/* ============================================================
   SUPABASE CONFIG — supabase-config.js
   Shared credentials and helper functions for ALL pages.
   ============================================================ */

const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eKZx3549j8unaFOQaZNGlQ_IdVWH5BI'; // ← your anon public key

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

async function getRestaurants() {
  return sbFetch('restaurants?select=*&order=featured.desc,name.asc');
}

async function getRestaurant(slug) {
  const data = await sbFetch(
    `restaurants?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`
  );
  return data[0] || null;
}

async function getRestaurantMenu(restaurantSlug) {
  return sbFetch(
    `restaurant_menus?restaurant_slug=eq.${encodeURIComponent(restaurantSlug)}&select=*&order=category.asc,name.asc`
  );
}

/* ============================================================
   ATTRACTIONS — used by destinations.js, attraction-details.js
   ============================================================ */
const db = {

  async getAttraction(slug) {
    const data = await sbFetch(
      `attractions?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`
    );
    return data[0] || null;
  },

  async getSimilar(category, excludeSlug) {
    return sbFetch(
      `attractions?category=eq.${encodeURIComponent(category)}&slug=neq.${encodeURIComponent(excludeSlug)}&select=slug,name,county,category,difficulty,rating,review_count,price_min,price_max,image_hero&limit=3`
    );
  },

  async getAttractions() {
    return sbFetch(
      'attractions?select=slug,name,region,county,category,image_hero&order=name.asc'
    );
  },

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
   SPORTS DESTINATIONS — used by category.html
   ============================================================ */

/* Fetch all sports destinations, optionally filtered by sport */
async function getSportsDestinations(sport) {
  if (sport) {
    return sbFetch(
      `sports_destinations?sport=eq.${encodeURIComponent(sport)}&select=*&order=rating.desc`
    );
  }
  return sbFetch('sports_destinations?select=*&order=sport.asc,rating.desc');
}

/* Fetch a single sports destination by slug */
async function getSportsDestination(slug) {
  const data = await sbFetch(
    `sports_destinations?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`
  );
  return data[0] || null;
}

/* ============================================================
   ORDERS
   ============================================================ */

async function submitOrder(orderData) {
  return sbMutate('orders', 'POST', orderData);
}

/* ============================================================
   EVENTS
   ============================================================ */

async function getEvents() {
  const today = new Date().toISOString().split('T')[0];
  return sbFetch(
    `events?select=*&date=gte.${today}&order=date.asc`
  );
}

async function getEvent(slug) {
  const data = await sbFetch(
    `events?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`
  );
  return data[0] || null;
}

/* ============================================================
   HOTELS
   ============================================================ */

async function getHotels() {
  return sbFetch('hotels?select=*&order=featured.desc,name.asc');
}

async function getHotel(slug) {
  const data = await sbFetch(
    `hotels?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`
  );
  return data[0] || null;
}
