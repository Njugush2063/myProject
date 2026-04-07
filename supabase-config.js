/* ══════════════════════════════════════════════════════════════════════
   supabase-config.js  —  SafariQuest Kenya
   Loaded as a regular <script> tag (NOT a module).
   Exposes two globals:
     - getSportsDestinations(sport)  used by category.js
     - db.getAttraction(slug)        used by attraction-details.js
     - db.getSimilar(category, slug) used by attraction-details.js
══════════════════════════════════════════════════════════════════════ */

const SUPABASE_URL  = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_eKZx3549j8unaFOQaZNGlQ_IdVWH5BI';
const SPORTS_TABLE  = 'sports_destinations';
const ATTRACT_TABLE = 'destinations';

/* ── tiny fetch helper ── */
async function sbFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
    }
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${res.statusText}`);
  return res.json();
}

/* ══════════════════════════════════════════════════════════════════════
   getSportsDestinations(sport)
   Used by category.js to load destination cards.
══════════════════════════════════════════════════════════════════════ */
window.getSportsDestinations = async function (sport) {
  try {
    const data = await sbFetch(
      `${SPORTS_TABLE}?sport=eq.${sport}&order=featured.desc,rating.desc&limit=50`
    );
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[supabase-config] getSportsDestinations failed:', err.message);
    return [];
  }
};

/* ══════════════════════════════════════════════════════════════════════
   db  —  used by attraction-details.js
══════════════════════════════════════════════════════════════════════ */
window.db = {

  getAttractions: async function (limit = 20) {
    try {
      const data = await sbFetch(
        `${ATTRACT_TABLE}?order=rating.desc&limit=${limit}`
      );
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('[supabase-config] getAttractions failed:', err.message);
      return [];
    }
  },

  getAttraction: async function (slug) {
    try {
      const data = await sbFetch(
        `${ATTRACT_TABLE}?slug=eq.${encodeURIComponent(slug)}&limit=1`
      );
      if (Array.isArray(data) && data.length > 0) return data[0];
      return null;
    } catch (err) {
      console.warn('[supabase-config] getAttraction failed:', err.message);
      return null;
    }
  },

  getSimilar: async function (category, currentSlug) {
    try {
      const data = await sbFetch(
        `${ATTRACT_TABLE}?category=eq.${encodeURIComponent(category)}&slug=neq.${encodeURIComponent(currentSlug)}&order=rating.desc&limit=4`
      );
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('[supabase-config] getSimilar failed:', err.message);
      return [];
    }
  }

};
