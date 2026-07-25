import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  Leaf,
  HeartPulse,
  RotateCcw
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    language,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    categories
  } = useApp();

  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const organicCategory = categories.find(c => c.id === 'organic');
  const medicalCategory = categories.find(c => c.id === 'medical');

  // Filter Logic
  let filtered = products.filter(product => {
    // Category match
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    // Subcategory match
    if (selectedSubcategory !== 'all' && product.subcategory !== selectedSubcategory) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q) || product.nameBn.includes(q);
      const matchDesc = product.description.toLowerCase().includes(q) || product.descriptionBn.includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  // Sorting
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const subcategoriesToShow = selectedCategory === 'organic'
    ? organicCategory?.subcategories || []
    : selectedCategory === 'medical'
    ? medicalCategory?.subcategories || []
    : [
        ...(organicCategory?.subcategories || []),
        ...(medicalCategory?.subcategories || [])
      ];

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A66C2] via-blue-700 to-[#2EBD59] text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            E-Commerce Store
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-hind">
            {language === 'bn' ? 'ঘরের ডাক্তার স্বাস্থ্য ও চিকিৎসা পণ্য ক্যাটালগ' : 'Ghorer Daktar Shop Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-hind">
            ১০০% খাঁটি সুন্দরবনের মধু, প্রিমিয়াম কালোজিরা তেল, অলিভ অয়েল, বিপি মেশিন ও প্রেসক্রিপশন সামগ্রী।
          </p>
        </div>
      </div>

      {/* Main Controls & Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        
        {/* Search & Category Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Main Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? 'সকল পণ্য (All)' : 'All Products'}
            </button>

            <button
              onClick={() => {
                setSelectedCategory('organic');
                setSelectedSubcategory('all');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                selectedCategory === 'organic'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>Organic Products</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('medical');
                setSelectedSubcategory('all');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                selectedCategory === 'medical'
                  ? 'bg-[#0A66C2] text-white'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-blue-500" />
              <span>Medical Products</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="পণ্য সার্চ করুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

        </div>

        {/* Subcategories Filter Pills */}
        {subcategoriesToShow.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold shrink-0">সাব-ক্যাটাগরি:</span>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition ${
                  selectedSubcategory === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                সবগুলো
              </button>
              {subcategoriesToShow.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition ${
                    selectedSubcategory === sub.id
                      ? 'bg-[#0A66C2] text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {language === 'bn' ? sub.nameBn : sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sorting & Result Count Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
          <div className="text-slate-600 dark:text-slate-400 font-hind">
            মোট <span className="font-bold text-slate-900 dark:text-white font-poppins">{filtered.length}</span> টি পণ্য পাওয়া গেছে
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-200 rounded-lg p-1.5"
              >
                <option value="default">ডিফল্ট ক্রমানুসার</option>
                <option value="price-low">দামঃ কম থেকে বেশি</option>
                <option value="price-high">দামঃ বেশি থেকে কম</option>
                <option value="rating">সেরা রেটিং</option>
              </select>
            </div>

            {/* Reset Button */}
            {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-rose-500 hover:underline flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিসেট</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Product List Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-hind">
            কোনো পণ্য খুঁজে পাওয়া যায়নি!
          </h3>
          <p className="text-xs text-slate-500 font-hind">
            অনুগ্রহ করে সার্চ কীওয়ার্ড বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            সকল পণ্য দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
