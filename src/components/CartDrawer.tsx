import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    siteSettings,
    language,
    setActivePage,
    showToast
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedDiscount(data.discountAmount);
        setCouponApplied(true);
        showToast(`কুপন ক্লেইম সফল! ৳${data.discountAmount} ডিসকাউন্ট পাওয়া গেছে!`, 'success');
      } else {
        showToast(data.error || 'অবৈধ কুপন কোড', 'error');
      }
    } catch (e) {
      showToast('কুপন ভ্যালিডেশন ব্যর্থ হয়েছে', 'error');
    }
  };

  const finalSubtotal = Math.max(0, cartSubtotal - appliedDiscount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-hind">
                  {language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
                </h3>
                <p className="text-xs text-slate-500 font-poppins">
                  {cart.length} Unique Items
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body - Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-hind">
                  আপনার কার্ট বর্তমানে খালি!
                </h4>
                <p className="text-xs text-slate-500 font-hind max-w-xs mx-auto">
                  আমাদের অর্গানিক মধু, অলিভ অয়েল বা মেডিকেল ডিভাইস ক্যাটালগ দেখুন।
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('shop');
                  }}
                  className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                >
                  <span>পণ্যসমূহ দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map(item => {
                const effectivePrice = item.product.discountPrice || item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-slate-200 dark:border-slate-700"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white font-hind line-clamp-1">
                          {language === 'bn' ? item.product.nameBn : item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-500 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-extrabold text-[#0A66C2] dark:text-blue-400 font-poppins">
                          ৳{effectivePrice}
                        </span>

                        <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 py-0.5 text-xs font-bold font-poppins">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 space-y-3">
              
              {/* Coupon Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    placeholder="কুপন কোড (e.g. HEALTH10)"
                    disabled={couponApplied}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white uppercase font-poppins"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                  className="bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
                >
                  {couponApplied ? 'প্রযোজ্য' : 'আবেদন'}
                </button>
              </div>

              {/* Subtotal Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-hind pt-1">
                <div className="flex justify-between">
                  <span>পণ্যের মূল্য (Subtotal):</span>
                  <span className="font-bold font-poppins">৳{cartSubtotal}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>কুপন ডিসকাউন্ট:</span>
                    <span className="font-poppins">-৳{appliedDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>ডেলিভারি চার্জ (ঢাকা/ঢাকার বাইরে):</span>
                  <span>৳{siteSettings.deliveryChargeInsideDhaka} - ৳{siteSettings.deliveryChargeOutsideDhaka}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>সর্বমোট (Estimated Total):</span>
                  <span className="text-lg text-[#0A66C2] dark:text-blue-400 font-poppins">
                    ৳{finalSubtotal}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActivePage('checkout');
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#2EBD59] hover:bg-[#24a24a] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5"
              >
                <span>অর্ডার সম্পন্ন করুন (Proceed to Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>১০০% নিরাপদ চেকআউট • ক্যাশ অন ডেলিভারি সহজলভ্য</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
