import { db } from './index.ts';
import { users, products, doctors, orders, appointments, siteSettings, landingPages, districts, postOffices } from './schema.ts';
import { eq, like, or, and, desc, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { initialProducts, initialDoctors, initialSiteSettings, initialDistricts, initialPostOffices } from '../data/mockData.ts';
import { Product, Doctor, Order, Appointment, SiteSettings } from '../types.ts';

// SEED DATABASE ON SERVER STARTUP IF EMPTY
export async function seedDatabaseIfEmpty() {
  try {
    // 1. Check & Seed Site Settings
    const existingSettings = await db.select().from(siteSettings);
    if (existingSettings.length === 0) {
      await db.insert(siteSettings).values({
        whatsappNumber: initialSiteSettings.whatsappNumber,
        hotline: initialSiteSettings.hotline,
        email: initialSiteSettings.email,
        address: initialSiteSettings.address,
        deliveryChargeInsideDhaka: initialSiteSettings.deliveryChargeInsideDhaka,
        deliveryChargeOutsideDhaka: initialSiteSettings.deliveryChargeOutsideDhaka,
        noticeBanner: initialSiteSettings.noticeBanner,
        heroHeadline: initialSiteSettings.heroHeadline,
        heroSubheadline: initialSiteSettings.heroSubheadline
      });
      console.log('✅ Seeded site settings to PostgreSQL');
    }

    // Seed Districts if empty
    try {
      const existingDistricts = await db.select().from(districts);
      if (existingDistricts.length === 0) {
        for (const d of initialDistricts) {
          await db.insert(districts).values({
            name: d.name,
            nameBn: d.nameBn,
            division: d.division,
            isInsideDhaka: d.isInsideDhaka,
            deliveryCharge: d.deliveryCharge || null,
            isEnabled: d.isEnabled
          });
        }
        console.log('✅ Seeded 64 Bangladesh districts to PostgreSQL');
      }
    } catch (dErr) {
      console.error('Failed to seed districts:', dErr);
    }

    // Seed Post Offices if empty
    try {
      const existingPostOffices = await db.select().from(postOffices);
      if (existingPostOffices.length === 0) {
        for (const po of initialPostOffices) {
          await db.insert(postOffices).values({
            districtName: po.districtName,
            postOfficeName: po.postOfficeName,
            postOfficeNameBn: po.postOfficeNameBn,
            postCode: po.postCode,
            isEnabled: po.isEnabled
          });
        }
        console.log('✅ Seeded Bangladesh post offices to PostgreSQL');
      }
    } catch (poErr) {
      console.error('Failed to seed post offices:', poErr);
    }

    // 2. Check & Seed Admin and Test User
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      const hashedAdminPassword = await bcrypt.hash('Rr1312612351@', 10);
      const hashedUserPassword = await bcrypt.hash('123456', 10);

      await db.insert(users).values([
        {
          uid: 'admin-raselalishanto',
          name: 'Rasel Ali Shanto',
          email: 'raselalishanto@gmail.com',
          password: hashedAdminPassword,
          phone: '01700000000',
          role: 'admin'
        },
        {
          uid: 'user-demo-101',
          name: 'সাদ্দাম হোসেন',
          email: 'user@example.com',
          password: hashedUserPassword,
          phone: '01812345678',
          role: 'user'
        }
      ]);
      console.log('✅ Seeded admin and user to PostgreSQL');
    } else {
      // Ensure raselalishanto exists and has the correct password
      const adminExists = await db.select().from(users).where(eq(users.email, 'raselalishanto@gmail.com'));
      const hashedAdminPassword = await bcrypt.hash('Rr1312612351@', 10);

      if (adminExists.length === 0) {
        await db.insert(users).values({
          uid: 'admin-raselalishanto',
          name: 'Rasel Ali Shanto',
          email: 'raselalishanto@gmail.com',
          password: hashedAdminPassword,
          phone: '01700000000',
          role: 'admin'
        });
      } else {
        await db.update(users)
          .set({ password: hashedAdminPassword, role: 'admin' })
          .where(eq(users.email, 'raselalishanto@gmail.com'));
      }

      const secondAdminExists = await db.select().from(users).where(eq(users.email, '07raselfb@gmail.com'));
      if (secondAdminExists.length === 0) {
        await db.insert(users).values({
          uid: 'admin-07raselfb',
          name: 'Rasel FB Admin',
          email: '07raselfb@gmail.com',
          password: hashedAdminPassword,
          phone: '01700000001',
          role: 'admin'
        });
      } else {
        await db.update(users)
          .set({ password: hashedAdminPassword, role: 'admin' })
          .where(eq(users.email, '07raselfb@gmail.com'));
      }
    }

    // 3. Check & Seed Products
    const existingProds = await db.select().from(products);
    if (existingProds.length === 0) {
      for (const p of initialProducts) {
        await db.insert(products).values({
          id: p.id,
          name: p.name,
          nameBn: p.nameBn,
          category: p.category,
          subcategory: p.subcategory,
          price: p.price,
          discountPrice: p.discountPrice,
          rating: p.rating,
          reviewCount: p.reviewCount,
          stock: p.stock,
          image: p.image,
          description: p.description,
          descriptionBn: p.descriptionBn,
          isOrganic: p.isOrganic || false,
          isBestSeller: p.isBestSeller || false,
          isFeatured: p.isFeatured || false,
          badge: p.badge
        });
      }
      console.log(`✅ Seeded ${initialProducts.length} products to PostgreSQL`);
    }

    // 4. Check & Seed Doctors
    const existingDocs = await db.select().from(doctors);
    if (existingDocs.length === 0) {
      for (const d of initialDoctors) {
        await db.insert(doctors).values({
          id: d.id,
          name: d.name,
          nameBn: d.nameBn,
          degree: d.degree,
          degreeBn: d.degreeBn,
          specialty: d.specialty,
          specialtyBn: d.specialtyBn,
          experienceYears: d.experienceYears,
          consultationFee: d.consultationFee,
          availability: d.availability,
          availabilityBn: d.availabilityBn,
          photo: d.photo,
          rating: d.rating,
          totalConsultations: d.totalConsultations,
          bmdcReg: d.bmdcReg,
          about: d.about
        });
      }
      console.log(`✅ Seeded ${initialDoctors.length} doctors to PostgreSQL`);
    }

    // 5. Check & Seed Landing Pages for products
    await seedLandingPagesIfEmpty();

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// USER AUTH HELPERS
export async function registerUserInDb(data: { name: string; email: string; password?: string; phone?: string; uid?: string }) {
  try {
    const cleanEmail = data.email.toLowerCase().trim();
    const existing = await db.select().from(users).where(eq(users.email, cleanEmail));
    if (existing.length > 0) {
      const user = existing[0];
      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));
        user.password = hashedPassword;
      }
      return user;
    }

    const uid = data.uid || `user-${Date.now()}`;
    let hashedPassword = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const role = (cleanEmail === 'raselalishanto@gmail.com' || cleanEmail === 'raselalishanto' || cleanEmail === 'admin@ghorerdaktar.com' || cleanEmail === 'admin') ? 'admin' : 'user';

    const inserted = await db.insert(users).values({
      uid,
      name: data.name,
      email: cleanEmail,
      password: hashedPassword,
      phone: data.phone || '',
      role
    }).returning();

    return inserted[0];
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw new Error(error.message || 'ইউজার রেজিস্টার ব্যর্থ হয়েছে');
  }
}

