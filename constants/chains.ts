export interface ChainConfig {
  chainId: number
  chainIdHex: string
  name: string
  rpcUrl: string
  blockExplorer: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export const BASE_MAINNET: ChainConfig = {
  chainId: 8453,
  chainIdHex: "0x2105",
  name: "Base",
  rpcUrl: "https://mainnet.base.org",
  blockExplorer: "https://basescan.org",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
}

export const SUPPORTED_CHAIN_IDS: number[] = [8453]

export const CHAIN_BY_ID: Record<number, ChainConfig> = {
  8453: BASE_MAINNET,
}

export const DEFAULT_CHAIN = BASE_MAINNET