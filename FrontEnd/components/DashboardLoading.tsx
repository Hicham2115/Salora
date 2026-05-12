export function DashboardLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f2ede6]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo mark */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <span className="text-2xl font-bold tracking-tight text-white">S</span>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-bold text-gray-900">Salora</span>
          <span className="text-sm text-gray-400">Loading your dashboard…</span>
        </div>

        {/* Animated bar */}
        <div className="h-1 w-40 overflow-hidden rounded-full bg-primary/20">
          <div className="h-full w-1/2 animate-[slide_1.4s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}
