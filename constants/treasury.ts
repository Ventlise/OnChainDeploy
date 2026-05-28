export const TREASURY_WALLET = "0x398a97A08C421D8748e15Fcf72F897b59d47Be22"
export const DEPLOY_FEE_USD = 0.15
export const VERIFY_FEE_USD = 0.30


export const TREASURY_ADDRESS = TREASURY_WALLET
export const TREASURY_FEE_DEPLOY_USD = DEPLOY_FEE_USD
export const TREASURY_FEE_VERIFY_USD = VERIFY_FEE_USD


export const CONTRACT_GAS_LIMITS: Record<string, number> = {
  "simple-storage": 120000,
  "hello-base":     110000,
  "counter":        145000,
  "voting":         200000,
}
export const DEFAULT_GAS_LIMIT = 150000