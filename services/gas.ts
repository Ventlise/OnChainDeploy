/**
 * gas.ts — fetches live gas price from Base RPC
 * and real-time ETH/USD price from Binance public API.
 */

import { rpcCall, hexToBigInt, weiToGwei, weiToEth } from "@/services/rpc";
import { DEFAULT_CHAIN } from "@/constants/chains";

export interface GasData {
  gasPriceGwei: number;
  gasPriceWei: bigint;
  ethPriceUsd: number;
}

export interface FeeEstimate {
  gasLimit: number;
  gasCostEth: number;
  gasCostUsd: number;
}

/** Fetch current gas price from Base RPC */
export async function fetchGasPrice(
  rpcUrl: string = DEFAULT_CHAIN.rpcUrl,
): Promise<{ gasPriceGwei: number; gasPriceWei: bigint }> {
  const hex = await rpcCall<string>("eth_gasPrice", [], rpcUrl);
  const wei = hexToBigInt(hex);
  return {
    gasPriceWei: wei,
    gasPriceGwei: weiToGwei(wei),
  };
}

/**
 * Fetch real-time ETH price in USD.
 * Primary:  Binance public API  — free, no key, real-time
 * Fallback: CoinGecko free tier — may be rate limited
 * Last resort: hardcoded $2000  — shown if both fail
 */
export async function fetchEthPriceUsd(): Promise<number> {
  // ── Primary: Binance ─────────────────────────────────────────────────
  try {
    const res = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
      { cache: "no-store" },
    );
    if (res.ok) {
      const json = await res.json();
      const price = parseFloat(json?.price);
      if (!isNaN(price) && price > 0) return price;
    }
  } catch {
    // fall through to next source
  }

  // ── Fallback: CoinGecko ──────────────────────────────────────────────
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { cache: "no-store" },
    );
    if (res.ok) {
      const json = await res.json();
      const price = json?.ethereum?.usd;
      if (price && price > 0) return price;
    }
  } catch {
    // fall through to last resort
  }

  // ── Last resort ──────────────────────────────────────────────────────
  console.warn("ETH price fetch failed — using fallback $2000");
  return 2000;
}

/** Fetch gas price and ETH/USD price together */
export async function fetchGasData(): Promise<GasData> {
  const [gas, ethPriceUsd] = await Promise.all([
    fetchGasPrice(),
    fetchEthPriceUsd(),
  ]);
  return {
    gasPriceGwei: gas.gasPriceGwei,
    gasPriceWei: gas.gasPriceWei,
    ethPriceUsd,
  };
}

/**
 * Estimate deployment cost for a given gas limit.
 * Adds 20% safety buffer to the gas limit.
 */
export function estimateDeploymentCost(
  gasLimit: number,
  gasData: GasData,
): FeeEstimate {
  const bufferedGas = Math.ceil(gasLimit * 1.2);
  const gasCostWei = gasData.gasPriceWei * BigInt(bufferedGas);
  const gasCostEth = weiToEth(gasCostWei);
  const gasCostUsd = gasCostEth * gasData.ethPriceUsd;
  return { gasLimit: bufferedGas, gasCostEth, gasCostUsd };
}

/** Format USD: $0.0012 or $1.23 */
export function formatUsd(amount: number): string {
  if (amount < 0.01) return `$${amount.toFixed(4)}`;
  return `$${amount.toFixed(2)}`;
}

/** Format ETH: 0.00012300 ETH */
export function formatEth(amount: number): string {
  if (amount < 0.0001) return `${amount.toFixed(8)} ETH`;
  return `${amount.toFixed(6)} ETH`;
}
