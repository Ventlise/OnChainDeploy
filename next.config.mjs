/** @type {import('next').NextConfig} */
const nextConfig = {

  // ── Security Headers (safe set — won't break Web3 wallets) ────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Stop your site being embedded in fake sites (clickjacking)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },

          // Stop browsers guessing file types (injection protection)
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Force HTTPS for 1 year (no downgrade attacks)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },

          // Hide your URL when users click external links
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // Block camera, mic, location access
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },

          // Extra XSS shield for older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ]
  },

  // ── Performance ───────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // ── Webpack fixes for Web3 packages ──────────────────────────
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
      lokijs: false,
      encoding: false,
    }
    return config
  },
}

export default nextConfig