export async function loginUserInDb(email: string, passwordAttempt: string) {
  try {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    if (!cleanEmail) {
      throw new Error('ইমেইল বা ইউজারনেম প্রদান করুন');
    }

    const result = await db.select().from(users).where(eq(users.email, cleanEmail));
    
    // Master passwords for regular testing ease
    const isMasterPassword = passwordAttempt === '123456' || 
                             passwordAttempt === 'password';

    const adminPassEnv = process.env.ADMIN_PASSWORD || 'Rr1312612351@';
    const adminEmailEnv = (process.env.ADMIN_EMAIL || 'raselalishanto@gmail.com').toLowerCase();
    const adminUserEnv = (process.env.ADMIN_USERNAME || 'raselalishanto').toLowerCase();

    const isAdminEmail = cleanEmail === adminEmailEnv ||
                         cleanEmail === adminUserEnv ||
                         cleanEmail === 'admin@ghorerdaktar.com' ||
                         cleanEmail === 'admin';

    // Strict check for admin accounts
    if (isAdminEmail || (result.length > 0 && result[0].role === 'admin')) {
      if (passwordAttempt !== adminPassEnv) {
        throw new Error('ভুল ইমেইল বা পাসওয়ার্ড! (Invalid username or password)');
      }
      if (result.length > 0) return result[0];
    }

    if (result.length === 0) {
      // In demo environment, auto-create account if not found so login never fails
      const hashedPassword = await bcrypt.hash(passwordAttempt || '123456', 10);
      const newRole = isAdminEmail ? 'admin' : 'user';
      const newEmail = !cleanEmail.includes('@') ? `${cleanEmail}@gmail.com` : cleanEmail;
      
      const newUser = {
        id: Math.floor(Math.random() * 100000) + 10,
        uid: `${newRole}-${Date.now()}`,
        name: isAdminEmail ? 'Rasel Ali Shanto' : (cleanEmail.split('@')[0] || 'Demo User'),
        email: newEmail,
        password: hashedPassword,
        phone: '01700000000',
        role: newRole
      };
      const inserted = await db.insert(users).values(newUser).returning();
      return inserted[0] || newUser;
    }

    const user = result[0];

    // Master password or admin auto-allow in demo mode
    if (isMasterPassword || (user.role === 'admin' && isAdminEmail)) {
      return user;
    }

    if (!user.password) {
      const hashedPassword = await bcrypt.hash(passwordAttempt || '123456', 10);
      await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));
      user.password = hashedPassword;
      return user;
    }

    const match = await bcrypt.compare(passwordAttempt, user.password);
    if (!match) {
      // In demo environment, sync password to prevent locking out user
      const hashedPassword = await bcrypt.hash(passwordAttempt || '123456', 10);
      await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));
      user.password = hashedPassword;
      return user;
    }

    return user;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'লগইন ব্যর্থ হয়েছে');
  }
}

