/**
 * app/api/verify/route.ts
 * Server-side BaseScan verification
 * Uses single-file format with normalized source + evmVersion support
 */

import { NextRequest, NextResponse } from "next/server"

const BASESCAN_API = "https://api.etherscan.io/v2/api?chainid=8453"

interface VerifyRequest {
  contractAddress: string
  contractName: string
  sourceCode: string
  compilerVersion: string
  optimizationUsed: boolean
  optimizationRuns: number
  evmVersion?: string
}

function getApiKey(): string {
  return process.env.BASESCAN_API_KEY ?? ""
}

async function submitToBaseScan(req: VerifyRequest): Promise<{
  success: boolean
  guid?: string
  alreadyVerified?: boolean
  error?: string
}> {
  const apiKey = getApiKey()

  if (!apiKey) {
    return { success: false, error: "BASESCAN_API_KEY not set on server." }
  }

  // Normalize line endings — Windows CRLF to Unix LF
  const normalizedSource = req.sourceCode
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    + "\n"

  // Normalize evmVersion — replace unsupported versions with london
  const unsupportedVersions = ["osaka", "cancun", "shanghai"]
  const rawEvm = req.evmVersion ?? "london"
  const evmVersion = unsupportedVersions.includes(rawEvm) ? "london" : rawEvm

  console.log("[api/verify] Submitting to BaseScan", {
    address: req.contractAddress,
    name: req.contractName,
    compiler: req.compilerVersion,
    optimization: req.optimizationUsed,
    runs: req.optimizationRuns,
    evmVersion,
    sourceLength: normalizedSource.length,
  })

  const body = new URLSearchParams({
    module: "contract",
    action: "verifysourcecode",
    apikey: apiKey,
    contractaddress: req.contractAddress,
    sourceCode: normalizedSource,
    codeformat: "solidity-single-file",
    contractname: req.contractName,
    compilerversion: req.compilerVersion,
    optimizationUsed: req.optimizationUsed ? "1" : "0",
    runs: req.optimizationRuns.toString(),
    evmversion: evmVersion,
    licenseType: "3",
  })

  const res = await fetch(BASESCAN_API, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  const data = await res.json()
  console.log("[api/verify] BaseScan response →", data)

  if (
    data.result?.includes("Already Verified") ||
    data.result?.includes("already verified")
  ) {
    return { success: true, alreadyVerified: true }
  }

  if (data.status !== "1") {
    return {
      success: false,
      error: data.result ?? "BaseScan submission failed.",
    }
  }

  return { success: true, guid: data.result }
}

async function pollForResult(guid: string): Promise<{
  status: "verified" | "pending" | "failed"
  message: string
}> {
  const apiKey = getApiKey()
  const MAX_ATTEMPTS = 15
  const POLL_INTERVAL = 10000

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL))

    try {
      const params = new URLSearchParams({
        module: "contract",
        action: "checkverifystatus",
        guid,
        apikey: apiKey,
      })

      const res = await fetch(`${BASESCAN_API}&${params.toString()}`)
      const data = await res.json()
      console.log(`[api/verify] Poll ${i + 1}/${MAX_ATTEMPTS} → ${data.result}`)

      if (data.result === "Pass - Verified") {
        return { status: "verified", message: "Contract verified on BaseScan." }
      }

      if (data.result?.includes("Already Verified")) {
        return { status: "verified", message: "Already verified on BaseScan." }
      }

      if (
        data.result?.includes("Fail") ||
        data.result?.includes("Unable to verify")
      ) {
        return {
          status: "failed",
          message: `Verification failed: ${data.result}`,
        }
      }

    } catch (e) {
      console.error(`[api/verify] Poll error ${i + 1}`, e)
    }
  }

  return {
    status: "pending",
    message: "Verification submitted. Check BaseScan in a few minutes.",
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as VerifyRequest

    if (
      !body.contractAddress ||
      !body.contractName ||
      !body.sourceCode ||
      !body.compilerVersion
    ) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields." },
        { status: 400 },
      )
    }

    // Wait for BaseScan to index the newly deployed contract
    console.log("[api/verify] Waiting 20s for BaseScan indexing…")
    await new Promise((r) => setTimeout(r, 20000))

    const submission = await submitToBaseScan(body)

    if (submission.alreadyVerified) {
      return NextResponse.json({
        status: "verified",
        message: "Already verified on BaseScan.",
        explorerVerifiedUrl: `https://basescan.org/address/${body.contractAddress}#code`,
      })
    }

    if (!submission.success) {
      return NextResponse.json({
        status: "failed",
        message: submission.error ?? "Submission failed.",
      })
    }

    const result = await pollForResult(submission.guid!)

    return NextResponse.json({
      status: result.status,
      message: result.message,
      explorerVerifiedUrl:
        result.status === "verified"
          ? `https://basescan.org/address/${body.contractAddress}#code`
          : undefined,
    })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error."
    console.error("[api/verify] Exception →", message)
    return NextResponse.json(
      { status: "error", message },
      { status: 500 },
    )
  }
}