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
  
  // Function to initialize Wormhole and get the chain context
  async function initializeWormhole(): Promise<Wormhole<Network>> {
    return await wormhole("Testnet", [evm, solana, algorand, cosmwasm, sui]);
  }
  
  // Function to perform a token transfer
  async function performTokenTransfer<N extends Network>(
    wh: Wormhole<N>,
    {
      token,
      amount: amountInUnits,
      source,
      destination,
      delivery = { automatic: false },
      payload,
      roundTrip = false,
      recoverTxid,
    }: {
      token: TokenId;
      amount: bigint;
      source: SignerStuff<N, Chain>;
      destination: SignerStuff<N, Chain>;
      delivery?: {
        automatic: boolean;
        nativeGas?: bigint;
      };
      payload?: Uint8Array;
      roundTrip?: boolean;
      recoverTxid?: string;
    }
  ): Promise<TokenTransfer<N>> {
    // Handle transfer recovery if needed
    const xfer = !recoverTxid
      ? await initiateTransfer(wh, {
          token,
          amount: amountInUnits,
          source,
          destination,
          delivery,
          payload,
        })
      : await TokenTransfer.from(wh, {
          chain: source.chain.chain,
          txid: recoverTxid,
        });
  
    const receipt = await waitLog(wh, xfer);
  
    // Log and return transfer details
    console.log(receipt);
    return xfer;
  }
  
  // Function to initiate a token transfer
  async function initiateTransfer<N extends Network>(
    wh: Wormhole<N>,
    route: {
      token: TokenId;
      amount: bigint;
      source: SignerStuff<N, Chain>;
      destination: SignerStuff<N, Chain>;
      delivery: {
        automatic: boolean;
        nativeGas?: bigint;
      };
      payload?: Uint8Array;
    }
  ): Promise<TokenTransfer<N>> {
    // Create a TokenTransfer object
    const xfer = await wh.tokenTransfer(
      route.token,
      route.amount,
      route.source.address,
      route.destination.address,
      route.delivery.automatic,
      route.payload,
      route.delivery.nativeGas,
    );
  
    // Get a quote for the transfer
    const quote = await TokenTransfer.quoteTransfer(
      wh,
      route.source.chain,
      route.destination.chain,
      xfer.transfer,
    );
    console.log(quote);
  
    if (xfer.transfer.automatic && quote.destinationToken.amount < 0) {
      throw new Error("The amount requested is too low to cover the fee and any native gas requested.");
    }
  
    console.log("Starting transfer");
    const srcTxids = await xfer.initiateTransfer(route.source.signer);
    console.log(`Started transfer: `, srcTxids);
  
    if (route.delivery.automatic) {
      return xfer;
    }
  
    console.log("Getting Attestation");
    const attestIds = await xfer.fetchAttestation(60_000);
    console.log(`Got Attestation: `, attestIds);
  
    console.log("Completing Transfer");
    const destTxids = await xfer.completeTransfer(route.destination.signer);
    console.log(`Completed Transfer: `, destTxids);
  
    return xfer;
  }
  
  // Export the main functionality
  export { initializeWormhole, performTokenTransfer };
  