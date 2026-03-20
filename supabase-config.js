/* ============================================================
   SUPABASE CONFIG — supabase-config.js
   Shared credentials and helper functions for ALL pages.
   !! Replace YOUR_ANON_PUBLIC_KEY with your actual anon key !!
   Find it in: Supabase Dashboard → Settings → API
   ============================================================ */

const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNieWlwbXJvenFzbnRvamlhcnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTE1NCwiZXhwIjoyMDg4OTc1MTU0fQ.8-lofBhuCiw78An17hUUak8iAkKu27ql71FWkLQv-8Y';

/* ── Shared fetch helper ── */
async function sbFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${res.statusText}`);
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
   ATTRACTIONS — used by attraction-details.js via `db` object
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
  }

};
