"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { Toaster } from "sonner"
import { X, FileText, Shield } from "lucide-react"
import { NetworkBanner } from "@/components/web3/NetworkBanner"
import { ContractCard } from "@/components/web3/ContractCard"
import { WalletStatsSidebar } from "@/components/web3/WalletStatsSidebar"
import { CONTRACTS } from "@/components/web3/contracts"
import { useDeploymentStats } from "@/hooks/useDeploymentStats"
import { useWallet } from "@/hooks/useWallet"

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
        <div
          className="absolute left-0 right-0 top-0 h-0.5"
          style={{ background: "linear-gradient(90deg,#7c5af5,#38bdf8)", borderRadius: "20px 20px 0 0" }}
        />
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div
              className="grid h-8 w-8 place-items-center rounded-[8px]"
              style={{ background: "linear-gradient(135deg,#7c5af5,#38bdf8)" }}
            >
              <Shield className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[var(--ink)]">Privacy Policy</span>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-white/[0.08] bg-white/[0.05] text-[var(--ink-3)] transition-colors hover:bg-white/[0.10] hover:text-[var(--ink)]"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 text-[12.5px] leading-relaxed text-[var(--ink-2)] space-y-5">
          <p className="text-[11px] uppercase tracking-widest text-[var(--ink-3)] font-semibold">
            Last updated: June 2026
          </p>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">1. No Account Required</h3>
            <p>OnChainDeploy does not require you to create an account or provide any personal information. You connect using your own Web3 wallet — we never ask for your name, email, or any identifying information.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">2. What We See</h3>
            <p>When you connect your wallet, we can see your public wallet address because it is required to interact with Base Mainnet. This is the same information visible to anyone on the blockchain. We do not store, log, or sell your wallet address.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">3. On-Chain Data Is Public</h3>
            <p>All smart contracts you deploy are permanently recorded on Base Mainnet and are publicly visible to anyone. The contract address, deployment transaction, and verified source code are public blockchain data. This is by design and cannot be reversed.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">4. No Cookies or Tracking</h3>
            <p>OnChainDeploy does not use tracking cookies, advertising pixels, or third-party analytics tools. We do not track your browsing behavior across websites or sessions.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">5. Local Storage Only</h3>
            <p>Your wallet connection state and deployment statistics are stored locally in your browser only. This data never leaves your device and is not sent to our servers. You can clear it at any time by clearing your browser data.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">6. Third-Party Services</h3>
            <p>We use the following third-party services to operate the platform:</p>
            <ul className="mt-1.5 space-y-1 pl-4 list-disc text-[var(--ink-2)]">
              <li><span className="text-[var(--ink)]">Base Mainnet RPC</span> — to broadcast your transactions</li>
              <li><span className="text-[var(--ink)]">BaseScan API</span> — to verify your contract source code</li>
              <li><span className="text-[var(--ink)]">Binance / CoinGecko API</span> — to fetch live ETH price for fee display</li>
            </ul>
            <p className="mt-2">These services may log your IP address as part of standard network operations. Please refer to their own privacy policies for details.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">7. We Do Not Sell Data</h3>
            <p>We do not sell, rent, or share any user data with advertisers or data brokers. OnChainDeploy has no advertising business model — our only revenue is the optional $0.09 Deploy &amp; Verify fee.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">8. Children</h3>
            <p>OnChainDeploy is not intended for use by anyone under the age of 18. We do not knowingly collect information from minors.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">9. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. Any changes will be reflected here with an updated date. Continued use of the platform means you accept the updated policy.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">10. Contact</h3>
            <p>If you have questions about this Privacy Policy, please reach out through our official channels. We are committed to being fully transparent about how this platform works.</p>
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
        <div
          className="absolute left-0 right-0 top-0 h-0.5"
          style={{ background: "linear-gradient(90deg,#7c5af5,#38bdf8)", borderRadius: "20px 20px 0 0" }}
        />
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div
              className="grid h-8 w-8 place-items-center rounded-[8px]"
              style={{ background: "linear-gradient(135deg,#7c5af5,#38bdf8)" }}
            >
              <FileText className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[var(--ink)]">Terms of Service</span>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full border border-white/[0.08] bg-white/[0.05] text-[var(--ink-3)] transition-colors hover:bg-white/[0.10] hover:text-[var(--ink)]"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 text-[12.5px] leading-relaxed text-[var(--ink-2)] space-y-5">
          <p className="text-[11px] uppercase tracking-widest text-[var(--ink-3)] font-semibold">
            Last updated: June 2026
          </p>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">1. Acceptance of Terms</h3>
            <p>By using OnChainDeploy, you agree to these Terms of Service. If you do not agree, please do not use the platform. These terms apply to all users who access or use our smart contract deployment services on Base Mainnet.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">2. What OnChainDeploy Does</h3>
            <p>OnChainDeploy is a non-custodial smart contract deployment tool. We provide pre-audited contract templates that you can deploy directly to Base Mainnet using your own wallet. We do not hold your funds, private keys, or control your deployed contracts at any point.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">3. Fees</h3>
            <p>Deployment is free — you only pay the Base network gas fee. The Deploy &amp; Verify option costs $0.09 USD (paid in ETH at time of transaction). This fee covers BaseScan source verification so your contract is publicly readable and trusted. Fees are non-refundable once a transaction is confirmed on-chain.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">4. Blockchain Transactions Are Irreversible</h3>
            <p>All deployments are permanent and cannot be undone. Once a contract is deployed to Base Mainnet, it exists on the blockchain forever. Please verify all details before confirming any transaction in your wallet. OnChainDeploy is not responsible for contracts deployed with incorrect parameters.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">5. Your Responsibility</h3>
            <p>You are solely responsible for:</p>
            <ul className="mt-1.5 space-y-1 pl-4 list-disc text-[var(--ink-2)]">
              <li>Ensuring you have sufficient ETH balance for gas fees</li>
              <li>Understanding the contract you are deploying</li>
              <li>The legality of your deployment in your jurisdiction</li>
              <li>Keeping your wallet and private keys secure</li>
              <li>Any actions taken with contracts you deploy</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">6. No Warranties</h3>
            <p>OnChainDeploy is provided &quot;as is&quot; without any warranty. While our contract templates are tested and audited, we make no guarantees about fitness for any particular purpose. Smart contract interactions carry inherent risks including but not limited to bugs, network congestion, and gas price volatility.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">7. Limitation of Liability</h3>
            <p>OnChainDeploy and its team shall not be liable for any loss of funds, failed transactions, or damages arising from the use of this platform. This includes losses caused by network issues, wallet errors, or third-party services such as BaseScan or Base RPC providers.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">8. Prohibited Use</h3>
            <p>You may not use OnChainDeploy to deploy contracts intended for fraudulent activity, scams, rug pulls, money laundering, or any activity that violates applicable law. We reserve the right to block wallet addresses associated with malicious activity.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">9. Third-Party Services</h3>
            <p>We use third-party services including Base Mainnet RPC, BaseScan API, and ETH price oracles. We are not responsible for downtime or errors from these services. Verification may occasionally fail due to BaseScan API limits — in such cases, you may verify manually at basescan.org.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">10. Changes to Terms</h3>
            <p>We may update these terms at any time. Continued use of the platform after changes are posted constitutes acceptance of the new terms. Major changes will be communicated via the platform.</p>
          </section>

          <section>
            <h3 className="mb-1.5 text-[13px] font-bold text-[var(--ink)]">11. Contact</h3>
            <p>For questions about these terms, please reach out through our official channels. OnChainDeploy is built by an independent team and is not affiliated with Coinbase, Base protocol, or Anthropic.</p>
          </section>
        </div>

        <div className="border-t border-white/[0.08] px-6 py-3.5">
          <button
            onClick={onClose}
            className="w-full rounded-[10px] gradient-bg py-2 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(124,90,245,0.35)] transition-all hover:shadow-[0_6px_20px_rgba(124,90,245,0.50)]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function HomePage() {
  const { address } = useWallet()
  const { deployed, verified, recordDeploy, recordDeployVerify } =
    useDeploymentStats(address ?? undefined)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const regularContracts = CONTRACTS.filter((c) => !c.comingSoon)
  const comingSoonContract = CONTRACTS.find((c) => c.comingSoon)

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
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-6 py-3.5">
          <div
            className="gradient-bg grid h-10 w-10 flex-shrink-0 place-items-center rounded-[11px]"
            style={{ boxShadow: "0 8px 24px rgba(124,90,245,0.35)" }}
          >
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
        <NetworkBanner />
      </header>

      {/* Main layout */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_300px] lg:items-start lg:gap-8">

          {/* LEFT — hero + cards */}
          <section className="min-w-0">
            <div className="mb-8">
              <h1 className="mb-3 text-[38px] font-extrabold leading-[1.05] tracking-tight sm:text-[48px]">
                Ship a contract in{" "}
                <span className="gradient-text">one click</span>.
              </h1>
              <p className="max-w-xl text-[15px] leading-relaxed text-[var(--ink-2)] sm:text-[16.5px]">
                Pick a template, hit deploy, and your contract is live on Base.
              </p>
            </div>

            {/* Card grid wrapper */}
            <div className="flex flex-col gap-4">
              {/* 3-column grid for regular cards */}
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

              {/* Coming Soon — sits below grid, width naturally matches grid */}
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
          <WalletStatsSidebar
            deployed={deployed}
            verified={verified}
          />

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mx-auto mt-4 flex max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] px-4 py-5 text-[12.5px] text-[var(--ink-3)] sm:px-6">
        <div className="flex items-center gap-3">
          <span>© 2026 OnChainDeploy</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[11.5px] font-semibold text-sky-300">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Powered by Base
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowPrivacy(true)}
            className="hover:text-[var(--ink-2)] transition-colors"
          >
            Privacy
          </button>
          <button
            onClick={() => setShowTerms(true)}
            className="hover:text-[var(--ink-2)] transition-colors"
          >
            Terms
          </button>
        </div>
      </footer>

      {/* Modals */}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      <Toaster position="bottom-right" theme="dark" richColors />
    </main>
  )
}