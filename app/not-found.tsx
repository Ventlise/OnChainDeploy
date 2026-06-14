"use client"

import { useRouter } from "next/navigation"
import { Home, AlertTriangle } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--bg-2)] text-[var(--ink)]">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-base" />
        <div className="bg-grid" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-noise" />
        <div className="bg-top-glow" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">

        {/* Icon */}
        <div
          className="mb-6 grid h-20 w-20 place-items-center rounded-[20px]"
          style={{
            background: "linear-gradient(135deg, #7c5af5, #38bdf8)",
            boxShadow: "0 12px 40px rgba(124,90,245,0.45)",
          }}
        >
          <AlertTriangle className="h-9 w-9 text-white" strokeWidth={2} />
        </div>

        {/* 404 number */}
        <div
          className="mb-2 text-[96px] font-extrabold leading-none tracking-tight"
          style={{
            background: "linear-gradient(135deg, #7c5af5, #38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>

        {/* Headline */}
        <h1 className="mb-3 text-[24px] font-extrabold tracking-tight text-[var(--ink)] sm:text-[28px]">
          Page not found
        </h1>

        {/* Subtitle */}
        <p className="mb-8 max-w-sm text-[15px] leading-relaxed text-[var(--ink-2)]">
          This page does not exist or has been moved. Head back to deploy your smart contracts on Base.
        </p>

        {/* Back home button */}
        <button
          onClick={() => router.push("/")}
          className="gradient-bg flex items-center gap-2.5 rounded-[12px] px-6 py-3 text-[14px] font-bold text-white shadow-[0_4px_20px_rgba(124,90,245,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,90,245,0.60)]"
        >
          <Home className="h-4 w-4" strokeWidth={2.5} />
          Back to OnChainDeploy
        </button>

        {/* Small print */}
        <p className="mt-8 text-[12px] text-[var(--ink-3)]">
          OnChainDeploy · One-click contracts on Base
        </p>
      </div>
    </main>
  )
}