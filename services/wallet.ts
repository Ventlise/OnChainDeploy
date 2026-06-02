/**
 * wallet.ts — SSR-safe wallet connection service.
 *
 * Notes on disconnect:
 *   EIP-1193 has no native disconnect. MetaMask (11.1+) and Rabby support
 *   `wallet_revokePermissions` which properly drops the site's permission to
 *   read accounts — so the next connect call triggers a fresh popup.
 *   Older wallets ignore the method; we fall back to clearing local state.
 */

export interface WalletState {
  address: string | null
  chainId: number | null
  isConnected: boolean
}

/** Returns window.ethereum or null — safe to call anywhere */
function getProvider(): unknown {
  if (typeof window === "undefined") return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).ethereum ?? null
}

/** True if MetaMask (or compatible wallet) is installed */
export function isWalletInstalled(): boolean {
  return getProvider() !== null
}

/** Connect wallet — returns address + chainId on success */
export async function connectWallet(): Promise<WalletState> {
  const provider = getProvider()
  if (!provider) {
    throw new Error("No wallet detected. Please install MetaMask.")
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eth = provider as any

  const accounts: string[] = await eth.request({
    method: "eth_requestAccounts",
  })

  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts returned. Did you reject the connection?")
  }

  const chainIdHex: string = await eth.request({ method: "eth_chainId" })
  const chainId = parseInt(chainIdHex, 16)

  return {
    address: accounts[0],
    chainId,
    isConnected: true,
  }
}

/** Read current wallet state without prompting the user */
export async function getWalletState(): Promise<WalletState> {
  const provider = getProvider()
  const empty: WalletState = { address: null, chainId: null, isConnected: false }

  if (!provider) return empty

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eth = provider as any

  try {
    const accounts: string[] = await eth.request({ method: "eth_accounts" })
    if (!accounts || accounts.length === 0) return empty

    const chainIdHex: string = await eth.request({ method: "eth_chainId" })
    const chainId = parseInt(chainIdHex, 16)

    return { address: accounts[0], chainId, isConnected: true }
  } catch {
    return empty
  }
}

/**
 * Properly disconnect from the site by revoking the eth_accounts permission.
 * Works on MetaMask 11.1+ and Rabby. On older wallets we silently fall through —
 * local state is still cleared so the UI reflects a disconnected state.
 */
export async function disconnectWallet(): Promise<WalletState> {
  const provider = getProvider()

  if (provider) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eth = provider as any
    try {
      await eth.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      })
    } catch {
      // Older wallets don't implement this method — ignore and clear state anyway.
    }
  }

  return { address: null, chainId: null, isConnected: false }
}

/** Shorten address for display: 0x1234…abcd */
export function shortenAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

/**
 * Subscribe to account / chain changes.
 * Returns an unsubscribe function.
 */
export function subscribeToWalletEvents(
  onAccountChange: (accounts: string[]) => void,
  onChainChange: (chainId: number) => void,
): () => void {
  const provider = getProvider()
  if (!provider) return () => {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eth = provider as any

  const handleAccounts = (accounts: string[]) => onAccountChange(accounts)
  const handleChain = (chainIdHex: string) =>
    onChainChange(parseInt(chainIdHex, 16))

  eth.on?.("accountsChanged", handleAccounts)
  eth.on?.("chainChanged", handleChain)

  return () => {
    eth.removeListener?.("accountsChanged", handleAccounts)
    eth.removeListener?.("chainChanged", handleChain)
  }
}