/**
 * lib/validation.ts
 */

interface VerifyPayload {
  contractAddress: string
  contractName: string
  sourceCode: string
  compilerVersion: string
  optimizationUsed: boolean
  optimizationRuns: number
  evmVersion?: string
  constructorArguments?: string
}

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
const COMPILER_REGEX = /^v0\.[0-9]+\.[0-9]+\+commit\.[a-f0-9]{8}$/
const CONTRACT_NAME_REGEX = /^[A-Za-z_][A-Za-z0-9_]{0,49}$/
const EVM_VERSIONS = new Set([
  "homestead", "tangerineWhistle", "spuriousDragon", "byzantium",
  "constantinople", "petersburg", "istanbul", "berlin", "london",
  "paris", "shanghai", "cancun",
])
const MAX_SOURCE_BYTES = 200_000
const MAX_RUNS = 1_000_000_000

export function validateVerifyPayload(
  body: unknown,
): { ok: true; data: VerifyPayload } | { ok: false; error: string } {

  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." }
  }

  const b = body as Record<string, unknown>

  if (typeof b.contractAddress !== "string" || !ADDRESS_REGEX.test(b.contractAddress)) {
    return { ok: false, error: "Invalid contract address format." }
  }

  if (typeof b.contractName !== "string" || !CONTRACT_NAME_REGEX.test(b.contractName)) {
    return { ok: false, error: "Invalid contract name." }
  }

  if (typeof b.sourceCode !== "string" || b.sourceCode.length === 0) {
    return { ok: false, error: "Source code is required." }
  }
  if (b.sourceCode.length > MAX_SOURCE_BYTES) {
    return { ok: false, error: `Source code exceeds ${MAX_SOURCE_BYTES} byte limit.` }
  }

  if (typeof b.compilerVersion !== "string" || !COMPILER_REGEX.test(b.compilerVersion)) {
    return { ok: false, error: "Invalid compiler version format." }
  }

  if (typeof b.optimizationUsed !== "boolean") {
    return { ok: false, error: "optimizationUsed must be boolean." }
  }

  if (
    typeof b.optimizationRuns !== "number" ||
    !Number.isInteger(b.optimizationRuns) ||
    b.optimizationRuns < 0 ||
    b.optimizationRuns > MAX_RUNS
  ) {
    return { ok: false, error: "Invalid optimizationRuns value." }
  }

  if (b.evmVersion !== undefined) {
    if (typeof b.evmVersion !== "string" || !EVM_VERSIONS.has(b.evmVersion)) {
      return { ok: false, error: "Invalid evmVersion." }
    }
  }

  // constructorArguments — optional hex string
  if (b.constructorArguments !== undefined) {
    if (
      typeof b.constructorArguments !== "string" ||
      !/^[0-9a-fA-F]*$/.test(b.constructorArguments)
    ) {
      return { ok: false, error: "Invalid constructorArguments format." }
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
      constructorArguments: b.constructorArguments as string | undefined,
    },
  }
}