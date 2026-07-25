import { Category, Product, Doctor, SiteSettings, FAQ, Testimonial, Coupon } from '../types';

export const initialSiteSettings: SiteSettings = {
  whatsappNumber: '8801700000000',
  hotline: '+880 1700-000000',
  email: '',
  address: 'House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
  deliveryChargeInsideDhaka: 60,
  deliveryChargeOutsideDhaka: 120,
  noticeBanner: '🎉 স্পেশাল ডিসকাউন্ট! ১ম অর্ডারে ১০% ছাড় পেতে কুপন ব্যবহার করুন: HEALTH10',
  heroHeadline: 'আপনার পরিবারের স্বাস্থ্যসেবার বিশ্বস্ত ঠিকানা',
  heroSubheadline: 'Organic Products, Medical Products এবং MBBS Doctor Consultation — সবকিছু এক প্ল্যাটফর্মে।',
};

export const initialCategories: Category[] = [
  {
    id: 'organic',
    name: 'Organic Products',
    nameBn: 'অর্গানিক প্রোডাক্টস',
    slug: 'organic-products',
    mainCategory: 'organic',
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: '১০০% খাঁটি ও প্রাকৃতিক অর্গানিক খাদ্য ও স্বাস্থ্যকর পণ্য',
    subcategories: [
      { id: 'organic-honey', name: 'Organic Honey', nameBn: 'খাঁটি মধু', image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=400&q=80' },
      { id: 'black-seed', name: 'Black Seed & Oil', nameBn: 'কালোজিরা ও তেল', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80' },
      { id: 'olive-oil', name: 'Extra Virgin Olive Oil', nameBn: 'অলিভ অয়েল', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80' },
      { id: 'herbal-tea', name: 'Herbal Tea & Green Tea', nameBn: 'ভেষজ চা', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80' },
      { id: 'organic-spices', name: 'Organic Spices', nameBn: 'জৈব মসলা', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80' },
      { id: 'dry-fruits', name: 'Dry Fruits & Nuts', nameBn: 'ড্রাই ফ্রুটস ও কাজুবাদাম', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80' },
      { id: 'natural-supplements', name: 'Natural Supplements', nameBn: 'প্রাকৃতিক সাপ্লিমেন্ট', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { id: 'healthy-food', name: 'Healthy Food', nameBn: 'স্বাস্থ্যকর খাবার', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  {
    id: 'medical',
    name: 'Medical Products',
    nameBn: 'মেডিকেল প্রোডাক্টস',
    slug: 'medical-products',
    mainCategory: 'medical',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'মেডিকেল ডিভাইস, ওষুধ, স্কিনকেয়ার ও পার্সোনাল কেয়ার সামগ্রী',
    subcategories: [
      { id: 'medicine', name: 'Medicine', nameBn: 'ওষুধ', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { id: 'beauty', name: 'Beauty', nameBn: 'বিউটি কেয়ার', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' },
      { id: 'skincare', name: 'Skincare', nameBn: 'স্কিনকেয়ার', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80' },
      { id: 'haircare', name: 'Haircare', nameBn: 'হেয়ারকেয়ার', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80' },
      { id: 'baby-care', name: 'Baby Care', nameBn: 'বেবি কেয়ার', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80' },
      { id: 'home-care', name: 'Home Care', nameBn: 'হোম কেয়ার', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80' },
      { id: 'medical-devices', name: 'Medical Devices', nameBn: 'মেডিকেল ডিভাইস', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80' },
      { id: 'supplements', name: 'Supplements', nameBn: 'ভিটামিন ও সাপ্লিমেন্ট', image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=400&q=80' },
      { id: 'herbal', name: 'Herbal', nameBn: 'হেষজ চিকিৎসা', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80' },
      { id: 'healthcare', name: 'Healthcare Essentials', nameBn: 'হেলথকেয়ার', image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1cdb?auto=format&fit=crop&w=400&q=80' },
      { id: 'pet-care', name: 'Pet Care', nameBn: 'পেট কেয়ার', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80' },
      { id: 'homeopathy', name: 'Homeopathy', nameBn: 'হোমিওপ্যাথি', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=400&q=80' },
      { id: 'dermatology', name: 'Dermatology', nameBn: 'ডার্মাটোলজি', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80' },
      { id: 'food-nutrition', name: 'Food & Nutrition', nameBn: 'ফুড ও নিউট্রিশন', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  {
    id: 'doctor',
    name: 'Doctor Consultation',
    nameBn: 'ডাক্তার কনসালটেশন',
    slug: 'doctor-consultation',
    mainCategory: 'doctor',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    description: 'অভিজ্ঞ MBBS ও বিশেষজ্ঞ ডাক্তারদের সাথে ভিডিও ও অনলাইন কনসালটেশন'
  }
];

export const initialDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Rahman',
    nameBn: 'ডাঃ সারা রহমান',
    degree: 'MBBS, FCPS (Medicine)',
    degreeBn: 'এমবিবিএস, এফসিপিএস (মেডিসিন)',
    specialty: 'Medicine Specialist',
    specialtyBn: 'মেডিসিন বিশেষজ্ঞ',
    experienceYears: 15,
    consultationFee: 700,
    availability: 'Sat - Thu: 6:00 PM - 9:00 PM',
    availabilityBn: 'শনি - বৃহঃ সন্ধ্যা ৬:০০ - রাত ৯:০০',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    totalConsultations: 1240,
    bmdcReg: 'A-45892',
    about: 'ঢাকা মেডিকেল কলেজের সাবেক কনসালটেন্ট। ডায়াবেটিস, উচ্চ রক্তচাপ ও জটিল মেডিসিন সমস্যায় বিশেষ পারদর্শী।'
  },
  {
    id: 'doc-2',
    name: 'Dr. Tanvir Hasan',
    nameBn: 'ডাঃ তানভীর হাসান',
    degree: 'MBBS, DCH (Child Health)',
    degreeBn: 'এমবিবিএস, ডিসিএইচ (শিশু স্বাস্থ্য)',
    specialty: 'Child Specialist',
    specialtyBn: 'শিশু রোগ বিশেষজ্ঞ',
    experienceYears: 10,
    consultationFee: 600,
    availability: 'Daily: 4:00 PM - 8:00 PM',
    availabilityBn: 'প্রতিদিনঃ বিকাল ৪:০০ - রাত ৮:০০',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    totalConsultations: 980,
    bmdcReg: 'A-51203',
    about: 'শিশু রোগ ও নবজাতকের যত্নে ১০ বছরের অভিজ্ঞতাসম্পন্ন সহানুভূতিশীল চিকিৎসক।'
  },
  {
    id: 'doc-3',
    name: 'Dr. Nusrat Jahan',
    nameBn: 'ডাঃ নুসরাত জাহান',
    degree: 'MBBS, DDV (Dermatology)',
    degreeBn: 'এমবিবিএস, ডিডিভি (চর্ম ও যৌন)',
    specialty: 'Skin Specialist',
    specialtyBn: 'চর্ম ও যৌন রোগ বিশেষজ্ঞ',
    experienceYears: 12,
    consultationFee: 800,
    availability: 'Fri - Wed: 5:00 PM - 9:00 PM',
    availabilityBn: 'শুক্র - বুধঃ বিকাল ৫:০০ - রাত ৯:০০',
    photo: 'https://images.unsplash.com/photo-1594824813566-88855ce78347?auto=format&fit=crop&w=500&q=80',
    rating: 4.95,
    totalConsultations: 1520,
    bmdcReg: 'A-48911',
    about: 'ব্রণ, এলার্জি, চর্মরোগ ও লেজার চিকিৎসায় স্পেশালিস্ট। বিএসএমএমইউ (পিজি হাসপাতাল) এর বিশেষজ্ঞ ডাক্তার।'
  }
];

export const initialProducts: Product[] = [
  // Organic Category
  {
    id: 'prod-1',
    name: 'Sundarban Raw Organic Honey (500g)',
    nameBn: 'সুন্দরবনের ১০০% খাঁটি প্রাকৃতিক মধু (৫০০ গ্রাম)',
    category: 'organic',
    subcategory: 'organic-honey',
    price: 650,
    discountPrice: 550,
    rating: 4.9,
    reviewCount: 128,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: '100% Raw & Filtered Sundarban Mangrove Honey harvested directly from natural beehives. Rich in antioxidants and natural enzymes.',
    descriptionBn: 'সুন্দরবনের গভীর বন থেকে সংগৃহীত প্রাকৃতিক প্রাকৃতিক মধু। এতে কোনো প্রকার কেমিক্যাল বা কৃত্রিম চিনি মেলানো হয় নাই। রোগ প্রতিরোধ ক্ষমতা বাড়ায়।',
    isOrganic: true,
    isBestSeller: true,
    isFeatured: true,
    badge: 'Best Seller',
    specs: { Weight: '500g', Origin: 'Sundarbans, BD', Type: 'Raw Wild Honey', ShelfLife: '2 Years' },
    benefits: ['রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে', 'ঠাণ্ডা ও কাশির প্রাকৃতিক মহৌষধ', 'শক্তি ও এনার্জি যোগায়']
  },
  {
    id: 'prod-2',
    name: 'Cold Pressed Black Seed Oil (100ml)',
    nameBn: 'কোল্ড প্রেসড খাঁটি কালোজিরা তেল (১০০ মি.লি.)',
    category: 'organic',
    subcategory: 'black-seed',
    price: 350,
    discountPrice: 290,
    rating: 4.8,
    reviewCount: 94,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    description: 'Premium organic black seed oil extracted using cold-press technology to preserve essential thymoquinone and nutrients.',
    descriptionBn: 'প্রথম চাপের খাঁটি অর্গানিক কালোজিরার তেল। উচ্চমাত্রার থাইমোকুইনোন সমৃদ্ধ। সব রোগের নিরাময়ে অত্যন্ত কার্যকর।',
    isOrganic: true,
    isBestSeller: true,
    badge: '100% Pure',
    specs: { Volume: '100ml', Method: 'Cold Pressed', Purity: '100% Organic' }
  },
  {
    id: 'prod-3',
    name: 'Spanish Extra Virgin Olive Oil (500ml)',
    nameBn: 'স্প্যানিশ এক্সট্রা ভার্জিন অলিভ অয়েল (৫০০ মি.লি.)',
    category: 'organic',
    subcategory: 'olive-oil',
    price: 950,
    discountPrice: 850,
    rating: 4.7,
    reviewCount: 62,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    description: 'Imported Grade-A extra virgin olive oil for cooking, salad dressing, skin hydration, and hair nourish.',
    descriptionBn: 'স্পেন থেকে আমদানিকৃত সেরা মানের এক্সট্রা ভার্জিন অলিভ অয়েল। সালাদ, হালকা রান্না এবং ত্বক ও চুলের যত্নে উপযোগী।',
    isOrganic: true,
    specs: { Volume: '500ml', Origin: 'Spain', Type: 'Extra Virgin' }
  },
  {
    id: 'prod-4',
    name: 'Organic Tulsi & Green Tea Blend (20 Tea Bags)',
    nameBn: 'অর্গানিক তুলসী ও গ্রিন টি (২০ টি-ব্যাগ)',
    category: 'organic',
    subcategory: 'herbal-tea',
    price: 280,
    discountPrice: 230,
    rating: 4.9,
    reviewCount: 45,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    description: 'Refreshing herbal tea infused with natural tulsi leaves and premium green tea. Boosts immunity and aids digestion.',
    descriptionBn: 'মানসিক ক্লান্তি দূর করতে ও মেদ কমাতে তুলসী ও গ্রীন টি এর প্রাকৃতিক মিশ্রণ।',
    isOrganic: true,
    isFeatured: true,
    badge: 'Popular'
  },
  {
    id: 'prod-5',
    name: 'Premium Roasted Cashews & Almonds Mix (250g)',
    nameBn: 'প্রিমিয়াম রোস্টেড কাজুবাদাম ও কাঠবাদাম (২৫০ গ্রাম)',
    category: 'organic',
    subcategory: 'dry-fruits',
    price: 480,
    discountPrice: 420,
    rating: 4.85,
    reviewCount: 78,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp and fresh high-grade cashew nuts and California almonds. Lightly salted and rich in healthy fats.',
    descriptionBn: 'স্বাস্থ্যকর হালকা মচমচে কাজুবাদাম ও প্রিমিয়াম কাঠবাদামের প্যাক। হার্ট ও ব্রেইনের স্বাস্থ্যের জন্য অত্যন্ত উপকারী।',
    isOrganic: true
  },

  // Medical Products Category
  {
    id: 'prod-6',
    name: 'Digital Blood Pressure Monitor (Arm Type)',
    nameBn: 'ডিজিটাল ব্লাড প্রেসার মনিটর (বিপি মেশিন)',
    category: 'medical',
    subcategory: 'medical-devices',
    price: 2400,
    discountPrice: 1950,
    rating: 4.9,
    reviewCount: 182,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    description: 'Accurate clinical grade automatic digital BP machine with voice alert and memory storage for 90 readings.',
    descriptionBn: 'বাসায় নিখুঁত প্রেশার মাপার জন্য ভয়েস অ্যালার্ট সুবিধাসহ ডিজিটাল বিপি মনিটর। ৩ বছরের ওয়ারেন্টি সহ।',
    isBestSeller: true,
    isFeatured: true,
    badge: '3 Yr Warranty',
    specs: { Display: 'Large LCD', Memory: '90 Records', Power: 'AAA Batteries / USB C', Warranty: '3 Years' }
  },
  {
    id: 'prod-7',
    name: 'Accu-Chek Blood Glucose Meter Kit',
    nameBn: 'অ্যাকিউ-চেক সুগার মাপার মেশিন কিট (২৫ স্ট্রিপ সহ)',
    category: 'medical',
    subcategory: 'medical-devices',
    price: 1800,
    discountPrice: 1550,
    rating: 4.88,
    reviewCount: 210,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1cdb?auto=format&fit=crop&w=600&q=80',
    description: 'Fast 5-second blood sugar test kit with 25 test strips and lancet device included. Essential for diabetes tracking.',
    descriptionBn: 'সহজে ও মাত্র ৫ সেকেন্ডে রক্তের গ্লুকোজ মাপার প্রিমিয়াম ডায়াবেটিস কিট। ২৫ টি ফ্রি স্ট্রিপ সহ।',
    isBestSeller: true,
    badge: 'Essential',
    specs: { TestTime: '5 Seconds', Memory: '500 Tests', Includes: 'Meter, 25 Strips, Lancing Pen' }
  },
  {
    id: 'prod-8',
    name: 'Fingertip Pulse Oximeter SPO2 Sensor',
    nameBn: 'ফিঙ্গারটিপ পালস অক্সিমিটার (SPO2 ও হার্টরেট)',
    category: 'medical',
    subcategory: 'medical-devices',
    price: 850,
    discountPrice: 650,
    rating: 4.75,
    reviewCount: 140,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'Instant blood oxygen level and pulse rate monitor with HD OLED screen and auto power off.',
    descriptionBn: 'রক্তে অক্সিজেনের মাত্রা ও পালস রেট পরিমাপক আধুনিক পোর্টেবল ডিভাইস।',
    badge: 'Offer'
  },
  {
    id: 'prod-9',
    name: 'CeraVe Hydrating Facial Cleanser (237ml)',
    nameBn: 'সেরাভি হাইড্রেটিং ফেসিয়াল ক্লিনজার (২৩৭ মি.লি.)',
    category: 'medical',
    subcategory: 'skincare',
    price: 1650,
    discountPrice: 1450,
    rating: 4.9,
    reviewCount: 88,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    description: 'Dermatologist recommended cleanser with essential ceramides and hyaluronic acid for sensitive and dry skin.',
    descriptionBn: 'চর্মরোগ বিশেষজ্ঞদের দ্বারা স্বীকৃত ফেসওয়াশ। সংবেদনশীল ও শুষ্ক ত্বকের আর্দ্রতা বজায় রাখে।',
    isFeatured: true
  },
  {
    id: 'prod-10',
    name: 'Non-Contact Infrared Medical Thermometer',
    nameBn: 'ইনফ্রারেড নন-কন্টাক্ট মেজারমেন্ট থার্মোমিটার',
    category: 'medical',
    subcategory: 'medical-devices',
    price: 1200,
    discountPrice: 890,
    rating: 4.8,
    reviewCount: 65,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    description: 'High-precision non-contact forehead thermometer with color-coded fever warning screen.',
    descriptionBn: 'স্পর্শ ছাড়া মাত্র ১ সেকেন্ডে শরীরের নির্ভুল তাপমাত্রা মাপার ডিজিটাল থার্মোমিটার।'
  },
  {
    id: 'prod-11',
    name: 'Multivitamin & Zinc Health Gummies (60 Gummies)',
    nameBn: 'মাল্টিভিটামিন ও জিংক হেলথ গামিজ (৬০ পিস)',
    category: 'medical',
    subcategory: 'supplements',
    price: 1100,
    discountPrice: 920,
    rating: 4.82,
    reviewCount: 52,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=600&q=80',
    description: 'Daily health boost with Vitamin C, D3, B12 and Zinc for adults and kids above 12.',
    descriptionBn: 'দৈনন্দিন শারীরিক দুর্বলতা কাটাতে ও ইমিউনিটি বাড়াতে সুস্বাদু নিউট্রিশনাল গামিজ।'
  },
  {
    id: 'prod-12',
    name: 'Gentle Baby Lotion & Wash Set (200ml)',
    nameBn: 'জেন্টল বেবি লোশন ও ওয়াশ সেট (২০০ মি.লি.)',
    category: 'medical',
    subcategory: 'baby-care',
    price: 880,
    discountPrice: 750,
    rating: 4.9,
    reviewCount: 41,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    description: 'Hypoallergenic baby care kit free from parabens and harsh chemicals. Keeps baby skin ultra smooth.',
    descriptionBn: 'শিশুর কোমল ত্বকের নিবিড় যত্নে প্যারাবেন মুক্ত প্রাকৃতিক বেবি লোশন ও বডি ওয়াশ।'
  }
];

export const initialFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How does MBBS Doctor Consultation work on Ghorer Daktar?',
    questionBn: 'ঘরের ডাক্তার প্ল্যাটফর্মে ডাক্তার কনসালটেশন কিভাবে কাজ করে?',
    answer: 'Select your preferred doctor, click "Book Now", choose a convenient date/time, and pay or confirm via WhatsApp. The doctor will contact you for a video or audio session at the scheduled time.',
    answerBn: 'আপনার পছন্দের ডাক্তার সিলেক্ট করে "Book Now" বাটনে ক্লিক করুন। সুবিধাজনক তারিখ ও সময় নির্বাচন করে হোয়াটসঅ্যাপে অ্যাপয়েন্টমেন্ট কনফার্ম করুন। নির্ধারিত সময়ে ডাক্তার সরাসরি অডিও/ভিডিও কলে যুক্ত হবেন।',
    category: 'doctor'
  },
  {
    id: 'faq-2',
    question: 'Are your organic products 100% pure and certified?',
    questionBn: 'আপনাদের অর্গানিক প্রোডাক্টগুলো কি ১০০% খাঁটি ও পরীক্ষিত?',
    answer: 'Yes! All organic items like Sundarban Honey, Black Seed Oil, and Olive Oil are lab tested, ethically sourced, and free from artificial preservatives.',
    answerBn: 'হ্যাঁ! আমাদের প্রতিটি অর্গানিক পণ্য সরাসরি উৎস থেকে সরাসরি সংগৃহীত এবং ল্যাব দ্বারা পরীক্ষিত। কোনো কৃত্রিম প্রিজারভেটিভ বা ভেজাল নেই।',
    category: 'organic'
  },
  {
    id: 'faq-3',
    question: 'What are the delivery charges and delivery time in Bangladesh?',
    questionBn: 'ডেলিভারি চার্জ কত এবং কতদিনের মধ্যে পণ্য পাওয়া যাবে?',
    answer: 'Inside Dhaka delivery charge is ৳60 (1-2 Days). Outside Dhaka delivery charge is ৳120 (2-4 Days). Express same day delivery is available in Dhaka.',
    answerBn: 'ঢাকার ভেতরে ডেলিভারি চার্জ ৬০ টাকা (১-২ দিন)। ঢাকার বাইরে চার্জ ১২০ টাকা (২-৪ দিন)। ক্যাশ অন ডেলিভারি সুবিধা রয়েছে।',
    category: 'delivery'
  },
  {
    id: 'faq-4',
    question: 'Can I pay via Cash on Delivery (COD) or bKash?',
    questionBn: 'আমি কি ক্যাশ অন ডেলিভারি নাকি বিকাশ/নগদে মূল্য পরিশোধ করতে পারব?',
    answer: 'We support Cash on Delivery (COD), bKash, Nagad, Rocket, and Debit/Credit Cards across Bangladesh.',
    answerBn: 'আপনি ক্যাশ অন ডেলিভারির পাশাপাশি বিকাশ, নগদ, রকেট ও কার্ডের মাধ্যমে নিরাপদে পেমেন্ট করতে পারবেন।',
    category: 'payment'
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'কামরুল হাসান (Kamrul Hasan)',
    role: 'শিক্ষক',
    location: 'ধানমণ্ডি, ঢাকা',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: 'ডাঃ সারা রহমানের সাথে অনলাইনে কনসালটেশন নিয়ে আমি অত্যন্ত সন্তুষ্ট। প্রেসক্রিপশন সাথে সাথেই হোয়াটসঅ্যাপে পেয়ে গেছি। সার্ভিস অসাধারণ!',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'নাসরিন সুলতানা (Nasrin Sultana)',
    role: 'গৃহিণী',
    location: 'গুলশান, ঢাকা',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    comment: 'সুন্দরবনের খাঁটি মধু ও ডিজিটাল বিপি মনিটর অর্ডার করেছিলাম। ১ দিনের মধ্যে অরিজিনাল প্রোডাক্ট পেয়েছি। খাঁটি জিনিস পাওয়ার বিশ্বস্ত জায়গা।',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'আরিফুর রহমান (Arifur Rahman)',
    role: 'আইটি প্রফেশনাল',
    location: 'চট্টগ্রাম',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    comment: 'ঢাকার বাইরে চট্টগ্রামেও মাত্র ৩ দিনে কোল্ড প্রেসড কালোজিরা তেল হাতে পেলাম। ঘরের ডাক্তার পরিবারের জন্য এক দারুণ উপহার।',
    rating: 5
  }
];

export const initialCoupons: Coupon[] = [
  { code: 'HEALTH10', discountPercent: 10, minSpend: 500, active: true },
  { code: 'GHORER20', discountPercent: 20, minSpend: 1500, active: true }
];

export const initialDistricts = [
  { name: 'Dhaka', nameBn: 'ঢাকা', division: 'Dhaka', isInsideDhaka: true, deliveryCharge: 60, isEnabled: true },
  { name: 'Gazipur', nameBn: 'গাজীপুর', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Tangail', nameBn: 'টাঙ্গাইল', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Faridpur', nameBn: 'ফরিদপুর', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Gopalganj', nameBn: 'গোপালগঞ্জ', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Madaripur', nameBn: 'মাদারীপুর', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Manikganj', nameBn: 'মানিকগঞ্জ', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Narsingdi', nameBn: 'নরসিংদী', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Rajbari', nameBn: 'রাজবাড়ী', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Shariatpur', nameBn: 'শরীয়তপুর', division: 'Dhaka', isInsideDhaka: false, isEnabled: true },
  { name: 'Chattogram', nameBn: 'চট্টগ্রাম', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: "Cox's Bazar", nameBn: 'কক্সবাজার', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: 'Comilla', nameBn: 'কুমিল্লা', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: 'Feni', nameBn: 'ফেনী', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: 'Noakhali', nameBn: 'নোয়াখালী', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: 'Chandpur', nameBn: 'চাঁদপুর', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: 'Rangamati', nameBn: 'রাঙ্গামাটি', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: 'Bandarban', nameBn: 'বান্দরবান', division: 'Chattogram', isInsideDhaka: false, isEnabled: true },
  { name: 'Rajshahi', nameBn: 'রাজশাহী', division: 'Rajshahi', isInsideDhaka: false, isEnabled: true },
  { name: 'Bogura', nameBn: 'বগুড়া', division: 'Rajshahi', isInsideDhaka: false, isEnabled: true },
  { name: 'Pabna', nameBn: 'পাবনা', division: 'Rajshahi', isInsideDhaka: false, isEnabled: true },
  { name: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', division: 'Rajshahi', isInsideDhaka: false, isEnabled: true },
  { name: 'Natore', nameBn: 'নাটোর', division: 'Rajshahi', isInsideDhaka: false, isEnabled: true },
  { name: 'Naogaon', nameBn: 'নওগাঁ', division: 'Rajshahi', isInsideDhaka: false, isEnabled: true },
  { name: 'Joypurhat', nameBn: 'জয়পুরহাট', division: 'Rajshahi', isInsideDhaka: false, isEnabled: true },
  { name: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi', isInsideDhaka: false, isEnabled: true },
  { name: 'Khulna', nameBn: 'খুলনা', division: 'Khulna', isInsideDhaka: false, isEnabled: true },
  { name: 'Jashore', nameBn: 'যশোর', division: 'Khulna', isInsideDhaka: false, isEnabled: true },
  { name: 'Kushtia', nameBn: 'কুষ্টিয়া', division: 'Khulna', isInsideDhaka: false, isEnabled: true },
  { name: 'Satkhira', nameBn: 'সাতক্ষীরা', division: 'Khulna', isInsideDhaka: false, isEnabled: true },
  { name: 'Bagerhat', nameBn: 'বাগেরহাট', division: 'Khulna', isInsideDhaka: false, isEnabled: true },
  { name: 'Jhenaidah', nameBn: 'ঝিনাইদহ', division: 'Khulna', isInsideDhaka: false, isEnabled: true },
  { name: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', division: 'Khulna', isInsideDhaka: false, isEnabled: true },
  { name: 'Magura', nameBn: 'মাগুরা', division: 'Khulna', isInsideDhaka: false, isEnabled: true },
  { name: 'Narail', nameBn: 'নড়াইল', division: 'Khulna', isInsideDhaka: false, isEnabled: true },
  { name: 'Meherpur', nameBn: 'মেহেরপুর', division: 'Khulna', isInsideDhaka: false, isEnabled: true },
  { name: 'Barishal', nameBn: 'বরিশাল', division: 'Barishal', isInsideDhaka: false, isEnabled: true },
  { name: 'Patuakhali', nameBn: 'পটুয়াখালী', division: 'Barishal', isInsideDhaka: false, isEnabled: true },
  { name: 'Bhola', nameBn: 'ভোলা', division: 'Barishal', isInsideDhaka: false, isEnabled: true },
  { name: 'Pirojpur', nameBn: 'পিরোজপুর', division: 'Barishal', isInsideDhaka: false, isEnabled: true },
  { name: 'Barguna', nameBn: 'বরগুনা', division: 'Barishal', isInsideDhaka: false, isEnabled: true },
  { name: 'Jhalokathi', nameBn: 'ঝালকাঠি', division: 'Barishal', isInsideDhaka: false, isEnabled: true },
  { name: 'Sylhet', nameBn: 'সিলেট', division: 'Sylhet', isInsideDhaka: false, isEnabled: true },
  { name: 'Moulvibazar', nameBn: 'মৌলভীবাজার', division: 'Sylhet', isInsideDhaka: false, isEnabled: true },
  { name: 'Sunamganj', nameBn: 'সুনামগঞ্জ', division: 'Sylhet', isInsideDhaka: false, isEnabled: true },
  { name: 'Habiganj', nameBn: 'হবিগঞ্জ', division: 'Sylhet', isInsideDhaka: false, isEnabled: true },
  { name: 'Rangpur', nameBn: 'রংপুর', division: 'Rangpur', isInsideDhaka: false, isEnabled: true },
  { name: 'Dinajpur', nameBn: 'দিনাজপুর', division: 'Rangpur', isInsideDhaka: false, isEnabled: true },
  { name: 'Gaibandha', nameBn: 'গাইবান্ধা', division: 'Rangpur', isInsideDhaka: false, isEnabled: true },
  { name: 'Kurigram', nameBn: 'কুড়িগ্রাম', division: 'Rangpur', isInsideDhaka: false, isEnabled: true },
  { name: 'Nilphamari', nameBn: 'নীলফামারী', division: 'Rangpur', isInsideDhaka: false, isEnabled: true },
  { name: 'Lalmonirhat', nameBn: 'লালমনিরহাট', division: 'Rangpur', isInsideDhaka: false, isEnabled: true },
  { name: 'Panchagarh', nameBn: 'পঞ্চগড়', division: 'Rangpur', isInsideDhaka: false, isEnabled: true },
  { name: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', division: 'Rangpur', isInsideDhaka: false, isEnabled: true },
  { name: 'Mymensingh', nameBn: 'ময়মনসিংহ', division: 'Mymensingh', isInsideDhaka: false, isEnabled: true },
  { name: 'Jamalpur', nameBn: 'জামালপুর', division: 'Mymensingh', isInsideDhaka: false, isEnabled: true },
  { name: 'Netrokona', nameBn: 'নেত্রকোণা', division: 'Mymensingh', isInsideDhaka: false, isEnabled: true },
  { name: 'Sherpur', nameBn: 'শেরপুর', division: 'Mymensingh', isInsideDhaka: false, isEnabled: true }
];

export const initialPostOffices = [
  // Dhaka
  { districtName: 'Dhaka', postOfficeName: 'Dhanmondi', postOfficeNameBn: 'ধানমন্ডি', postCode: '1205', isEnabled: true },
  { districtName: 'Dhaka', postOfficeName: 'Mirpur', postOfficeNameBn: 'মিরপুর', postCode: '1216', isEnabled: true },
  { districtName: 'Dhaka', postOfficeName: 'Gulshan', postOfficeNameBn: 'গুলশান', postCode: '1212', isEnabled: true },
  { districtName: 'Dhaka', postOfficeName: 'Uttara', postOfficeNameBn: 'উত্তরা', postCode: '1230', isEnabled: true },
  { districtName: 'Dhaka', postOfficeName: 'Motijheel GPO', postOfficeNameBn: 'মতিঝিল জিপিও', postCode: '1000', isEnabled: true },
  { districtName: 'Dhaka', postOfficeName: 'Mohammadpur', postOfficeNameBn: 'মোহাম্মদপুর', postCode: '1207', isEnabled: true },
  { districtName: 'Dhaka', postOfficeName: 'Banani', postOfficeNameBn: 'বনানী', postCode: '1213', isEnabled: true },
  { districtName: 'Dhaka', postOfficeName: 'Tejgaon', postOfficeNameBn: 'তেজগাঁও', postCode: '1215', isEnabled: true },
  { districtName: 'Dhaka', postOfficeName: 'Badda', postOfficeNameBn: 'বাড্ডা', postCode: '1212', isEnabled: true },
  { districtName: 'Dhaka', postOfficeName: 'Savar', postOfficeNameBn: 'সাভার', postCode: '1340', isEnabled: true },
  { districtName: 'Dhaka', postOfficeName: 'Keraniganj', postOfficeNameBn: 'কেরানীগঞ্জ', postCode: '1310', isEnabled: true },

  // Chattogram
  { districtName: 'Chattogram', postOfficeName: 'Agrabad', postOfficeNameBn: 'আগ্রাবাদ', postCode: '4100', isEnabled: true },
  { districtName: 'Chattogram', postOfficeName: 'GEC Circle', postOfficeNameBn: 'জিইসি মোড়', postCode: '4000', isEnabled: true },
  { districtName: 'Chattogram', postOfficeName: 'Halishahar', postOfficeNameBn: 'হালি শহর', postCode: '4216', isEnabled: true },
  { districtName: 'Chattogram', postOfficeName: 'Kotwali', postOfficeNameBn: 'কোতোয়ালী', postCode: '4000', isEnabled: true },

  // Gazipur
  { districtName: 'Gazipur', postOfficeName: 'Gazipur Sadar', postOfficeNameBn: 'গাজীপুর সদর', postCode: '1700', isEnabled: true },
  { districtName: 'Gazipur', postOfficeName: 'Tongi', postOfficeNameBn: 'টঙ্গী', postCode: '1710', isEnabled: true },

  // Narayanganj
  { districtName: 'Narayanganj', postOfficeName: 'Narayanganj Head Office', postOfficeNameBn: 'নারায়ণগঞ্জ হেড অফিস', postCode: '1400', isEnabled: true },
  { districtName: 'Narayanganj', postOfficeName: 'Siddhirganj', postOfficeNameBn: 'সিদ্ধিরগঞ্জ', postCode: '1430', isEnabled: true },

  // Sylhet
  { districtName: 'Sylhet', postOfficeName: 'Zindabazar Head Office', postOfficeNameBn: 'জিন্দাবাজার হেড অফিস', postCode: '3100', isEnabled: true },
  { districtName: 'Sylhet', postOfficeName: 'Amberkhana', postOfficeNameBn: 'আম্বরখানা', postCode: '3100', isEnabled: true },

  // Rajshahi
  { districtName: 'Rajshahi', postOfficeName: 'Rajshahi GPO', postOfficeNameBn: 'রাজশাহী জিপিও', postCode: '6000', isEnabled: true },
  { districtName: 'Rajshahi', postOfficeName: 'Ghoramara', postOfficeNameBn: 'ঘোড়ামারা', postCode: '6100', isEnabled: true },

  // Khulna
  { districtName: 'Khulna', postOfficeName: 'Khulna GPO', postOfficeNameBn: 'খুলনা জিপিও', postCode: '9100', isEnabled: true },
  { districtName: 'Khulna', postOfficeName: 'Daulatpur', postOfficeNameBn: 'দৌলতপুর', postCode: '9202', isEnabled: true },

  // Barishal
  { districtName: 'Barishal', postOfficeName: 'Barishal Sadar', postOfficeNameBn: 'বরিশাল সদর', postCode: '8200', isEnabled: true },

  // Rangpur
  { districtName: 'Rangpur', postOfficeName: 'Rangpur Head Office', postOfficeNameBn: 'রংপুর হেড অফিস', postCode: '5400', isEnabled: true },

  // Mymensingh
  { districtName: 'Mymensingh', postOfficeName: 'Mymensingh Sadar', postOfficeNameBn: 'ময়মনসিংহ সদর', postCode: '2200', isEnabled: true },

  // Comilla
  { districtName: 'Comilla', postOfficeName: 'Comilla Head Office', postOfficeNameBn: 'কুমিল্লা হেড অফিস', postCode: '3500', isEnabled: true },

  // Bogura
  { districtName: 'Bogura', postOfficeName: 'Bogura Head Office', postOfficeNameBn: 'বগুড়া হেড অফিস', postCode: '5800', isEnabled: true },

  // Jashore
  { districtName: 'Jashore', postOfficeName: 'Jashore Sadar', postOfficeNameBn: 'যশোর সদর', postCode: '7400', isEnabled: true },

  // Cox's Bazar
  { districtName: "Cox's Bazar", postOfficeName: "Cox's Bazar Sadar", postOfficeNameBn: 'কক্সবাজার সদর', postCode: '4700', isEnabled: true }
];
