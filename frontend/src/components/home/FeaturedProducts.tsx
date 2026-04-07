'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import api from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  mrp?: number;
  images: string[];
  category: string;
  woolType?: string;
  rating: number;
  numReviews: number;
  stock: number;
}

// Skeleton loader card
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100">
      <div className="aspect-[4/5] animate-shimmer" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-16 rounded-full animate-shimmer" />
        <div className="h-4 w-full rounded animate-shimmer" />
        <div className="h-4 w-3/4 rounded animate-shimmer" />
        <div className="h-5 w-20 rounded animate-shimmer mt-3" />
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/products?limit=8&sort=newest')
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      {/* Section header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="inline-flex items-center gap-2 text-amber-700 text-[0.72rem] font-semibold uppercase tracking-[0.2em] mb-3">
            <span className="w-6 h-px bg-amber-600" />
            Handpicked for you
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-800">
            Featured Sweaters
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-800 text-[0.85rem] font-semibold transition-colors"
        >
          View all
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : products.length > 0
          ? products.map((p, i) => (
              <div
                key={p._id}
                className="animate-fadeUp"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProductCard product={p} badge={i === 0 ? 'Popular' : undefined} />
              </div>
            ))
          : (
            /* Empty state */
            <div className="col-span-full py-20 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9"/>
                  <path strokeLinecap="round" d="M3.5 9.5C7 8 12 10 15 8s3-5 0-5"/>
                </svg>
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-stone-700">No products yet</p>
                <p className="text-stone-400 text-sm mt-1">Add your first sweater from the admin panel</p>
              </div>
              <Link href="/admin" className="px-5 py-2.5 rounded-xl bg-amber-700 text-amber-50 text-sm font-semibold hover:bg-amber-600 transition-colors">
                Go to Admin
              </Link>
            </div>
          )
        }
      </div>

      {/* Mobile view all link */}
      <div className="sm:hidden mt-8 text-center">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-amber-700 font-semibold text-sm">
          View all sweaters
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </section>
  );
}