/* ══════════════════════════════════════════════════════════════════════
   supabase-config.js  —  SafariQuest Kenya
   Loaded as a regular <script> tag (NOT a module).
   Exposes two globals:
     - getSportsDestinations(sport)  used by category.js
     - db.getAttraction(slug)        used by attraction-details.js
     - db.getSimilar(category, slug) used by attraction-details.js
══════════════════════════════════════════════════════════════════════ */

const SUPABASE_URL  = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNieWlwbXJvenFzbnRvamlhcnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTkxNTQsImV4cCI6MjA4ODk3NTE1NH0.31TAhmUCV_Uh0W8FGnR2_TLCZDU4YBM1U5LMSMc5JZs';
const SPORTS_TABLE  = 'sports_destinations';
const ATTRACT_TABLE = 'attractions';

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
