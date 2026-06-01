// hooks/useDeploymentStats.ts
//
// Persists deployed/verified counts per wallet address in localStorage.
// Each wallet has its own stats — they survive page refresh.
// When wallet disconnects or changes, shows that wallet's own stats.

"use client"

import { useEffect, useState, useCallback } from "react"

interface Stats {
  deployed: number
  verified: number
}

const STORAGE_KEY = "ocd_stats" // ocd = OnChainDeploy

function loadStats(address: string): Stats {
  if (typeof window === "undefined") return { deployed: 0, verified: 0 }
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${address.toLowerCase()}`)
    if (!raw) return { deployed: 0, verified: 0 }
    const parsed = JSON.parse(raw)
    return {
      deployed: typeof parsed.deployed === "number" ? parsed.deployed : 0,
      verified: typeof parsed.verified === "number" ? parsed.verified : 0,
    }
  } catch {
    return { deployed: 0, verified: 0 }
  }
}

function saveStats(address: string, stats: Stats): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(
      `${STORAGE_KEY}_${address.toLowerCase()}`,
      JSON.stringify(stats)
    )
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function useDeploymentStats(address: string | undefined) {
  const [stats, setStats] = useState<Stats>({ deployed: 0, verified: 0 })

  // Load stats from localStorage when wallet address changes
  useEffect(() => {
    if (!address) {
      setStats({ deployed: 0, verified: 0 })
      return
    }
    const saved = loadStats(address)
    setStats(saved)
  }, [address])

  // Call this after a successful Deploy
  const recordDeploy = useCallback(() => {
    if (!address) return
    setStats((prev) => {
      const next = { ...prev, deployed: prev.deployed + 1 }
      saveStats(address, next)
      return next
    })
  }, [address])

  // Call this after a successful Deploy & Verify
  const recordDeployVerify = useCallback(() => {
    if (!address) return
    setStats((prev) => {
      const next = {
        deployed: prev.deployed + 1,
        verified: prev.verified + 1,
      }
      saveStats(address, next)
      return next
    })
  }, [address])

  const verifyRate = stats.deployed
    ? Math.round((stats.verified / stats.deployed) * 100)
    : 0

  return {
    deployed: stats.deployed,
    verified: stats.verified,
    verifyRate,
    recordDeploy,
    recordDeployVerify,
  }
}