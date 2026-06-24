// components/web3/GlobalStatsCard.tsx
"use client"

import { Rocket } from "lucide-react"
import { useGlobalStats } from "@/hooks/useGlobalStats"

export function GlobalStatsCard() {
  const { total } = useGlobalStats()

  return (
    <div className="glass relative overflow-hidden p-4">
      {/* Gradient border glow — matches your wallet card */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl p-[1.5px] opacity-70"
        style={{
          background: "var(--grad)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div
        className="pointer-events-none absolute -inset-0.5 -z-10 rounded-[18px] opacity-20 blur-2xl"
        style={{ background: "var(--grad)" }}
      />

      {/* Live badge */}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-300">
        <span className="pulse-green inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Live · Base Mainnet
      </span>

      {/* Icon + label */}
      <div className="mt-3 flex items-center gap-2.5">
        <div
          className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
          style={{
            background: "var(--grad)",
            boxShadow: "0 4px 14px rgba(124,90,245,0.4)",
          }}
        >
          <Rocket className="h-4 w-4 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
            Global Contracts Deployed
          </div>
        </div>
      </div>

      {/* The big number */}
      <div className="mt-3">
        <div className="gradient-text text-[40px] font-extrabold leading-none tracking-tight tabular-nums">
          {total !== null ? total.toLocaleString() : "—"}
        </div>
        <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--ink-2)]">
          Smart contracts shipped on Base through OnChainDeploy by builders
          worldwide.
        </p>
      </div>
    </div>
  )
}