import { pgTable, serial, text, integer, boolean, timestamp, real } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  phone: text('phone'),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameBn: text('name_bn').notNull(),
  category: text('category').notNull(), // 'organic' | 'medical'
  subcategory: text('subcategory').notNull(),
  price: integer('price').notNull(),
  discountPrice: integer('discount_price'),
  rating: real('rating').default(5.0),
  reviewCount: integer('review_count').default(1),
  stock: integer('stock').default(50),
  image: text('image').notNull(),
  description: text('description').notNull(),
  descriptionBn: text('description_bn').notNull(),
  isOrganic: boolean('is_organic').default(false),
  isBestSeller: boolean('is_bestseller').default(false),
  isFeatured: boolean('is_featured').default(false),
  badge: text('badge'),
  createdAt: timestamp('created_at').defaultNow()
});

export const doctors = pgTable('doctors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameBn: text('name_bn').notNull(),
  degree: text('degree').notNull(),
  degreeBn: text('degree_bn').notNull(),
  specialty: text('specialty').notNull(),
  specialtyBn: text('specialty_bn').notNull(),
  experienceYears: integer('experience_years').default(5),
  consultationFee: integer('consultation_fee').notNull(),
  availability: text('availability').notNull(),
  availabilityBn: text('availability_bn').notNull(),
  photo: text('photo').notNull(),
  rating: real('rating').default(4.9),
  totalConsultations: integer('total_consultations').default(0),
  bmdcReg: text('bmdc_reg'),
  about: text('about'),
  createdAt: timestamp('created_at').defaultNow()
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address').notNull(),
  district: text('district').notNull(),
  thana: text('thana'),
  postOffice: text('post_office'),
  postCode: text('post_code'),
  villageRoad: text('village_road'),
  deliveryNote: text('delivery_note'),
  deliveryCharge: integer('delivery_charge').notNull(),
  paymentMethod: text('payment_method').notNull(),
  transactionId: text('transaction_id'),
  items: text('items').notNull(), // JSON stringified items
  subtotal: integer('subtotal').notNull(),
  discount: integer('discount').default(0),
  couponCode: text('coupon_code'),
  total: integer('total').notNull(),
  status: text('status').default('Pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  confirmedAt: timestamp('confirmed_at')
});

export const districts = pgTable('districts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  nameBn: text('name_bn').notNull(),
  division: text('division').default('Dhaka'),
  isInsideDhaka: boolean('is_inside_dhaka').default(false).notNull(),
  deliveryCharge: integer('delivery_charge'),
  isEnabled: boolean('is_enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const postOffices = pgTable('post_offices', {
  id: serial('id').primaryKey(),
  districtId: integer('district_id'),
  districtName: text('district_name').notNull(),
  postOfficeName: text('post_office_name').notNull(),
  postOfficeNameBn: text('post_office_name_bn').notNull(),
  postCode: text('post_code').notNull(),
  isEnabled: boolean('is_enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const appointments = pgTable('appointments', {
  id: text('id').primaryKey(),
  doctorId: text('doctor_id').notNull(),
  doctorName: text('doctor_name').notNull(),
  patientName: text('patient_name').notNull(),
  patientPhone: text('patient_phone').notNull(),
  patientEmail: text('patient_email'),
  age: integer('age').notNull(),
  gender: text('gender').notNull(),
  problemDescription: text('problem_description').notNull(),
  preferredDate: text('preferred_date').notNull(),
  preferredTimeSlot: text('preferred_time_slot').notNull(),
  consultationFee: integer('consultation_fee').notNull(),
  paymentMethod: text('payment_method').default('bkash'),
  paymentStatus: text('payment_status').default('Paid').notNull(),
  transactionId: text('transaction_id'),
  status: text('status').default('Pending').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  whatsappNumber: text('whatsapp_number').notNull(),
  hotline: text('hotline').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  deliveryChargeInsideDhaka: integer('delivery_charge_inside_dhaka').notNull(),
  deliveryChargeOutsideDhaka: integer('delivery_charge_outside_dhaka').notNull(),
  noticeBanner: text('notice_banner').notNull(),
  heroHeadline: text('hero_headline').notNull(),
  heroSubheadline: text('hero_subheadline').notNull()
});

export const landingPages = pgTable('landing_pages', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  headline: text('headline').notNull(),
  subheadline: text('subheadline'),
  bannerUrl: text('banner_url'),
  galleryImages: text('gallery_images'), // JSON string array
  videoUrl: text('video_url'),
  benefits: text('benefits'), // JSON string array
  features: text('features'), // JSON string array
  faqs: text('faqs'), // JSON string array
  reviews: text('reviews'), // JSON string array
  buyMoreOffers: text('buy_more_offers'), // JSON string array
  countdownMinutes: integer('countdown_minutes').default(180),
  stockCount: integer('stock_count').default(15),
  whatsappRedirectEnabled: boolean('whatsapp_redirect_enabled').default(true),
  isFeatured: boolean('is_featured').default(true),
  isActive: boolean('is_active').default(true),

  // SEO & Marketing Pixels
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  ogImage: text('og_image'),
  fbPixelId: text('fb_pixel_id'),
  gtmId: text('gtm_id'),
  canonicalUrl: text('canonical_url'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
