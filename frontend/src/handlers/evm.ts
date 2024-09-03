import * as fs from 'fs';
import { exec } from 'child_process';
import { getEmitterAddressEth, getEmitterAddressSolana, parseSequenceFromLogEth } from '@certusone/wormhole-sdk';
import { ethers } from 'ethers';
import fetch from 'node-fetch';

const config = JSON.parse(fs.readFileSync('./xdapp.config.json', 'utf-8'));

async function deploy(chain: string) {
    const { rpc, privateKey } = config.networks[chain];

    return new Promise<void>((resolve, reject) => {
        exec(
            `cd chains/evm && forge build && forge create --legacy --rpc-url ${rpc} --private-key ${privateKey} src/Messenger.sol:Messenger && exit`,
            (err, stdout, stderr) => {
                if (err) {
                    return reject(new Error(`Deployment failed: ${err.message}`));
                }

                if (stderr) {
                    console.error(stderr);
                }

                if (stdout) {
                    console.log(stdout);
                    const deploymentAddress = stdout
                        .split("Deployed to: ")[1]
                        .split("\n")[0]
                        .trim();
                    const emittedVAAs: never[] = []; // Resets the emittedVAAs
                    fs.writeFileSync(
                        `./deployinfo/${chain}.deploy.json`,
                        JSON.stringify({ address: deploymentAddress, vaas: emittedVAAs }, null, 4)
                    );
                    resolve();
                }
            }
        );
    });
}

async function registerApp(src: string, target: string) {
    const srcNetwork = config.networks[src];
    const targetNetwork = config.networks[target];

    let srcDeploymentInfo;
    let targetDeploymentInfo;

    try {
        srcDeploymentInfo = JSON.parse(fs.readFileSync(`./deployinfo/${src}.deploy.json`, 'utf-8'));
    } catch {
        throw new Error(`${src} is not deployed yet`);
    }

    try {
        targetDeploymentInfo = JSON.parse(fs.readFileSync(`./deployinfo/${target}.deploy.json`, 'utf-8'));
    } catch {
        throw new Error(`${target} is not deployed yet`);
    }

    let targetEmitter;
    switch (targetNetwork.type) {
        case 'evm':
            targetEmitter = getEmitterAddressEth(targetDeploymentInfo.address);
            break;
        case 'solana':
            setDefaultWasm("node"); // Required for Solana
            targetEmitter = await getEmitterAddressSolana(targetDeploymentInfo.address);
            break;
        default:
            throw new Error(`Unsupported network type: ${targetNetwork.type}`);
    }

    const emitterBuffer = Buffer.from(targetEmitter, 'hex');
    const signer = new ethers.Wallet(srcNetwork.privateKey).connect(new ethers.JsonRpcProvider(srcNetwork.rpc));
    const messenger = new ethers.Contract(
        srcDeploymentInfo.address,
        JSON.parse(fs.readFileSync('./chains/evm/out/Messenger.sol/Messenger.json', 'utf-8')).abi,
        signer
    );

    return await messenger.registerApplicationContracts(targetNetwork.wormholeChainId, emitterBuffer);
}

async function sendMsg(src: string, msg: string) {
    const srcNetwork = config.networks[src];
    let srcDeploymentInfo;

    try {
        srcDeploymentInfo = JSON.parse(fs.readFileSync(`./deployinfo/${src}.deploy.json`, 'utf-8'));
    } catch {
        throw new Error(`${src} is not deployed yet`);
    }

    const signer = new ethers.Wallet(srcNetwork.privateKey).connect(new ethers.JsonRpcProvider(srcNetwork.rpc));
    const messenger = new ethers.Contract(
        srcDeploymentInfo.address,
        JSON.parse(fs.readFileSync('./chains/evm/out/Messenger.sol/Messenger.json', 'utf-8')).abi,
        signer
    );

    const tx = await messenger.sendMsg(Buffer.from(msg));
    const receipt = await tx.wait();
    const seq = parseSequenceFromLogEth(receipt, srcNetwork.bridgeAddress);
    const emitterAddr = getEmitterAddressEth(srcDeploymentInfo.address);

    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for Guardian to pick up the message

    const response = await fetch(`${config.wormhole.restAddress}/v1/signed_vaa/${srcNetwork.wormholeChainId}/${emitterAddr}/${seq}`);
    const vaaBytes = await response.json();

    if (!vaaBytes.vaaBytes) {
        throw new Error("VAA not found!");
    }

    srcDeploymentInfo.vaas = srcDeploymentInfo.vaas || [];
    srcDeploymentInfo.vaas.push(vaaBytes.vaaBytes);

    fs.writeFileSync(
        `./deployinfo/${src}.deploy.json`,
        JSON.stringify(srcDeploymentInfo, null, 4)
    );

    return vaaBytes.vaaBytes;
}

async function submitVaa(src: string, target: string, idx: string) {
    const srcNetwork = config.networks[src];
    let srcDeploymentInfo;
    let targetDeploymentInfo;

    try {
        srcDeploymentInfo = JSON.parse(fs.readFileSync(`./deployinfo/${src}.deploy.json`, 'utf-8'));
    } catch {
        throw new Error(`${src} is not deployed yet`);
    }

    try {
        targetDeploymentInfo = JSON.parse(fs.readFileSync(`./deployinfo/${target}.deploy.json`, 'utf-8'));
    } catch {
        throw new Error(`${target} is not deployed yet`);
    }

    const vaa = isNaN(parseInt(idx))
        ? targetDeploymentInfo.vaas.pop()
        : targetDeploymentInfo.vaas[parseInt(idx)];

    const signer = new ethers.Wallet(srcNetwork.privateKey).connect(new ethers.JsonRpcProvider(srcNetwork.rpc));
    const messenger = new ethers.Contract(
        srcDeploymentInfo.address,
        JSON.parse(fs.readFileSync('./chains/evm/out/Messenger.sol/Messenger.json', 'utf-8')).abi,
        signer
    );

    return await messenger.receiveEncodedMsg(Buffer.from(vaa, 'base64'));
}

async function getCurrentMsg(src: string) {
    const srcNetwork = config.networks[src];
    let srcDeploymentInfo;

    try {
        srcDeploymentInfo = JSON.parse(fs.readFileSync(`./deployinfo/${src}.deploy.json`, 'utf-8'));
    } catch {
        throw new Error(`${src} is not deployed yet`);
    }

    const signer = new ethers.Wallet(srcNetwork.privateKey).connect(new ethers.JsonRpcProvider(srcNetwork.rpc));
    const messenger = new ethers.Contract(
        srcDeploymentInfo.address,
        JSON.parse(fs.readFileSync('./chains/evm/out/Messenger.sol/Messenger.json', 'utf-8')).abi,
        signer
    );

    return await messenger.getCurrentMsg();
}

export { deploy, registerApp, sendMsg, submitVaa, getCurrentMsg };
    function setDefaultWasm(arg0: string) {
        throw new Error('Function not implemented.');
    }

