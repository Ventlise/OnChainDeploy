// hooks/useGlobalStats.ts
// Fetches the global deploy count and increments it.
// Uses a browser event so ALL copies of the hook stay in sync
// (sidebar refreshes the moment ContractCard increments).

"use client"

import { useEffect, useState, useCallback } from "react"

const STATS_UPDATED_EVENT = "ocd:stats-updated"

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

  // Initial fetch on mount
  useEffect(() => {
    fetchTotal()
  }, [fetchTotal])

  // Listen for "stats updated" events from anywhere in the app
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleUpdate = (e: Event) => {
      const newTotal = (e as CustomEvent<number>).detail
      if (typeof newTotal === "number") {
        setTotal(newTotal)
      }
    }

    window.addEventListener(STATS_UPDATED_EVENT, handleUpdate)
    return () => window.removeEventListener(STATS_UPDATED_EVENT, handleUpdate)
  }, [])

  // Call this right after a successful deploy
  const incrementGlobal = useCallback(async () => {
    try {
      const res = await fetch("/api/stats", { method: "POST" })
      if (!res.ok) return
      const data = await res.json()
      if (typeof data.total === "number") {
        setTotal(data.total)

        // Broadcast to every other instance of this hook (sidebar, etc.)
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(STATS_UPDATED_EVENT, { detail: data.total })
          )
        }
      }
    } catch {
      // Counter bump failed — not critical, deploy already succeeded
    }
  }, [])

  return { total, isLoading, incrementGlobal, refresh: fetchTotal }
}