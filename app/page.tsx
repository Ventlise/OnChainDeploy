"use client"

import { Toaster } from "sonner"
import { NetworkBanner } from "@/components/web3/NetworkBanner"
import { ContractCard } from "@/components/web3/ContractCard"
import { WalletStatsSidebar } from "@/components/web3/WalletStatsSidebar"
import { CONTRACTS } from "@/components/web3/contracts"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--bg-2)] text-[var(--ink)]">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-dot-grid" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[rgba(13,13,24,0.65)] backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="gradient-bg grid h-10 w-10 place-items-center rounded-[11px] shadow-[0_8px_24px_rgba(124,90,245,0.35)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v10l9 5 9-5V7z" />
                <path d="M3 7l9 5 9-5M12 12v10" opacity="0.7" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-[17px] font-extrabold tracking-tight">OnChainDeploy</div>
              <div className="text-xs text-[var(--ink-3)]">One-click contracts on Base</div>
            </div>
          </div>
        </div>
        <NetworkBanner />
      </header>

      {/* Main layout */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-10">
        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_300px]">
          <section>
            <div className="mb-7">
              <h1 className="mb-3.5 text-[52px] font-extrabold leading-[1.05] tracking-tight">
                Ship a contract in <span className="gradient-text">one click</span>.
              </h1>
              <p className="max-w-xl text-[16.5px] leading-relaxed text-[var(--ink-2)]">
                Pick a template, hit deploy, and your contract is live on Base
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
              {CONTRACTS.map((c) => (
                <ContractCard key={c.id} {...c} />
              ))}
            </div>
          </section>
          <WalletStatsSidebar deployed={12} verified={9} />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3.5 border-t border-white/[0.08] px-6 py-6 text-[12.5px] text-[var(--ink-3)]">
        <div className="flex items-center gap-3.5">
          <span>© 2026 OnChainDeploy</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[11.5px] font-semibold text-sky-300">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Powered by Base
          </span>
        </div>
        <div className="flex gap-4.5">
          <a href="#" className="hover:text-[var(--ink-2)]">Privacy</a>
          <a href="#" className="hover:text-[var(--ink-2)]">Terms</a>
        </div>
      </footer>

      <Toaster position="bottom-right" theme="dark" richColors />
    </main>
  )
}
