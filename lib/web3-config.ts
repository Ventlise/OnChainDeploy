'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base } from 'wagmi/chains'

// Safely handle ethereum property conflicts from browser extensions
// Some extensions try to redefine window.ethereum after MetaMask
// This prevents the "Cannot redefine property: ethereum" crash
if (typeof window !== 'undefined') {
  try {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum')
    if (descriptor && !descriptor.configurable) {
      // Property is locked — make it configurable so extensions don't crash
      Object.defineProperty(window, 'ethereum', {
        ...descriptor,
        configurable: true,
      })
    }
  } catch {
    // Silent fail — extension conflict is cosmetic only
  }
}

export const wagmiConfig = getDefaultConfig({
  appName: 'OnChainDeploy',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
  chains: [base],
  ssr: false,
})