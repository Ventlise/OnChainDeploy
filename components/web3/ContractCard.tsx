"use client"

import { useState } from "react"
import { Rocket, ShieldCheck, Lock } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { toast } from "sonner"
import { DeploymentModal } from "./DeploymentModal"
import { TxStatus, type TxStep } from "./TxStatus"
import { DEPLOY_FEE_USD, VERIFY_FEE_USD } from "@/constants/treasury"
import type { DeployMode } from "./FeeBreakdown"
import { deployContract } from "@/services/deploy"
import { useWallet } from "@/hooks/useWallet"
import { useNetwork } from "@/hooks/useNetwork"
import {
  SIMPLE_STORAGE_BYTECODE,
  SIMPLE_STORAGE_GAS_LIMIT,
  SIMPLE_STORAGE_SOURCE,
  SIMPLE_STORAGE_COMPILER,
  SIMPLE_STORAGE_DEPLOY_FEE_USD,
  SIMPLE_STORAGE_VERIFY_FEE_USD,
} from "@/contracts/simple-storage"

// ── Contract registry ─────────────────────────────────────────────────
interface ContractData {
  bytecode: string
  gasLimit: number
  source: string
  compiler: {
    name: string
    version: string
    optimizationUsed: boolean
    optimizationRuns: number
  }
  deployFeeUsd?: number
  verifyFeeUsd?: number
}

const CONTRACT_REGISTRY: Record<string, ContractData> = {
  "simple-storage": {
    bytecode: SIMPLE_STORAGE_BYTECODE,
    gasLimit: SIMPLE_STORAGE_GAS_LIMIT,
    source: SIMPLE_STORAGE_SOURCE,
    compiler: SIMPLE_STORAGE_COMPILER,
    deployFeeUsd: SIMPLE_STORAGE_DEPLOY_FEE_USD,
    verifyFeeUsd: SIMPLE_STORAGE_VERIFY_FEE_USD,
  },
  // "hello-base": { ... },
  // "counter":    { ... },
  // "voting":     { ... },
}

// ── Props ─────────────────────────────────────────────────────────────
interface ContractCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  accent: string
  color?: string
  gradient: string
  glow: string
  border: string
  comingSoon?: boolean
  comingSoonLabel?: string
  comingSoonExtra?: string
  onDeploy?: (id: string) => void
  onDeployVerify?: (id: string) => void
}

