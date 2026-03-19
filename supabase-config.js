/* ============================================================
   SUPABASE CONFIG — supabase-config.js
   Updated with new publishable key format
   ============================================================ */

const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eKZx3549j8unaFOQaZNGlQ_IdVWH5BI';

/* ── Helper: build auth headers ── */
function sbHeaders() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };
}

/* ── Fetch a single attraction by slug ── */
async function getAttraction(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/attractions?slug=eq.${slug}&select=*&limit=1`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  const data = await res.json();
  return data[0] || null;
}

/* ── Fetch all attractions ── */
async function getAttractions() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/attractions?select=*&order=name.asc`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return await res.json();
}

/* ── Fetch similar attractions (same category, different slug) ── */
async function getSimilarAttractions(slug, category, limit = 3) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/attractions?category=eq.${encodeURIComponent(category)}&slug=neq.${slug}&select=slug,name,location,category,rating,price_min,image_hero&limit=${limit}`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return await res.json();
}

/* ── Fetch all restaurants ── */
async function getRestaurants() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/restaurants?select=*&order=featured.desc,name.asc`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return await res.json();
}

/* ── Fetch a single restaurant by slug ── */
async function getRestaurant(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/restaurants?slug=eq.${slug}&select=*&limit=1`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  const data = await res.json();
  return data[0] || null;
}

/* ── Expose as db object (backwards compatible) ── */
const db = {
  getAttraction,
  getAttractions,
  getSimilarAttractions,
  getRestaurants,
  getRestaurant
};
