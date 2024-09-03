// Example content of types.ts
export type Stats = {
    max: bigint;
    min: bigint;
    quorum: bigint;
    mean: bigint;
    delta: bigint;
  };
  
  export type Status = {
    address: string;
    chainId: number;
    height: bigint;
  };
  
  export type HeightsByChain = Record<string, Record<string, bigint>>;
  