import { TokenId, Wormhole, signSendWait, wormhole } from "@wormhole-foundation/sdk";
import algorand from "@wormhole-foundation/sdk/algorand";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import { inspect } from "util";
import { getSigner } from "../helpers/index";

// Function to create a wrapped token
export default async function createWrapped() {
  const wh = await wormhole("Testnet", [evm, solana, algorand]);

  // Define the token to be wrapped
  const token: TokenId = Wormhole.chainAddress(
    "Avalanche",
    "0x3bE4bce46442F5E85c47257145578E724E40cF97",
  );

  // Get the context and signer for the origin chain
  const origChain = wh.getChain(token.chain);
  const { signer: origSigner } = await getSigner(origChain);

  let txid;

  if (!txid) {
    // Create an attestation on the origin chain
    const tb = await origChain.getTokenBridge();
    const attestTxns = tb.createAttestation(
      token.address,
      Wormhole.parseAddress(origSigner.chain(), origSigner.address()),
    );
    const txids = await signSendWait(origChain, attestTxns, origSigner);
    console.log("txids: ", inspect(txids, { depth: null }));
    txid = txids[0]!.txid;
    console.log("Created attestation (save this): ", txid);
  }

  // Retrieve the Wormhole message ID from the transaction logs
  const msgs = await origChain.parseTransaction(txid);
  console.log(msgs);

  // Get the Signed VAA from the Wormhole API
  const timeout = 60_000; // 60 seconds timeout
  const vaa = await wh.getVaa(msgs[0]!, "TokenBridge:AttestMeta", timeout);
  if (!vaa) throw new Error("VAA not found after retries exhausted, try extending the timeout");

  console.log(vaa.payload.token.address);

  // Check if the token is already wrapped on the destination chain
  const chain = "Algorand";
  const destChain = wh.getChain(chain);
  const { signer } = await getSigner(destChain);

  const tb = await destChain.getTokenBridge();
  try {
    // Try to get the wrapped asset
    const wrapped = await tb.getWrappedAsset(token);
    console.log("Already wrapped");
    return { chain, address: wrapped };
  } catch (e) {}

  // If not wrapped, proceed with the attestation on the destination chain
  console.log("Attesting asset");
  await signSendWait(
    destChain,
    tb.submitAttestation(vaa, Wormhole.parseAddress(signer.chain(), signer.address())),
    signer,
  );

  // Function to wait and check for the wrapped asset
  async function waitForIt() {
    do {
      try {
        const wrapped = await tb.getWrappedAsset(token);
        return { chain, address: wrapped };
      } catch (e) {
        console.error(e);
      }
      console.log("Waiting before checking again...");
      await new Promise((r) => setTimeout(r, 2000));
    } while (true);
  }

  console.log("Wrapped: ", await waitForIt());
}
