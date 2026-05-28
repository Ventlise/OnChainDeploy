/**
 * verify.ts — verifies contracts using BaseScan API.
 *
 * BaseScan is Etherscan-compatible and gives the green "Verified" checkmark
 * directly on basescan.org.
 *
 * Requires: NEXT_PUBLIC_BASESCAN_API_KEY in your .env.local file
 * Get free key at: https://basescan.org/register
 */

const BASESCAN_API = "https://api.basescan.org/api";

export interface VerifyParams {
  contractAddress: string;
  contractName: string;
  sourceCode: string;
  /** Format: "v0.8.17+commit.8df45f5f" */
  compilerVersion: string;
  optimizationUsed: boolean;
  optimizationRuns: number;
}

export type VerifyStatus = "verified" | "pending" | "failed" | "error" | "no-key";

export interface VerifyResult {
  status: VerifyStatus;
  message: string;
  explorerVerifiedUrl?: string;
}

/** Read API key from Next.js env — set NEXT_PUBLIC_BASESCAN_API_KEY in .env.local */
function getApiKey(): string | null {
  return process.env.NEXT_PUBLIC_BASESCAN_API_KEY ?? null;
}

/** Poll BaseScan for verification result using GUID */
async function pollVerifyResult(
  guid: string,
  maxAttempts = 10,
  intervalMs = 5000,
): Promise<VerifyResult> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));

    const params = new URLSearchParams({
      module: "contract",
      action: "checkverifystatus",
      guid,
      apikey: getApiKey() ?? "",
    });

    const res = await fetch(`${BASESCAN_API}?${params.toString()}`);
    const data = await res.json();

    if (data.result === "Pass - Verified") {
      return {
        status: "verified",
        message: "Contract source verified on BaseScan.",
      };
    }

    if (data.result === "Fail - Unable to verify") {
      return {
        status: "failed",
        message: "BaseScan could not verify — check compiler settings match exactly.",
      };
    }

    // "Pending in queue" — keep polling
  }

  return {
    status: "pending",
    message: "Verification submitted — check BaseScan in a few minutes.",
  };
}

/**
 * Submit contract source code to BaseScan for verification.
 */
export async function verifyContract(
  params: VerifyParams,
): Promise<VerifyResult> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      status: "no-key",
      message:
        "No BaseScan API key found. Add NEXT_PUBLIC_BASESCAN_API_KEY to your .env.local file.",
    };
  }

  const {
    contractAddress,
    contractName,
    sourceCode,
    compilerVersion,
    optimizationUsed,
    optimizationRuns,
  } = params;

  try {
    const body = new URLSearchParams({
      module: "contract",
      action: "verifysourcecode",
      apikey: apiKey,
      contractaddress: contractAddress,
      sourceCode: sourceCode,
      codeformat: "solidity-single-file",
      contractname: contractName,
      compilerversion: compilerVersion,
      optimizationUsed: optimizationUsed ? "1" : "0",
      runs: optimizationRuns.toString(),
      licenseType: "3", // MIT
    });

    const res = await fetch(BASESCAN_API, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json();

    if (data.status !== "1") {
      return {
        status: "failed",
        message: data.result ?? "Verification submission failed.",
      };
    }

    // data.result is a GUID — poll for result
    const guid: string = data.result;
    const result = await pollVerifyResult(guid);

    if (result.status === "verified") {
      result.explorerVerifiedUrl = `https://basescan.org/address/${contractAddress}#code`;
    }

    return result;
  } catch (err: unknown) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Network error during verification.",
    };
  }
}
