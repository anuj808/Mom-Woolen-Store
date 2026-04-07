'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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

interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

const CATEGORIES = [
  { value: '',        label: 'All'     },
  { value: 'mens',    label: "Men's"   },
  { value: 'womens',  label: "Women's" },
  { value: 'kids',    label: 'Kids'    },
  { value: 'unisex',  label: 'Unisex'  },
];

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First'    },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'popular',    label: 'Most Popular'    },
];

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

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();

  const [products,   setProducts]   = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  // Read filters from URL
  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort')     || 'newest';
  const search   = searchParams.get('search')   || '';
  const page     = Number(searchParams.get('page') || 1);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (sort)     params.set('sort',     sort);
      if (search)   params.set('search',   search);
      if (page > 1) params.set('page',     String(page));
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('limit', '12');

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || null);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, sort, search, page, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Page header */}
      <div className="bg-stone-900 pt-8 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-amber-600 text-[0.72rem] uppercase tracking-widest font-semibold mb-2">Browse</p>
          <h1 className="font-display text-4xl font-bold text-amber-50">
            {category ? CATEGORIES.find(c => c.value === category)?.label + ' Collection' : 'All Sweaters'}
          </h1>
          {pagination && (
            <p className="text-stone-500 text-sm mt-2">{pagination.total} products</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Controls bar */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">

          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              defaultValue={search}
              placeholder="Search sweaters…"
              onKeyDown={(e) => { if (e.key === 'Enter') updateParam('search', (e.target as HTMLInputElement).value); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => updateParam('category', value)}
                className={`px-4 py-2 rounded-xl text-[0.82rem] font-semibold transition-all
                  ${category === value
                    ? 'bg-amber-700 text-amber-50 shadow-md'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-700'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort — pushed to right */}
          <div className="ml-auto">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="pl-3 pr-8 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-[0.82rem] focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price filter */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-stone-500 text-sm">Price:</span>
          <input
            type="number"
            placeholder="Min ₹"
            defaultValue={minPrice}
            onBlur={(e) => updateParam('minPrice', e.target.value)}
            className="w-24 px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:outline-none focus:border-amber-400"
          />
          <span className="text-stone-400">—</span>
          <input
            type="number"
            placeholder="Max ₹"
            defaultValue={maxPrice}
            onBlur={(e) => updateParam('maxPrice', e.target.value)}
            className="w-24 px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:outline-none focus:border-amber-400"
          />
          {(minPrice || maxPrice) && (
            <button
              onClick={() => { updateParam('minPrice', ''); updateParam('maxPrice', ''); }}
              className="text-red-400 hover:text-red-500 text-xs font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : products.length > 0
            ? products.map((p, i) => (
                <div key={p._id} className="animate-fadeUp" style={{ animationDelay: `${i * 40}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))
            : (
              <div className="col-span-full py-24 text-center">
                <p className="font-display text-xl text-stone-500">No sweaters found</p>
                <p className="text-stone-400 text-sm mt-2">Try changing your filters</p>
                <button
                  onClick={() => router.push('/shop')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-amber-700 text-amber-50 text-sm font-semibold hover:bg-amber-600 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )
          }
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => updateParam('page', String(p))}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all
                  ${p === pagination.page
                    ? 'bg-amber-700 text-amber-50 shadow-md'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-300'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}