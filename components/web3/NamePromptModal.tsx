"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles, Shuffle, ArrowRight, X } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  generateUniqueName,
  validateContractName,
  CONTRACT_NAME_CONFIGS,
} from "@/lib/nameGenerator"

interface NamePromptModalProps {
  isOpen: boolean
  contractId: string
  contractTitle: string
  icon: LucideIcon
  gradient: string
  glow: string
  onConfirm: (name: string) => void
  onClose: () => void
}

export function NamePromptModal({
  isOpen,
  contractId,
  contractTitle,
  icon: Icon,
  gradient,
  glow,
  onConfirm,
  onClose,
}: NamePromptModalProps) {
  const config = CONTRACT_NAME_CONFIGS[contractId]
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset state when modal opens + focus input
  useEffect(() => {
    if (isOpen) {
      setName("")
      setError(null)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "Enter") handleContinue()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, name])

  const handleChange = (value: string) => {
    // Enforce 15 char hard limit in the input itself
    if (value.length > 15) return
    setName(value)
    // Clear error as user types
    if (error) setError(null)
  }

  const handleShuffle = () => {
    const generated = generateUniqueName(contractId)
    // Generated name is already ≤15 chars by design
    setName(generated)
    setError(null)
  }

  const handleContinue = () => {
    const trimmed = name.trim()

    // If blank, auto-generate a unique name
    if (trimmed.length === 0) {
      const autoName = generateUniqueName(contractId)
      onConfirm(autoName)
      return
    }

    const validationError = validateContractName(trimmed)
    if (validationError) {
      setError(validationError)
      return
    }

    onConfirm(trimmed)
  }

  const handleSkip = () => {
    const autoName = generateUniqueName(contractId)
    onConfirm(autoName)
  }

  if (!isOpen) return null

  const remaining = 15 - name.length
  const isNearLimit = remaining <= 3

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/65 p-6 backdrop-blur-md"
      onClick={onClose}
      style={{ animation: "fade-in 0.2s ease" }}
    >
      <div
        className="glass-strong w-full max-w-[400px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scale-in 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
          <div
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-[11px]"
            style={{ background: gradient, boxShadow: `0 4px 14px ${glow}` }}
          >
            <Icon className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ink-3)]">
              Name your contract
            </div>
            <div className="text-[15px] font-bold text-[var(--ink)] truncate">
              {contractTitle}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[var(--ink-3)] hover:bg-white/[0.08] hover:text-[var(--ink)] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {/* Prompt label */}
          <label className="mb-2 block text-[13px] font-semibold text-[var(--ink)]">
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-purple-400" />
            {config?.prompt ?? "Give it a name"}
          </label>

          {/* Input row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={config?.placeholder ?? "My Contract"}
                maxLength={15}
                className="w-full rounded-[9px] border border-white/[0.10] bg-white/[0.05] px-3 py-2.5 text-[14px] font-medium text-[var(--ink)] placeholder-[var(--ink-3)] outline-none transition-all focus:border-purple-400/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-purple-400/20"
              />
              {/* Character counter */}
              <span
                className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] font-semibold transition-colors ${
                  isNearLimit
                    ? remaining === 0
                      ? "text-red-400"
                      : "text-amber-400"
                    : "text-[var(--ink-3)]"
                }`}
              >
                {remaining}
              </span>
            </div>

            {/* Shuffle button */}
            <button
              type="button"
              onClick={handleShuffle}
              title="Generate random name"
              className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[9px] border border-white/[0.10] bg-white/[0.05] text-[var(--ink-2)] transition-all hover:border-purple-400/40 hover:bg-purple-400/10 hover:text-purple-300"
            >
              <Shuffle className="h-4 w-4" />
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="mt-1.5 text-[12px] text-red-400">{error}</p>
          )}

          {/* Hint */}
          {!error && (
            <p className="mt-1.5 text-[12px] text-[var(--ink-3)]">
              Max 15 chars · Makes your contract unique on-chain
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-white/[0.08] px-5 py-4">
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 rounded-[9px] border border-white/[0.08] bg-white/[0.03] py-2.5 text-[13px] font-semibold text-[var(--ink-3)] transition-colors hover:bg-white/[0.07] hover:text-[var(--ink-2)]"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="gradient-bg flex flex-[2] items-center justify-center gap-2 rounded-[9px] py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(124,90,245,0.3)] transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(124,90,245,0.5)]"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}