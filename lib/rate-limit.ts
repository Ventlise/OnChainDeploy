/**
 * lib/rate-limit.ts
 *
 * Two-layer rate limiting:
 *   1. Per WALLET ADDRESS — main control (100 verifications per day)
 *   2. Per IP            — backstop against bots with no wallet (200 per day)
 *
 * In-memory store. Resets when the serverless function cold-starts (~10-30 min idle).
 * Good enough for early stage. Move to Redis later if you need persistence.
 */

interface Bucket {
  count: number
  resetAt: number
}

const walletBuckets = new Map<string, Bucket>()
const ipBuckets = new Map<string, Bucket>()

const DAY_MS = 24 * 60 * 60 * 1000

// Limits — change these freely
const MAX_PER_WALLET_PER_DAY = 50
const MAX_PER_IP_PER_DAY = 100

/** Generic per-bucket-store check */
function checkBucket(
  store: Map<string, Bucket>,
  key: string,
  max: number,
): { allowed: boolean; resetInSec: number; usedCount: number } {
  const now = Date.now()
  const entry = store.get(key)

  // Opportunistic cleanup to keep memory bounded
  if (store.size > 5000) {
    for (const [k, v] of store.entries()) {
      if (v.resetAt < now) store.delete(k)
    }
  }

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + DAY_MS })
    return { allowed: true, resetInSec: Math.ceil(DAY_MS / 1000), usedCount: 1 }
  }

  if (entry.count >= max) {
    return {
      allowed: false,
      resetInSec: Math.ceil((entry.resetAt - now) / 1000),
      usedCount: entry.count,
    }
  }

  entry.count += 1
  store.set(key, entry)
  return {
    allowed: true,
    resetInSec: Math.ceil((entry.resetAt - now) / 1000),
    usedCount: entry.count,
  }
}

/**
 * Check both wallet and IP limits.
 * Returns the first one that's blocked, or `allowed: true` if both pass.
 */
export function checkVerifyRateLimit(
  walletAddress: string,
  ip: string,
): {
  allowed: boolean
  reason?: "wallet" | "ip"
  message?: string
  resetInSec?: number
} {
  // Normalize wallet address (lowercase) so 0xABC and 0xabc share a bucket
  const wallet = walletAddress.toLowerCase()

  // Per-wallet check first — most relevant
  const walletCheck = checkBucket(walletBuckets, wallet, MAX_PER_WALLET_PER_DAY)
  if (!walletCheck.allowed) {
    const hours = Math.ceil(walletCheck.resetInSec / 3600)
    return {
      allowed: false,
      reason: "wallet",
      message: `Daily limit of ${MAX_PER_WALLET_PER_DAY} verifications reached for this wallet. Resets in ~${hours} hours.`,
      resetInSec: walletCheck.resetInSec,
    }
  }

  // Per-IP backstop — only triggers if someone with no wallet floods the endpoint,
  // or if one IP burns through MANY wallets (suspicious anyway)
  const ipCheck = checkBucket(ipBuckets, ip, MAX_PER_IP_PER_DAY)
  if (!ipCheck.allowed) {
    const hours = Math.ceil(ipCheck.resetInSec / 3600)
    return {
      allowed: false,
      reason: "ip",
      message: `Too many requests from your network. Resets in ~${hours} hours.`,
      resetInSec: ipCheck.resetInSec,
    }
  }

  return { allowed: true }
}

/** Extract client IP from request headers (works on Vercel + local). */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()

  const realIp = headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  return "unknown"
}