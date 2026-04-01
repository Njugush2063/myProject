/* ============================================================
   SUPABASE CONFIG — supabase-config.js
   Shared credentials and helper functions for ALL pages.

   !! IMPORTANT — SECURITY FIX !!
   Your previous key was the SERVICE ROLE (admin) key.
   That key has been exposed publicly and must be regenerated immediately:
     1. Go to: Supabase Dashboard → Settings → API
     2. Under "Service Role", click Reveal → Regenerate (to invalidate the old one)
     3. Copy the "anon / public" key (the one labelled "anon public")
     4. Paste it below to replace YOUR_ANON_PUBLIC_KEY

   The anon key is safe to use in frontend code.
   The service_role key must NEVER appear in frontend code.
   ============================================================ */
const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eKZx3549j8unaFOQaZNGlQ_IdVWH5BI'; // ← Replace this with your anon key

/* ============================================================
   ROW LEVEL SECURITY REMINDER
   With the anon key, your Supabase tables need public read
   policies or data will return empty. Run these in the
   Supabase SQL Editor if you haven't already:

   CREATE POLICY "public_read_restaurants" ON restaurants
     FOR SELECT USING (true);

   CREATE POLICY "public_read_attractions" ON attractions
     FOR SELECT USING (true);

   CREATE POLICY "public_read_restaurant_menus" ON restaurant_menus
     FOR SELECT USING (true);

   CREATE POLICY "public_insert_orders" ON orders
     FOR INSERT WITH CHECK (true);
   ============================================================ */

/* ── Shared fetch helper ── */
async function sbFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
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

/* Fetch all restaurants */
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

/* ============================================================
   ATTRACTIONS — used by attraction-details.js and destinations.js
   ============================================================ */
const db = {

  /* Fetch a single attraction by slug */
  async getAttraction(slug) {
    const data = await sbFetch(
      `attractions?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`
    );
    return data[0] || null;
  },

  /* Fetch similar attractions (same category, exclude current slug) */
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

  /* Fetch attractions by category slug (used by category.html) */
  async getAttractionsByCategory(categorySlug) {
    /* Map URL slugs (e.g. "big-five") to DB category values (e.g. "Big Five Safari") */
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
