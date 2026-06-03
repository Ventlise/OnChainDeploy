/**
 * services/deploy.ts
 *
 * Flow:
 *  1. Fetch live gas + ETH price
 *  2. ABI-encode the contract name and append to bytecode
 *  3. Send deployment transaction
 *  4. Wait for receipt → get contract address
 *  5. Send per-contract treasury fee
 *  6. If mode = "deploy-verify" → submit source + constructor arg to BaseScan
 */

import { TREASURY_ADDRESS } from "@/constants/treasury"
import { fetchGasData } from "@/services/gas"
import { verifyContract, type VerifyParams } from "@/services/verify"
import type { DeployMode } from "@/services/fees"

export interface DeployResult {
  contractAddress: string
  deployTxHash: string
  treasuryTxHash: string
  explorerUrl: string
  verified?: boolean
  verifyMessage?: string
  contractName: string
  encodedConstructorArg: string
}

function getEth() {
  if (typeof window === "undefined") throw new Error("No browser environment.")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eth = (window as any).ethereum
  if (!eth) throw new Error("No wallet detected. Please install MetaMask.")
  return eth
}

/**
 * ABI-encodes a single string constructor argument.
 *
 * Solidity ABI encoding for a single string parameter:
 *  - 32 bytes: offset to data (always 0x20 = 32 for first param)
 *  - 32 bytes: string length in bytes
 *  - N * 32 bytes: string data, right-padded with zeros to 32-byte boundary
 *
 * This is exactly what BaseScan needs in `constructorArguments`.
 */
export function encodeStringConstructorArg(value: string): string {
  // Encode string to UTF-8 bytes
  const encoder = new TextEncoder()
  const bytes = encoder.encode(value)
  const len = bytes.length

  // Offset to string data (always 32 = 0x20 for single param)
  const offset = "0000000000000000000000000000000000000000000000000000000000000020"

  // String length padded to 32 bytes
  const lengthHex = len.toString(16).padStart(64, "0")

  // String data padded to 32-byte boundary
  let dataHex = ""
  for (const byte of bytes) {
    dataHex += byte.toString(16).padStart(2, "0")
  }
  // Pad to next 32-byte boundary
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
 *
 * @param bytecode        Base creation bytecode (0x prefixed) — from contract file
 * @param gasLimit        Gas limit for this contract
 * @param from            Deployer wallet address
 * @param mode            "deploy" | "deploy-verify"
 * @param treasuryFeeUsd  Per-contract fee in USD
 * @param contractName    User-chosen name — ABI-encoded and appended to bytecode
 * @param verifyParams    Required when mode = "deploy-verify"
 * @param onStatus        Live status update callback
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

  // ── 1. Gas + ETH price ────────────────────────────────────────────
  onStatus?.("Fetching gas prices…")
  const gasData = await fetchGasData()
  const gasPriceHex = "0x" + gasData.gasPriceWei.toString(16)

  // ── 2. Append ABI-encoded name to bytecode ────────────────────────
  // This makes every deployment's on-chain bytecode unique.
  // The name is passed as a constructor argument (string) — standard Solidity ABI.
  const encodedArg = encodeStringConstructorArg(contractName)
  const deployBytecode = bytecode + encodedArg

  // ── 3. Deploy transaction ─────────────────────────────────────────
  onStatus?.("Waiting for MetaMask signature…")
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
      throw new Error("Transaction rejected in MetaMask.")
    }
    throw err
  }

  // ── 4. Wait for receipt ───────────────────────────────────────────
  onStatus?.("Deploying to Base… (this may take ~15s)")
  const receipt = await waitForReceipt(deployTxHash)

  if (!receipt.contractAddress) {
    throw new Error("No contract address returned. Deployment failed.")
  }

  // ── 5. Treasury fee ───────────────────────────────────────────────
  onStatus?.("Sending platform fee…")
  const feeWeiHex = usdToWeiHex(treasuryFeeUsd, gasData.ethPriceUsd)

  let treasuryTxHash: string
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
      throw new Error(
        `Sorry, contract not fully deployed. Please try again.`,
      )
    }
    throw err
  }

  // ── 6. Verification ───────────────────────────────────────────────
  let verified = false
  let verifyMessage = ""

  if (mode === "deploy-verify" && verifyParams) {
    onStatus?.("Submitting source code for verification…")
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