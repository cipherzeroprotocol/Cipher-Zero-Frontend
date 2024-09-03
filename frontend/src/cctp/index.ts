import { Wormhole, Network, Signer, Chain, TransactionId, CircleTransfer, amount, wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import { getSigner, waitForRelay } from "../helpers/helpers";
import { cctpTransfer, completeTransfer } from "./cctp";

// Export types and functions for use in other parts of the project
export type {
    Wormhole,
    Network,
    Signer,
    Chain,
    TransactionId
};

// Utility Functions
/**
 * Initialize a Wormhole instance with specific network and platform configurations.
 * @param network - The network to be used (e.g., 'Mainnet', 'Testnet').
 * @param platforms - Array of platforms to support (e.g., [evm]).
 * @returns Initialized Wormhole instance.
 */
export async function initializeWormhole(network: string, platforms: any[]): Promise<Wormhole<Network>> {
    return await wormhole(network as "Mainnet" | "Testnet" | "Devnet", platforms);
}

/**
 * Fetch and log the status of a specific transfer.
 * @param wh - The Wormhole instance.
 * @param txid - The transaction ID of the transfer.
 * @param timeout - Timeout in milliseconds to wait for attestation.
 */
export async function logTransferStatus(
    wh: Wormhole<Network>,
    txid: TransactionId,
    timeout: number = 60000
): Promise<void> {
    try {
        const xfer = await CircleTransfer.from(wh, txid);
        const attestIds = await xfer.fetchAttestation(timeout);
        console.log("Attestation fetched: ", attestIds);
    } catch (error) {
        console.error("Error fetching transfer status: ", error);
    }
}

/**
 * Retrieve the current gas fee for a specific network.
 * @param network - The network for which the gas fee is to be retrieved.
 * @returns The current gas fee in the specified network.
 */
export async function getCurrentGasFee(network: Network): Promise<number> {
    // Placeholder for actual implementation
    // You can integrate with network-specific APIs or services to get the current gas fee
    return 0.01; // Example value
}

// Re-export functions from cctp module
export { getSigner, waitForRelay, cctpTransfer, completeTransfer };

// Optionally, you can add more utility functions or additional exports here
