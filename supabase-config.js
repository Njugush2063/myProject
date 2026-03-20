/* ============================================================
   SUPABASE CONFIG — supabase-config.js
   Shared credentials and helper functions for all pages.
   !! Replace the two values below with your actual keys !!
   Find them in: Supabase Dashboard → Settings → API
   ============================================================ */

const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNieWlwbXJvenFzbnRvamlhcnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTE1NCwiZXhwIjoyMDg4OTc1MTU0fQ.8-lofBhuCiw78An17hUUak8iAkKu27ql71FWkLQv-8Y';

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
