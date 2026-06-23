// hooks/useReferral.ts
"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@/hooks/useWallet"

const SITE_URL = "https://onchaindeploy.co"

export function useReferral() {
  const { address, isConnected } = useWallet()
  const [referralLink, setReferralLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [incomingRef, setIncomingRef] = useState<string | null>(null)

  // Build this user's referral link from their wallet address
  useEffect(() => {
    if (isConnected && address) {
      // Use first 8 + last 4 chars of wallet as the ref code
      const code = `${address.slice(2, 10)}${address.slice(-4)}`
      setReferralLink(`${SITE_URL}?ref=${code}`)
    } else {
      setReferralLink("")
    }
  }, [address, isConnected])

  // Read incoming referral from URL on page load
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const ref = params.get("ref")
    if (ref) setIncomingRef(ref)
  }, [])

  // Copy link to clipboard
  const copyLink = async () => {
    if (!referralLink) return
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea")
      el.value = referralLink
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Share URLs for each platform
  const shareText = encodeURIComponent(
    "Deploy smart contracts on Base in one click — no code needed. Try OnChainDeploy:"
  )
  const shareUrl = encodeURIComponent(referralLink || SITE_URL)

  const shareOnX = () => {
    window.open(
      `https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  return {
    referralLink,
    isConnected,
    copied,
    copyLink,
    shareOnX,
    shareOnFacebook,
    incomingRef,
  }
}