import { Database, Sparkles, Plus, Vote, Lock, Smile, Users, FileText, Dice6, Sun } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ContractAccent = "purple" | "blue" | "green" | "amber" | "gradient" | "pink" | "teal" | "orange" | "indigo" | "yellow"

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
    id: "gm-beacon",
    title: "GM Beacon",
    description: "Say GM on-chain. Tracks a global GM count and your personal GM streak — forever on Base.",
    icon: Sun,
    accent: "yellow",
    color: "#facc15",
    border: "linear-gradient(90deg, #facc15, #fb923c)",
    gradient: "linear-gradient(135deg, #facc15, #fb923c)",
    glow: "rgba(250, 204, 21, 0.45)",
  },
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
    description: "Track anything that needs counting — votes, attendance, sales. Every increment recorded forever.",
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
  {
    id: "mood-tracker",
    title: "Mood Tracker",
    description: "Write your current mood on-chain with a timestamp. Your feelings, forever on Base.",
    icon: Smile,
    accent: "pink",
    color: "#f472b6",
    border: "linear-gradient(90deg, #f472b6, #e879f9)",
    gradient: "linear-gradient(135deg, #f472b6, #e879f9)",
    glow: "rgba(244, 114, 182, 0.45)",
  },
  {
    id: "visitor-tracker",
    title: "Visitor Tracker",
    description: "Count every wallet that visits. See the total count and who stopped by last.",
    icon: Users,
    accent: "teal",
    color: "#2dd4bf",
    border: "linear-gradient(90deg, #2dd4bf, #34d399)",
    gradient: "linear-gradient(135deg, #2dd4bf, #34d399)",
    glow: "rgba(45, 212, 191, 0.45)",
  },
  {
    id: "chain-notes",
    title: "Chain Notes",
    description: "Leave a permanent note on Base with your wallet address and timestamp attached.",
    icon: FileText,
    accent: "orange",
    color: "#fb923c",
    border: "linear-gradient(90deg, #fb923c, #fbbf24)",
    gradient: "linear-gradient(135deg, #fb923c, #fbbf24)",
    glow: "rgba(251, 146, 60, 0.45)",
  },
  {
    id: "lucky-block",
    title: "Lucky Block",
    description: "Every wallet stores its own lucky number. Set yours and check anyone else's on-chain.",
    icon: Dice6,
    accent: "indigo",
    color: "#818cf8",
    border: "linear-gradient(90deg, #818cf8, #a78bfa)",
    gradient: "linear-gradient(135deg, #818cf8, #a78bfa)",
    glow: "rgba(129, 140, 248, 0.45)",
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
  },
]

export const getContractById = (id: string): ContractDef | undefined =>
  CONTRACTS.find((c) => c.id === id)