'use client';
import { useEffect, useState } from 'react';
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

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100">
      <div className="aspect-[4/5] animate-shimmer" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-16 rounded-full animate-shimmer" />
        <div className="h-4 w-full rounded animate-shimmer" />
        <div className="h-5 w-20 rounded animate-shimmer mt-3" />
      </div>
    </div>
  );
}

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/products?sort=newest&limit=16')
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <div className="bg-stone-900 pt-8 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-2 text-amber-500 text-[0.72rem] font-semibold uppercase tracking-[0.2em] mb-3">
            <span className="w-6 h-px bg-amber-600" />
            Just arrived
          </span>
          <h1 className="font-display text-4xl font-bold text-amber-50">New Arrivals</h1>
          <p className="text-stone-400 text-sm mt-2">Fresh off the needles — our latest handcrafted pieces</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => (
                <div key={p._id} className="animate-fadeUp" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProductCard product={p} badge="New" />
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}