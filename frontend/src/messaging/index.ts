import { signSendWait, wormhole, VAA, SignAndSendSigner, PayloadLiteral } from "@wormhole-foundation/sdk";
import solana from "@wormhole-foundation/sdk/solana";
//import { getSigner } from "../helpers/index.js";
import { ChainContext } from "@wormhole-foundation/sdk";
import { getSigner } from "@/cctp";

// Define the types
export type ChainContextType = ChainContext<"Testnet", "Solana", "Solana">;
export type SignerInfo = Awaited<ReturnType<typeof getSigner>>;

/**
 * Initializes the Wormhole SDK for the specified chain and returns the chain context.
 * @returns {Promise<ChainContextType>} The chain context for the Solana chain.
 */
export async function initializeWormhole(): Promise<ChainContextType> {
  const wh = await wormhole("Testnet", [solana]);
  return wh.getChain("Solana") as ChainContextType; // Type assertion
}

/**
 * Publishes a message to the Wormhole core bridge.
 * @param chain - The chain context to use.
 * @param address - The address of the sender.
 * @param payload - The message payload.
 * @param nonce - A unique identifier for the message.
 * @param consistencyLevel - The consistency level of the message.
 * @returns {Promise<string>} The transaction ID of the published message.
 */
export async function publishMessage(
  chain: ChainContextType,
  address: string,
  payload: Uint8Array,
  nonce: number,
  consistencyLevel: number
): Promise<string> {
  const coreBridge = (await chain.getWormholeCore()) as any; // Ensure proper type or cast as necessary
  const publishTxs = coreBridge.publishMessage(address, payload, nonce, consistencyLevel);
  const signer = await getSigner(chain); // Get the signer object
  const txids = await signSendWait(chain, publishTxs, signer as unknown as SignAndSendSigner<"Testnet", "Solana">); // Pass the signer object with the correct type assertion
  return txids[txids.length - 1].txid;
}

/**
 * Retrieves the VAA from a transaction.
 * @param chain - The chain context to use.
 * @param txid - The transaction ID to query.
 * @param timeout - The timeout period for querying the VAA.
 * @returns {Promise<VAA<Uint8Array>>} The VAA as a VAA<Uint8Array>.
 */
export async function getVaaFromTransaction(
  chain: ChainContextType,
  txid: string,
  timeout: number = 60_000
): Promise<VAA<PayloadLiteral>> {
  const [whm] = await chain.parseTransaction(txid);
  const wh = await wormhole("Testnet", [solana]); // Initialize Wormhole again if needed
  const vaa: VAA<PayloadLiteral> | null = await wh.getVaa(whm, "Uint8Array", timeout) as VAA<PayloadLiteral> | null;

  if (!vaa) {
    throw new Error("VAA not found or expired");
  }

  return vaa;
}

/**
 * Verifies a message using the Wormhole core bridge.
 * @param chain - The chain context to use.
 * @param address - The address of the sender.
 * @param vaa - The VAA to verify.
 * @returns {Promise<any>} The result of the verification transaction.
 */
export async function verifyMessage(
  chain: ChainContextType,
  address: string,
  vaa: Uint8Array
): Promise<any> {
  const coreBridge = (await chain.getWormholeCore()) as any; // Ensure proper type or cast as necessary
  const verifyTxs = coreBridge.verifyMessage(address, vaa);
  const signer = await getSigner(chain); // Get the signer object
  return await signSendWait(chain, verifyTxs, signer as unknown as SignAndSendSigner<"Testnet", "Solana">);
}