export function ContractCard({
  id,
  title,
  description,
  icon: Icon,
  accent,
  gradient,
  glow,
  border,
  comingSoon = false,
  comingSoonLabel,
  comingSoonExtra,
  onDeploy,
  onDeployVerify,
}: ContractCardProps) {
  const { address, isConnected } = useWallet()
  const { isCorrectNetwork } = useNetwork()

  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<DeployMode>("deploy")
  const [step, setStep] = useState<TxStep>("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [txHash, setTxHash] = useState<string>()
  const [contractAddress, setContractAddress] = useState<string>()
  const [error, setError] = useState<string>()

  const openModal = (m: DeployMode) => {
    if (comingSoon) return
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first.")
      return
    }
    if (!isCorrectNetwork) {
      toast.error("Please switch to Base Mainnet first.")
      return
    }
    setMode(m)
    setStep("idle")
    setStatusMessage("")
    setTxHash(undefined)
    setContractAddress(undefined)
    setError(undefined)
    setIsOpen(true)
  }

  const closeModal = () => {
    if (step !== "idle" && step !== "success" && step !== "error") return
    setIsOpen(false)
  }

  // ── Real deployment function ─────────────────────────────────────
  const confirm = async () => {
    if (!address) {
      setError("Wallet disconnected. Please reconnect.")
      setStep("error")
      return
    }

    const contractData = CONTRACT_REGISTRY[id]

    if (!contractData) {
      setError(`${title} is coming soon. Only Simple Storage is live right now.`)
      setStep("error")
      return
    }

    try {
      const result = await deployContract(
        contractData.bytecode,
        contractData.gasLimit,
        address,
        mode,
        mode === "deploy-verify"
          ? {
              contractName: contractData.compiler.name,
              sourceCode: contractData.source,
              compilerVersion: contractData.compiler.version,
              optimizationUsed: contractData.compiler.optimizationUsed,
              optimizationRuns: contractData.compiler.optimizationRuns,
            }
          : undefined,
        (msg: string) => {
          setStatusMessage(msg)
          if (msg.includes("gas") || msg.includes("Gas")) setStep("fetching-gas")
          else if (msg.includes("MetaMask") || msg.includes("signature")) setStep("awaiting-signature")
          else if (msg.includes("Deploy") || msg.includes("deploy")) setStep("deploying")
          else if (msg.includes("fee") || msg.includes("platform")) setStep("sending-fee")
          else if (msg.includes("verif") || msg.includes("Verif")) setStep("sending-fee")
        },
      )

      setContractAddress(result.contractAddress)
      setTxHash(result.deployTxHash)
      setStep("success")

      if (result.verified) {
        toast.success(`✅ Deployed & verified! ${result.contractAddress.slice(0, 10)}…`)
      } else {
        toast.success(`✅ Deployed! ${result.contractAddress.slice(0, 10)}…`)
      }

      if (mode === "deploy-verify") onDeployVerify?.(id)
      else onDeploy?.(id)

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      setError(message)
      setStep("error")
      toast.error(message)
    }
  }

  const isDeploying = step !== "idle" && step !== "success" && step !== "error"
  const deployFee = CONTRACT_REGISTRY[id]?.deployFeeUsd ?? DEPLOY_FEE_USD
  const verifyFee = CONTRACT_REGISTRY[id]?.verifyFeeUsd ?? VERIFY_FEE_USD

  /* ── COMING SOON CARD ───────────────────────────────────────────── */
  if (comingSoon) {
    return (
      <div
        className="glass relative col-span-1 sm:col-span-2 overflow-hidden p-4 opacity-80"
        style={{ borderRadius: 16 }}
      >
        <div className="absolute left-0 right-0 top-0 h-0.5"
          style={{ background: "linear-gradient(90deg,#7c5af5,#38bdf8)", borderRadius: "16px 16px 0 0" }} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
              style={{ background: "linear-gradient(135deg,#7c5af5,#38bdf8)", boxShadow: "0 4px 14px rgba(124,90,245,0.4)" }}>
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
                  dangerouslySetInnerHTML={{
                    __html: comingSoonExtra.replace("Join the waitlist",
                      '<span class="text-purple-300 underline cursor-pointer">Join the waitlist</span>')
                  }} />
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

  /* ── REGULAR CARD ───────────────────────────────────────────────── */
  return (
    <>
      <div className="glass relative flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-white/[0.12]"
        style={{ borderRadius: 16 }}>
        <div className="absolute left-0 right-0 top-0 h-0.5"
          style={{ background: border, borderRadius: "16px 16px 0 0" }} />

        <div className="flex flex-1 flex-col p-3.5 pt-4">
          <div className="mb-2.5 grid h-9 w-9 place-items-center rounded-[9px]"
            style={{ background: gradient, boxShadow: `0 4px 12px ${glow}` }}>
            <Icon className="h-4 w-4 text-white" strokeWidth={2} />
          </div>

          <h3 className="mb-1 text-[14px] font-bold leading-snug tracking-tight text-[var(--ink)]">
            {title}
          </h3>
          <p className="mb-3 flex-1 text-[12px] leading-relaxed text-[var(--ink-2)]">
            {description}
          </p>

          {!CONTRACT_REGISTRY[id] && (
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
              🔧 Deployment coming soon
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={() => openModal("deploy")}
              className="flex flex-1 items-center justify-center gap-1 rounded-[8px] border border-white/[0.10] bg-white/[0.05] px-2 py-1.5 text-[12px] font-semibold text-[var(--ink)] transition-all hover:border-white/[0.18] hover:bg-white/[0.09]">
              <Rocket className="h-3 w-3 shrink-0" strokeWidth={2} />
              <span>Deploy</span>
              <span className="text-[10px] font-medium opacity-60">${deployFee.toFixed(2)}</span>
            </button>

            <button type="button" onClick={() => openModal("deploy-verify")}
              className="gradient-bg flex flex-1 items-center justify-center gap-1 rounded-[8px] px-2 py-1.5 text-[12px] font-semibold text-white shadow-[0_3px_10px_rgba(124,90,245,0.30)] transition-all hover:-translate-y-px hover:shadow-[0_5px_16px_rgba(124,90,245,0.50)]">
              <ShieldCheck className="h-3 w-3 shrink-0" strokeWidth={2} />
              <span className="hidden sm:inline">Deploy &amp; Verify</span>
              <span className="sm:hidden">+ Verify</span>
              <span className="text-[10px] font-medium opacity-75">${verifyFee.toFixed(2)}</span>
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
              statusMessage={statusMessage}
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