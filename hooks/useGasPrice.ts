import { useState, useEffect, useCallback } from "react";
import { fetchGasData, formatUsd, type GasData } from "@/services/gas";

export interface UseGasPriceReturn {
  gasData: GasData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  /** Formatted ETH price e.g. "$3,200.00" */
  ethPriceFormatted: string;
  /** Formatted gas price e.g. "0.05 Gwei" */
  gasPriceFormatted: string;
}

const REFRESH_INTERVAL_MS = 15_000; // refresh every 15 seconds

export function useGasPrice(): UseGasPriceReturn {
  const [gasData, setGasData] = useState<GasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchGasData();
      setGasData(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch gas data.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    load();
  }, [load]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(load, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  const ethPriceFormatted = gasData
    ? `$${gasData.ethPriceUsd.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "—";

  const gasPriceFormatted = gasData
    ? `${gasData.gasPriceGwei.toFixed(4)} Gwei`
    : "—";

  return {
    gasData,
    isLoading,
    error,
    refresh: load,
    ethPriceFormatted,
    gasPriceFormatted,
  };
}
