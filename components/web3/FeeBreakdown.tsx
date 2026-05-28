"use client"

import { DEPLOY_FEE_USD, VERIFY_FEE_USD } from "@/constants/treasury"
import { getContractById } from "./contracts"

export type DeployMode = "deploy" | "deploy-verify"

interface FeeBreakdownProps {
  contractId: string
  mode: DeployMode
  ethPriceUsd?: number
}

export function FeeBreakdown({ contractId, mode, ethPriceUsd = 3420 }: FeeBreakdownProps) {
  const contract = getContractById(contractId)
  const isVerify = mode === "deploy-verify"

  // Rough estimated gas — replace with on-chain estimate.
  const baseGas = contract?.accent === "amber" ? 0.000064 : 0.000028
  const gas = isVerify ? baseGas + 0.00002 : baseGas
  const platformFee = isVerify ? VERIFY_FEE_USD : DEPLOY_FEE_USD
  const total = gas * ethPriceUsd + platformFee

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-[13.5px]">
        <span className="text-[var(--ink-2)]">Estimated gas</span>
        <span className="font-mono font-semibold text-[var(--ink)]">
          {gas.toFixed(6)} ETH
        </span>
      </div>

      <div className="flex items-center justify-between text-[13.5px]">
        <span className="text-[var(--ink-2)]">Platform fee</span>
        <span className="font-mono font-semibold text-[var(--ink)]">
          ${platformFee.toFixed(2)}
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
          ~${total.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
