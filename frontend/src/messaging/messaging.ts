import { getSigner } from "@/cctp";
import { encoding, signSendWait, wormhole } from "@wormhole-foundation/sdk";
import solana from "@wormhole-foundation/sdk/solana";
//import { getSigner } from "../helpers/index.js";

(async function () {

  const wh = await wormhole("Testnet", [solana]);

  const chain = wh.getChain("Solana");
  const { signer, address } = await getSigner(chain);

 
  const coreBridge = await chain.getWormholeCore();

  // Generate transactions, sign and send them
  const publishTxs = coreBridge.publishMessage(
    // Address of sender (emitter in VAA)
    address.address,
    // Message to send (payload in VAA)
    encoding.bytes.encode("lol"),
  
    0,
    
    0,
  );
 
  const txids = await signSendWait(chain, publishTxs, signer);

  const txid = txids[txids.length - 1];

 
  const [whm] = await chain.parseTransaction(txid!.txid);

  

  // Wait for the vaa to be signed and available with a timeout
  const vaa = await wh.getVaa(whm!, "Uint8Array", 60_000);
  console.log(vaa);
  

  const verifyTxs = coreBridge.verifyMessage(address.address, vaa!);
  console.log(await signSendWait(chain, verifyTxs, signer));
  
})();