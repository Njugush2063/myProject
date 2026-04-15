/* ══════════════════════════════════════════════════════════════════════
   supabase-config.js  —  SafariQuest Kenya
   Loaded as a regular <script> tag (NOT a module).
   Exposes two globals:
     - getSportsDestinations(sport)  used by category.js
     - db.getAttraction(slug)        used by attraction-details.js
     - db.getSimilar(category, slug) used by attraction-details.js
══════════════════════════════════════════════════════════════════════ */

/* Use var instead of const to prevent "already declared" errors
   if this script is ever parsed more than once by the browser */
var SUPABASE_URL  = 'https://cbyipmrozqsntojiartw.supabase.co';
var SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNieWlwbXJvenFzbnRvamlhcnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTkxNTQsImV4cCI6MjA4ODk3NTE1NH0.31TAhmUCV_Uh0W8FGnR2_TLCZDU4YBM1U5LMSMc5JZs';
var SPORTS_TABLE  = 'sports_destinations';
var ATTRACT_TABLE = 'attractions';

/* ── tiny fetch helper ── */
async function sbFetch(path) {
  var res = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type':  'application/json',
    }
  });
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + res.statusText);
  return res.json();
}

/* ══════════════════════════════════════════════════════════════════════
   getSportsDestinations(sport)
   Used by category.js to load destination cards.
══════════════════════════════════════════════════════════════════════ */
window.getSportsDestinations = async function (sport) {
  try {
    var data = await sbFetch(
      SPORTS_TABLE + '?sport=eq.' + sport + '&order=featured.desc,rating.desc&limit=50'
    );
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[supabase-config] getSportsDestinations failed:', err.message);
    return [];
  }
};

/* ══════════════════════════════════════════════════════════════════════
   db  —  used by attraction-details.js
   Falls back to local attractions-data.js if Supabase is unavailable.
══════════════════════════════════════════════════════════════════════ */
window.db = {

  getAttractions: async function (options) {
    try {
      if (!options || typeof options === 'number') options = { limit: options || 20 };
      var limit    = options.limit    || 20;
      var order    = options.order    || 'rating.desc';
      var category = options.category || null;
      var path = ATTRACT_TABLE + '?order=' + order + '&limit=' + limit;
      if (category) path += '&category=eq.' + encodeURIComponent(category);
      var data = await sbFetch(path);
      if (Array.isArray(data) && data.length > 0) return data;
      /* Fallback to local data */
      console.warn('[supabase-config] getAttractions empty — using local data');
      return window.ATTRACTIONS_DATA || [];
    } catch (err) {
      console.warn('[supabase-config] getAttractions failed:', err.message, '— using local data');
      return window.ATTRACTIONS_DATA || [];
    }
  },

  getAttraction: async function (slug) {
    try {
      var data = await sbFetch(
        ATTRACT_TABLE + '?slug=eq.' + encodeURIComponent(slug) + '&limit=1'
      );
      if (Array.isArray(data) && data.length > 0) return data[0];
      /* Supabase returned empty — use local fallback */
      console.warn('[supabase-config] Supabase empty for slug:', slug, '— using local data');
      return window.getAttractionBySlug ? window.getAttractionBySlug(slug) : null;
    } catch (err) {
      console.warn('[supabase-config] getAttraction failed:', err.message, '— using local data');
      return window.getAttractionBySlug ? window.getAttractionBySlug(slug) : null;
    }
  },

  getSimilar: async function (category, currentSlug) {
    try {
      var data = await sbFetch(
        ATTRACT_TABLE + '?category=eq.' + encodeURIComponent(category) +
        '&slug=neq.' + encodeURIComponent(currentSlug) +
        '&order=rating.desc&limit=4'
      );
      if (Array.isArray(data) && data.length > 0) return data;
      /* Fallback to local similar */
      return window.getSimilarAttractions ? window.getSimilarAttractions(category, currentSlug) : [];
    } catch (err) {
      console.warn('[supabase-config] getSimilar failed:', err.message);
      return window.getSimilarAttractions ? window.getSimilarAttractions(category, currentSlug) : [];
    }
  }

};
