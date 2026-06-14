import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

const SITE_URL = 'https://on-chain-deploy.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'OnChainDeploy — Deploy Smart Contracts on Base in One Click',
  description:
    'Deploy and verify smart contracts on Base Mainnet with one click. No code, no Remix, no confusion. Pick a template, connect your wallet, and ship your contract in seconds — BaseScan verified.',
  keywords: [
    'deploy smart contract',
    'Base Mainnet',
    'no-code smart contract',
    'BaseScan verify',
    'one-click deploy',
    'Web3 deployment',
    'Solidity deploy',
    'Base chain',
    'smart contract template',
    'deploy contract without coding',
  ],
  authors: [{ name: 'OnChainDeploy' }],
  creator: 'OnChainDeploy',
  publisher: 'OnChainDeploy',
  applicationName: 'OnChainDeploy',
  category: 'technology',

  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'OnChainDeploy',
    title: 'OnChainDeploy — Deploy Smart Contracts on Base in One Click',
    description:
      'No code. No Remix. Pick a template, connect your wallet, and your smart contract is live on Base — verified on BaseScan in seconds.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OnChainDeploy — One-click smart contract deployment on Base',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'OnChainDeploy — Deploy Smart Contracts on Base in One Click',
    description:
      'No code. No Remix. Connect your wallet and ship a verified smart contract on Base in seconds.',
    images: ['/og-image.png'],
    creator: '@onchaindeploy',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },

  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* JSON-LD structured data for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'OnChainDeploy',
              url: SITE_URL,
              description:
                'Deploy and verify smart contracts on Base Mainnet with one click. No coding required.',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free deployment, optional $0.09 verification',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}