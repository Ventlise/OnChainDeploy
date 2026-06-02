import { useState, useEffect, useCallback } from "react"
import {
  connectWallet,
  disconnectWallet,
  getWalletState,
  subscribeToWalletEvents,
  isWalletInstalled,
  shortenAddress,
  type WalletState,
} from "@/services/wallet"

export interface UseWalletReturn {
  address: string | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  isInstalled: boolean
  shortAddress: string
  error: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // On mount: check if already connected + detect wallet install
  useEffect(() => {
    setIsInstalled(isWalletInstalled())

    getWalletState().then((walletState) => {
      setState(walletState)
    })

    // Listen for account / chain switches
    const unsubscribe = subscribeToWalletEvents(
      (accounts) => {
        if (accounts.length === 0) {
          setState({ address: null, chainId: null, isConnected: false })
        } else {
          setState((prev) => ({
            ...prev,
            address: accounts[0],
            isConnected: true,
          }))
        }
      },
      (chainId) => {
        setState((prev) => ({ ...prev, chainId }))
      },
    )

    return () => unsubscribe()
  }, [])

  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(null)
    try {
      const walletState = await connectWallet()
      setState(walletState)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect wallet."
      setError(message)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      const cleared = await disconnectWallet()
      setState(cleared)
    } catch {
      // Even if revoke fails, clear local state so UI updates.
      setState({ address: null, chainId: null, isConnected: false })
    }
  }, [])

  return {
    address: state.address,
    chainId: state.chainId,
    isConnected: state.isConnected,
    isConnecting,
    isInstalled,
    shortAddress: state.address ? shortenAddress(state.address) : "",
    error,
    connect,
    disconnect,
  }
}