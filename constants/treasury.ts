// ─────────────────────────────────────────────────────────────────────────────
// Treasury configuration
// Treasury wallet: 0x398a97A08C421D8748e15Fcf72F897b59d47Be22
// ─────────────────────────────────────────────────────────────────────────────

export const TREASURY_WALLET  = "0x398a97A08C421D8748e15Fcf72F897b59d47Be22"
export const TREASURY_ADDRESS = TREASURY_WALLET

// ── Global default fees ───────────────────────────────────────────────────────
// Deploy-only is always free across all contracts.
// Deploy & Verify is $0.09 — except GM Beacon which is fully free (see below).
export const DEPLOY_FEE_USD = 0
export const VERIFY_FEE_USD = 0.09

// Aliases used by FeeBreakdown and DeploymentModal
export const TREASURY_FEE_DEPLOY_USD = DEPLOY_FEE_USD
export const TREASURY_FEE_VERIFY_USD = VERIFY_FEE_USD

// ── Per-contract gas limits ───────────────────────────────────────────────────
// These are safe upper bounds — the user only pays actual gas used.
export const CONTRACT_GAS_LIMITS: Record<string, number> = {
  "gm-beacon":      200_000,
  "simple-storage": 120_000,
  "hello-base":     110_000,
  "counter":        145_000,
  "voting":         200_000,
}

export const DEFAULT_GAS_LIMIT = 150_000

// ── GM Beacon — completely free (both deploy and deploy+verify) ───────────────
// GM Beacon is the flagship cultural contract. Both buttons cost $0.
// No treasury fee is ever sent — user signs 1 tx (deploy) or 1 tx (deploy+verify).
// Verification itself is off-chain (BaseScan API) — no signature needed for that.
export const GM_BEACON_DEPLOY_FEE_USD = 0
export const GM_BEACON_VERIFY_FEE_USD = 0

// ── Existing contract fee overrides ──────────────────────────────────────────
// All contracts follow the global defaults above.
// These are here for explicitness — override per-contract if ever needed.
export const SIMPLE_STORAGE_DEPLOY_FEE_USD = 0
export const SIMPLE_STORAGE_VERIFY_FEE_USD = 0.09

export const HELLO_BASE_DEPLOY_FEE_USD = 0
export const HELLO_BASE_VERIFY_FEE_USD = 0.09

export const COUNTER_DEPLOY_FEE_USD = 0
export const COUNTER_VERIFY_FEE_USD = 0.09

export const VOTING_DEPLOY_FEE_USD = 0
export const VOTING_VERIFY_FEE_USD = 0.09