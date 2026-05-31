/**
 * deploy.ts — core deployment + optional verification logic.
 *
 * Flow:
 *  1. Fetch live gas + ETH price
 *  2. Send deployment transaction
 *  3. Wait for receipt → get contract address
 *  4. Send fixed treasury fee
 *  5. If mode = "deploy-verify" → submit source to Sourcify
 */

import {
  TREASURY_ADDRESS,
  TREASURY_FEE_DEPLOY_USD,
  TREASURY_FEE_VERIFY_USD,
} from "@/constants/treasury";
import { fetchGasData } from "@/services/gas";
import { verifyContract, type VerifyParams } from "@/services/verify";
import type { DeployMode } from "@/services/fees";

export interface DeployResult {
  contractAddress: string;
  deployTxHash: string;
  treasuryTxHash: string;
  explorerUrl: string;
  verified?: boolean;
  verifyMessage?: string;
}

function getEth() {
  if (typeof window === "undefined") throw new Error("No browser environment.");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eth = (window as any).ethereum;
  if (!eth) throw new Error("No wallet detected. Please install MetaMask.");
  return eth;
}

/** Poll until tx is mined — max 3 minutes */
async function waitForReceipt(txHash: string): Promise<{ contractAddress: string }> {
  const eth = getEth();
  const MAX = 60;
  const INTERVAL = 3000;

  for (let i = 0; i < MAX; i++) {
    await new Promise((r) => setTimeout(r, INTERVAL));
    const receipt = await eth.request({
      method: "eth_getTransactionReceipt",
      params: [txHash],
    });
    if (receipt) {
      if (receipt.status === "0x0") {
        throw new Error("Transaction reverted by the EVM.");
      }
      return { contractAddress: receipt.contractAddress };
    }
  }
  throw new Error("Tx not mined in time. Check BaseScan.");
}

/**
 * USD → wei using BigInt math (no floating point precision loss).
 * Formula: wei = (usdAmount * 1e18) / ethPriceUsd
 */
function usdToWeiHex(usdAmount: number, ethPriceUsd: number): string {
  const SCALE = 1_000_000n;
  const usdScaled = BigInt(Math.round(usdAmount * Number(SCALE)));
  const priceScaled = BigInt(Math.round(ethPriceUsd * Number(SCALE)));
  const WEI = BigInt("1000000000000000000");
  const wei = (usdScaled * WEI) / priceScaled;
  return "0x" + wei.toString(16);
}

function toHex(n: number): string {
  return "0x" + n.toString(16);
}

/**
 * Main deployment function.
 *
 * @param bytecode      Full creation bytecode (0x prefixed)
 * @param gasLimit      Estimated gas limit for this contract
 * @param from          Deployer wallet address
 * @param mode          "deploy" | "deploy-verify"
 * @param verifyParams  Required when mode = "deploy-verify"
 * @param onStatus      Live status update callback
 */
export async function deployContract(
  bytecode: string,
  gasLimit: number,
  from: string,
  mode: DeployMode,
  verifyParams?: Omit<VerifyParams, "contractAddress">,
  onStatus?: (msg: string) => void,
): Promise<DeployResult> {
  const eth = getEth();

  // ── 1. Gas + ETH price ───────────────────────────────────────────────
  onStatus?.("Fetching gas prices…");
  const gasData = await fetchGasData();
  const gasPriceHex = "0x" + gasData.gasPriceWei.toString(16);

  // ── 2. Deploy transaction ────────────────────────────────────────────
  onStatus?.("Waiting for MetaMask signature…");
  let deployTxHash: string;
  try {
    deployTxHash = await eth.request({
      method: "eth_sendTransaction",
      params: [{ from, data: bytecode, gas: toHex(gasLimit), gasPrice: gasPriceHex }],
    });
  } catch (err: unknown) {
    if ((err as { code?: number })?.code === 4001) {
      throw new Error("Transaction rejected in MetaMask.");
    }
    throw err;
  }

  // ── 3. Wait for receipt ──────────────────────────────────────────────
  onStatus?.("Deploying to Base… (this may take ~15s)");
  const receipt = await waitForReceipt(deployTxHash);

  if (!receipt.contractAddress) {
    throw new Error("No contract address returned. Deployment failed.");
  }

  // ── 4. Treasury fee ──────────────────────────────────────────────────
  onStatus?.("Sending platform fee…");
  const feeUsd =
    mode === "deploy-verify" ? TREASURY_FEE_VERIFY_USD : TREASURY_FEE_DEPLOY_USD;
  const feeWeiHex = usdToWeiHex(feeUsd, gasData.ethPriceUsd);

  let treasuryTxHash: string;
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
    });
  } catch (err: unknown) {
    if ((err as { code?: number })?.code === 4001) {
      throw new Error(
        `Contract deployed at ${receipt.contractAddress} but platform fee was rejected.`,
      );
    }
    throw err;
  }

  // ── 5. Sourcify verification (deploy-verify only) ────────────────────
  let verified = false;
  let verifyMessage = "";

  if (mode === "deploy-verify" && verifyParams) {
    onStatus?.("Submitting source code for verification…");
    try {
      const result = await verifyContract({
        ...verifyParams,
        contractAddress: receipt.contractAddress,
      });
      verified = result.status === "verified";
      verifyMessage = result.message;
    } catch {
      verifyMessage = "Auto-verification failed — you can verify manually at basescan.org/verifyContract";
    }
  }

  return {
    contractAddress: receipt.contractAddress,
    deployTxHash,
    treasuryTxHash,
    explorerUrl: `https://basescan.org/address/${receipt.contractAddress}`,
    verified,
    verifyMessage,
  };
}
