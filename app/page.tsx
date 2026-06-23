"use client"

export const dynamic = "force-dynamic"
import { FaqSection, FAQ_ITEMS } from "@/components/web3/FaqSection"
import { useState } from "react"
import { Toaster } from "sonner"
import { X, FileText, Shield, Wallet, Sparkles } from "lucide-react"
import { NetworkBanner } from "@/components/web3/NetworkBanner"
import { ContractCard } from "@/components/web3/ContractCard"
import { WalletStatsSidebar } from "@/components/web3/WalletStatsSidebar"
import { ReferralCard } from "@/components/web3/ReferralCard"
import { CONTRACTS } from "@/components/web3/contracts"
import { useDeploymentStats } from "@/hooks/useDeploymentStats"
import { useWallet } from "@/hooks/useWallet"

/* ── About Modal ─────────────────────────────────────────────────── */
function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass-strong relative flex flex-col overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
        style={{ width: "min(520px, 92vw)", height: "min(520px, 88vh)", borderRadius: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute left-0 right-0 top-0 h-0.5" style={{ background: "linear-gradient(90deg,#7c5af5,#38bdf8)", borderRadius: "20px 20px 0 0" }} />
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-[8px]" style={{ background: "linear-gradient(135deg,#7c5af5,#38bdf8)" }}>
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[var(--ink)]">About OnChainDeploy</span>
          </div>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full border border-white/[0.08] bg-white/[0.05] text-[var(--ink-3)] transition-colors hover:bg-white/[0.10] hover:text-[var(--ink)]">
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 text-[12.5px] leading-relaxed text-[var(--ink-2)] space-y-5">
          <p className="text-[11px] uppercase tracking-widest text-[var(--ink-3)] font-semibold">
            Built on Base · June 2026
          </p>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">What is OnChainDeploy?</h3>
            <p>
              <span className="font-semibold text-[var(--ink)]">OnChainDeploy</span> is a no-code
              smart contract deployment platform built on Base Mainnet, an Ethereum Layer 2 network
              created by Coinbase. It allows anyone — regardless of technical background — to deploy
              and verify smart contracts directly from their browser in a single click.
            </p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">Why We Built It</h3>
            <p>
              Traditional smart contract deployment requires knowledge of Solidity, familiarity with
              developer tools like Remix or Hardhat, and an understanding of compiler settings.
              OnChainDeploy removes all of this complexity. Users select from a library of
              pre-tested contract templates, connect a Web3 wallet, and deploy instantly.
            </p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">How It Works</h3>
            <ul className="space-y-2 pl-1">
              {[
                { num: "1", text: "Connect MetaMask or Rabby — no signup needed" },
                { num: "2", text: "Pick a contract template from the library" },
                { num: "3", text: "Click Deploy — confirm in your wallet" },
                { num: "4", text: "Your contract is live on Base instantly" },
                { num: "5", text: "Optionally verify source code on BaseScan for $0.09" },
              ].map((s) => (
                <li key={s.num} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full text-[10px] font-extrabold text-white"
                    style={{ background: "linear-gradient(135deg,#7c5af5,#38bdf8)" }}
                  >
                    {s.num}
                  </span>
                  <span>{s.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">Our Principles</h3>
            <p>
              OnChainDeploy is fully non-custodial — we never hold your funds, private keys, or
              control your contracts. Every deployment goes directly from your wallet to the
              blockchain. We believe deploying on-chain should be as easy as posting on social media.
            </p>
          </section>

          {/* Quick facts */}
          <section>
            <h3 className="mb-2 text-[13px] font-bold text-[var(--ink)]">Quick Facts</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Network", value: "Base Mainnet" },
                { label: "Chain ID", value: "8453" },
                { label: "Deploy Cost", value: "Free + gas" },
                { label: "Verify Cost", value: "$0.09" },
                { label: "Wallets", value: "MetaMask, Rabby" },
                { label: "Templates", value: "9 and growing" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-[8px] border border-white/[0.07] bg-white/[0.03] px-3 py-2"
                >
                  <div className="text-[10px] uppercase tracking-wider text-[var(--ink-3)]">{f.label}</div>
                  <div className="mt-0.5 text-[13px] font-bold text-[var(--ink)]">{f.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">Independent Project</h3>
            <p>
              OnChainDeploy is built by an independent team passionate about making Web3 accessible
              to everyone. We are not affiliated with Coinbase, Base protocol, or Anthropic.
            </p>
          </section>
        </div>

        <div className="border-t border-white/[0.08] px-6 py-3.5">
          <button
            onClick={onClose}
            className="w-full rounded-[10px] gradient-bg py-2 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(124,90,245,0.35)] transition-all hover:shadow-[0_6px_20px_rgba(124,90,245,0.50)]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Privacy Modal ───────────────────────────────────────────────── */
function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass-strong relative flex flex-col overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
        style={{ width: "min(520px, 92vw)", height: "min(520px, 88vh)", borderRadius: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute left-0 right-0 top-0 h-0.5" style={{ background: "linear-gradient(90deg,#7c5af5,#38bdf8)", borderRadius: "20px 20px 0 0" }} />
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-[8px]" style={{ background: "linear-gradient(135deg,#7c5af5,#38bdf8)" }}>
              <Shield className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[var(--ink)]">Privacy Policy</span>
          </div>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full border border-white/[0.08] bg-white/[0.05] text-[var(--ink-3)] transition-colors hover:bg-white/[0.10] hover:text-[var(--ink)]">
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 text-[12.5px] leading-relaxed text-[var(--ink-2)] space-y-5">
          <p className="text-[11px] uppercase tracking-widest text-[var(--ink-3)] font-semibold">Last updated: June 2026</p>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">1. No Account Required</h3><p>OnChainDeploy does not require you to create an account or provide any personal information. You connect using your own Web3 wallet — we never ask for your name, email, or any identifying information.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">2. What We See</h3><p>When you connect your wallet, we can see your public wallet address because it is required to interact with Base Mainnet. This is the same information visible to anyone on the blockchain. We do not store, log, or sell your wallet address.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">3. On-Chain Data Is Public</h3><p>All smart contracts you deploy are permanently recorded on Base Mainnet and are publicly visible to anyone. The contract address, deployment transaction, and verified source code are public blockchain data.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">4. No Cookies or Tracking</h3><p>OnChainDeploy does not use tracking cookies, advertising pixels, or third-party analytics tools. We do not track your browsing behavior across websites or sessions.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">5. Local Storage Only</h3><p>Your wallet connection state and deployment statistics are stored locally in your browser only. This data never leaves your device and is not sent to our servers.</p></section>
          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">6. Third-Party Services</h3>
            <p>We use the following third-party services:</p>
            <ul className="mt-1.5 space-y-1 pl-4 list-disc text-[var(--ink-2)]">
              <li><span className="text-[var(--ink)]">Base Mainnet RPC</span> — to broadcast your transactions</li>
              <li><span className="text-[var(--ink)]">BaseScan API</span> — to verify your contract source code</li>
              <li><span className="text-[var(--ink)]">Binance / CoinGecko API</span> — to fetch live ETH price</li>
            </ul>
          </section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">7. We Do Not Sell Data</h3><p>We do not sell, rent, or share any user data with advertisers or data brokers. Our only revenue is the optional $0.09 Deploy &amp; Verify fee.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">8. Children</h3><p>OnChainDeploy is not intended for use by anyone under the age of 18.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">9. Changes</h3><p>We may update this Privacy Policy from time to time. Continued use means you accept the updated policy.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">10. Contact</h3><p>If you have questions, please reach out through our official channels.</p></section>
        </div>
        <div className="border-t border-white/[0.08] px-6 py-3.5">
          <button onClick={onClose} className="w-full rounded-[10px] gradient-bg py-2 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(124,90,245,0.35)] transition-all hover:shadow-[0_6px_20px_rgba(124,90,245,0.50)]">Got It</button>
        </div>
      </div>
    </div>
  )
}

/* ── Terms Modal ─────────────────────────────────────────────────── */
function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass-strong relative flex flex-col overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
        style={{ width: "min(520px, 92vw)", height: "min(520px, 88vh)", borderRadius: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute left-0 right-0 top-0 h-0.5" style={{ background: "linear-gradient(90deg,#7c5af5,#38bdf8)", borderRadius: "20px 20px 0 0" }} />
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-[8px]" style={{ background: "linear-gradient(135deg,#7c5af5,#38bdf8)" }}>
              <FileText className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[var(--ink)]">Terms of Service</span>
          </div>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full border border-white/[0.08] bg-white/[0.05] text-[var(--ink-3)] transition-colors hover:bg-white/[0.10] hover:text-[var(--ink)]">
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 text-[12.5px] leading-relaxed text-[var(--ink-2)] space-y-5">
          <p className="text-[11px] uppercase tracking-widest text-[var(--ink-3)] font-semibold">Last updated: June 2026</p>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">1. Acceptance of Terms</h3><p>By using OnChainDeploy, you agree to these Terms of Service. If you do not agree, please do not use the platform.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">2. What OnChainDeploy Does</h3><p>OnChainDeploy is a non-custodial smart contract deployment tool. We do not hold your funds, private keys, or control your deployed contracts at any point.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">3. Fees</h3><p>Deployment is free — you only pay the Base network gas fee. The Deploy &amp; Verify option costs $0.09 USD paid in ETH. Fees are non-refundable once confirmed on-chain.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">4. Blockchain Transactions Are Irreversible</h3><p>All deployments are permanent. Once a contract is deployed to Base Mainnet, it exists forever. OnChainDeploy is not responsible for contracts deployed with incorrect parameters.</p></section>
          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">5. Your Responsibility</h3>
            <ul className="mt-1.5 space-y-1 pl-4 list-disc text-[var(--ink-2)]">
              <li>Ensuring sufficient ETH balance for gas fees</li>
              <li>Understanding the contract you are deploying</li>
              <li>Legality of your deployment in your jurisdiction</li>
              <li>Keeping your wallet and private keys secure</li>
            </ul>
          </section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">6. No Warranties</h3><p>OnChainDeploy is provided &quot;as is&quot; without any warranty. Smart contract interactions carry inherent risks including bugs, network congestion, and gas price volatility.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">7. Limitation of Liability</h3><p>OnChainDeploy shall not be liable for any loss of funds, failed transactions, or damages arising from use of this platform.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">8. Prohibited Use</h3><p>You may not use OnChainDeploy for fraudulent activity, scams, rug pulls, money laundering, or any activity violating applicable law.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">9. Third-Party Services</h3><p>We are not responsible for downtime from Base RPC, BaseScan API, or ETH price oracles. Verification may occasionally fail due to BaseScan API limits.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">10. Changes to Terms</h3><p>We may update these terms at any time. Continued use constitutes acceptance of the new terms.</p></section>
          <section><h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">11. Contact</h3><p>OnChainDeploy is built by an independent team and is not affiliated with Coinbase, Base protocol, or Anthropic.</p></section>
        </div>
        <div className="border-t border-white/[0.08] px-6 py-3.5">
          <button onClick={onClose} className="w-full rounded-[10px] gradient-bg py-2 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(124,90,245,0.35)] transition-all hover:shadow-[0_6px_20px_rgba(124,90,245,0.50)]">I Understand</button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function HomePage() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet()
  const { deployed, verified, recordDeploy, recordDeployVerify } =
    useDeploymentStats(address ?? undefined)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  const regularContracts = CONTRACTS.filter((c) => !c.comingSoon)
  const comingSoonContract = CONTRACTS.find((c) => c.comingSoon)

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--bg-2)] text-[var(--ink)]">

      {/* ── Rich background ────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-base" />
        <div className="bg-grid" />
        <div className="bg-dots" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-noise" />
        <div className="bg-top-glow" />
      </div>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[rgba(10,10,20,0.75)] backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <div
              className="gradient-bg grid h-9 w-9 flex-shrink-0 place-items-center rounded-[10px]"
              style={{ boxShadow: "0 6px 20px rgba(124,90,245,0.40)" }}
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="white" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v10l9 5 9-5V7z" />
                <path d="M3 7l9 5 9-5M12 12v10" opacity="0.7" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-[16px] font-extrabold tracking-tight">OnChainDeploy</div>
              <div className="text-[11px] text-[var(--ink-3)]">One-click contracts on Base</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-400/[0.07] px-3 py-1.5 text-[11px] font-semibold text-sky-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              Base Mainnet
            </span>
            <div className="header-wallet-btn">
              {isConnected ? (
                <button
                  onClick={disconnect}
                  className="flex items-center gap-2 rounded-[9px] border border-white/[0.10] bg-white/[0.05] px-3.5 py-2 text-[12px] font-semibold text-[var(--ink)] transition-all hover:bg-white/[0.09]"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Connected"}
                </button>
              ) : (
                <button
                  onClick={connect}
                  disabled={isConnecting}
                  className="gradient-bg flex items-center gap-2 rounded-[9px] px-4 py-2 text-[12px] font-bold text-white shadow-[0_3px_12px_rgba(124,90,245,0.40)] transition-all hover:shadow-[0_5px_18px_rgba(124,90,245,0.55)] hover:-translate-y-px disabled:opacity-60"
                >
                  <Wallet className="h-3.5 w-3.5" strokeWidth={2.5} />
                  {isConnecting ? "Connecting…" : "Connect Wallet"}
                </button>
              )}
            </div>
          </div>
        </div>
        <NetworkBanner />
      </header>

      {/* ── Main layout ────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_300px] lg:items-start lg:gap-8">

          {/* LEFT — hero + cards */}
          <section className="min-w-0">

            {/* Hero */}
            <div className="mb-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-400/[0.08] px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-[12px] font-semibold text-purple-300">
                  Live on Base Mainnet · Deploy in seconds
                </span>
              </div>

              <h1 className="mb-4 text-[40px] font-extrabold leading-[1.04] tracking-tight sm:text-[52px]">
                Ship a contract in{" "}
                <span className="gradient-text">one click</span>.
              </h1>

              <p className="mb-6 max-w-lg text-[15px] leading-relaxed text-[var(--ink-2)] sm:text-[16.5px]">
                No code. No Remix. No confusion. Pick a template, connect your wallet, and your smart contract is live on Base.
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5">
                  <span className="text-emerald-400 text-[13px]">✓</span>
                  <span className="text-[12px] font-medium text-[var(--ink-2)]">BaseScan Verified</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5">
                  <span className="text-purple-400 text-[13px]">✓</span>
                  <span className="text-[12px] font-medium text-[var(--ink-2)]">Deploy is Free</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5">
                  <span className="text-sky-400 text-[13px]">✓</span>
                  <span className="text-[12px] font-medium text-[var(--ink-2)]">Non-Custodial</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5">
                  <span className="text-amber-400 text-[13px]">✓</span>
                  <span className="text-[12px] font-medium text-[var(--ink-2)]">9 Templates Ready</span>
                </div>
              </div>
            </div>

            {/* Contract cards */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {regularContracts.map((c) => (
                  <ContractCard
                    key={c.id}
                    {...c}
                    onDeploy={recordDeploy}
                    onDeployVerify={recordDeployVerify}
                  />
                ))}
              </div>
              {comingSoonContract && (
                <ContractCard
                  key={comingSoonContract.id}
                  {...comingSoonContract}
                  onDeploy={recordDeploy}
                  onDeployVerify={recordDeployVerify}
                />
              )}
            </div>
          </section>

          {/* RIGHT — sidebar */}
          <div className="flex flex-col gap-3">
            <WalletStatsSidebar deployed={deployed} verified={verified} />
            <ReferralCard />
          </div>
        </div>

        {/* FAQ — full width below the grid */}
        <div className="mx-auto mt-6 max-w-[900px]">
          <FaqSection />
        </div>
      </div>

      {/* FAQ structured data for Google + AI engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />

      {/* Footer */}
      <footer className="relative z-10 mx-auto mt-4 flex max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-5 text-[12.5px] text-[var(--ink-3)] sm:px-6">
        <div className="flex items-center gap-3">
          <span>© 2026 OnChainDeploy</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[11.5px] font-semibold text-sky-300">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Powered by Base
          </span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowAbout(true)} className="hover:text-[var(--ink-2)] transition-colors">About</button>
          <button onClick={() => setShowPrivacy(true)} className="hover:text-[var(--ink-2)] transition-colors">Privacy</button>
          <button onClick={() => setShowTerms(true)} className="hover:text-[var(--ink-2)] transition-colors">Terms</button>
        </div>
      </footer>

      {/* Modals */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      <Toaster position="bottom-right" theme="dark" richColors />
    </main>
  )
}