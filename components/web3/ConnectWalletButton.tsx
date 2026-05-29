"use client"

import { useState } from "react"
import { Wallet, Copy, Check, Loader2 } from "lucide-react"

interface ConnectWalletButtonProps {
  isConnected?: boolean
  isConnecting?: boolean
  address?: string
  balance?: number
  onConnect?: () => void
  onDisconnect?: () => void
}

const formatAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`

export function ConnectWalletButton({
  isConnected = false,
  isConnecting = false,
  address = "",
  balance = 0,
  onConnect,
  onDisconnect,
}: ConnectWalletButtonProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard unavailable */ }
  }

  // Not connected — show connect button
  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={onConnect}
        disabled={isConnecting}
        className="gradient-bg flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(124,90,245,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(124,90,245,0.5)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting…
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" strokeWidth={2} />
            Connect Wallet
          </>
        )}
      </button>
    )
  }

  // Connected — show address + balance + disconnect
  return (
    <div className="flex flex-col gap-2">
      {/* Address row with copy */}
      <button
        type="button"
        onClick={copy}
        className="flex items-center justify-between rounded-[10px] border border-white/[0.08] bg-black/25 px-3 py-2 font-mono text-xs transition-colors hover:border-white/[0.14]"
      >
        <span className="font-medium text-[var(--ink)]">{formatAddress(address)}</span>
        <span className="flex items-center gap-1.5 text-[var(--ink-3)]">
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] text-emerald-400">copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[10px]">copy</span>
            </>
          )}
        </span>
      </button>

      {/* Balance row */}
      <div className="flex items-center justify-between rounded-[10px] border border-white/[0.08] bg-black/25 px-3 py-2 font-mono text-xs">
        <span className="text-[var(--ink-3)]">Balance</span>
        <span className="font-semibold text-emerald-400">{balance.toFixed(4)} ETH</span>
      </div>

      {/* Disconnect */}
      <button
        type="button"
        onClick={onDisconnect}
        className="text-center text-[11px] text-[var(--ink-3)] transition-colors hover:text-red-400"
      >
        Disconnect
      </button>
    </div>
  )
}