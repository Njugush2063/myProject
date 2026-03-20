/* ============================================================
   SUPABASE CONFIG — supabase-config.js
   Updated with new publishable key format
   ============================================================ */
const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNieWlwbXJvenFzbnRvamlhcnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTkxNTQsImV4cCI6MjA4ODk3NTE1NH0.31TAhmUCV_Uh0W8FGnR2_TLCZDU4YBM1U5LMSMc5JZs';

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

/* ── Fetch menu items for a restaurant by slug ── */
async function getRestaurantMenu(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/restaurant_menus?restaurant_slug=eq.${encodeURIComponent(slug)}&order=category.asc,popular.desc&select=*`,
    { headers: sbHeaders() }
  );
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return await res.json();
}

/* ── Save an order ── */
async function saveOrder(orderData) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/orders`,
    {
      method: 'POST',
      headers: { ...sbHeaders(), 'Prefer': 'return=representation' },
      body: JSON.stringify(orderData)
    }
  );
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return await res.json();
}

/* ── Expose as db object (backwards compatible) ── */
const db = {
  getAttraction,
  getAttractions,
  getSimilarAttractions,
  getRestaurants,
  getRestaurant,
  getRestaurantMenu,
  saveOrder
};
