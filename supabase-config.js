/* ============================================================
   SUPABASE CONFIG — supabase-config.js
   Shared credentials and helper functions for ALL pages.

   SETUP STEPS:
   1. Go to: https://supabase.com/dashboard/project/cbyipmrozqsntojiartw/settings/api
   2. Under "Project API Keys", copy the "anon public" key
   3. Paste it below to replace YOUR_NEW_ANON_KEY_HERE
   4. Save and re-deploy to GitHub Pages

   !! SECURITY REMINDER !!
   Only ever use the "anon public" key in frontend code.
   The "service_role" key must NEVER appear in frontend/client code.
   ============================================================ */

const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'YOUR_NEW_ANON_KEY_HERE'; // ← paste your anon public key here

/* ============================================================
   ROW LEVEL SECURITY
   Your tables need public read policies for data to load.
   Run these once in Supabase Dashboard → SQL Editor:

   -- Allow anyone to read restaurants
   CREATE POLICY "public_read_restaurants" ON restaurants
     FOR SELECT USING (true);

   -- Allow anyone to read attractions
   CREATE POLICY "public_read_attractions" ON attractions
     FOR SELECT USING (true);

   -- Allow anyone to read restaurant menus
   CREATE POLICY "public_read_restaurant_menus" ON restaurant_menus
     FOR SELECT USING (true);

   -- Allow anyone to submit orders
   CREATE POLICY "public_insert_orders" ON orders
     FOR INSERT WITH CHECK (true);
   ============================================================ */

/* ── Shared fetch helper ───────────────────────────────────── */
async function sbFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey:        SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Supabase ${res.status}: ${errText}`);
  }

  return res.json();
}

/* ── POST / PATCH / DELETE helper ─────────────────────────── */
async function sbMutate(path, method = 'POST', body = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey:         SUPABASE_KEY,
      Authorization:  `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer:         'return=representation'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Supabase ${res.status}: ${errText}`);
  }

  return res.json();
}

/* ============================================================
   RESTAURANTS
   ============================================================ */

/* Fetch all restaurants — ordered featured first, then A–Z */
async function getRestaurants() {
  return sbFetch('restaurants?select=*&order=featured.desc,name.asc');
}

/* Fetch a single restaurant by slug */
async function getRestaurant(slug) {
  const data = await sbFetch(
    `restaurants?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`
  );
  return data[0] || null;
}

/* Fetch menu items for a restaurant */
async function getRestaurantMenu(restaurantSlug) {
  return sbFetch(
    `restaurant_menus?restaurant_slug=eq.${encodeURIComponent(restaurantSlug)}&select=*&order=category.asc,name.asc`
  );
}

/* ============================================================
   ATTRACTIONS — used by destinations.js, attraction-details.js
   ============================================================ */
const db = {

  /* Fetch a single attraction by slug */
  async getAttraction(slug) {
    const data = await sbFetch(
      `attractions?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`
    );
    return data[0] || null;
  },

  /* Fetch similar attractions (same category, exclude current) */
  async getSimilar(category, excludeSlug) {
    return sbFetch(
      `attractions?category=eq.${encodeURIComponent(category)}&slug=neq.${encodeURIComponent(excludeSlug)}&select=slug,name,county,category,difficulty,rating,review_count,price_min,price_max,image_hero&limit=3`
    );
  },

  /* Fetch all attractions (used by homepage search suggestions) */
  async getAttractions() {
    return sbFetch(
      'attractions?select=slug,name,region,county,category,image_hero&order=name.asc'
    );
  },

  /* Fetch attractions filtered by category slug */
  async getAttractionsByCategory(categorySlug) {
    const categoryMap = {
      'big-five':  'Big Five Safari',
      'birds':     'Bird Watching',
      'mountain':  'Mountain Treks',
      'beach':     'Beach Escapes',
      'cultural':  'Cultural Tours',
      'adventure': 'Adventure Sports'
    };
    const category = categoryMap[categorySlug] || categorySlug;
    return sbFetch(
      `attractions?category=eq.${encodeURIComponent(category)}&select=*&order=rating.desc`
    );
  }
};

/* ============================================================
   ORDERS
   ============================================================ */

/* Submit a new order */
async function submitOrder(orderData) {
  return sbMutate('orders', 'POST', orderData);
}

/* ============================================================
   EVENTS (for events.html when it's built)
   ============================================================ */

/* Fetch all upcoming events */
async function getEvents() {
  const today = new Date().toISOString().split('T')[0];
  return sbFetch(
    `events?select=*&date=gte.${today}&order=date.asc`
  );
}

/* Fetch a single event by slug */
async function getEvent(slug) {
  const data = await sbFetch(
    `events?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`
  );
  return data[0] || null;
}

/* ============================================================
   HOTELS (for hotels.html when it's built)
   ============================================================ */

/* Fetch all hotels */
async function getHotels() {
  return sbFetch('hotels?select=*&order=featured.desc,name.asc');
}

/* Fetch a single hotel by slug */
async function getHotel(slug) {
  const data = await sbFetch(
    `hotels?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`
  );
  return data[0] || null;
}
