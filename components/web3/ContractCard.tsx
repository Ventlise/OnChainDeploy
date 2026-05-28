"use client"

import { useState } from "react"
import { Rocket, ShieldCheck } from "lucide-react"
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

      // Simulated success — replace with real handler return values
      const addr =
        "0x" +
        Array.from({ length: 40 }, () =>
          "0123456789abcdef"[Math.floor(Math.random() * 16)],
        ).join("")
      const hash =
        "0x" +
        Array.from({ length: 64 }, () =>
          "0123456789abcdef"[Math.floor(Math.random() * 16)],
        ).join("")
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

  const isDeploying =
    step !== "idle" && step !== "success" && step !== "error"

  return (
    <>
      <div
        className="glass relative overflow-hidden p-5.5 transition-all hover:-translate-y-0.5 hover:border-white/[0.12]"
        style={{ borderRadius: 16 }}
      >
        <div
          className="absolute left-0 right-0 top-0 h-0.5"
          style={{ background: border, borderRadius: "16px 16px 0 0" }}
        />
        <div
          className="relative mb-4 grid h-10 w-10 place-items-center rounded-[11px]"
          style={{ background: gradient, boxShadow: `0 6px 18px ${glow}` }}
        >
          <Icon className="relative z-10 h-5 w-5 text-white" strokeWidth={2} />
        </div>

        <h3 className="mb-1.5 text-lg font-bold tracking-tight text-[var(--ink)]">{title}</h3>
        <p className="mb-4 text-[13.5px] leading-relaxed text-[var(--ink-2)]">{description}</p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openModal("deploy")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-[13px] font-semibold text-[var(--ink)] transition-colors hover:bg-white/[0.08]"
          >
            <Rocket className="h-3.5 w-3.5" strokeWidth={2} />
            Deploy
            <span className="text-xs font-medium opacity-80">${DEPLOY_FEE_USD.toFixed(2)}</span>
          </button>
          <button
            type="button"
            onClick={() => openModal("deploy-verify")}
            className="gradient-bg flex flex-1 items-center justify-center gap-1.5 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(124,90,245,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(124,90,245,0.5)]"
          >
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Deploy &amp; Verify
            <span className="text-xs font-medium opacity-80">${VERIFY_FEE_USD.toFixed(2)}</span>
          </button>
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
