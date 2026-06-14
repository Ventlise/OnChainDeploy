export default function Loading() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--bg-2)] text-[var(--ink)]">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-base" />
        <div className="bg-grid" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-noise" />
        <div className="bg-top-glow" />
      </div>

      {/* Centered spinner */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-5">

        {/* Animated logo */}
        <div
          className="gradient-bg grid h-16 w-16 place-items-center rounded-[18px]"
          style={{
            boxShadow: "0 10px 40px rgba(124,90,245,0.50)",
            animation: "glow-pulse 1.5s ease-in-out infinite",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            stroke="white"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L3 7v10l9 5 9-5V7z" />
            <path d="M3 7l9 5 9-5M12 12v10" opacity="0.7" />
          </svg>
        </div>

        {/* Loading bar */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full gradient-bg"
            style={{
              animation: "shimmer 1.8s ease-in-out infinite",
              backgroundSize: "200% 100%",
            }}
          />
        </div>

        <p className="text-[13px] font-medium text-[var(--ink-3)]">
          Loading OnChainDeploy…
        </p>
      </div>
    </main>
  )
}