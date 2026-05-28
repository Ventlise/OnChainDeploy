"use client"

import { useState } from "react"
import { Rocket, ShieldCheck, Lock } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { DeploymentModal } from "./DeploymentModal"
import { TxStatus, type TxStep } from "./TxStatus"
import { DEPLOY_FEE_USD, VERIFY_FEE_USD } from "@/constants/treasury"
import type { DeployMode } from "./FeeBreakdown"

interface ContractCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  accent: string
  color: string
  gradient: string
  glow: string
  border: string
  comingSoon?: boolean
  comingSoonLabel?: string
  comingSoonExtra?: string
  onDeploy?: (id: string) => Promise<void> | void
  onDeployVerify?: (id: string) => Promise<void> | void
}

export function ContractCard({
  id,
  title,
  description,
  icon: Icon,
  accent,
  color,
  gradient,
  glow,
  border,
  comingSoon = false,
  comingSoonLabel,
  comingSoonExtra,
  onDeploy,
  onDeployVerify,
}: ContractCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<DeployMode>("deploy")
  const [step, setStep] = useState<TxStep>("idle")
  const [txHash, setTxHash] = useState<string>()
  const [contractAddress, setContractAddress] = useState<string>()
  const [error, setError] = useState<string>()

  const openModal = (m: DeployMode) => {
    if (comingSoon) return
    setMode(m)
    setStep("idle")
    setTxHash(undefined)
    setContractAddress(undefined)
    setError(undefined)
    setIsOpen(true)
  }

  const closeModal = () => {
    if (step !== "idle" && step !== "success" && step !== "error") return
    setIsOpen(false)
  }

  const confirm = async () => {
    try {
      setStep("fetching-gas")
      await new Promise((r) => setTimeout(r, 500))
      setStep("awaiting-signature")
      await new Promise((r) => setTimeout(r, 700))
      setStep("deploying")
      await new Promise((r) => setTimeout(r, 1000))
      setStep("sending-fee")
      await new Promise((r) => setTimeout(r, 700))
      const addr = "0x" + Array.from({ length: 40 }, () =>
        "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")
      const hash = "0x" + Array.from({ length: 64 }, () =>
        "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")
      setContractAddress(addr)
      setTxHash(hash)
      setStep("success")
      if (mode === "deploy-verify") await onDeployVerify?.(id)
      else await onDeploy?.(id)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
      setStep("error")
    }
  }

  const isDeploying = step !== "idle" && step !== "success" && step !== "error"

  /* ── COMING SOON CARD ─────────────────────────────── */
  if (comingSoon) {
    return (
      <div
        className="glass relative col-span-1 sm:col-span-2 overflow-hidden p-4 opacity-80"
        style={{ borderRadius: 16 }}
      >
        <div
          className="absolute left-0 right-0 top-0 h-0.5"
          style={{ background: "linear-gradient(90deg,#7c5af5,#38bdf8)", borderRadius: "16px 16px 0 0" }}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
              style={{ background: "linear-gradient(135deg,#7c5af5,#38bdf8)", boxShadow: "0 4px 14px rgba(124,90,245,0.4)" }}
            >
              <Lock className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-400/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-purple-300">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                {comingSoonLabel ?? "Coming Soon"}
              </span>
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                {["ERC-20", "NFT Drop", "Multi-sig", "Airdrop"].map((t) => (
                  <span key={t} className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-[var(--ink-3)] blur-[2px] select-none">{t}</span>
                ))}
                <span className="text-[11px] text-[var(--ink-3)]">+ more templates</span>
              </div>
              <p className="max-w-md text-[12px] leading-relaxed text-[var(--ink-2)]">{description}</p>
              {comingSoonExtra && (
                <p className="mt-0.5 text-[12px] text-[var(--ink-2)]"
                  dangerouslySetInnerHTML={{ __html: comingSoonExtra.replace("Join the waitlist", '<span class="text-purple-300 underline cursor-pointer">Join the waitlist</span>') }}
                />
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-2 sm:flex-col sm:w-[160px]">
            <button disabled className="flex flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-[8px] border border-white/[0.06] bg-white/[0.03] py-1.5 text-[12px] font-semibold text-[var(--ink-3)] opacity-50">
              <Rocket className="h-3 w-3" strokeWidth={2} /> Deploy
            </button>
            <button disabled className="flex flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-[8px] border border-white/[0.06] bg-white/[0.03] py-1.5 text-[12px] font-semibold text-[var(--ink-3)] opacity-50">
              <ShieldCheck className="h-3 w-3" strokeWidth={2} /> Deploy & Verify
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── REGULAR CARD ─────────────────────────────────── */
  return (
    <>
      <div
        className="glass relative flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-white/[0.12]"
        style={{ borderRadius: 16 }}
      >
        {/* colored top border */}
        <div
          className="absolute left-0 right-0 top-0 h-0.5"
          style={{ background: border, borderRadius: "16px 16px 0 0" }}
        />

        {/* card body */}
        <div className="flex flex-1 flex-col p-3.5 pt-4">

          {/* icon */}
          <div
            className="mb-2.5 grid h-9 w-9 place-items-center rounded-[9px]"
            style={{ background: gradient, boxShadow: `0 4px 12px ${glow}` }}
          >
            <Icon className="h-4 w-4 text-white" strokeWidth={2} />
          </div>

          {/* title */}
          <h3 className="mb-1 text-[14px] font-bold leading-snug tracking-tight text-[var(--ink)]">
            {title}
          </h3>

          {/* description */}
          <p className="mb-3 flex-1 text-[12px] leading-relaxed text-[var(--ink-2)]">
            {description}
          </p>

          {/* buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => openModal("deploy")}
              className="flex flex-1 items-center justify-center gap-1 rounded-[8px] border border-white/[0.10] bg-white/[0.05] px-2 py-1.5 text-[12px] font-semibold text-[var(--ink)] transition-all hover:border-white/[0.18] hover:bg-white/[0.09]"
            >
              <Rocket className="h-3 w-3 shrink-0" strokeWidth={2} />
              <span>Deploy</span>
              <span className="text-[10px] font-medium opacity-60">
                ${DEPLOY_FEE_USD.toFixed(2)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => openModal("deploy-verify")}
              className="gradient-bg flex flex-1 items-center justify-center gap-1 rounded-[8px] px-2 py-1.5 text-[12px] font-semibold text-white shadow-[0_3px_10px_rgba(124,90,245,0.30)] transition-all hover:-translate-y-px hover:shadow-[0_5px_16px_rgba(124,90,245,0.50)]"
            >
              <ShieldCheck className="h-3 w-3 shrink-0" strokeWidth={2} />
              <span className="hidden sm:inline">Deploy &amp; Verify</span>
              <span className="sm:hidden">+ Verify</span>
              <span className="text-[10px] font-medium opacity-75">
                ${VERIFY_FEE_USD.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>

      <DeploymentModal
        isOpen={isOpen}
        contractId={id}
        contractTitle={title}
        contractDescription={description}
        icon={Icon}
        accent={accent}
        gradient={gradient}
        glow={glow}
        mode={mode}
        isDeploying={isDeploying}
        txStatusSlot={
          step !== "idle" ? (
            <TxStatus
              step={step}
              contractAddress={contractAddress}
              deployTxHash={txHash}
              error={error}
            />
          ) : null
        }
        onConfirm={confirm}
        onClose={closeModal}
      />
    </>
  )
}