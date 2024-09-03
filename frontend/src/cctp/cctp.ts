import {
  Chain,
  ChainContext,
  CircleTransfer,
  Network,
  SignAndSendSigner,
  Signer,
  TransactionId,
  Wormhole,
  amount,
  wormhole,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";

// Initialize Wormhole for the desired network and supported platforms
async function initializeWormhole(): Promise<Wormhole<Network>> {
  return wormhole("Testnet", [evm]); 
}

// Perform CCTP transfer
export async function cctpTransfer<N extends Network>(
  wh: Wormhole<N>,
  src: Signer<N, Chain>, // Adjusted type
  dst: Signer<N, Chain>, // Adjusted type
  req: {
    amount: bigint;
    automatic: boolean;
    nativeGas?: bigint;
  }
): Promise<void> {
  try {
    const xfer = await wh.circleTransfer(
      req.amount,
      src.address, // Adjusted property access
      dst.address, // Adjusted property access
      req.automatic,
      undefined,
      req.nativeGas,
    );
    console.log("Transfer Initiated: ", xfer);

    const quote = await CircleTransfer.quoteTransfer(src.chain, dst.chain, xfer.transfer);
    console.log("Transfer Quote: ", quote);

    const srcTxids = await xfer.initiateTransfer(src.sign); // Adjusted method call
    console.log(`Transfer Started: `, srcTxids);

    if (req.automatic) {
      const relayStatus = await waitForRelay(srcTxids[srcTxids.length - 1]!);
      console.log(`Relay Completed: `, relayStatus);
    } else {
      console.log("Waiting for Attestation...");
      const attestIds = await xfer.fetchAttestation(60_000);
      console.log(`Attestation Received: `, attestIds);

      console.log("Completing Transfer...");
      const dstTxids = await xfer.completeTransfer(dst.sign); // Adjusted method call
      console.log(`Transfer Completed: `, dstTxids);
    }
  } catch (error) {
    console.error("Error during CCTP Transfer:", error);
  }
}

// Complete transfer using transaction ID
export async function completeTransfer<N extends Network>(
  wh: Wormhole<N>,
  txid: TransactionId,
  signer: SignAndSendSigner<N, Chain> // Adjusted type
): Promise<void> {
  try {
    const xfer = await CircleTransfer.from(wh, txid);

    const attestIds = await xfer.fetchAttestation(60 * 60 * 1000);
    console.log("Attestation Received: ", attestIds);

    const dstTxIds = await xfer.completeTransfer(signer.signAndSend); // Adjusted method call
    console.log("Transfer Completed: ", dstTxIds);
  } catch (error) {
    console.error("Error completing transfer:", error);
  }
}

// Main function to run the transfer
(async function main() {
  try {
    const wh = await initializeWormhole();
    const sendChain = wh.getChain("Avalanche");
    const rcvChain = wh.getChain("BaseSepolia");

    const source = await getSigner(sendChain); // Adjusted to await
    const destination = await getSigner(rcvChain); // Adjusted to await

    const amt = amount.units(amount.parse("0.2", 6));
    const automatic = false;
    const nativeGas = automatic ? amount.units(amount.parse("0.0", 6)) : BigInt(0);

    await cctpTransfer(wh, source, destination, {
      amount: amt,
      automatic,
      nativeGas,
    });
  } catch (error) {
    console.error("Error in main function:", error);
  }
})();

async function waitForRelay(txid: string): Promise<string> { // Adjusted function
  // Implement the actual wait for relay logic here
  return "Relay completed";
}

async function getSigner<N extends Network, C extends Chain>(chain: ChainContext<N, C, any>): Promise<Signer<N, C>> {
  // Implement the logic to return the appropriate signer based on the chain
  // This function should return a valid Signer instance
  return {
    chain,
    address: "signer-address",
    sign: async (tx: any) => {
      // Implement signing logic here
      return tx;
    }
  } as unknown as Signer<N, C>;
}
