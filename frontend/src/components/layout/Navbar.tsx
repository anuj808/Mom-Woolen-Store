'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const NAV_LINKS = [
  { label: 'Home',         href: '/'             },
  { label: 'Shop',         href: '/shop'          },
  { label: 'New Arrivals', href: '/new-arrivals'  },
];

export default function Navbar() {
  const pathname              = usePathname();
  const router                = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push('/auth/login');
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-stone-900/95 backdrop-blur-md shadow-lg shadow-stone-950/20 py-3'
          : 'bg-stone-900 py-4'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-amber-700 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                <svg className="w-5 h-5 text-amber-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9"/>
                  <path strokeLinecap="round" d="M3.5 9.5C7 8 12 10 15 8s3-5 0-5"/>
                  <path strokeLinecap="round" d="M20.5 14.5C17 16 12 14 9 16s-3 5 0 5"/>
                  <path strokeLinecap="round" d="M9 3.8C9.5 7 12 9 12 12s-2.5 5-3 8.2"/>
                </svg>
              </div>
              <div className="leading-none">
                <span className="block text-[0.6rem] text-amber-600/80 uppercase tracking-[0.18em] font-medium">
                  Handcrafted
                </span>
                <span className="block text-[1rem] font-bold text-amber-50 tracking-tight">
                  Mom's Woolen Store
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative px-4 py-2 rounded-lg text-[0.85rem] font-medium transition-all duration-200
                    ${isActive(href)
                      ? 'text-amber-300 bg-amber-900/40'
                      : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800'}
                  `}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-9 h-9 rounded-xl text-stone-300 hover:text-amber-200 hover:bg-stone-800 transition-all"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                {/* Cart count badge — wire to cart store later */}
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-600 text-white text-[0.55rem] font-bold flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* Auth — desktop */}
              {isAuthenticated && user ? (
                <div className="relative hidden md:block" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-700 flex items-center justify-center text-amber-100 text-xs font-bold">
                      {user.name ? user.name[0].toUpperCase() : user.phone.slice(-2)}
                    </div>
                    <span className="text-stone-200 text-[0.82rem] font-medium max-w-[7rem] truncate">
                      {user.name || user.phone}
                    </span>
                    <svg className={`w-3.5 h-3.5 text-stone-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-stone-800 border border-stone-700 rounded-2xl shadow-xl shadow-stone-950/40 overflow-hidden">
                      <div className="px-4 py-3 border-b border-stone-700">
                        <p className="text-stone-200 text-[0.82rem] font-semibold truncate">{user.name || 'My Account'}</p>
                        <p className="text-stone-500 text-[0.72rem] truncate">+91 {user.phone}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-stone-300 hover:text-amber-200 hover:bg-stone-700 text-[0.82rem] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                          My Profile
                        </Link>
                        <Link href="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-stone-300 hover:text-amber-200 hover:bg-stone-700 text-[0.82rem] transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                          My Orders
                        </Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-amber-400 hover:text-amber-300 hover:bg-stone-700 text-[0.82rem] transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-stone-700 text-[0.82rem] transition-colors border-t border-stone-700 mt-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-amber-50 text-[0.82rem] font-semibold transition-all active:scale-95"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                  Login
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl hover:bg-stone-800 transition-all gap-1.5"
                aria-label="Toggle menu"
              >
                <span className={`block w-5 h-0.5 bg-stone-300 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-stone-300 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-stone-300 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <div className={`
        fixed inset-0 z-40 md:hidden transition-all duration-300
        ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}
      `}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer */}
        <div className={`
          absolute top-0 right-0 h-full w-72 bg-stone-900 border-l border-stone-800
          shadow-2xl transition-transform duration-300 flex flex-col
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-800">
            <span className="text-amber-200 font-bold text-[0.95rem]">Mom's Woolen Store</span>
            <button onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-[0.9rem] font-medium transition-all
                  ${isActive(href)
                    ? 'text-amber-300 bg-amber-900/40 border border-amber-900/60'
                    : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800'}
                `}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[0.9rem] font-medium text-stone-300 hover:text-amber-200 hover:bg-stone-800 transition-all"
            >
              Cart
              <span className="ml-auto w-5 h-5 rounded-full bg-amber-700 text-amber-100 text-[0.6rem] font-bold flex items-center justify-center">0</span>
            </Link>
          </nav>

          {/* Mobile auth */}
          <div className="px-4 pb-8 border-t border-stone-800 pt-4">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-800 mb-3">
                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-amber-100 font-bold">
                    {user.name ? user.name[0].toUpperCase() : '?'}
                  </div>
                  <div className="leading-none">
                    <p className="text-stone-200 text-[0.85rem] font-semibold">{user.name || 'My Account'}</p>
                    <p className="text-stone-500 text-[0.72rem] mt-0.5">+91 {user.phone}</p>
                  </div>
                </div>
                <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-[0.85rem] transition-colors">My Profile</Link>
                <Link href="/orders" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-stone-300 hover:bg-stone-800 text-[0.85rem] transition-colors">My Orders</Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-red-400 hover:bg-stone-800 text-[0.85rem] transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-amber-50 font-semibold text-[0.9rem] transition-all"
              >
                Login / Sign up
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Spacer so content doesn't hide behind fixed navbar */}
      <div className="h-16" />
    </>
  );
}