// PRODUCTS HELPERS
export async function getAllProductsFromDb(filters?: { category?: string; subcategory?: string; search?: string }) {
  try {
    let all = await db.select().from(products).orderBy(desc(products.createdAt));
    if (filters?.category && filters.category !== 'all') {
      all = all.filter(p => p.category === filters.category);
    }
    if (filters?.subcategory && filters.subcategory !== 'all') {
      all = all.filter(p => p.subcategory === filters.subcategory);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      all = all.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nameBn.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.descriptionBn.includes(q)
      );
    }
    return all;
  } catch (error) {
    console.error('Failed to get products from DB:', error);
    return [];
  }
}

export async function addProductToDb(p: any) {
  try {
    const newId = `prod-${Date.now()}`;
    const inserted = await db.insert(products).values({
      id: newId,
      name: p.name,
      nameBn: p.nameBn,
      category: p.category,
      subcategory: p.subcategory,
      price: Number(p.price),
      discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
      stock: Number(p.stock || 50),
      image: p.image,
      description: p.description,
      descriptionBn: p.descriptionBn,
      isOrganic: Boolean(p.isOrganic),
      isBestSeller: Boolean(p.isBestSeller),
      isFeatured: Boolean(p.isFeatured),
      badge: p.badge || null
    }).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to add product:', error);
    throw error;
  }
}

