import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import AuthProvider from '@/components/auth/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title:       "Mom's Woolen Store — Handcrafted Sweaters",
  description: 'Beautiful handmade woolen sweaters, crafted with love.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="font-body bg-stone-50 text-stone-800 antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}