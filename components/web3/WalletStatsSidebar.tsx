// components/web3/WalletStatsSidebar.tsx
"use client"

import { useEffect, useState } from "react"
import { Fuel, Wifi, Box, Bitcoin, Rocket } from "lucide-react"
import { useWallet } from "@/hooks/useWallet"
import { useNetwork } from "@/hooks/useNetwork"
import { useGasPrice } from "@/hooks/useGasPrice"
import { useGlobalStats } from "@/hooks/useGlobalStats"

export function WalletStatsSidebar({
  deployed,
  verified,
}: {
  deployed: number
  verified: number
}) {
  const { address, isConnected } = useWallet()
  const { isCorrectNetwork } = useNetwork()
  const { isLoading: gasLoading, gasPriceFormatted, ethPriceFormatted, refresh } = useGasPrice()
  const { total: globalTotal, isLoading: globalLoading } = useGlobalStats()

  const [block, setBlock] = useState(24891342)
  const [balance, setBalance] = useState(0)

  // Block number ticker — visual only
  useEffect(() => {
    const t = setInterval(() => setBlock((b) => b + 1), 2200)
    return () => clearInterval(t)
  }, [])

  // Fetch real ETH balance when wallet connects
  useEffect(() => {
    if (!address || !isConnected) { setBalance(0); return }
    const fetchBalance = async () => {
      try {
        const eth = (window as any).ethereum
        if (!eth) return
        const hex: string = await eth.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        })
        const wei = BigInt(hex)
        setBalance(Number(wei) / 1e18)
      } catch { setBalance(0) }
    }
    fetchBalance()
  }, [address, isConnected])

  const verifyRate = deployed ? Math.round((verified / deployed) * 100) : 0
  const formatAddr = (a: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—")

  return (
    <aside className="sticky top-[72px] flex flex-col gap-3">

      {/* ── GLOBAL STATS CARD (replaces the old duplicate wallet card) ── */}
      <div className="glass relative overflow-hidden p-4">
        {/* Gradient border glow — same as original wallet card */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl p-[1.5px] opacity-70"
          style={{
            background: "var(--grad)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
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

        {/* Icon + label row */}
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
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
            Global Contracts Deployed
          </div>
        </div>

        {/* The big live number */}
        <div className="mt-3">
          <div 
           key={globalTotal ?? 0}
           className="gradient-text text-[40px] font-extrabold leading-none tracking-tight            tabular-nums animate-in fade-in zoom-in-95 duration-500"
        >
            {globalLoading
              ? "—"
              : globalTotal !== null
              ? globalTotal.toLocaleString()
              : "123"}
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--ink-2)]">
            Smart contracts shipped on Base through OnChainDeploy — by builders worldwide.
          </p>
        </div>
      </div>

      {/* ── YOUR STATS CARD (unchanged) ── */}
      <div className="glass p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ink-3)]">
            Your Stats
          </span>
          <span className="font-mono text-[10px] text-[var(--ink-3)]">30d</span>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="rounded-[10px] border border-white/[0.08] bg-black/25 p-2.5">
            <div className="gradient-text text-[22px] font-extrabold leading-none tracking-tight">
              {deployed}
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
              Deployed
            </div>
          </div>
          <div className="rounded-[10px] border border-white/[0.08] bg-black/25 p-2.5">
            <div className="text-[22px] font-extrabold leading-none tracking-tight text-emerald-400">
              {verified}
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
              Verified
            </div>
          </div>
        </div>

        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-[11px] font-medium text-[var(--ink-2)]">Verify rate</span>
          <span className="font-mono text-[11px] font-bold text-[var(--ink)]">{verifyRate}%</span>
        </div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="gradient-bg h-full rounded-full transition-[width] duration-700"
            style={{ width: `${verifyRate}%`, boxShadow: "0 0 10px rgba(124,90,245,0.5)" }}
          />
        </div>

        <div className="flex flex-col gap-1.5 border-t border-dashed border-white/[0.08] pt-3">
          <Row label="Wallet" value={formatAddr(address ?? "")} />
          <Row label="Network" value="Base · 8453" />
          <Row label="Balance" value={isConnected ? `${balance.toFixed(4)} ETH` : "—"} />
        </div>
      </div>

      {/* ── NETWORK FEED CARD (unchanged) ── */}
      <div className="glass p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ink-3)]">
            Network Feed
          </span>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 transition-colors hover:text-emerald-300"
          >
            <span className="pulse-green inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            LIVE
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <FeedRow
            icon={<Fuel className="h-3.5 w-3.5" />}
            label="Gas price"
            value={gasLoading ? "…" : gasPriceFormatted}
          />
          <FeedRow
            icon={<Bitcoin className="h-3.5 w-3.5" />}
            label="ETH price"
            value={gasLoading ? "…" : ethPriceFormatted}
          />
          <FeedRow
            icon={<Wifi className="h-3.5 w-3.5" />}
            label="Network"
            value="BASE"
            valueClass="text-emerald-400"
          />
          <FeedRow
            icon={<Box className="h-3.5 w-3.5" />}
            label="Block"
            value={`#${block.toLocaleString()}`}
          />
        </div>
      </div>

    </aside>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[11.5px]">
      <span className="text-[var(--ink-3)]">{label}</span>
      <span className="font-mono font-medium text-[var(--ink)]">{value}</span>
    </div>
  )
}

function FeedRow({
  icon,
  label,
  value,
  valueClass = "text-[var(--ink)]",
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between rounded-[8px] border border-white/[0.08] bg-black/25 px-2.5 py-2">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-white/[0.04] text-[var(--ink-2)]">
          {icon}
        </span>
        <span className="text-[11.5px] font-medium text-[var(--ink-2)]">{label}</span>
      </div>
      <span className={`font-mono text-[11.5px] font-semibold ${valueClass}`}>{value}</span>
    </div>
  )
}