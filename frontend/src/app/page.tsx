import Hero            from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Link from 'next/link';

// ── Category quick links ────────────────────────────────────────────────────
function Categories() {
  const cats = [
    { label: "Men's",    href: '/shop?category=mens',    emoji: '🧔', desc: 'Classic & rugged styles'  },
    { label: "Women's",  href: '/shop?category=womens',  emoji: '👩', desc: 'Elegant & cozy designs'   },
    { label: "Kids",     href: '/shop?category=kids',    emoji: '👦', desc: 'Warm & playful patterns'  },
    { label: "Unisex",   href: '/shop?category=unisex',  emoji: '🧑', desc: 'For everyone to wear'     },
  ];

  return (
    <section className="bg-stone-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-amber-700 text-[0.72rem] font-semibold uppercase tracking-[0.2em] mb-3">
            <span className="w-6 h-px bg-amber-600" />
            Browse by category
            <span className="w-6 h-px bg-amber-600" />
          </span>
          <h2 className="font-display text-3xl font-bold text-stone-800">Shop by Collection</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cats.map(({ label, href, emoji, desc }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-3">{emoji}</div>
              <h3 className="font-display text-lg font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
                {label}
              </h3>
              <p className="text-stone-400 text-xs mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why choose us ────────────────────────────────────────────────────────────
function WhyUs() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      title: '100% Pure Wool',
      desc:  'No synthetic blends. Every yarn is sourced from trusted farms.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
        </svg>
      ),
      title: 'Made with Love',
      desc:  'Each piece is hand-knitted — no two are exactly alike.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
        </svg>
      ),
      title: 'Free Delivery',
      desc:  'Free shipping on all orders above ₹999 across India.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
        </svg>
      ),
      title: 'Easy Returns',
      desc:  '7-day hassle-free return if you are not satisfied.',
    },
  ];

  return (
    <section className="py-20 bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-amber-50">
            Why choose us?
          </h2>
          <p className="text-stone-400 mt-3 text-[0.9rem]">We take pride in every stitch.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="bg-stone-800/60 border border-stone-700/50 rounded-2xl p-6 hover:border-amber-800/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-900/50 text-amber-500 flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="font-display text-[1rem] font-bold text-amber-100 mb-2">{title}</h3>
              <p className="text-stone-500 text-[0.82rem] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyUs />
    </>
  );
}