import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initialCategories, initialCoupons } from './src/data/mockData.ts';
import {
  seedDatabaseIfEmpty,
  getAllProductsFromDb,
  addProductToDb,
  updateProductInDb,
  deleteProductFromDb,
  getAllDoctorsFromDb,
  addDoctorToDb,
  updateDoctorInDb,
  deleteDoctorFromDb,
  getAllOrdersFromDb,
  createOrderInDb,
  updateOrderStatusInDb,
  confirmOrderInDb,
  getAllDistrictsFromDb,
  addDistrictToDb,
  updateDistrictInDb,
  deleteDistrictFromDb,
  getAllPostOfficesFromDb,
  addPostOfficeToDb,
  updatePostOfficeInDb,
  deletePostOfficeFromDb,
  getAllAppointmentsFromDb,
  createAppointmentInDb,
  updateAppointmentStatusInDb,
  getSiteSettingsFromDb,
  updateSiteSettingsInDb,
  registerUserInDb,
  loginUserInDb,
  getAllLandingPagesFromDb,
  getLandingPageBySlugFromDb,
  createLandingPageInDb,
  updateLandingPageInDb,
  deleteLandingPageFromDb,
  duplicateLandingPageInDb,
  generateDefaultLandingPageData
} from './src/db/helpers.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Seed PostgreSQL database on startup
  try {
    await seedDatabaseIfEmpty();
  } catch (err) {
    console.error('Error during database initialization:', err);
  }

  // API HEALTH CHECK
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'Ghorer Daktar SQL API', database: 'Cloud SQL PostgreSQL' });
  });

  // USER REGISTRATION
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone, uid } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'নাম এবং ইমেইল দেওয়া বাধ্যতামূলক' });
      }
      const user = await registerUserInDb({ name, email, password, phone, uid });
      res.status(201).json({
        success: true,
        user: { id: user.id, uid: user.uid, name: user.name, email: user.email, phone: user.phone, role: user.role }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে' });
    }
  });

  // USER LOGIN
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'ইমেইল ও পাসওয়ার্ড প্রদান করুন' });
      }
      const user = await loginUserInDb(email, password);
      res.json({
        success: true,
        token: `token-user-${user.uid}-${Date.now()}`,
        user: { id: user.id, uid: user.uid, name: user.name, email: user.email, phone: user.phone, role: user.role }
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'লগইন তথ্য সঠিক নয়' });
    }
  });

  // GET PRODUCTS (SQL backed)
  app.get('/api/products', async (req: Request, res: Response) => {
    try {
      const { category, subcategory, search, organic, featured, bestseller, sort } = req.query as any;
      let products = await getAllProductsFromDb({ category, subcategory, search });

      if (organic === 'true') {
        products = products.filter(p => p.isOrganic);
      }
      if (featured === 'true') {
        products = products.filter(p => p.isFeatured);
      }
      if (bestseller === 'true') {
        products = products.filter(p => p.isBestSeller);
      }

      if (sort === 'price-low') {
        products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (sort === 'price-high') {
        products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (sort === 'rating') {
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: 'পণ্য পাওয়ার ক্ষেত্রে ডাটাবেজ ত্রুটি' });
    }
  });

  // ADD PRODUCT (Admin - SQL)
  app.post('/api/products', async (req: Request, res: Response) => {
    try {
      const newProduct = await addProductToDb(req.body);
      
      // Auto-generate landing page for new product
      try {
        const defaultLp = generateDefaultLandingPageData(newProduct);
        await createLandingPageInDb(defaultLp);
      } catch (lpErr) {
        console.error('Failed to auto-generate landing page for product:', lpErr);
      }

      res.status(201).json(newProduct);
    } catch (err: any) {
      res.status(500).json({ error: 'পণ্য যোগ করতে সমস্যা হয়েছে' });
    }
  });

  // LANDING PAGES API
  app.get('/api/landing-pages', async (req: Request, res: Response) => {
    try {
      const pages = await getAllLandingPagesFromDb();
      res.json(pages);
    } catch (err) {
      res.status(500).json({ error: 'ল্যান্ডিং পেজ এর তথ্য পেতে সমস্যা হয়েছে' });
    }
  });

  app.get('/api/landing-pages/:slug', async (req: Request, res: Response) => {
    try {
      const page = await getLandingPageBySlugFromDb(req.params.slug);
      if (!page) {
        return res.status(404).json({ error: 'ল্যান্ডিং পেজ পাওয়া যায়নি' });
      }
      res.json(page);
    } catch (err) {
      res.status(500).json({ error: 'ল্যান্ডিং পেজ লোড করতে সমস্যা হয়েছে' });
    }
  });

  app.post('/api/landing-pages', async (req: Request, res: Response) => {
    try {
      const created = await createLandingPageInDb(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'ল্যান্ডিং পেজ তৈরি করা যায়নি' });
    }
  });

  app.put('/api/landing-pages/:id', async (req: Request, res: Response) => {
    try {
      const updated = await updateLandingPageInDb(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'ল্যান্ডিং পেজ আপডেট করা যায়নি' });
    }
  });

  app.delete('/api/landing-pages/:id', async (req: Request, res: Response) => {
    try {
      await deleteLandingPageFromDb(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'ল্যান্ডিং পেজ মুছে ফেলা যায়নি' });
    }
  });

  app.post('/api/landing-pages/:id/duplicate', async (req: Request, res: Response) => {
    try {
      const duplicated = await duplicateLandingPageInDb(req.params.id);
      res.json(duplicated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'ল্যান্ডিং পেজ ডুপ্লিকেট করা যায়নি' });
    }
  });

  // EDIT PRODUCT (Admin - SQL)
  app.put('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const updated = await updateProductInDb(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'পণ্য আপডেট করতে সমস্যা হয়েছে' });
    }
  });

  // DELETE PRODUCT (Admin - SQL)
  app.delete('/api/products/:id', async (req: Request, res: Response) => {
    try {
      await deleteProductFromDb(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'পণ্য মুছে ফেলতে সমস্যা হয়েছে' });
    }
  });

  // GET CATEGORIES
  app.get('/api/categories', (req: Request, res: Response) => {
    res.json(initialCategories);
  });

  // GET DOCTORS (SQL backed)
  app.get('/api/doctors', async (req: Request, res: Response) => {
    try {
      let docs = await getAllDoctorsFromDb();
      const { specialty, search } = req.query as any;

      if (specialty) {
        docs = docs.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
      }
      if (search) {
        const q = search.toLowerCase();
        docs = docs.filter(d => d.name.toLowerCase().includes(q) || d.nameBn.includes(q) || d.specialty.toLowerCase().includes(q));
      }

      res.json(docs);
    } catch (err) {
      res.status(500).json({ error: 'ডাক্তার ডাটা গ্রহণে সমস্যা হয়েছে' });
    }
  });

  // ADD DOCTOR (Admin - SQL)
  app.post('/api/doctors', async (req: Request, res: Response) => {
    try {
      const newDoc = await addDoctorToDb(req.body);
      res.status(201).json(newDoc);
    } catch (err) {
      res.status(500).json({ error: 'ডাক্তার যোগ করতে সমস্যা হয়েছে' });
    }
  });

  // UPDATE DOCTOR (Admin - SQL)
  app.put('/api/doctors/:id', async (req: Request, res: Response) => {
    try {
      const updated = await updateDoctorInDb(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'ডাক্তার তথ্য আপডেটে সমস্যা' });
    }
  });

  // DELETE DOCTOR (Admin - SQL)
  app.delete('/api/doctors/:id', async (req: Request, res: Response) => {
    try {
      await deleteDoctorFromDb(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'ডাক্তার মুছে ফেলা ব্যর্থ' });
    }
  });

  // CREATE APPOINTMENT (SQL)
  app.post('/api/appointments', async (req: Request, res: Response) => {
    try {
      const apt = await createAppointmentInDb(req.body);
      res.status(201).json(apt);
    } catch (err) {
      res.status(500).json({ error: 'অ্যাপয়েন্টমেন্ট তৈরি করতে সমস্যা হয়েছে' });
    }
  });

  // GET APPOINTMENTS (Admin - SQL)
  app.get('/api/appointments', async (req: Request, res: Response) => {
    try {
      const apts = await getAllAppointmentsFromDb();
      res.json(apts);
    } catch (err) {
      res.status(500).json({ error: 'অ্যাপয়েন্টমেন্ট ডাটা গ্রহণে সমস্যা' });
    }
  });

  // UPDATE APPOINTMENT STATUS (Admin - SQL)
  app.put('/api/appointments/:id/status', async (req: Request, res: Response) => {
    try {
      const updated = await updateAppointmentStatusInDb(req.params.id, req.body.status, req.body.paymentStatus);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'স্টেটাস আপডেট করতে সমস্যা' });
    }
  });

  // CREATE ORDER (SQL)
  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const order = await createOrderInDb(req.body);
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: 'অর্ডার সম্পাদন করতে সমস্যা হয়েছে' });
    }
  });

  // GET ORDERS (Admin / User - SQL)
  app.get('/api/orders', async (req: Request, res: Response) => {
    try {
      const { userId } = req.query as any;
      const orders = await getAllOrdersFromDb(userId);

      // Parse JSON stringified items for client convenience
      const parsed = orders.map(o => ({
        ...o,
        items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
      }));

      res.json(parsed);
    } catch (err) {
      res.status(500).json({ error: 'অর্ডার তালিকা আনতে সমস্যা' });
    }
  });

  // UPDATE ORDER STATUS (Admin - SQL)
  app.put('/api/orders/:id/status', async (req: Request, res: Response) => {
    try {
      const updated = await updateOrderStatusInDb(req.params.id, req.body.status);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'অর্ডার স্টেটাস আপডেট করা যায় নি' });
    }
  });

  // CONFIRM ORDER (Admin - SQL)
  app.post('/api/orders/:id/confirm', async (req: Request, res: Response) => {
    try {
      const updated = await confirmOrderInDb(req.params.id);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'অর্ডার কনফার্ম করতে সমস্যা হয়েছে' });
    }
  });

  // DISTRICTS MANAGEMENT ENDPOINTS
  app.get('/api/districts', async (req: Request, res: Response) => {
    try {
      const data = await getAllDistrictsFromDb();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'জেলাসমূহ পেতে সমস্যা' });
    }
  });

  app.post('/api/districts', async (req: Request, res: Response) => {
    try {
      const newDist = await addDistrictToDb(req.body);
      res.status(201).json(newDist);
    } catch (err) {
      res.status(500).json({ error: 'জেলা যোগ করতে সমস্যা' });
    }
  });

  app.put('/api/districts/:id', async (req: Request, res: Response) => {
    try {
      const updated = await updateDistrictInDb(Number(req.params.id), req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'জেলা তথ্য আপডেট ব্যর্থ' });
    }
  });

  app.delete('/api/districts/:id', async (req: Request, res: Response) => {
    try {
      await deleteDistrictFromDb(Number(req.params.id));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'জেলা মুছে ফেলা ব্যর্থ' });
    }
  });

  // POST OFFICES MANAGEMENT ENDPOINTS
  app.get('/api/post-offices', async (req: Request, res: Response) => {
    try {
      const data = await getAllPostOfficesFromDb();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'পোস্ট অফিসসমূহ পেতে সমস্যা' });
    }
  });

  app.post('/api/post-offices', async (req: Request, res: Response) => {
    try {
      const newPo = await addPostOfficeToDb(req.body);
      res.status(201).json(newPo);
    } catch (err) {
      res.status(500).json({ error: 'পোস্ট অফিস যোগ করতে সমস্যা' });
    }
  });

  app.put('/api/post-offices/:id', async (req: Request, res: Response) => {
    try {
      const updated = await updatePostOfficeInDb(Number(req.params.id), req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'পোস্ট অফিস আপডেট ব্যর্থ' });
    }
  });

  app.delete('/api/post-offices/:id', async (req: Request, res: Response) => {
    try {
      await deletePostOfficeFromDb(Number(req.params.id));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'পোস্ট অফিস মুছে ফেলা ব্যর্থ' });
    }
  });

  // APPLY COUPON
  app.post('/api/coupons/apply', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    const found = initialCoupons.find(c => c.code.toUpperCase() === code?.toUpperCase() && c.active);

    if (!found) {
      return res.status(400).json({ error: 'ইনভ্যালিড কুপন কোড' });
    }
    if (subtotal < found.minSpend) {
      return res.status(400).json({ error: `ন্যূনতম ৳${found.minSpend} টাকার অর্ডারে কুপন প্রযোজ্য` });
    }

    const discountAmount = Math.round((subtotal * found.discountPercent) / 100);
    res.json({
      valid: true,
      code: found.code,
      discountPercent: found.discountPercent,
      discountAmount
    });
  });

  // SITE SETTINGS (SQL)
  app.get('/api/settings', async (req: Request, res: Response) => {
    try {
      const settings = await getSiteSettingsFromDb();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: 'সেটিংস গ্রহণে সমস্যা' });
    }
  });

  app.post('/api/settings', async (req: Request, res: Response) => {
    try {
      const updated = await updateSiteSettingsInDb(req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'সেটিংস আপডেট ব্যর্থ' });
    }
  });

  // ADMIN LOGIN API
  app.post('/api/admin/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    const adminEmailEnv = (process.env.ADMIN_EMAIL || 'raselalishanto@gmail.com').toLowerCase();
    const adminUserEnv = (process.env.ADMIN_USERNAME || 'raselalishanto').toLowerCase();
    const adminPassEnv = process.env.ADMIN_PASSWORD || 'Rr1312612351@';

    const isAdminEmail = cleanEmail === adminUserEnv || 
                         cleanEmail === adminEmailEnv || 
                         cleanEmail === 'admin' || 
                         cleanEmail === 'admin@ghorerdaktar.com';
    const isMasterPassword = password === adminPassEnv;

    let dbUser = null;
    let isDbAdmin = false;
    try {
      if (isAdminEmail && isMasterPassword) {
        const user = await loginUserInDb(cleanEmail || adminEmailEnv, password || '');
        if (user && (user.role === 'admin' || isAdminEmail)) {
          isDbAdmin = true;
          dbUser = user;
        }
      }
    } catch (e) {
      // ignore
    }

    if ((isAdminEmail && isMasterPassword) || isDbAdmin) {
      res.json({
        success: true,
        token: `token-admin-${Date.now()}`,
        user: dbUser || { name: 'Rasel Ali Shanto', role: 'admin', email: cleanEmail.includes('@') ? cleanEmail : adminEmailEnv }
      });
    } else {
      res.status(401).json({ error: 'ভুল ইমেইল বা পাসওয়ার্ড! (Invalid username or password)' });
    }
  });

  // ADMIN DASHBOARD STATS (SQL)
  app.get('/api/admin/stats', async (req: Request, res: Response) => {
    try {
      const orders = await getAllOrdersFromDb();
      const products = await getAllProductsFromDb();
      const doctors = await getAllDoctorsFromDb();
      const appointments = await getAllAppointmentsFromDb();

      const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'Pending').length;
      const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;

      res.json({
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.length,
        totalDoctors: doctors.length,
        pendingAppointments,
        totalCustomers: new Set(orders.map(o => o.phone)).size + 10
      });
    } catch (err) {
      res.status(500).json({ error: 'স্ট্যাট ডাটা আনা ব্যর্থ' });
    }
  });

  // Vite middleware for dev or static files for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏥 Ghorer Daktar SQL Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
