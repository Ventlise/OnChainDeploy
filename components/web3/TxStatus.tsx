"use client"

import { Loader2, CheckCircle2, AlertCircle, ExternalLink, Zap, Fuel } from "lucide-react"

export type TxStep =
  | "idle"
  | "fetching-gas"
  | "awaiting-signature"
  | "deploying"
  | "sending-fee"
  | "success"
  | "error"

interface TxStatusProps {
  step: TxStep
  statusMessage?: string
  contractAddress?: string
  deployTxHash?: string
  explorerUrl?: string
  error?: string
}

const STEP_LABELS: Record<Exclude<TxStep, "idle">, string> = {
  "fetching-gas": "Fetching gas estimate…",
  "awaiting-signature": "Awaiting wallet signature…",
  deploying: "Broadcasting to Base…",
  "sending-fee": "Sending platform fee…",
  success: "Deployed",
  error: "Deployment failed",
}

const STEP_PCT: Record<Exclude<TxStep, "idle">, number> = {
  "fetching-gas": 15,
  "awaiting-signature": 35,
  deploying: 65,
  "sending-fee": 85,
  success: 100,
  error: 100,
}

const shortHash = (h?: string) => (h ? `${h.slice(0, 8)}…${h.slice(-6)}` : "")

export function TxStatus({
  step,
  statusMessage,
  contractAddress,
  deployTxHash,
  explorerUrl,
  error,
}: TxStatusProps) {
  if (step === "idle") return null

  const label = statusMessage ?? STEP_LABELS[step]
  const pct = STEP_PCT[step]
  const isError = step === "error"
  const isSuccess = step === "success"
  const isLoading = !isError && !isSuccess

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--ink-2)]">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-[var(--blue)]" />}
          {isSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          {isError && <AlertCircle className="h-4 w-4 text-red-400" />}
          <span>{label}</span>
        </div>
        <span className="font-mono text-xs font-semibold text-[var(--ink)]">{pct}%</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            isError ? "bg-red-400" : "gradient-bg"
          }`}
          style={{
            width: `${pct}%`,
            boxShadow: isError ? undefined : "0 0 12px rgba(124,90,245,0.5)",
          }}
        />
      </div>

      {isSuccess && contractAddress && (
        <div className="flex flex-col gap-1.5 rounded-[10px] border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2.5">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-emerald-400/80">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3 w-3" />
              Contract address
            </span>
          </div>
          <span className="font-mono text-xs font-medium text-[var(--ink)] break-all">
            {contractAddress}
          </span>
        </div>
      )}

      {deployTxHash && (
        <a
          href={explorerUrl ?? `https://basescan.org/tx/${deployTxHash}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-[10px] border border-white/[0.08] bg-black/25 px-3 py-2.5 font-mono text-xs text-[var(--ink-2)] transition-colors hover:border-white/[0.12] hover:text-[var(--ink)]"
        >
          <span className="flex items-center gap-1.5">
            <Fuel className="h-3.5 w-3.5" />
            {shortHash(deployTxHash)}
          </span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}

      {isError && error && (
        <p className="rounded-[10px] border border-red-400/20 bg-red-400/[0.06] px-3 py-2.5 text-[12.5px] text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
