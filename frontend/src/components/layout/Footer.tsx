import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-900 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9"/>
                  <path strokeLinecap="round" d="M3.5 9.5C7 8 12 10 15 8s3-5 0-5"/>
                  <path strokeLinecap="round" d="M20.5 14.5C17 16 12 14 9 16s-3 5 0 5"/>
                </svg>
              </div>
              <span className="text-amber-100 font-bold text-[0.95rem]">Mom's Woolen Store</span>
            </div>
            <p className="text-stone-500 text-[0.82rem] leading-relaxed">
              Every sweater is handcrafted with love, using the finest wool. Warmth you can feel, quality you can trust.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-stone-300 font-semibold text-[0.82rem] uppercase tracking-widest mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'All Products', href: '/shop' },
                { label: 'New Arrivals', href: '/new-arrivals' },
                { label: 'Men\'s Collection', href: '/shop?category=mens' },
                { label: 'Women\'s Collection', href: '/shop?category=womens' },
                { label: 'Kids Collection', href: '/shop?category=kids' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-stone-500 hover:text-amber-400 text-[0.82rem] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-stone-300 font-semibold text-[0.82rem] uppercase tracking-widest mb-4">Help</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'My Orders',      href: '/orders'  },
                { label: 'My Profile',     href: '/profile' },
                { label: 'Contact Us',     href: '/contact' },
                { label: 'Return Policy',  href: '/returns' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-stone-500 hover:text-amber-400 text-[0.82rem] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-600 text-[0.75rem]">
            © {new Date().getFullYear()} Mom's Woolen Store. Made with ❤️ in India.
          </p>
          <p className="text-stone-700 text-[0.72rem]">Handcrafted · Sustainable · Warm</p>
        </div>
      </div>
    </footer>
  );
}