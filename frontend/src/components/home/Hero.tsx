import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-stone-900">

      {/* Background texture pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Warm gradient blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-900/20 blur-3xl -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-green-900/15 blur-3xl translate-y-1/4 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="space-y-8">
            <div className="animate-fadeUp" style={{ animationDelay: '0ms' }}>
              <span className="inline-flex items-center gap-2 text-amber-500 text-[0.75rem] font-semibold uppercase tracking-[0.2em] mb-4">
                <span className="w-8 h-px bg-amber-600" />
                Handcrafted in India
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-50 leading-[1.08] tracking-tight">
                Wrapped in
                <span className="block text-amber-400">warmth &</span>
                <span className="block">tradition</span>
              </h1>
            </div>

            <p className="text-stone-400 text-lg leading-relaxed max-w-md animate-fadeUp" style={{ animationDelay: '100ms' }}>
              Every sweater is knitted by hand with pure wool — no machines, no shortcuts.
              Just the same craft your grandmother knew, kept alive with love.
            </p>

            <div className="flex flex-wrap gap-4 animate-fadeUp" style={{ animationDelay: '200ms' }}>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-amber-700 hover:bg-amber-600 text-amber-50 font-semibold text-[0.95rem] transition-all active:scale-95 shadow-lg shadow-amber-900/30"
              >
                Shop All Sweaters
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                href="/new-arrivals"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-stone-700 hover:border-amber-700 text-stone-300 hover:text-amber-300 font-semibold text-[0.95rem] transition-all"
              >
                New Arrivals
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4 animate-fadeUp" style={{ animationDelay: '300ms' }}>
              {[
                { label: '100% Pure Wool',    icon: '🧶' },
                { label: 'Hand Knitted',      icon: '🤲' },
                { label: 'Free Shipping ₹999+', icon: '📦' },
              ].map(({ label, icon }) => (
                <div key={label} className="flex items-center gap-2 text-stone-500 text-[0.78rem]">
                  <span className="text-base">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — decorative card stack */}
          <div className="hidden lg:flex justify-center items-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <div className="relative w-80 h-96">

              {/* Back card */}
              <div className="absolute inset-0 bg-amber-900/30 rounded-3xl border border-amber-800/30 rotate-6 translate-x-4 translate-y-2" />

              {/* Middle card */}
              <div className="absolute inset-0 bg-stone-800/80 rounded-3xl border border-stone-700/50 rotate-2 translate-x-1" />

              {/* Front card */}
              <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 rounded-3xl border border-stone-700 flex flex-col items-center justify-center gap-6 shadow-2xl">
                <div className="w-24 h-24 rounded-full bg-amber-800/40 flex items-center justify-center">
                  <svg className="w-12 h-12 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9"/>
                    <path strokeLinecap="round" d="M3.5 9.5C7 8 12 10 15 8s3-5 0-5"/>
                    <path strokeLinecap="round" d="M20.5 14.5C17 16 12 14 9 16s-3 5 0 5"/>
                    <path strokeLinecap="round" d="M9 3.8C9.5 7 12 9 12 12s-2.5 5-3 8.2"/>
                  </svg>
                </div>
                <div className="text-center px-6">
                  <p className="font-display text-xl text-amber-200 font-semibold">Pure Kashmiri Wool</p>
                  <p className="text-stone-500 text-sm mt-1.5">Softest. Warmest. Timeless.</p>
                </div>
                <div className="flex gap-2">
                  {['#8B4513', '#2D5016', '#1a1a2e', '#8B0000', '#F5F5DC'].map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-stone-700 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-amber-300">₹1,299</p>
                  <p className="text-stone-600 text-xs line-through mt-0.5">₹1,899</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-stone-600 text-[0.65rem] uppercase tracking-widest">Scroll</span>
        <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}