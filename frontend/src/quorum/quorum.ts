import { Chain, api, toChain, wormhole } from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";

// Define types for heartbeat data
type Stats = {
  max: bigint;
  min: bigint;
  quorum: bigint;
  mean: bigint;
  delta: bigint;
};

type Status = {
  address: string;
  chainId: number;
  height: bigint;
};

type HeightsByChain = Record<string, Record<string, bigint>>;

// Chains to skip
const skipChains = [
  "Pythnet",
  "Evmos",
  "Osmosis",
  "Kujira",
  "Klaytn",
  "Wormchain",
  "Near",
  "Sui",
  "Xpla",
  "Aptos",
  "Cosmoshub",
];

// Main function to fetch and process heartbeats
(async function () {
  // Initialize Wormhole with specified chains
  const wh = await wormhole("Mainnet", [evm, solana]);

  // Fetch heartbeats
  const hbc = await getHeartbeats(wh.config.api);
  
  for (const [chain, heights] of Object.entries(hbc)) {
    if (skipChains.includes(chain)) continue;

    try {
      const ctx = wh.getChain(chain as Chain);

      // Ensure RPC is available
      await ctx.getRpc();

      // Get latest block height for the chain
      const chainLatest = await ctx.getLatestBlock();
      
      // Calculate statistics from heights
      const stats = getStats(Object.values(heights));
      
      console.log(chain, BigInt(chainLatest) - stats.quorum);
    } catch (e) {
      console.error(`Error processing chain ${chain}:`, e);
    }
  }
})();

// Function to fetch heartbeat data from the API
async function getHeartbeats(apiUrl: string): Promise<HeightsByChain> {
  const hbs = await api.getGuardianHeartbeats(apiUrl);
  
  // Extract and transform heartbeat data
  const nets = hbs!.map((hb) => {
    return hb.rawHeartbeat.networks.map((n) => ({
      address: hb.verifiedGuardianAddr,
      chainId: n.id,
      height: BigInt(n.height),
    } as Status)).flat();
  }).flat();

  // Organize heartbeat data by chain
  const byChain: HeightsByChain = {};
  for (const status of nets) {
    if (status.address === "0x58CC3AE5C097b213cE3c81979e1B9f9570746AA5") continue;

    let chain: string;
    try {
      chain = toChain(status.chainId);
    } catch {
      continue;
    }

    if (!(chain in byChain)) byChain[chain] = {};
    byChain[chain][status.address] = status.height;
  }
  return byChain;
}

// Function to calculate statistics from heights
function getStats(vals: bigint[]): Stats {
  if (vals.length === 0) {
    throw new Error("Cannot calculate statistics for an empty array.");
  }
  
  vals.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)); // Ensure array is sorted
  
  const max = vals[vals.length - 1];
  const min = vals[0];
  const sum = vals.reduce((acc, v) => acc + v, BigInt(0));
  const mean = sum / BigInt(vals.length);
  const quorum = vals[Math.floor(vals.length * 2 / 3)];
  const delta = max - min;
  
  return { max, min, quorum, mean, delta };
}
