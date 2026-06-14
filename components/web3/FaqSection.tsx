"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

interface FaqItem {
  q: string
  a: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "How does OnChainDeploy work?",
    a: "OnChainDeploy works in three simple steps. Step 1 — Connect your wallet: connect MetaMask or Rabby in one click, no signup or email required. Step 2 — Pick a template: choose from 9 pre-tested smart contract templates including GM Beacon, Counter, Voting, Mood Tracker, and more. Step 3 — Deploy in one click: confirm the transaction in your wallet and your contract is live on Base Mainnet instantly. For Deploy & Verify, your source code is also published publicly on BaseScan for $0.09.",
  },
  {
    q: "What is OnChainDeploy?",
    a: "OnChainDeploy is a no-code platform that lets anyone deploy and verify smart contracts on Base Mainnet with a single click. You connect your wallet, pick a pre-tested contract template, and your contract goes live on the blockchain in seconds — no Solidity knowledge or development tools required.",
  },
  {
    q: "Do I need to know how to code to use it?",
    a: "No. OnChainDeploy is built specifically for non-developers. You do not need to know Solidity, use Remix, or set up any development environment. Every contract template is pre-written and tested. You simply choose one and deploy it from your browser.",
  },
  {
    q: "How much does it cost to deploy a contract?",
    a: "Deploying a contract is completely free — you only pay the standard Base network gas fee, which is usually a fraction of a cent. The optional Deploy & Verify feature, which publishes your contract's source code to BaseScan, costs a flat $0.09 paid in ETH.",
  },
  {
    q: "Is OnChainDeploy safe to use?",
    a: "Yes. OnChainDeploy is non-custodial, meaning we never hold your funds, private keys, or control your contracts. You sign every transaction directly from your own wallet such as MetaMask or Rabby. The platform cannot move your funds or access your wallet.",
  },
  {
    q: "What is contract verification and why does it matter?",
    a: "Verification publishes your contract's source code publicly on BaseScan, the Base blockchain explorer. A verified contract is transparent and trusted — anyone can read its code and confirm what it does. This is important for credibility, especially if other people will interact with your contract.",
  },
  {
    q: "Which wallets are supported?",
    a: "OnChainDeploy supports MetaMask and Rabby wallets. You connect your wallet with one click and can disconnect at any time. No account or signup is needed.",
  },
  {
    q: "What blockchain does OnChainDeploy use?",
    a: "OnChainDeploy deploys contracts to Base Mainnet, an Ethereum Layer 2 network built by Coinbase. Base offers very low gas fees and fast transactions, making it ideal for affordable contract deployment.",
  },
  {
    q: "What types of contracts can I deploy?",
    a: "OnChainDeploy currently offers templates including GM Beacon, Simple Storage, Hello Base, Counter, Voting, Mood Tracker, Visitor Tracker, Chain Notes, and Lucky Block. More templates including ERC-20 tokens, NFT drops, and multi-sig wallets are coming soon.",
  },
  {
    q: "Are deployments permanent?",
    a: "Yes. Once a contract is deployed to Base Mainnet, it exists on the blockchain permanently and cannot be deleted or undone. Always review the details before confirming a deployment in your wallet.",
  },
  {
    q: "How is OnChainDeploy different from using Remix?",
    a: "Remix is a developer tool that requires you to write or paste Solidity code, compile it manually, and understand deployment parameters. OnChainDeploy removes all of that — there is no code, no compiling, and no configuration. It is designed for people who want results without the technical complexity.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="mt-12">
      <div className="mb-5 flex items-center gap-2.5">
        <div
          className="grid h-8 w-8 place-items-center rounded-[9px]"
          style={{ background: "linear-gradient(135deg,#7c5af5,#38bdf8)" }}
        >
          <HelpCircle className="h-4 w-4 text-white" strokeWidth={2} />
        </div>
        <h2 className="text-[20px] font-extrabold tracking-tight text-[var(--ink)]">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <article
              key={i}
              className="glass overflow-hidden transition-all"
              style={{ borderRadius: 12 }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <h3 className="text-[14px] font-semibold text-[var(--ink)]">{item.q}</h3>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-[var(--ink-3)] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.5}
                />
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 text-[13px] leading-relaxed text-[var(--ink-2)]">
                    {item.a}
                  </p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}