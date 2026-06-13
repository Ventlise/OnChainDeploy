import { Database, Sparkles, Plus, Vote, Lock, Sun } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ContractAccent = "purple" | "blue" | "green" | "amber" | "orange" | "gradient"

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
  skipNamePrompt?: boolean
  comingSoon?: boolean
  comingSoonLabel?: string
  comingSoonExtra?: string
}

export const CONTRACTS: ContractDef[] = [
  // ── GM Beacon — flagship Web3 culture contract, always first ──────
  {
    id: "gm-beacon",
    title: "GM Beacon",
    description: "Say GM on-chain. Every wallet builds its own GM streak — your personal record, forever on Base.",
    icon: Sun,
    accent: "orange",
    color: "#f97316",
    border: "linear-gradient(90deg, #f59e0b, #f97316)",
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    glow: "rgba(249, 115, 22, 0.45)",
    skipNamePrompt: true,
  },
  // ── Existing verified contracts ───────────────────────────────────
  {
    id: "simple-storage",
    title: "Data Vault",
    description: "Store any number permanently on-chain and read it back anytime. The simplest possible contract — perfect first deploy.",
    icon: Database,
    accent: "purple",
    color: "#7c5af5",
    border: "linear-gradient(90deg, #7c5af5, #a78bfa)",
    gradient: "linear-gradient(135deg, #7c5af5, #a78bfa)",
    glow: "rgba(124, 90, 245, 0.45)",
  },
  {
    id: "hello-base",
    title: "Hello Web3",
    description: "Your first message on Base. Set it, update it, share it. Anyone can read it forever.",
    icon: Sparkles,
    accent: "blue",
    color: "#38bdf8",
    border: "linear-gradient(90deg, #38bdf8, #60a5fa)",
    gradient: "linear-gradient(135deg, #38bdf8, #60a5fa)",
    glow: "rgba(56, 189, 248, 0.45)",
  },
  {
    id: "counter",
    title: "Block Counter",
    description: "Count anything that matters — fans, attendance, milestones. Every count locked on-chain forever.",
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
    description: "Run polls and governance votes that nobody can fake. One wallet, one vote — permanent and public.",
    icon: Vote,
    accent: "amber",
    color: "#fbbf24",
    border: "linear-gradient(90deg, #fbbf24, #fb923c)",
    gradient: "linear-gradient(135deg, #fbbf24, #fb923c)",
    glow: "rgba(251, 191, 36, 0.45)",
  },
  // ── Coming Soon — always last, rendered outside the grid ──────────
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
  },
]

export const getContractById = (id: string): ContractDef | undefined =>
  CONTRACTS.find((c) => c.id === id)