import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Share2,
  MessageSquare,
  Zap
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    selectedProductForQuickView,
    setSelectedProductForQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    language,
    siteSettings,
    setActivePage,
    orderNow
  } = useApp();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProductForQuickView) return null;

  const product = selectedProductForQuickView;
  const isWishlisted = isInWishlist(product.id);
  const effectivePrice = product.discountPrice || product.price;

  const handleBuyNow = () => {
    setSelectedProductForQuickView(null);
    orderNow(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForQuickView(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 rounded-full flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 relative">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.isOrganic && (
                <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  100% Organic
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0A66C2]">
                  {product.category === 'organic' ? 'Organic Product' : 'Medical Device'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock ({product.stock} units)
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-hind leading-snug">
                {language === 'bn' ? product.nameBn : product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-poppins">
                  {product.rating} ({product.reviewCount} Reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-extrabold text-[#0A66C2] dark:text-blue-400 font-poppins">
                  ৳{effectivePrice}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-slate-400 line-through font-poppins">
                    ৳{product.price}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-hind mt-3 leading-relaxed">
                {language === 'bn' ? product.descriptionBn : product.description}
              </p>

              {/* Specs */}
              {product.specs && (
                <div className="mt-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs grid grid-cols-2 gap-2">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-slate-400">{key}:</span>{' '}
                      <span className="font-bold text-slate-800 dark:text-slate-200">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">পরিমাণ:</span>
                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-bold font-poppins">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 transition ${
                    isWishlisted ? 'text-rose-500 bg-rose-50' : 'text-slate-500 hover:text-rose-500'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#08529d] text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition group"
                  title="কার্টে যোগ করুন / Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition" />
                  <span>{language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#1da84e] text-white py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition group animate-pulse-subtle"
                  title="সরাসরি চেকআউটে অর্ডার করুন / Order Now"
                >
                  <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition" />
                  <span>{language === 'bn' ? 'সরাসরি অর্ডার করুন' : 'Order Now'}</span>
                </button>
              </div>
              {/* Order via WhatsApp option */}
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber}?text=I%20want%20to%20order%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 py-2.5 rounded-xl font-bold text-xs transition"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>হোয়াটসঅ্যাপে সরাসরি অর্ডার দিন</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
