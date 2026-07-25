import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Heart,
  Star,
  Eye,
  CheckCircle2,
  Sparkles,
  Tag,
  Zap
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductForQuickView,
    orderNow
  } = useApp();

  const isWishlisted = isInWishlist(product.id);
  const effectivePrice = product.discountPrice || product.price;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-[#E2E8F0] dark:border-slate-700/80 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative">
      
      {/* Top Badges */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1 items-start">
        {product.isOrganic && (
          <span className="bg-[#22C55E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Organic</span>
          </span>
        )}

        {product.isBestSeller && (
          <span className="bg-[#0A66C2] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
            Best Seller
          </span>
        )}

        {discountPercent > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
            <Tag className="w-2.5 h-2.5" />
            <span>-{discountPercent}%</span>
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-5 right-5 z-10 p-2 rounded-full shadow-md transition ${
          isWishlisted
            ? 'bg-rose-500 text-white'
            : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-rose-500'
        }`}
        title="Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      <div>
        {/* Product Image & Quick View Trigger */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F8FAFC] dark:bg-slate-900 mb-3 group">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          {/* Quick View Hover Button */}
          <button
            onClick={() => setSelectedProductForQuickView(product)}
            className="absolute inset-x-3 bottom-3 bg-[#0A66C2]/90 hover:bg-[#0A66C2] text-white py-2 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-1.5 shadow-md backdrop-blur-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Category Tag */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1">
          <span className="uppercase tracking-wider text-[#0A66C2] font-semibold">
            {product.category === 'organic' ? 'Organic Food' : 'Medical Device'}
          </span>
          {product.stock > 0 ? (
            <span className="text-[#22C55E] dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" />
              In Stock
            </span>
          ) : (
            <span className="text-rose-500">Stock Out</span>
          )}
        </div>

        {/* Product Name */}
        <h3
          onClick={() => setSelectedProductForQuickView(product)}
          className="text-sm font-bold text-[#1E293B] dark:text-white font-hind line-clamp-2 hover:text-[#0A66C2] cursor-pointer transition mb-1.5"
        >
          {language === 'bn' ? product.nameBn : product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 font-poppins">
            {product.rating}
          </span>
          <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
        </div>
      </div>

      {/* Pricing & CTA Buttons (Requirement 1 & 2) */}
      <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-700/60 space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-[#0A66C2] dark:text-blue-400 font-poppins">
              ৳{effectivePrice}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-slate-400 line-through font-poppins">
                ৳{product.price}
              </span>
            )}
          </div>
          {product.stock > 0 && (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              ⚡ ফাস্ট ডেলিভারি
            </span>
          )}
        </div>

        {/* TWO BUTTONS: Add to Cart (Blue) and Order Now (Green -> Checkout Page) */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {/* Add to Cart (for buying multiple products) */}
          <button
            onClick={() => addToCart(product)}
            className="bg-[#0A66C2] hover:bg-[#08529d] text-white py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 group"
            title="কার্টে যোগ করুন / Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5 group-hover:scale-110 transition" />
            <span>{language === 'bn' ? 'কার্টে যোগ' : 'Add to Cart'}</span>
          </button>

          {/* Order Now (takes directly to checkout page) */}
          <button
            onClick={() => orderNow(product)}
            className="bg-[#22C55E] hover:bg-[#1da84e] text-white py-2 px-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition active:scale-95 group animate-pulse-subtle"
            title="সরাসরি চেকআউটে অর্ডার করুন / Order Now"
          >
            <Zap className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition" />
            <span>{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
