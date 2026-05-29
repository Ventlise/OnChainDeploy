/**
 * verify.ts
 * Method: BaseScan API — Standard JSON Input (same as Hardhat)
 * Runs: CLIENT-SIDE only (browser fetch)
 * Env: NEXT_PUBLIC_BASESCAN_API_KEY
 */

const BASESCAN_API = "https://api.basescan.org/api"

export interface VerifyParams {
  contractAddress: string
  contractName: string
  sourceCode: string
  compilerVersion: string
  optimizationUsed: boolean
  optimizationRuns: number
}

export type VerifyStatus = "verified" | "pending" | "failed" | "error" | "no-key"

export interface VerifyResult {
  status: VerifyStatus
  message: string
  explorerVerifiedUrl?: string
}

function getApiKey(): string | null {
  return process.env.NEXT_PUBLIC_BASESCAN_API_KEY ?? null
}

function log(msg: string, data?: unknown) {
  console.log(`[verify] ${msg}`, data ?? "")
}

function buildStandardJsonInput(
  contractName: string,
  sourceCode: string,
  optimizationUsed: boolean,
  optimizationRuns: number,
): string {
  const input = {
    language: "Solidity",
    sources: {
      [`${contractName}.sol`]: { content: sourceCode },
    },
    settings: {
      optimizer: { enabled: optimizationUsed, runs: optimizationRuns },
      outputSelection: {
        "*": { "*": ["abi", "evm.bytecode", "evm.deployedBytecode", "metadata"] },
      },
      evmVersion: "paris",
    },
  }
  log("Standard JSON Input built", { contractName, optimizationUsed })
  return JSON.stringify(input)
}

async function waitForIndexing(ms: number): Promise<void> {
  log(`Waiting ${ms / 1000}s for BaseScan to index contract…`)
  await new Promise((r) => setTimeout(r, ms))
}

async function pollVerifyResult(guid: string): Promise<VerifyResult> {
  const MAX = 12
  const INTERVAL = 10000

  log(`Polling for result — GUID: ${guid}`)

  for (let i = 0; i < MAX; i++) {
    await new Promise((r) => setTimeout(r, INTERVAL))

    try {
      const params = new URLSearchParams({
        module: "contract",
        action: "checkverifystatus",
        guid,
        apikey: getApiKey() ?? "",
      })

      const res = await fetch(`${BASESCAN_API}?${params.toString()}`)
      const data = await res.json()
      log(`Poll attempt ${i + 1} — result: ${data.result}`)

      if (data.result === "Pass - Verified") {
        return { status: "verified", message: "Contract verified on BaseScan." }
      }

      if (data.result?.includes("Already Verified")) {
        return { status: "verified", message: "Already verified on BaseScan." }
      }

      if (data.result?.includes("Fail") || data.result?.includes("Unable to verify")) {
        return { status: "failed", message: `BaseScan: ${data.result}` }
      }

    } catch (e) {
      log(`Poll error attempt ${i + 1}`, e)
    }
  }

  return {
    status: "pending",
    message: "Submitted — check BaseScan in a few minutes.",
  }
}

export async function verifyContract(params: VerifyParams): Promise<VerifyResult> {
  const apiKey = getApiKey()
  log("Starting verification", {
    contractAddress: params.contractAddress,
    contractName: params.contractName,
    compilerVersion: params.compilerVersion,
    optimizationUsed: params.optimizationUsed,
    apiKeyPresent: !!apiKey,
  })

  if (!apiKey) {
    return {
      status: "no-key",
      message: "No BaseScan API key. Add NEXT_PUBLIC_BASESCAN_API_KEY to .env.local",
    }
  }

  const {
    contractAddress,
    contractName,
    sourceCode,
    compilerVersion,
    optimizationUsed,
    optimizationRuns,
  } = params

  try {
    // Step 1 — Wait for BaseScan to index
    await waitForIndexing(45000)

    // Step 2 — Build Standard JSON Input
    const standardJsonInput = buildStandardJsonInput(
      contractName,
      sourceCode,
      optimizationUsed,
      optimizationRuns,
    )

    // Step 3 — Build exact payload
    const payload: Record<string, string> = {
      module: "contract",
      action: "verifysourcecode",
      apikey: apiKey,
      contractaddress: contractAddress,
      sourceCode: standardJsonInput,
      codeformat: "solidity-standard-json-input",
      contractname: `${contractName}.sol:${contractName}`,
      compilerversion: compilerVersion,
      licenseType: "3",
    }

    log("Submitting verification payload", {
      contractaddress: payload.contractaddress,
      codeformat: payload.codeformat,
      contractname: payload.contractname,
      compilerversion: payload.compilerversion,
      licenseType: payload.licenseType,
    })

    const body = new URLSearchParams(payload)
    const res = await fetch(BASESCAN_API, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })

    const data = await res.json()
    log("BaseScan submission response", data)

    if (data.result?.includes("Already Verified")) {
      return {
        status: "verified",
        message: "Already verified on BaseScan.",
        explorerVerifiedUrl: `https://basescan.org/address/${contractAddress}#code`,
      }
    }

    if (data.status !== "1") {
      log("Submission failed", data)
      return {
        status: "failed",
        message: `Submission failed: ${data.result ?? "Unknown error"}`,
      }
    }

    // Step 4 — Poll for result
    const guid: string = data.result
    const result = await pollVerifyResult(guid)

    if (result.status === "verified") {
      result.explorerVerifiedUrl = `https://basescan.org/address/${contractAddress}#code`
    }

    log("Final verification result", result)
    return result

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    log("Verification exception", msg)
    return { status: "error", message: msg }
  }
}