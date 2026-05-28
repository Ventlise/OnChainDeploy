import { useState, useEffect, useCallback } from "react";
import {
  SUPPORTED_CHAIN_IDS,
  CHAIN_BY_ID,
  BASE_MAINNET,
  type ChainConfig,
} from "@/constants/chains";

export interface UseNetworkReturn {
  chainId: number | null;
  currentChain: ChainConfig | null;
  isCorrectNetwork: boolean;
  isSwitching: boolean;
  error: string | null;
  switchToBase: () => Promise<void>;
}

function getProvider() {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).ethereum ?? null;
}

/** Prompt MetaMask to switch to Base. Adds the chain if not already in wallet. */
async function switchChain(chain: ChainConfig): Promise<void> {
  const eth = getProvider();
  if (!eth) throw new Error("No wallet detected.");

  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chain.chainIdHex }],
    });
  } catch (switchError: unknown) {
    // Error code 4902 = chain not added to MetaMask yet
    const code = (switchError as { code?: number })?.code;
    if (code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chain.chainIdHex,
            chainName: chain.name,
            rpcUrls: [chain.rpcUrl],
            blockExplorerUrls: [chain.blockExplorer],
            nativeCurrency: chain.nativeCurrency,
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}

export function useNetwork(): UseNetworkReturn {
  const [chainId, setChainId] = useState<number | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read current chain on mount
  useEffect(() => {
    const eth = getProvider();
    if (!eth) return;

    eth
      .request({ method: "eth_chainId" })
      .then((hex: string) => setChainId(parseInt(hex, 16)))
      .catch(() => {});

    const handleChainChange = (hex: string) => {
      setChainId(parseInt(hex, 16));
    };

    eth.on?.("chainChanged", handleChainChange);
    return () => eth.removeListener?.("chainChanged", handleChainChange);
  }, []);

  const switchToBase = useCallback(async () => {
    setIsSwitching(true);
    setError(null);
    try {
      await switchChain(BASE_MAINNET);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to switch network.";
      setError(message);
    } finally {
      setIsSwitching(false);
    }
  }, []);

  const isCorrectNetwork =
    chainId !== null && SUPPORTED_CHAIN_IDS.includes(chainId);

  const currentChain = chainId ? (CHAIN_BY_ID[chainId] ?? null) : null;

  return {
    chainId,
    currentChain,
    isCorrectNetwork,
    isSwitching,
    error,
    switchToBase,
  };
}
