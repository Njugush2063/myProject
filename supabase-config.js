/* ══════════════════════════════════════════════════════════════════════
   supabase-config.js  —  SafariQuest Kenya
   Uses the Supabase CDN library (loaded before this file in HTML).
   NO import/export — plain global functions usable by any page script.
══════════════════════════════════════════════════════════════════════ */

const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eKZx3549j8unaFOQaZNGlQ_IdVWH5BI';

const _supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ── Sports destinations ── */
async function getSportsDestinations(sport) {
  const { data, error } = await _supabaseClient
    .from('sports_destinations')
    .select('*')
    .eq('sport', sport)
    .order('featured', { ascending: false })
    .order('rating',   { ascending: false });

  if (error) throw error;

  return data.map(d => ({
    ...d,
    highlights: typeof d.highlights === 'string'
      ? JSON.parse(d.highlights)
      : (d.highlights || [])
  }));
}
