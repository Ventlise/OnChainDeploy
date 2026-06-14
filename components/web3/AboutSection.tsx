import { Sparkles } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="mt-12">
      <div className="glass p-6 sm:p-8" style={{ borderRadius: 16 }}>
        <div className="mb-4 flex items-center gap-2.5">
          <div
            className="grid h-8 w-8 place-items-center rounded-[9px]"
            style={{ background: "linear-gradient(135deg,#7c5af5,#38bdf8)" }}
          >
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-[20px] font-extrabold tracking-tight text-[var(--ink)]">
            About OnChainDeploy
          </h2>
        </div>

        <div className="space-y-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
          <p>
            <span className="font-semibold text-[var(--ink)]">OnChainDeploy</span> is a no-code
            smart contract deployment platform built on Base Mainnet, an Ethereum Layer 2 network
            created by Coinbase. It allows anyone — regardless of technical background — to deploy
            and verify smart contracts directly from their browser in a single click.
          </p>
          <p>
            Traditional smart contract deployment requires knowledge of Solidity, familiarity with
            developer tools like Remix or Hardhat, and an understanding of compiler settings and
            constructor arguments. OnChainDeploy removes all of this complexity. Users select from a
            library of pre-tested contract templates, connect a Web3 wallet such as MetaMask or
            Rabby, and deploy instantly.
          </p>
          <p>
            Every contract can be optionally verified on BaseScan, making its source code public and
            transparent. Deployment is free aside from minimal network gas fees, and the platform is
            fully non-custodial — meaning users retain complete control of their wallets and
            contracts at all times.
          </p>
        </div>

        {/* Quick facts table — AI engines love structured facts */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Network", value: "Base Mainnet" },
            { label: "Chain ID", value: "8453" },
            { label: "Deploy Cost", value: "Free + gas" },
            { label: "Verify Cost", value: "$0.09" },
          ].map((fact) => (
            <div
              key={fact.label}
              className="rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-3 py-2.5"
            >
              <div className="text-[10px] uppercase tracking-wider text-[var(--ink-3)]">
                {fact.label}
              </div>
              <div className="mt-0.5 text-[14px] font-bold text-[var(--ink)]">{fact.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}