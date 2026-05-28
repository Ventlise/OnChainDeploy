"use client"

import { useEffect, useState } from "react"
import { Fuel, Wifi, Box, Bitcoin } from "lucide-react"
import { ConnectWalletButton } from "./ConnectWalletButton"

interface WalletStatsSidebarProps {
  deployed: number
  verified: number
  isConnected?: boolean
  address?: string
  balance?: number
  onConnect?: () => void
  onDisconnect?: () => void
}

export function WalletStatsSidebar({
  deployed,
  verified,
  isConnected = false,
  address = "",
  balance = 0,
  onConnect,
  onDisconnect,
}: WalletStatsSidebarProps) {
  const [feed, setFeed] = useState({ gas: 0.012, eth: 3420.55, block: 18420715 })

  useEffect(() => {
    const t = setInterval(() => {
      setFeed((f) => ({
        gas: Math.max(0.005, f.gas + (Math.random() - 0.5) * 0.004),
        eth: f.eth + (Math.random() - 0.5) * 4,
        block: f.block + 1,
      }))
    }, 2200)
    return () => clearInterval(t)
  }, [])

  const verifyRate = deployed ? Math.round((verified / deployed) * 100) : 0
  const formatAddr = (a: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—")

  return (
    <aside className="sticky top-[120px] flex flex-col gap-4.5">
      {/* WALLET CARD — gradient border + glow */}
      <div className="glass relative overflow-hidden p-5.5">
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
          className="pointer-events-none absolute -inset-0.5 -z-10 rounded-[18px] opacity-25 blur-2xl"
          style={{ background: "var(--grad)" }}
        />

        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-300">
          <span className="pulse-green inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          BASE MAINNET
        </span>

        <h3 className="mt-3.5 text-[17px] font-bold text-[var(--ink)]">
          {isConnected ? "Wallet connected" : "Connect your wallet"}
        </h3>
        <p className="mb-4 mt-1 text-[12.5px] leading-relaxed text-[var(--ink-2)]">
          {isConnected
            ? "Ready to deploy on Base. Gas paid in ETH."
            : "Connect to deploy contracts in one click."}
        </p>

        <ConnectWalletButton
          isConnected={isConnected}
          address={address}
          balance={balance}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </div>

      {/* STATS CARD */}
      <div className="glass p-5">
        <div className="mb-3.5 flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--ink-3)]">
            Your Stats
          </span>
          <span className="font-mono text-[11px] text-[var(--ink-3)]">30d</span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-[12px] border border-white/[0.08] bg-black/25 p-3.5">
            <div className="gradient-text text-[26px] font-extrabold leading-none tracking-tight">
              {deployed}
            </div>
            <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
              Deployed
            </div>
          </div>
          <div className="rounded-[12px] border border-white/[0.08] bg-black/25 p-3.5">
            <div className="text-[26px] font-extrabold leading-none tracking-tight text-emerald-400">
              {verified}
            </div>
            <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
              Verified
            </div>
          </div>
        </div>

        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-xs font-medium text-[var(--ink-2)]">Verify rate</span>
          <span className="font-mono text-xs font-bold text-[var(--ink)]">{verifyRate}%</span>
        </div>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="gradient-bg h-full rounded-full transition-[width] duration-700"
            style={{ width: `${verifyRate}%`, boxShadow: "0 0 12px rgba(124,90,245,0.5)" }}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-dashed border-white/[0.08] pt-3.5">
          <Row label="Wallet" value={formatAddr(address)} />
          <Row label="Network" value="Base · 8453" />
        </div>
      </div>

      {/* NETWORK FEED CARD */}
      <div className="glass p-5">
        <div className="mb-3.5 flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--ink-3)]">
            Network Feed
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <span className="pulse-green inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            LIVE
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <FeedRow icon={<Fuel className="h-4 w-4" />} label="Gas price" value={`${feed.gas.toFixed(3)} gwei`} />
          <FeedRow icon={<Bitcoin className="h-4 w-4" />} label="ETH price" value={`$${feed.eth.toFixed(2)}`} />
          <FeedRow icon={<Wifi className="h-4 w-4" />} label="Network" value="BASE" valueClass="text-emerald-400" />
          <FeedRow icon={<Box className="h-4 w-4" />} label="Block" value={`#${feed.block.toLocaleString()}`} />
        </div>
      </div>
    </aside>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
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
    <div className="flex items-center justify-between rounded-[10px] border border-white/[0.08] bg-black/25 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.04] text-[var(--ink-2)]">
          {icon}
        </span>
        <span className="text-[12.5px] font-medium text-[var(--ink-2)]">{label}</span>
      </div>
      <span className={`font-mono text-[12.5px] font-semibold ${valueClass}`}>{value}</span>
    </div>
  )
}
