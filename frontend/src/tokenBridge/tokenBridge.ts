import {
  Chain,
  Network,
  TokenId,
  TokenTransfer,
  Wormhole,
  amount,
  isTokenId,
  wormhole,
} from "@wormhole-foundation/sdk";

// Import the platform-specific packages
import algorand from "@wormhole-foundation/sdk/algorand";
import cosmwasm from "@wormhole-foundation/sdk/cosmwasm";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import sui from "@wormhole-foundation/sdk/sui";

import { SignerStuff, getSigner, waitLog } from "../helpers/helpers.js";

(async function () {
  // Initialize the Wormhole object with the Testnet configuration
  const wh = await wormhole("Testnet", [evm, solana, algorand, cosmwasm, sui]);

  // Define chain contexts
  const sendChain = wh.getChain("Solana");
  const rcvChain = wh.getChain("Sui");

  // Token ID for transferring native gas token
  const token = Wormhole.tokenId(sendChain.chain, "native");

  // Amount to be transferred
  const amt = "0.001";

  // Transfer mode: automatic or manual
  const automatic = false;

  // Optional native gas amount for automatic transfers
  const nativeGas = automatic ? "0.01" : undefined;

  // Obtain signers for source and destination chains
  const source = await getSigner(sendChain);
  const destination = await getSigner(rcvChain);

  // Token decimals
  const decimals = isTokenId(token)
    ? Number(await wh.getDecimals(token.chain, token.address))
    : sendChain.config.nativeTokenDecimals;

  // Flag for round-trip transfer
  const roundTrip: boolean = false;

  // Transaction ID for recovering a token transfer
  let recoverTxid = undefined;
  // recoverTxid = "0xa4e0a2c1c994fe3298b5646dfd5ce92596dc1a589f42e241b7f07501a5a5a39f";

  // Create and perform the token transfer
  const xfer = !recoverTxid
    ? await tokenTransfer(
        wh,
        {
          token,
          amount: amount.units(amount.parse(amt, decimals)),
          source,
          destination,
          delivery: {
            automatic,
            nativeGas: nativeGas ? amount.units(amount.parse(nativeGas, decimals)) : undefined,
          },
        },
        roundTrip,
      )
    : await TokenTransfer.from(wh, {
        chain: source.chain.chain,
        txid: recoverTxid,
      });

  // Log the receipt of the transfer
  const receipt = await waitLog(wh, xfer);
  console.log(receipt);
})();

async function tokenTransfer<N extends Network>(
  wh: Wormhole<N>,
  route: {
    token: TokenId;
    amount: bigint;
    source: SignerStuff<N, Chain>;
    destination: SignerStuff<N, Chain>;
    delivery?: {
      automatic: boolean;
      nativeGas?: bigint;
    };
    payload?: Uint8Array;
  },
  roundTrip?: boolean,
): Promise<TokenTransfer<N>> {
  // Create a TokenTransfer object
  const xfer = await wh.tokenTransfer(
    route.token,
    route.amount,
    route.source.address,
    route.destination.address,
    route.delivery?.automatic ?? false,
    route.payload,
    route.delivery?.nativeGas,
  );

  // Get a quote for the transfer
  const quote = await TokenTransfer.quoteTransfer(
    wh,
    route.source.chain,
    route.destination.chain,
    xfer.transfer,
  );
  console.log(quote);

  if (xfer.transfer.automatic && quote.destinationToken.amount < 0)
    throw "The amount requested is too low to cover the fee and any native gas requested.";

  // Initiate the transfer
  console.log("Starting transfer");
  const srcTxids = await xfer.initiateTransfer(route.source.signer);
  console.log(`Started transfer: `, srcTxids);

  // If automatic, return the transfer object
  if (route.delivery?.automatic) return xfer;

  // Fetch the attestation for manual transfers
  console.log("Getting Attestation");
  const attestIds = await xfer.fetchAttestation(60_000);
  console.log(`Got Attestation: `, attestIds);

  // Complete the transfer on the destination chain
  console.log("Completing Transfer");
  const destTxids = await xfer.completeTransfer(route.destination.signer);
  console.log(`Completed Transfer: `, destTxids);

  // If round-trip transfer, initiate transfer back
  if (!roundTrip) return xfer;

  const { destinationToken: token } = quote;
  return await tokenTransfer(wh, {
    ...route,
    token: token.token,
    amount: token.amount,
    source: route.destination,
    destination: route.source,
  });
}
