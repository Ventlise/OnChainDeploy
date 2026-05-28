import { Database, Sparkles, Plus, Vote, Lock } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ContractAccent = "purple" | "blue" | "green" | "amber" | "gradient"

export interface ContractDef {
  id: string
  title: string
  description: string
  icon: LucideIcon
  accent: ContractAccent
  color: string
  border: string
  gradient: string
  glow: string
  comingSoon?: boolean
  comingSoonLabel?: string
  comingSoonExtra?: string
}

export const CONTRACTS: ContractDef[] = [
  {
    id: "simple-storage",
    title: "Simple Storage",
    description: "Store and retrieve a single uint256 value on-chain. Perfect first deploy.",
    icon: Database,
    accent: "purple",
    color: "#7c5af5",
    border: "linear-gradient(90deg, #7c5af5, #a78bfa)",
    gradient: "linear-gradient(135deg, #7c5af5, #a78bfa)",
    glow: "rgba(124, 90, 245, 0.45)",
  },
  {
    id: "hello-base",
    title: "Hello Base",
    description: "A friendly greeter contract — set a message, read it back, emit events.",
    icon: Sparkles,
    accent: "blue",
    color: "#38bdf8",
    border: "linear-gradient(90deg, #38bdf8, #60a5fa)",
    gradient: "linear-gradient(135deg, #38bdf8, #60a5fa)",
    glow: "rgba(56, 189, 248, 0.45)",
  },
  {
    id: "counter",
    title: "Counter",
    description: "Increment, decrement, reset. The blockchain hello-world with state.",
    icon: Plus,
    accent: "green",
    color: "#34d399",
    border: "linear-gradient(90deg, #34d399, #6ee7b7)",
    gradient: "linear-gradient(135deg, #34d399, #6ee7b7)",
    glow: "rgba(52, 211, 153, 0.45)",
  },
  {
    id: "voting",
    title: "Voting",
    description: "Lightweight on-chain governance — proposals, ballots, weighted votes.",
    icon: Vote,
    accent: "amber",
    color: "#fbbf24",
    border: "linear-gradient(90deg, #fbbf24, #fb923c)",
    gradient: "linear-gradient(135deg, #fbbf24, #fb923c)",
    glow: "rgba(251, 191, 36, 0.45)",
  },
  {
    id: "coming-soon",
    title: "More Templates",
    description: "We're cooking up new one-click templates — ERC-20, NFT drops, multi-sig wallets and more.",
    icon: Lock,
    accent: "gradient",
    color: "#7c5af5",
    border: "linear-gradient(90deg, #7c5af5, #38bdf8)",
    gradient: "linear-gradient(135deg, #7c5af5, #38bdf8)",
    glow: "rgba(124, 90, 245, 0.35)",
    comingSoon: true,
    comingSoonLabel: "Coming Soon",
    comingSoonExtra: "Join the waitlist to deploy first.",
  },
]

export const getContractById = (id: string): ContractDef | undefined =>
  CONTRACTS.find((c) => c.id === id)