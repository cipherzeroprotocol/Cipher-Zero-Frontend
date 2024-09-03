import {
  AttestationReceipt,
  Chain,
  ChainContext,
  Network,
  ProtocolName,
  TokenId,
  TransferReceipt,
  TransferState,
  UniversalOrNative,
  Wormhole,
  circle,
  routes,
  wormhole,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
//import { TokenId } from "@wormhole-foundation/sdk/dist/chain";
import thetajs from '@thetalabs/theta-js';

require('isomorphic-fetch');

const { Wallet, providers: { HttpProvider }, Contract, ContractFactory, networks: { ChainIds } } = thetajs;

// Configuration
const ADMIN_WALLET_ADDRESS = "<ADMIN_WALLET_ADDRESS>";
const USER1_WALLET_ADDRESS = "<USER1_WALLET_ADDRESS>";
const USER2_WALLET_ADDRESS = "<USER2_WALLET_ADDRESS>";
const ADMIN_PRIVATE_KEY = "<ADMIN_PRIVATE_KEY>";
const USER1_PRIVATE_KEY = "<USER1_PRIVATE_KEY>";
const USER2_PRIVATE_KEY = "<USER2_PRIVATE_KEY>";

// Theta.js setup
const thetaProvider = new HttpProvider(ChainIds.Privatenet);
const walletAdmin = new Wallet(ADMIN_PRIVATE_KEY, thetaProvider);
const walletUser1 = new Wallet(USER1_PRIVATE_KEY, thetaProvider);
const walletUser2 = new Wallet(USER2_PRIVATE_KEY, thetaProvider);

// Helper function to get a signer for a given chain
async function getSigner(chain: ChainContext<Network, Chain>) {
  // This is a placeholder. In a real scenario, you'd need to implement
  // logic to return the appropriate signer for the given chain.
  return {
    signer: walletAdmin, // Using admin wallet as an example
    address: ADMIN_WALLET_ADDRESS,
  };
}

async function main() {
  try {
    // Initialize Wormhole SDK for Testnet
    const wh = await wormhole("Testnet", [evm, solana]);

    // Get chain contexts
    const sendChain = wh.getChain("Avalanche");
    const rcvChain = wh.getChain("Polygon");
    
    // Get signers
    const sender = await getSigner(sendChain);
    const receiver = await getSigner(rcvChain);

    // Create resolver with CCTP routes
    const resolver = wh.resolver([
      routes.CCTPRoute,
      routes.AutomaticCCTPRoute,
    ]);

    // Helper function to get USDC address
    const usdcAddress = (network: Network, chain: Chain) =>
      Wormhole.chainAddress(chain, circle.usdcContract.get(network, chain)!);

    const srcUsdc = usdcAddress(sendChain.network, sendChain.chain);
    const dstUsdc = usdcAddress(rcvChain.network, rcvChain.chain);

    // Create a transfer request
    // Assuming srcUsdc and dstUsdc are meant to be used in a different part of the transfer logic
    // and not directly in the RouteTransferRequest.create method.
    // The corrected call removes srcUsdc and dstUsdc from the parameters.
    const tr = await routes.RouteTransferRequest.create(wh, {
      source: sender.address as unknown as TokenId<typeof sendChain.chain>,
      destination: receiver.address as unknown as TokenId<typeof rcvChain.chain>,
    });

    // Find possible routes for the transfer request
    const foundRoutes = await resolver.findRoutes(tr);
    console.log("Found routes:", foundRoutes);

    // Select the best route (pop the last route from the list)
    const bestRoute = foundRoutes.pop()!;
    console.log("Selected route:", bestRoute);

    // Define transfer parameters
    const transferParams = { 
      amount: "1.5", 
      chain: sendChain.chain, 
      address: sender.address as unknown as UniversalOrNative<typeof sendChain.chain> // Change the type to UniversalOrNative<typeof sendChain.chain>
    };

    // Validate the transfer parameters
    const validated = await bestRoute.validate(transferParams);
    if (!validated.valid) throw validated.error;
    console.log("Validated parameters:", validated);

    // Get a quote for the transfer
    const quote = await bestRoute.quote(validated.params);
    if (!quote.success) throw quote.error;
    console.log("Transfer quote:", quote);

    // Initiate the transfer
    const receipt = await bestRoute.initiate(sender.signer, quote, transferParams);
    console.log("Initiated transfer with receipt:", receipt);

    // Track the transfer until it is completed
    await checkAndComplete(bestRoute, receiver.signer, receipt);

  } catch (error) {
    console.error("Error processing transfer:", error);
  }
}

async function checkAndComplete(
  bestRoute: routes.Route<any, any, any, any>, 
  receiverSigner: any, 
  receipt: TransferReceipt<AttestationReceipt<ProtocolName>>
) {
  console.log("Checking transfer state...");
  for await (receipt of bestRoute.track(receipt, 120 * 1000)) {
    console.log("Transfer State:", TransferState[receipt.state]);

    // Check if the transfer has reached the final state
    if (receipt.state >= TransferState.DestinationFinalized) return;

    // Complete the transfer if it's in the attested state and route requires manual completion
    if (receipt.state === TransferState.Attested) {
      if (routes.isManual(bestRoute)) {
        const completedTxids = await bestRoute.complete(receiverSigner, receipt);
        console.log("Completed transfer with txids:", completedTxids);
        return;
      }
    }

    // Wait before checking again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Run the main function
main().catch(console.error);