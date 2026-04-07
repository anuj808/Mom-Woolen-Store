import Link from 'next/link';
import Image from 'next/image';

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

interface Props {
  product: Product;
  badge?: string;
}

export default function ProductCard({ product, badge }: Props) {
  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating));

  return (
    <Link href={`/shop/${product._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-amber-200 hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-300">

        {/* Image */}
        <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            /* Placeholder when no image */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50">
              <svg className="w-12 h-12 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="12" cy="12" r="9"/>
                <path strokeLinecap="round" d="M3.5 9.5C7 8 12 10 15 8s3-5 0-5"/>
                <path strokeLinecap="round" d="M20.5 14.5C17 16 12 14 9 16s-3 5 0 5"/>
              </svg>
              <span className="text-stone-400 text-xs mt-2">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {badge && (
              <span className="px-2.5 py-1 rounded-full bg-amber-700 text-amber-50 text-[0.65rem] font-bold uppercase tracking-wide shadow-sm">
                {badge}
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-green-700 text-green-50 text-[0.65rem] font-bold shadow-sm">
                {discount}% OFF
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-2.5 py-1 rounded-full bg-stone-700/90 text-stone-200 text-[0.65rem] font-bold shadow-sm">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.woolType && (
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-amber-700 mb-1">
              {product.woolType}
            </p>
          )}

          <h3 className="font-display text-[0.95rem] font-semibold text-stone-800 leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          {/* Stars */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex gap-0.5">
                {stars.map((filled, i) => (
                  <svg key={i} className={`w-3 h-3 ${filled ? 'text-amber-500' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-stone-400 text-[0.7rem]">({product.numReviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-display text-lg font-bold text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-stone-400 text-sm line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}