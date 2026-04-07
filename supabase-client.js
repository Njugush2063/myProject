/* ══════════════════════════════════════════════════════════════════════
   supabase-client.js  —  SafariQuest Kenya
   Loaded by restaurants.html BEFORE restaurants.js.
   Exposes:
     - getRestaurants()          → all restaurants (up to 200)
     - getRestaurant(slug)       → single restaurant by slug
══════════════════════════════════════════════════════════════════════ */

const SUPABASE_URL_CLIENT = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY_CLIENT = 'sb_publishable_eKZx3549j8unaFOQaZNGlQ_IdVWH5BI';
const RESTAURANTS_TABLE   = 'restaurants';

/* ── tiny fetch helper ── */
async function sbClientFetch(path) {
  const res = await fetch(`${SUPABASE_URL_CLIENT}/rest/v1/${path}`, {
    headers: {
      'apikey':        SUPABASE_KEY_CLIENT,
      'Authorization': `Bearer ${SUPABASE_KEY_CLIENT}`,
      'Content-Type':  'application/json',
      /* Ask Supabase to return the full count so we can paginate if needed */
      'Prefer':        'count=planned',
    }
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${res.statusText}`);
  return res.json();
}

/* ══════════════════════════════════════════════════════════════════════
   getRestaurants()
   Returns ALL restaurants ordered by featured desc, then rating desc.
   Uses a high limit (200) so all 45+ rows are always returned.
══════════════════════════════════════════════════════════════════════ */
window.getRestaurants = async function () {
  try {
    const data = await sbClientFetch(
      `${RESTAURANTS_TABLE}?order=featured.desc,rating.desc&limit=200&select=*`
    );
    console.log(`[supabase-client] getRestaurants → ${Array.isArray(data) ? data.length : 0} rows`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[supabase-client] getRestaurants failed:', err.message);
    return [];
  }
};

/* ══════════════════════════════════════════════════════════════════════
   getRestaurant(slug)
   Returns a single restaurant object, or null if not found.
══════════════════════════════════════════════════════════════════════ */
window.getRestaurant = async function (slug) {
  try {
    const data = await sbClientFetch(
      `${RESTAURANTS_TABLE}?slug=eq.${encodeURIComponent(slug)}&limit=1&select=*`
    );
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.warn('[supabase-client] getRestaurant failed:', err.message);
    return null;
  }
};
