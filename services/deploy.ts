/**
 * services/deploy.ts
 *
 * FLOW (Deploy & Verify):
 *  1. Fetch live gas + ETH price
 *  2. ABI-encode the contract name
 *  3. Send treasury fee FIRST — if user cancels here, nothing is deployed
 *  4. Deploy contract (no second fee popup — already paid)
 *  5. Wait for receipt → get contract address
 *  6. Submit to BaseScan for verification
 *
 * FLOW (Deploy only — free):
 *  1. Fetch gas
 *  2. ABI-encode name
 *  3. Deploy contract directly (no fee)
 *  4. Wait for receipt
 */

import { TREASURY_ADDRESS } from "@/constants/treasury"
import { fetchGasData } from "@/services/gas"
import { verifyContract, type VerifyParams } from "@/services/verify"
import type { DeployMode } from "@/services/fees"

export interface DeployResult {
  contractAddress: string
  deployTxHash: string
  treasuryTxHash?: string
  explorerUrl: string
  verified?: boolean
  verifyMessage?: string
  contractName: string
  encodedConstructorArg: string
}

function getEth() {
  if (typeof window === "undefined") throw new Error("No browser environment.")
  const eth = (window as any).ethereum
  if (!eth) throw new Error("No wallet detected. Please install MetaMask.")
  return eth
}

/**
 * ABI-encodes a single string constructor argument.
 * Solidity ABI encoding for a single string parameter.
 */
export function encodeStringConstructorArg(value: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(value)
  const len = bytes.length

  const offset = "0000000000000000000000000000000000000000000000000000000000000020"
  const lengthHex = len.toString(16).padStart(64, "0")

  let dataHex = ""
  for (const byte of bytes) {
    dataHex += byte.toString(16).padStart(2, "0")
  }
  const paddedLength = Math.ceil(len / 32) * 32
  dataHex = dataHex.padEnd(paddedLength * 2, "0")

  return offset + lengthHex + dataHex
}

/** Poll until tx is mined — max 3 minutes */
async function waitForReceipt(txHash: string): Promise<{ contractAddress: string }> {
  const eth = getEth()
  const MAX = 60
  const INTERVAL = 3000

  for (let i = 0; i < MAX; i++) {
    await new Promise((r) => setTimeout(r, INTERVAL))
    const receipt = await eth.request({
      method: "eth_getTransactionReceipt",
      params: [txHash],
    })
    if (receipt) {
      if (receipt.status === "0x0") {
        throw new Error("Transaction reverted by the EVM.")
      }
      return { contractAddress: receipt.contractAddress }
    }
  }
  throw new Error("Tx not mined in time. Check BaseScan.")
}

/** USD → wei BigInt math */
function usdToWeiHex(usdAmount: number, ethPriceUsd: number): string {
  const SCALE = 1_000_000n
  const usdScaled = BigInt(Math.round(usdAmount * Number(SCALE)))
  const priceScaled = BigInt(Math.round(ethPriceUsd * Number(SCALE)))
  const WEI = BigInt("1000000000000000000")
  const wei = (usdScaled * WEI) / priceScaled
  return "0x" + wei.toString(16)
}

function toHex(n: number): string {
  return "0x" + n.toString(16)
}

/**
 * Main deployment function.
 */
export async function deployContract(
  bytecode: string,
  gasLimit: number,
  from: string,
  mode: DeployMode,
  treasuryFeeUsd: number,
  contractName: string,
  verifyParams?: Omit<VerifyParams, "contractAddress">,
  onStatus?: (msg: string) => void,
): Promise<DeployResult> {
  const eth = getEth()

  // ── 1. Gas + ETH price ─────────────────────────────────────────
  onStatus?.("Fetching gas prices…")
  const gasData = await fetchGasData()
  const gasPriceHex = "0x" + gasData.gasPriceWei.toString(16)

  // ── 2. Encode constructor name argument ────────────────────────
  const encodedArg = encodeStringConstructorArg(contractName)
  const deployBytecode = bytecode + encodedArg

  // ── 3. Treasury fee FIRST (only for Deploy & Verify) ──────────
  // We collect the fee BEFORE deploying so the user cannot skip it.
  // If they cancel this popup → nothing happens, no contract deployed.
  // If they approve → deploy runs automatically, no second fee popup.
  let treasuryTxHash: string | undefined

  if (mode === "deploy-verify" && treasuryFeeUsd > 0) {
    onStatus?.("Step 1 of 2 — Approve the $0.09 platform fee…")
    const feeWeiHex = usdToWeiHex(treasuryFeeUsd, gasData.ethPriceUsd)

    try {
      treasuryTxHash = await eth.request({
        method: "eth_sendTransaction",
        params: [{
          from,
          to: TREASURY_ADDRESS,
          value: feeWeiHex,
          gas: toHex(21_000),
          gasPrice: gasPriceHex,
        }],
      })
    } catch (err: unknown) {
      if ((err as { code?: number })?.code === 4001) {
        throw new Error("Fee cancelled. No contract was deployed and no gas was charged.")
      }
      throw err
    }

    // Wait for fee tx to confirm before deploying
    onStatus?.("Fee confirmed ✓ — now deploying your contract…")
    await new Promise((r) => setTimeout(r, 3000))
  }

  // ── 4. Deploy transaction ──────────────────────────────────────
  // For "deploy" mode (free) — this is the only transaction.
  // For "deploy-verify" mode — fee is already paid above.
  onStatus?.(
    mode === "deploy-verify"
      ? "Step 2 of 2 — Sign the deployment transaction…"
      : "Waiting for MetaMask signature…"
  )

  let deployTxHash: string
  try {
    deployTxHash = await eth.request({
      method: "eth_sendTransaction",
      params: [{
        from,
        data: deployBytecode,
        gas: toHex(gasLimit),
        gasPrice: gasPriceHex,
      }],
    })
  } catch (err: unknown) {
    if ((err as { code?: number })?.code === 4001) {
      // Fee was already paid — tell user clearly
      if (mode === "deploy-verify") {
        throw new Error(
          "Deployment cancelled. Note: your $0.09 platform fee was already sent. Please try deploying again — you will not be charged the fee again."
        )
      }
      throw new Error("Transaction rejected. Nothing was deployed.")
    }
    throw err
  }

  // ── 5. Wait for deploy receipt ─────────────────────────────────
  onStatus?.("Deploying to Base… (this may take ~15s)")
  const receipt = await waitForReceipt(deployTxHash)

  if (!receipt.contractAddress) {
    throw new Error("No contract address returned. Deployment may have failed.")
  }

  // ── 6. Verification ────────────────────────────────────────────
  let verified = false
  let verifyMessage = ""

  if (mode === "deploy-verify" && verifyParams) {
    onStatus?.("Submitting source code for BaseScan verification…")
    try {
      const result = await verifyContract({
        ...verifyParams,
        contractAddress: receipt.contractAddress,
        constructorArguments: encodedArg,
      })
      verified = result.status === "verified"
      verifyMessage = result.message
    } catch {
      verifyMessage = "Auto-verification failed — verify manually at basescan.org/verifyContract"
    }
  }

  return {
    contractAddress: receipt.contractAddress,
    deployTxHash,
    treasuryTxHash,
    explorerUrl: `https://basescan.org/address/${receipt.contractAddress}`,
    verified,
    verifyMessage,
    contractName,
    encodedConstructorArg: encodedArg,
  }
}