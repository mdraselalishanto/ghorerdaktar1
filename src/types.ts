export type MainCategoryType = 'organic' | 'medical' | 'doctor';

export interface SubCategory {
  id: string;
  name: string;
  nameBn: string;
  image: string;
  count?: number;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  mainCategory: MainCategoryType;
  image: string;
  description: string;
  subcategories?: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  category: 'organic' | 'medical';
  subcategory: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  images?: string[];
  description: string;
  descriptionBn: string;
  isOrganic?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  badge?: string;
  specs?: Record<string, string>;
  benefits?: string[];
}

export interface Doctor {
  id: string;
  name: string;
  nameBn: string;
  degree: string;
  degreeBn: string;
  specialty: string;
  specialtyBn: string;
  experienceYears: number;
  consultationFee: number;
  availability: string;
  availabilityBn: string;
  photo: string;
  rating: number;
  totalConsultations: number;
  whatsappNumber?: string;
  bmdcReg?: string;
  about?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  problemDescription: string;
  preferredDate: string;
  preferredTimeSlot: string;
  consultationFee: number;
  paymentMethod?: 'bkash' | 'nagad' | 'rocket' | 'sslcommerz' | 'manual';
  paymentStatus?: 'Paid' | 'Pending' | 'Failed';
  transactionId?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  thana?: string;
  postOffice?: string;
  postCode?: string;
  villageRoad?: string;
  deliveryNote?: string;
  deliveryCharge: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card';
  transactionId?: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  confirmedAt?: string | null;
}

export interface District {
  id: number;
  name: string;
  nameBn: string;
  division?: string;
  isInsideDhaka: boolean;
  deliveryCharge?: number | null;
  isEnabled: boolean;
}

export interface PostOffice {
  id: number;
  districtId?: number;
  districtName: string;
  postOfficeName: string;
  postOfficeNameBn: string;
  postCode: string;
  isEnabled: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend: number;
  active: boolean;
}

export interface SiteSettings {
  whatsappNumber: string;
  hotline: string;
  email: string;
  address: string;
  deliveryChargeInsideDhaka: number;
  deliveryChargeOutsideDhaka: number;
  noticeBanner: string;
  heroHeadline: string;
  heroSubheadline: string;
}

export interface FAQ {
  id: string;
  question: string;
  questionBn: string;
  answer: string;
  answerBn: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  image: string;
  comment: string;
  rating: number;
}

export interface LandingPageOffer {
  quantity: number;
  label: string;
  price: number;
  savingsLabel?: string;
  isPopular?: boolean;
}

export interface LandingPageFAQ {
  question: string;
  answer: string;
}

export interface LandingPageReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  verified?: boolean;
  image?: string;
  date?: string;
}

export interface LandingPageData {
  id: string;
  productId: string;
  slug: string;
  title: string;
  headline: string;
  subheadline?: string;
  bannerUrl?: string;
  galleryImages?: string[];
  videoUrl?: string;
  benefits?: string[];
  features?: string[];
  faqs?: LandingPageFAQ[];
  reviews?: LandingPageReview[];
  buyMoreOffers?: LandingPageOffer[];
  countdownMinutes?: number;
  stockCount?: number;
  whatsappRedirectEnabled?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  fbPixelId?: string;
  gtmId?: string;
  canonicalUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  product?: Product;
}
