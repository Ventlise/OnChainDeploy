"use client"

import { useState } from "react"
import { Wallet, Copy, Check } from "lucide-react"

interface ConnectWalletButtonProps {
  isConnected?: boolean
  address?: string
  balance?: number
  onConnect?: () => void
  onDisconnect?: () => void
}

const formatAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`

export function ConnectWalletButton({
  isConnected = false,
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
    } catch {
      /* clipboard may be unavailable in some sandboxed contexts */
    }
  }

  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={onConnect}
        className="gradient-bg flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-[0_4px_14px_rgba(124,90,245,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(124,90,245,0.5)]"
      >
        <Wallet className="h-5 w-5" strokeWidth={2} />
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={copy}
        className="flex items-center justify-between rounded-[10px] border border-white/[0.08] bg-black/25 px-3 py-2.5 font-mono text-xs transition-colors hover:border-white/[0.12]"
      >
        <span className="font-medium text-[var(--ink)]">{formatAddress(address)}</span>
        <span className="flex items-center gap-2 text-[var(--ink-3)]">
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] text-emerald-400">copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[11px]">copy</span>
            </>
          )}
        </span>
      </button>
      <div className="flex items-center justify-between rounded-[10px] border border-white/[0.08] bg-black/25 px-3 py-2.5 font-mono text-xs">
        <span className="text-[var(--ink-3)]">Balance</span>
        <span className="font-semibold text-emerald-400">{balance.toFixed(4)} ETH</span>
      </div>
      <button
        type="button"
        onClick={onDisconnect}
        className="text-center text-[11.5px] text-[var(--ink-3)] transition-colors hover:text-[var(--ink-2)]"
      >
        Disconnect
      </button>
    </div>
  )
}
