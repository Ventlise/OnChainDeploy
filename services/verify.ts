/**
 * verify.ts — client-side verification caller
 * Calls our own Next.js API route /api/verify (server-side)
 * API key stays on server — never exposed to browser
 */

export interface VerifyParams {
  contractAddress: string
  contractName: string
  sourceCode: string
  compilerVersion: string
  optimizationUsed: boolean
  optimizationRuns: number
  evmVersion?: string
}

export type VerifyStatus = "verified" | "pending" | "failed" | "error" | "no-key"

export interface VerifyResult {
  status: VerifyStatus
  message: string
  explorerVerifiedUrl?: string
}

export async function verifyContract(params: VerifyParams): Promise<VerifyResult> {
  try {
    console.log("[verify] Sending to /api/verify →", params.contractAddress)

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("[verify] Server error", res.status, text)
      return {
        status: "error",
        message: `Server error ${res.status}. Verify manually at basescan.org/verifyContract`,
      }
    }

    const data = await res.json()
    console.log("[verify] Server result →", data)

    return {
      status: data.status,
      message: data.message,
      explorerVerifiedUrl: data.explorerVerifiedUrl,
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error."
    console.error("[verify] Exception →", message)
    return { status: "error", message }
  }
}