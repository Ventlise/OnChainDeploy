/**
 * rpc.ts — lightweight JSON-RPC helper.
 * Used to call Base RPC endpoints without needing ethers.js.
 */

import { DEFAULT_CHAIN } from "@/constants/chains";

export async function rpcCall<T = unknown>(
  method: string,
  params: unknown[] = [],
  rpcUrl: string = DEFAULT_CHAIN.rpcUrl,
): Promise<T> {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC request failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`);
  }

  return data.result as T;
}

/** Convert hex string e.g. "0x1a" to BigInt */
export function hexToBigInt(hex: string): bigint {
  return BigInt(hex);
}

/** Convert wei BigInt to ETH as a number */
export function weiToEth(wei: bigint): number {
  return Number(wei) / 1e18;
}

/** Convert wei BigInt to Gwei as a number */
export function weiToGwei(wei: bigint): number {
  return Number(wei) / 1e9;
}

/** Convert number to hex string e.g. 8453 → "0x2105" */
export function numberToHex(n: number): string {
  return "0x" + n.toString(16);
}
