export const BASE_MAINNET = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://mainnet.base.org"] },
    public: { http: ["https://mainnet.base.org"] },
  },
  blockExplorers: {
    default: {
      name: "Basescan",
      url: "https://basescan.org",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11" as const,
      blockCreated: 5022,
    },
  },
  testnet: false,
} as const

export type BaseChain = typeof BASE_MAINNET
export const BASE_CHAIN_ID = BASE_MAINNET.id
