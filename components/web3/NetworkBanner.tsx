"use client"

import { useNetwork } from "@/hooks/useNetwork"

export function NetworkBanner() {
  const { isCorrectNetwork, isSwitching, switchToBase } = useNetwork()

  // If wallet is on correct network — show nothing
  if (isCorrectNetwork) return null

  return (
    <div className="relative z-40 border-b border-amber-400/20 bg-amber-400/[0.06] px-4 py-2.5">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3">

        {/* Warning message */}
        <div className="flex items-center gap-2.5">
          <span className="text-amber-400">⚠</span>
          <span className="text-[13px] font-medium text-amber-200">
            Wrong network detected. Please switch to Base Mainnet to deploy.
          </span>
        </div>

        {/* Switch button */}
        <button
          onClick={switchToBase}
          disabled={isSwitching}
          className="gradient-bg flex items-center gap-2 rounded-[8px] px-4 py-1.5 text-[12px] font-bold text-white shadow-[0_2px_8px_rgba(124,90,245,0.3)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSwitching ? (
            <>
              <span className="inline-block animate-spin">⟳</span>
              Switching…
            </>
          ) : (
            <>
              ⚡ Switch to Base
            </>
          )}
        </button>

      </div>
    </div>
  )
}