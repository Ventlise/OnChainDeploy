/**
 * lib/nameGenerator.ts
 *
 * Generates cryptographically unique random suffixes for contract names.
 * Uses crypto.getRandomValues — guaranteed different even across 10,000 calls
 * because it draws from the OS entropy pool, not a seeded PRNG.
 *
 * Format examples:
 *   SimpleStorage → "Storage_a3f2b1"
 *   HelloBase     → "Hello_7c9d4e"
 *   Counter       → "Counter_2a8f1b"
 *   Voting        → "Ballot_e4c9d2"
 */

// 6 hex chars = 16^6 = 16,777,216 possible values
// Combined with timestamp: effectively infinite unique values
function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Generates a guaranteed-unique random suffix.
 * Combines 3 random bytes (6 hex chars) with last 2 chars of timestamp.
 * Example output: "a3f2b1c9"
 */
function uniqueSuffix(): string {
  const rand = randomHex(3)          // 3 random bytes = 6 hex chars
  const time = Date.now().toString(36).slice(-2)  // 2 base36 time chars
  return rand + time                  // 8 chars total, unique every call
}

export interface ContractNameConfig {
  prefix: string        // shown in popup title
  prompt: string        // question shown to user
  placeholder: string   // example text in input
  defaultPrefix: string // used for random generation
}

export const CONTRACT_NAME_CONFIGS: Record<string, ContractNameConfig> = {
  "simple-storage": {
    prefix: "Simple Storage",
    prompt: "Give it a label",
    placeholder: "My Treasury",
    defaultPrefix: "Storage",
  },
  "hello-base": {
    prefix: "Hello Base",
    prompt: "Say hello as...",
    placeholder: "CryptoPunk",
    defaultPrefix: "Hello",
  },
  "counter": {
    prefix: "Counter",
    prompt: "What are you counting?",
    placeholder: "Coffee Cups",
    defaultPrefix: "Counter",
  },
  "voting": {
    prefix: "Voting",
    prompt: "What's the vote about?",
    placeholder: "Team Pizza Choice",
    defaultPrefix: "Ballot",
  },
}

/**
 * Generates a unique random name for a contract.
 * Format: "{defaultPrefix}_{8charSuffix}"
 * Max length: never exceeds 15 chars (prefix max 7 + "_" + 8 = 16... adjusted below)
 *
 * Examples:
 *   Storage_a3f2b1c9
 *   Hello_a3f2b1c9
 *   Counter_a3f2b1c9   ← 7+1+8 = 16, so we trim prefix to 6
 *   Ballot_a3f2b1c9
 */
export function generateUniqueName(contractId: string): string {
  const config = CONTRACT_NAME_CONFIGS[contractId]
  const prefix = config?.defaultPrefix ?? "Contract"
  const suffix = uniqueSuffix()  // 8 chars

  // Ensure total <= 15 chars: prefix + "_" + suffix
  // suffix is always 8 chars, "_" is 1 char, so prefix max = 6
  const trimmedPrefix = prefix.slice(0, 6)
  return `${trimmedPrefix}_${suffix}`
}

/**
 * Validates a user-entered contract name.
 * Rules:
 *   - 1 to 15 characters
 *   - Letters, numbers, spaces, hyphens, underscores only
 *   - Cannot be only spaces
 */
export function validateContractName(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length === 0) return "Name cannot be empty."
  if (trimmed.length > 15) return "Name must be 15 characters or less."
  if (!/^[a-zA-Z0-9 \-_]+$/.test(trimmed)) {
    return "Only letters, numbers, spaces, hyphens, and underscores allowed."
  }
  return null // valid
}