// components/web3/ReferralCard.tsx
"use client"

import { Copy, Check, Share2 } from "lucide-react"
import { useReferral } from "@/hooks/useReferral"

// X (Twitter) icon — SVG since lucide doesn't have the new X logo
function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

// Facebook icon — SVG
function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function ReferralCard() {
  const {
    referralLink,
    isConnected,
    copied,
    copyLink,
    shareOnX,
    shareOnFacebook,
  } = useReferral()

  return (
    <div className="glass relative overflow-hidden p-4">
      {/* Top gradient line — matches your other cards */}
      <div
        className="absolute left-0 right-0 top-0 h-0.5"
        style={{
          background: "linear-gradient(90deg, #7c5af5, #38bdf8)",
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <div
          className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-[8px]"
          style={{
            background: "linear-gradient(135deg, #7c5af5, #38bdf8)",
            boxShadow: "0 3px 10px rgba(124,90,245,0.35)",
          }}
        >
          <Share2 className="h-3.5 w-3.5 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <div className="text-[13px] font-bold text-[var(--ink)]">
            Refer a Friend
          </div>
          <div className="text-[10px] text-[var(--ink-3)]">
            Help others deploy on Base
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 text-[11.5px] leading-relaxed text-[var(--ink-2)]">
        Share your link and help friends deploy their first smart contract — no
        code required.
      </p>

      {/* Referral link box */}
      {isConnected && referralLink ? (
        <>
          <div className="mb-2.5 flex items-center gap-1.5 rounded-[10px] border border-white/[0.08] bg-black/30 px-3 py-2">
            <span className="flex-1 truncate font-mono text-[10px] text-[var(--ink-2)]">
              {referralLink}
            </span>
            <button
              onClick={copyLink}
              title="Copy link"
              className="flex-shrink-0 rounded-[6px] border border-white/[0.08] bg-white/[0.05] p-1.5 transition-all hover:bg-white/[0.10]"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" strokeWidth={2.5} />
              ) : (
                <Copy className="h-3 w-3 text-[var(--ink-3)]" strokeWidth={2} />
              )}
            </button>
          </div>

          {/* Copied confirmation */}
          {copied && (
            <p className="mb-2 text-center text-[10px] font-semibold text-emerald-400">
              ✓ Link copied to clipboard!
            </p>
          )}

          {/* Share buttons */}
          <div className="flex gap-2">
            {/* X (Twitter) button */}
            <button
              onClick={shareOnX}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-white/[0.10] bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-[var(--ink-2)] transition-all hover:border-white/[0.20] hover:bg-white/[0.08] hover:text-[var(--ink)]"
            >
              <XIcon />
              Share on X
            </button>

            {/* Facebook button */}
            <button
              onClick={shareOnFacebook}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-[#1877f2]/30 bg-[#1877f2]/[0.08] px-3 py-2 text-[11px] font-semibold text-[#60a5fa] transition-all hover:bg-[#1877f2]/[0.15] hover:text-[#93c5fd]"
            >
              <FacebookIcon />
              Facebook
            </button>
          </div>
        </>
      ) : (
        /* Not connected state */
        <div className="rounded-[10px] border border-dashed border-white/[0.10] bg-black/20 px-3 py-3 text-center">
          <p className="text-[11px] text-[var(--ink-3)]">
            Connect your wallet to get your personal referral link
          </p>
        </div>
      )}
    </div>
  )
}