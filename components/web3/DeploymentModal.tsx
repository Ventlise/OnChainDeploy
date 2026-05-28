"use client"

import { useEffect, type ReactNode } from "react"
import { X } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { FeeBreakdown, type DeployMode } from "./FeeBreakdown"

interface DeploymentModalProps {
  isOpen: boolean
  contractId: string
  contractTitle: string
  contractDescription: string
  icon: LucideIcon
  accent: string
  gradient: string
  glow: string
  mode: DeployMode
  isDeploying: boolean
  txStatusSlot?: ReactNode
  onConfirm: () => void
  onClose: () => void
}

export function DeploymentModal({
  isOpen,
  contractId,
  contractTitle,
  contractDescription: _contractDescription,
  accent: _accent,
  icon: Icon,
  gradient,
  glow,
  mode,
  isDeploying,
  txStatusSlot,
  onConfirm,
  onClose,
}: DeploymentModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeploying) onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isOpen, isDeploying, onClose])

  if (!isOpen) return null

  const isVerify = mode === "deploy-verify"

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/65 p-6 backdrop-blur-md"
      onClick={() => !isDeploying && onClose()}
      style={{ animation: "fade-in 0.25s ease" }}
    >
      <div
        className="glass-strong w-full max-w-[460px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scale-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-white/[0.08] px-6 py-5">
          <div
            className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-[12px]"
            style={{ background: gradient, boxShadow: `0 6px 18px ${glow}` }}
          >
            <Icon className="relative z-10 h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--ink-3)]">
              {isVerify ? "Deploy & Verify" : "Deploy"}
            </div>
            <h3 className="mt-0.5 text-[18px] font-bold tracking-tight text-[var(--ink)]">
              {contractTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeploying}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[var(--ink-2)] transition-colors hover:bg-white/[0.08] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Fee section */}
        <div className="border-b border-white/[0.08] px-6 py-4.5">
          <FeeBreakdown contractId={contractId} mode={mode} />
        </div>

        {/* What happens next */}
        <div className="border-b border-white/[0.08] px-6 py-4.5">
          <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--ink-3)]">
            What happens next
          </div>
          <ol className="flex flex-col gap-2.5">
            {[
              <>Your wallet pops up to <b className="text-[var(--ink)]">sign one transaction</b>. No approvals needed.</>,
              <>We broadcast to <b className="text-[var(--ink)]">Base Mainnet</b> and watch for confirmation (~2s).</>,
              isVerify ? (
                <>Source code is <b className="text-[var(--ink)]">verified on Basescan</b> automatically.</>
              ) : (
                <>You get a contract address and a Basescan link.</>
              ),
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid h-[22px] w-[22px] flex-shrink-0 place-items-center rounded-md border border-purple-400/30 bg-purple-400/15 font-mono text-[11px] font-bold text-purple-300">
                  {i + 1}
                </span>
                <span className="pt-px text-[13px] leading-relaxed text-[var(--ink-2)]">{text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* TxStatus slot */}
        {txStatusSlot && (
          <div className="border-b border-white/[0.08] px-6 py-4.5">{txStatusSlot}</div>
        )}

        {/* Footer */}
        <div className="flex gap-2.5 px-6 pb-5 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeploying}
            className="flex-1 rounded-[10px] border border-white/[0.08] bg-white/[0.04] py-2.5 text-[13px] font-semibold text-[var(--ink)] transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeploying}
            className="gradient-bg flex-1 rounded-[10px] py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(124,90,245,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(124,90,245,0.5)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isDeploying ? "Deploying…" : "Sign & Deploy"}
          </button>
        </div>
      </div>
    </div>
  )
}
