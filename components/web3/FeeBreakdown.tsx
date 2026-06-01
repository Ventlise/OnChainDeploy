"use client"

import { CONTRACT_GAS_LIMITS, DEFAULT_GAS_LIMIT } from "@/constants/treasury"
import { useGasPrice } from "@/hooks/useGasPrice"

export type DeployMode = "deploy" | "deploy-verify"

interface FeeBreakdownProps {
  contractId: string
  mode: DeployMode
  platformFeeUsd: number
}

export function FeeBreakdown({ contractId, mode, platformFeeUsd }: FeeBreakdownProps) {
  const { gasData, isLoading } = useGasPrice()

  const isVerify = mode === "deploy-verify"
  const gasLimit = CONTRACT_GAS_LIMITS[contractId] ?? DEFAULT_GAS_LIMIT

  const ethPrice = gasData?.ethPriceUsd ?? 3420
  const gasPriceGwei = gasData?.gasPriceGwei ?? 0.001
  const gasCostEth = (gasLimit * gasPriceGwei * 1.2) / 1e9
  const gasCostUsd = gasCostEth * ethPrice
  const total = gasCostUsd + platformFeeUsd

  return (
    <div className="flex flex-col gap-2.5">

      <div className="flex items-center justify-between text-[13.5px]">
        <span className="text-[var(--ink-2)]">Estimated gas</span>
        <span className="font-mono font-semibold text-[var(--ink)]">
          {isLoading ? "…" : `${gasCostEth.toFixed(6)} ETH`}
        </span>
      </div>

      <div className="flex items-center justify-between text-[13.5px]">
        <span className="text-[var(--ink-2)]">Gas (USD)</span>
        <span className="font-mono font-semibold text-[var(--ink)]">
          {isLoading ? "…" : `~$${gasCostUsd.toFixed(4)}`}
        </span>
      </div>

      <div className="flex items-center justify-between text-[13.5px]">
        <span className="text-[var(--ink-2)]">Platform fee</span>
        <span className="font-mono font-semibold text-[var(--ink)]">
          ${platformFeeUsd.toFixed(2)}
        </span>
      </div>

      {isVerify && (
        <div className="flex items-center justify-between text-[13.5px]">
          <span className="text-[var(--ink-2)]">Basescan verification</span>
          <span className="font-mono font-semibold text-emerald-400">included</span>
        </div>
      )}

      <div className="mt-1 flex items-center justify-between border-t border-dashed border-white/[0.08] pt-3 text-[15px]">
        <span className="font-semibold text-[var(--ink)]">Total</span>
        <span className="gradient-text font-mono text-base font-extrabold">
          {isLoading ? "…" : `~$${total.toFixed(4)}`}
        </span>
      </div>

    </div>
  )
}