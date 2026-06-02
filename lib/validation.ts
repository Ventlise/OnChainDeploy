/**
 * lib/validation.ts
 *
 * Validates verify API request payload. Rejects anything malformed BEFORE
 * we make expensive BaseScan calls or hold the function open for minutes.
 */

interface VerifyPayload {
  contractAddress: string
  contractName: string
  sourceCode: string
  compilerVersion: string
  optimizationUsed: boolean
  optimizationRuns: number
  evmVersion?: string
}

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
const COMPILER_REGEX = /^v0\.[0-9]+\.[0-9]+\+commit\.[a-f0-9]{8}$/
const CONTRACT_NAME_REGEX = /^[A-Za-z_][A-Za-z0-9_]{0,49}$/
const EVM_VERSIONS = new Set([
  "homestead", "tangerineWhistle", "spuriousDragon", "byzantium",
  "constantinople", "petersburg", "istanbul", "berlin", "london",
  "paris", "shanghai", "cancun",
])

const MAX_SOURCE_BYTES = 200_000   // 200 KB — generous; real contracts are <50KB
const MAX_RUNS = 1_000_000_000     // solc max

/**
 * Validates a verify request payload. Returns an error message if invalid,
 * or null if everything checks out.
 */
export function validateVerifyPayload(
  body: unknown,
): { ok: true; data: VerifyPayload } | { ok: false; error: string } {

  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." }
  }

  const b = body as Record<string, unknown>

  // ── contractAddress ────────────────────────────────────────────────
  if (typeof b.contractAddress !== "string" || !ADDRESS_REGEX.test(b.contractAddress)) {
    return { ok: false, error: "Invalid contract address format." }
  }

  // ── contractName ───────────────────────────────────────────────────
  if (typeof b.contractName !== "string" || !CONTRACT_NAME_REGEX.test(b.contractName)) {
    return { ok: false, error: "Invalid contract name." }
  }

  // ── sourceCode ─────────────────────────────────────────────────────
  if (typeof b.sourceCode !== "string" || b.sourceCode.length === 0) {
    return { ok: false, error: "Source code is required." }
  }
  if (b.sourceCode.length > MAX_SOURCE_BYTES) {
    return { ok: false, error: `Source code exceeds ${MAX_SOURCE_BYTES} byte limit.` }
  }

  // ── compilerVersion ────────────────────────────────────────────────
  if (typeof b.compilerVersion !== "string" || !COMPILER_REGEX.test(b.compilerVersion)) {
    return { ok: false, error: "Invalid compiler version format." }
  }

  // ── optimizationUsed ───────────────────────────────────────────────
  if (typeof b.optimizationUsed !== "boolean") {
    return { ok: false, error: "optimizationUsed must be boolean." }
  }

  // ── optimizationRuns ───────────────────────────────────────────────
  if (
    typeof b.optimizationRuns !== "number" ||
    !Number.isInteger(b.optimizationRuns) ||
    b.optimizationRuns < 0 ||
    b.optimizationRuns > MAX_RUNS
  ) {
    return { ok: false, error: "Invalid optimizationRuns value." }
  }

  // ── evmVersion (optional) ──────────────────────────────────────────
  if (b.evmVersion !== undefined) {
    if (typeof b.evmVersion !== "string" || !EVM_VERSIONS.has(b.evmVersion)) {
      return { ok: false, error: "Invalid evmVersion." }
    }
  }

  return {
    ok: true,
    data: {
      contractAddress: b.contractAddress,
      contractName: b.contractName,
      sourceCode: b.sourceCode,
      compilerVersion: b.compilerVersion,
      optimizationUsed: b.optimizationUsed,
      optimizationRuns: b.optimizationRuns,
      evmVersion: b.evmVersion as string | undefined,
    },
  }
}