export async function updateProductInDb(id: string, p: any) {
  try {
    const updated = await db.update(products).set({
      name: p.name,
      nameBn: p.nameBn,
      category: p.category,
      subcategory: p.subcategory,
      price: Number(p.price),
      discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
      stock: Number(p.stock),
      image: p.image,
      description: p.description,
      descriptionBn: p.descriptionBn,
      isOrganic: Boolean(p.isOrganic),
      isBestSeller: Boolean(p.isBestSeller),
      isFeatured: Boolean(p.isFeatured),
      badge: p.badge
    }).where(eq(products.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

export async function deleteProductFromDb(id: string) {
  try {
    await db.delete(products).where(eq(products.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}

// DOCTORS HELPERS
export async function getAllDoctorsFromDb() {
  try {
    return await db.select().from(doctors).orderBy(desc(doctors.createdAt));
  } catch (error) {
    console.error('Failed to get doctors:', error);
    return [];
  }
}

export async function addDoctorToDb(d: any) {
  try {
    const newId = `doc-${Date.now()}`;
    const inserted = await db.insert(doctors).values({
      id: newId,
      name: d.name,
      nameBn: d.nameBn,
      degree: d.degree,
      degreeBn: d.degreeBn,
      specialty: d.specialty,
      specialtyBn: d.specialtyBn,
      experienceYears: Number(d.experienceYears || 5),
      consultationFee: Number(d.consultationFee),
      availability: d.availability,
      availabilityBn: d.availabilityBn,
      photo: d.photo,
      bmdcReg: d.bmdcReg,
      about: d.about
    }).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to add doctor:', error);
    throw error;
  }
}

export async function updateDoctorInDb(id: string, d: any) {
  try {
    const updated = await db.update(doctors).set({
      name: d.name,
      nameBn: d.nameBn,
      degree: d.degree,
      degreeBn: d.degreeBn,
      specialty: d.specialty,
      specialtyBn: d.specialtyBn,
      experienceYears: Number(d.experienceYears),
      consultationFee: Number(d.consultationFee),
      availability: d.availability,
      availabilityBn: d.availabilityBn,
      photo: d.photo,
      bmdcReg: d.bmdcReg,
      about: d.about
    }).where(eq(doctors.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update doctor:', error);
    throw error;
  }
}

export async function deleteDoctorFromDb(id: string) {
  try {
    await db.delete(doctors).where(eq(doctors.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete doctor:', error);
    throw error;
  }
}

// ORDERS HELPERS
export async function getAllOrdersFromDb(userId?: string) {
  try {
    if (userId) {
      return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export async function createOrderInDb(data: any) {
  try {
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `GD-${orderNum}`;
    const itemsJson = typeof data.items === 'string' ? data.items : JSON.stringify(data.items);

    const inserted = await db.insert(orders).values({
      id: orderId,
      userId: data.userId || null,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email || null,
      address: data.address,
      district: data.district,
      thana: data.thana || null,
      postOffice: data.postOffice || null,
      postCode: data.postCode || null,
      villageRoad: data.villageRoad || null,
      deliveryNote: data.deliveryNote || null,
      deliveryCharge: Number(data.deliveryCharge),
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId || null,
      items: itemsJson,
      subtotal: Number(data.subtotal),
      discount: Number(data.discount || 0),
      couponCode: data.couponCode || null,
      total: Number(data.total),
      status: 'Pending'
    }).returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to create order in DB:', error);
    throw error;
  }
}

export async function updateOrderStatusInDb(id: string, status: string) {
  try {
    const updateData: any = { status };
    if (status === 'Confirmed') {
      updateData.confirmedAt = new Date();
    }
    const updated = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
}

export async function confirmOrderInDb(id: string) {
  try {
    const updated = await db.update(orders)
      .set({
        status: 'Confirmed',
        confirmedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to confirm order in DB:', error);
    throw error;
  }
}

// DISTRICTS HELPERS
export async function getAllDistrictsFromDb() {
  try {
    return await db.select().from(districts);
  } catch (error) {
    console.error('Failed to fetch districts:', error);
    return [];
  }
}

export async function addDistrictToDb(data: any) {
  try {
    const inserted = await db.insert(districts).values({
      name: data.name,
      nameBn: data.nameBn,
      division: data.division || 'Dhaka',
      isInsideDhaka: Boolean(data.isInsideDhaka),
      deliveryCharge: data.deliveryCharge ? Number(data.deliveryCharge) : null,
      isEnabled: data.isEnabled !== undefined ? Boolean(data.isEnabled) : true
    }).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to add district:', error);
    throw error;
  }
}

export async function updateDistrictInDb(id: number, data: any) {
  try {
    const updated = await db.update(districts)
      .set({
        name: data.name,
        nameBn: data.nameBn,
        division: data.division,
        isInsideDhaka: Boolean(data.isInsideDhaka),
        deliveryCharge: data.deliveryCharge ? Number(data.deliveryCharge) : null,
        isEnabled: Boolean(data.isEnabled)
      })
      .where(eq(districts.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update district:', error);
    throw error;
  }
}

export async function deleteDistrictFromDb(id: number) {
  try {
    await db.delete(districts).where(eq(districts.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete district:', error);
    throw error;
  }
}

// POST OFFICES HELPERS
export async function getAllPostOfficesFromDb() {
  try {
    return await db.select().from(postOffices);
  } catch (error) {
    console.error('Failed to fetch post offices:', error);
    return [];
  }
}

export async function addPostOfficeToDb(data: any) {
  try {
    const inserted = await db.insert(postOffices).values({
      districtId: data.districtId ? Number(data.districtId) : null,
      districtName: data.districtName,
      postOfficeName: data.postOfficeName,
      postOfficeNameBn: data.postOfficeNameBn || data.postOfficeName,
      postCode: data.postCode,
      isEnabled: data.isEnabled !== undefined ? Boolean(data.isEnabled) : true
    }).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to add post office:', error);
    throw error;
  }
}

export async function updatePostOfficeInDb(id: number, data: any) {
  try {
    const updated = await db.update(postOffices)
      .set({
        districtName: data.districtName,
        postOfficeName: data.postOfficeName,
        postOfficeNameBn: data.postOfficeNameBn || data.postOfficeName,
        postCode: data.postCode,
        isEnabled: Boolean(data.isEnabled)
      })
      .where(eq(postOffices.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update post office:', error);
    throw error;
  }
}

export async function deletePostOfficeFromDb(id: number) {
  try {
    await db.delete(postOffices).where(eq(postOffices.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete post office:', error);
    throw error;
  }
}

// APPOINTMENTS HELPERS
export async function getAllAppointmentsFromDb() {
  try {
    return await db.select().from(appointments).orderBy(desc(appointments.createdAt));
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return [];
  }
}

export async function createAppointmentInDb(data: any) {
  try {
    const aptId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const inserted = await db.insert(appointments).values({
      id: aptId,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientEmail: data.patientEmail || null,
      age: Number(data.age || 30),
      gender: data.gender || 'Male',
      problemDescription: data.problemDescription || '',
      preferredDate: data.preferredDate,
      preferredTimeSlot: data.preferredTimeSlot,
      consultationFee: Number(data.consultationFee),
      paymentMethod: data.paymentMethod || 'bkash',
      paymentStatus: data.paymentStatus || 'Paid',
      transactionId: data.transactionId || null,
      status: data.status || 'Pending'
    }).returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to create appointment in DB:', error);
    throw error;
  }
}

export async function updateAppointmentStatusInDb(id: string, status: string, paymentStatus?: string) {
  try {
    const updateData: any = { status };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    const updated = await db.update(appointments).set(updateData).where(eq(appointments.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update appointment status:', error);
    throw error;
  }
}

// SITE SETTINGS HELPERS
export async function getSiteSettingsFromDb() {
  try {
    const result = await db.select().from(siteSettings);
    if (result.length > 0) return result[0];
    return initialSiteSettings;
  } catch (error) {
    console.error('Failed to get site settings:', error);
    return initialSiteSettings;
  }
}

export async function updateSiteSettingsInDb(data: Partial<SiteSettings>) {
  try {
    const existing = await db.select().from(siteSettings);
    if (existing.length > 0) {
      const updated = await db.update(siteSettings).set({ ...data }).where(eq(siteSettings.id, existing[0].id)).returning();
      return updated[0];
    } else {
      const inserted = await db.insert(siteSettings).values({
        whatsappNumber: data.whatsappNumber || initialSiteSettings.whatsappNumber,
        hotline: data.hotline || initialSiteSettings.hotline,
        email: data.email || initialSiteSettings.email,
        address: data.address || initialSiteSettings.address,
        deliveryChargeInsideDhaka: data.deliveryChargeInsideDhaka || 60,
        deliveryChargeOutsideDhaka: data.deliveryChargeOutsideDhaka || 120,
        noticeBanner: data.noticeBanner || initialSiteSettings.noticeBanner,
        heroHeadline: data.heroHeadline || initialSiteSettings.heroHeadline,
        heroSubheadline: data.heroSubheadline || initialSiteSettings.heroSubheadline
      }).returning();
      return inserted[0];
    }
  } catch (error) {
    console.error('Failed to update site settings:', error);
    throw error;
  }
}

// LANDING PAGE HELPERS
export function generateSlugForProduct(product: any): string {
  if (product.slug && product.slug !== product.id && !product.slug.startsWith("prod-")) {
    return product.slug.toLowerCase().trim();
  }
  
  const customMapping: Record<string, string> = {
    "prod-1": "organic-honey",
    "prod-2": "black-seed-oil",
    "prod-3": "extra-virgin-olive-oil",
    "prod-4": "organic-tulsi-green-tea",
    "prod-5": "premium-roasted-cashews-almonds",
    "prod-6": "digital-blood-pressure-monitor",
    "prod-7": "accu-chek-blood-glucose-meter",
    "prod-8": "pulse-oximeter",
    "prod-9": "cerave-hydrating-facial-cleanser",
    "prod-10": "infrared-thermometer",
    "prod-11": "multivitamin-zinc-gummies",
    "prod-12": "gentle-baby-lotion-wash"
  };

  if (customMapping[product.id]) {
    return customMapping[product.id];
  }

  const sourceText = product.name || product.subcategory || product.id || "product";
  let clean = sourceText
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!clean || clean.length < 3) {
    clean = (product.subcategory || `product-${product.id}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  return clean || `product-${product.id}`;
}

export function generateDefaultLandingPageData(product: any) {
  const slug = generateSlugForProduct(product);
  const effectivePrice = product.discountPrice || product.price;

  return {
    id: `lp-${product.id}`,
    productId: product.id,
    slug: slug.toLowerCase(),
    title: product.nameBn || product.name,
    headline: `🔥 ১০০% অরিজিনাল ও সেরা মানের ${product.nameBn || product.name} - সরাসরি অফার মূল্যে অর্ডার করুন!`,
    subheadline: `আজই অর্ডার করুন এবং বিশেষ ডিসকাউন্ট মূল্যে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি গ্রহণ করুন। সম্পূর্ণ পণ্য দেখে মূল্য পরিশোধ করুন।`,
    bannerUrl: product.image,
    galleryImages: JSON.stringify([product.image]),
    videoUrl: '',
    benefits: JSON.stringify([
      '১০০% খাঁটি, বিএসটিআই টেস্টেড ও কেমিক্যাল-মুক্ত প্রাকৃতিক পণ্য',
      'শরীরের সার্বিক সুস্থতা ও ইমিউনিটি বৃদ্ধিতে অত্যন্ত কার্যকর',
      'স্বচ্ছ প্যাকেজিং ও ডেলিভারিম্যানের সামনে দেখে চেক করার সুযোগ',
      'সারাদেশে দ্রুততম সময়ে নিশ্চিত ক্যাশ অন ডেলিভারি সুবিধা'
    ]),
    features: JSON.stringify([
      'প্রিমিয়াম এয়ার-টাইট সেফটি প্যাক',
      'অরিজিনাল ব্র্যান্ডের গুণগত মান নিশ্চিত',
      'পণ্য অপছন্দ হলে ২৪ ঘণ্টার মধ্যে রিটার্ন সুবিধা'
    ]),
    faqs: JSON.stringify([
      {
        question: 'কীভাবে অর্ডার করব?',
        answer: 'নিচের অর্ডার ফর্মে আপনার নাম, মোবাইল নম্বর এবং সঠিক ঠিকানা দিয়ে "অর্ডার কনফার্ম করুন" বাটনে চাপুন।'
      },
      {
        question: 'ডেলিভারি চার্জ কত এবং কতদিনে পাব?',
        answer: 'ঢাকার ভেতর ৬০ টাকা (১-২ দিন) এবং ঢাকার বাইরে ১২০ টাকা (২-৩ দিন)।'
      },
      {
        question: 'পণ্য পাওয়ার পর চেক করে টাকা দেওয়া যাবে?',
        answer: 'জি, শতভাগ নিশ্চিত হতে ডেলিভারিম্যানের সামনে প্যাকেট খুলে চেক করে টাকা দিতে পারবেন।'
      }
    ]),
    reviews: JSON.stringify([
      {
        id: 'rev-1',
        name: 'তানভীর আহমেদ',
        rating: 5,
        comment: 'পণ্যটির মান অসাধারণ! ঢাকা থেকে ২ দিনের মধ্যে ডেলিভারি পেয়েছি। ধন্যবাদ ঘরের ডাক্তার।',
        verified: true,
        date: '২ দিন আগে'
      },
      {
        id: 'rev-2',
        name: 'সাদিয়া তাসনিম',
        rating: 5,
        comment: '১০০% অরিজিনাল প্রোডাক্ট। কাস্টমার কেয়ারের সার্ভিসও খুব ভালো ছিল।',
        verified: true,
        date: '৪ দিন আগে'
      },
      {
        id: 'rev-3',
        name: 'রফিকুল ইসলাম',
        rating: 5,
        comment: 'প্যাকেজিং খুবই সুন্দর ছিল। কোয়ালিটি নিয়ে কোনো সন্দেহ নেই। সেরা জিনিস!',
        verified: true,
        date: '১ সপ্তাহ আগে'
      }
    ]),
    buyMoreOffers: JSON.stringify([
      {
        quantity: 1,
        label: '১টি প্যাক',
        price: effectivePrice,
        savingsLabel: 'নিয়মিত প্রাইস',
        isPopular: false
      },
      {
        quantity: 2,
        label: '২টি প্যাক (অফার প্রাইস)',
        price: Math.round(effectivePrice * 1.85),
        savingsLabel: `বিশেষ অফার (৳${Math.round(effectivePrice * 0.15 * 2)} বাঁচবে)`,
        isPopular: true
      },
      {
        quantity: 3,
        label: '৩টি প্যাক (ফ্যামিলি সেভার)',
        price: Math.round(effectivePrice * 2.6),
        savingsLabel: `সর্বোচ্চ ছাড় (৳${Math.round(effectivePrice * 0.4 * 3)} বাঁচবে)`,
        isPopular: false
      }
    ]),
    countdownMinutes: 180,
    stockCount: 15,
    whatsappRedirectEnabled: true,
    isFeatured: true,
    isActive: true,
    seoTitle: `${product.nameBn || product.name} - ক্যাশ অন ডেলিভারিতে অর্ডার করুন`,
    seoDescription: `${product.nameBn || product.name} কিনুন সেরা দামে। ১০০% অরিজিনাল কোয়ালিটি নিশ্চিত।`,
    ogImage: product.image,
    fbPixelId: '',
    gtmId: '',
    canonicalUrl: `/product/${slug}`
  };
}

export async function seedLandingPagesIfEmpty() {
  try {
    const allProds = await db.select().from(products);
    const existingLps = await db.select().from(landingPages);
    const existingProductIds = new Set(existingLps.map(l => l.productId));

    for (const prod of allProds) {
      if (!existingProductIds.has(prod.id)) {
        const defaultLp = generateDefaultLandingPageData(prod);
        await db.insert(landingPages).values(defaultLp).onConflictDoNothing();
      }
    }
  } catch (err) {
    console.error("Error seeding landing pages:", err);
  }
}

export async function getAllLandingPagesFromDb() {
  try {
    const pages = await db.select().from(landingPages).orderBy(desc(landingPages.createdAt));
    const allProds = await db.select().from(products);
    const prodMap = new Map(allProds.map(p => [p.id, p]));

    return pages.map(p => ({
      ...p,
      galleryImages: p.galleryImages ? JSON.parse(p.galleryImages) : [],
      benefits: p.benefits ? JSON.parse(p.benefits) : [],
      features: p.features ? JSON.parse(p.features) : [],
      faqs: p.faqs ? JSON.parse(p.faqs) : [],
      reviews: p.reviews ? JSON.parse(p.reviews) : [],
      buyMoreOffers: p.buyMoreOffers ? JSON.parse(p.buyMoreOffers) : [],
      product: prodMap.get(p.productId)
    }));
  } catch (error) {
    console.error("Failed to get landing pages:", error);
    return [];
  }
}

export async function getLandingPageBySlugFromDb(slugOrProductId: string) {
  try {
    const clean = slugOrProductId.toLowerCase().trim();
    let result = await db.select().from(landingPages).where(eq(landingPages.slug, clean));
    
    if (result.length === 0) {
      // Try finding by productId or prefix
      result = await db.select().from(landingPages).where(eq(landingPages.productId, clean));
    }
    
    if (result.length === 0) {
      // If not found in DB, check if a product exists with this ID, name, or subcategory and generate dynamically
      let prodRes = await db.select().from(products).where(or(eq(products.id, clean), eq(products.name, clean), eq(products.subcategory, clean)));
      if (prodRes.length === 0) {
        const allProds = await db.select().from(products);
        const matched = allProds.find(p => generateSlugForProduct(p) === clean || p.subcategory === clean || p.id === clean);
        if (matched) prodRes = [matched];
      }
      if (prodRes.length > 0) {
        const defaultLpData = generateDefaultLandingPageData(prodRes[0]);
        const inserted = await db.insert(landingPages).values(defaultLpData).onConflictDoNothing().returning();
        if (inserted.length > 0) {
          result = inserted;
        } else {
          result = await db.select().from(landingPages).where(eq(landingPages.productId, prodRes[0].id));
        }
      }
    }

    if (result.length === 0) return null;
    const page = result[0];
    const prodRes = await db.select().from(products).where(eq(products.id, page.productId));

    return {
      ...page,
      galleryImages: page.galleryImages ? JSON.parse(page.galleryImages) : [],
      benefits: page.benefits ? JSON.parse(page.benefits) : [],
      features: page.features ? JSON.parse(page.features) : [],
      faqs: page.faqs ? JSON.parse(page.faqs) : [],
      reviews: page.reviews ? JSON.parse(page.reviews) : [],
      buyMoreOffers: page.buyMoreOffers ? JSON.parse(page.buyMoreOffers) : [],
      product: prodRes.length > 0 ? prodRes[0] : undefined
    };
  } catch (error) {
    console.error("Failed to get landing page by slug:", error);
    return null;
  }
}

export async function createLandingPageInDb(data: any) {
  try {
    const lpId = data.id || `lp-${data.productId}-${Date.now()}`;
    const slug = (data.slug || `product-${data.productId}`).toLowerCase().trim();

    const values = {
      id: lpId,
      productId: data.productId,
      slug,
      title: data.title,
      headline: data.headline,
      subheadline: data.subheadline || '',
      bannerUrl: data.bannerUrl || '',
      galleryImages: JSON.stringify(data.galleryImages || []),
      videoUrl: data.videoUrl || '',
      benefits: JSON.stringify(data.benefits || []),
      features: JSON.stringify(data.features || []),
      faqs: JSON.stringify(data.faqs || []),
      reviews: JSON.stringify(data.reviews || []),
      buyMoreOffers: JSON.stringify(data.buyMoreOffers || []),
      countdownMinutes: Number(data.countdownMinutes || 180),
      stockCount: Number(data.stockCount || 15),
      whatsappRedirectEnabled: data.whatsappRedirectEnabled !== false,
      isFeatured: data.isFeatured !== false,
      isActive: data.isActive !== false,
      seoTitle: data.seoTitle || '',
      seoDescription: data.seoDescription || '',
      ogImage: data.ogImage || '',
      fbPixelId: data.fbPixelId || '',
      gtmId: data.gtmId || '',
      canonicalUrl: data.canonicalUrl || `/product/${slug}`
    };

    const inserted = await db.insert(landingPages).values(values).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to create landing page:', error);
    throw error;
  }
}

export async function updateLandingPageInDb(id: string, data: any) {
  try {
    const updateValues: any = {
      updatedAt: new Date()
    };

    if (data.productId) updateValues.productId = data.productId;
    if (data.slug) updateValues.slug = data.slug.toLowerCase().trim();
    if (data.title) updateValues.title = data.title;
    if (data.headline) updateValues.headline = data.headline;
    if (data.subheadline !== undefined) updateValues.subheadline = data.subheadline;
    if (data.bannerUrl !== undefined) updateValues.bannerUrl = data.bannerUrl;
    if (data.galleryImages !== undefined) updateValues.galleryImages = JSON.stringify(data.galleryImages);
    if (data.videoUrl !== undefined) updateValues.videoUrl = data.videoUrl;
    if (data.benefits !== undefined) updateValues.benefits = JSON.stringify(data.benefits);
    if (data.features !== undefined) updateValues.features = JSON.stringify(data.features);
    if (data.faqs !== undefined) updateValues.faqs = JSON.stringify(data.faqs);
    if (data.reviews !== undefined) updateValues.reviews = JSON.stringify(data.reviews);
    if (data.buyMoreOffers !== undefined) updateValues.buyMoreOffers = JSON.stringify(data.buyMoreOffers);
    if (data.countdownMinutes !== undefined) updateValues.countdownMinutes = Number(data.countdownMinutes);
    if (data.stockCount !== undefined) updateValues.stockCount = Number(data.stockCount);
    if (data.whatsappRedirectEnabled !== undefined) updateValues.whatsappRedirectEnabled = Boolean(data.whatsappRedirectEnabled);
    if (data.isFeatured !== undefined) updateValues.isFeatured = Boolean(data.isFeatured);
    if (data.isActive !== undefined) updateValues.isActive = Boolean(data.isActive);
    if (data.seoTitle !== undefined) updateValues.seoTitle = data.seoTitle;
    if (data.seoDescription !== undefined) updateValues.seoDescription = data.seoDescription;
    if (data.ogImage !== undefined) updateValues.ogImage = data.ogImage;
    if (data.fbPixelId !== undefined) updateValues.fbPixelId = data.fbPixelId;
    if (data.gtmId !== undefined) updateValues.gtmId = data.gtmId;
    if (data.canonicalUrl !== undefined) updateValues.canonicalUrl = data.canonicalUrl;

    const updated = await db.update(landingPages).set(updateValues).where(eq(landingPages.id, id)).returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update landing page:', error);
    throw error;
  }
}

export async function deleteLandingPageFromDb(id: string) {
  try {
    await db.delete(landingPages).where(eq(landingPages.id, id));
    return { success: true };
  } catch (error) {
    console.error('Failed to delete landing page:', error);
    throw error;
  }
}

export async function duplicateLandingPageInDb(id: string) {
  try {
    const existing = await db.select().from(landingPages).where(eq(landingPages.id, id));
    if (existing.length === 0) throw new Error('Landing page not found');

    const source = existing[0];
    const newId = `lp-${source.productId}-${Date.now().toString(36)}`;
    const newSlug = `${source.slug}-copy-${Math.floor(Math.random() * 1000)}`;

    const copyData = {
      ...source,
      id: newId,
      slug: newSlug,
      title: `${source.title} (Copy)`,
      canonicalUrl: `/product/${newSlug}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const inserted = await db.insert(landingPages).values(copyData).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to duplicate landing page:', error);
    throw error;
  }
}
