"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { BASE_CHAIN_ID } from "@/constants/chains"

/**
 * Placeholder hook — replace with wagmi's useChainId / useSwitchChain
 * or your own wallet provider integration.
 */
function useNetwork() {
  const [chainId, setChainId] = useState<number>(1)
  const isWrongNetwork = chainId !== BASE_CHAIN_ID
  const switchToBase = () => setChainId(BASE_CHAIN_ID)
  return { chainId, isWrongNetwork, switchToBase }
}

export function NetworkBanner() {
  const { isWrongNetwork, switchToBase } = useNetwork()

  if (!isWrongNetwork) return null

  return (
    <div className="border-y border-amber-400/20 bg-gradient-to-b from-amber-400/[0.10] to-amber-400/[0.05]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-2.5">
        <div className="flex items-center gap-2.5 text-sm font-medium text-amber-300">
          <span
            className="pulse-amber inline-block h-2 w-2 rounded-full bg-amber-400"
            style={{ boxShadow: "0 0 12px #fbbf24" }}
          />
          <AlertTriangle className="h-4 w-4" strokeWidth={2.2} />
          <span>
            Wrong network detected. Switch to <b className="font-semibold">Base Mainnet</b> to deploy.
          </span>
        </div>
        <button
          type="button"
          onClick={switchToBase}
          className="gradient-bg rounded-[10px] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(124,90,245,0.35)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(124,90,245,0.5)]"
        >
          Switch to Base
        </button>
      </div>
    </div>
  )
}
