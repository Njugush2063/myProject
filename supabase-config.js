/* ============================================================
   SUPABASE CONFIG — supabase-config.js
   Shared credentials and helper functions for all pages.
   !! Replace the two values below with your actual keys !!
   Find them in: Supabase Dashboard → Settings → API
   ============================================================ */

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_PUBLIC_KEY';

/* ── Fetch all restaurants ── */
async function getRestaurants() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/restaurants?select=*&order=featured.desc,name.asc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  if (!res.ok) throw new Error(`Supabase error ${res.status}: ${res.statusText}`);
  return res.json();
}

/* ── Fetch a single restaurant by slug ── */
async function getRestaurant(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/restaurants?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  if (!res.ok) throw new Error(`Supabase error ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return data[0] || null;
}
