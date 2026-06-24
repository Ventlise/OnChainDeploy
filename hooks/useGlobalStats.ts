// hooks/useGlobalStats.ts
// Fetches the global deploy count and provides a function to increment it
// Used by WalletStatsSidebar (display) and ContractCard (increment on deploy)

"use client"

import { useEffect, useState, useCallback } from "react"

export function useGlobalStats() {
  const [total, setTotal] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchTotal = useCallback(async () => {
    try {
      const res = await fetch("/api/stats", { cache: "no-store" })
      if (!res.ok) throw new Error("fetch failed")
      const data = await res.json()
      if (typeof data.total === "number") {
        setTotal(data.total)
      }
    } catch {
      // Silent fail — card shows "—" instead of crashing
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTotal()
  }, [fetchTotal])

  // Call this right after a successful deploy — bumps the shared global count
  const incrementGlobal = useCallback(async () => {
    try {
      const res = await fetch("/api/stats", { method: "POST" })
      if (!res.ok) return
      const data = await res.json()
      if (typeof data.total === "number") {
        setTotal(data.total)
      }
    } catch {
      // Counter bump failed — not critical, deploy already succeeded
    }
  }, [])

  return { total, isLoading, incrementGlobal, refresh: fetchTotal }
}