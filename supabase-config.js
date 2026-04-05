/* ══════════════════════════════════════════════════════════════════════
   supabase-config.js  —  SafariQuest Kenya
   Initialises the Supabase client and exports helper functions used
   by category.js (and other pages).
══════════════════════════════════════════════════════════════════════ */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eKZx3549j8unaFOQaZNGlQ_IdVWH5BI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TABLE = 'sports_destinations';

/**
 * Fetch all destinations for a given sport from Supabase.
 * Returns an array of destination objects, or [] on error.
 *
 * @param {string} sport  e.g. 'football' | 'golf' | 'rally' | 'basketball' | 'swimming'
 * @returns {Promise<Array>}
 */
export async function getSportsDestinations(sport) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('sport', sport)
      .order('featured', { ascending: false })
      .order('rating',   { ascending: false });

    if (error) {
      console.warn(`[Supabase] Error fetching ${sport}:`, error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn('[Supabase] Unexpected error:', err);
    return [];
  }
}

/**
 * Fetch hero image URLs for all sports from Supabase storage.
 * Returns a map of { football: 'https://...', golf: '...' ... }
 * or an empty object if unavailable.
 *
 * @returns {Promise<Object>}
 */
export async function getHeroImages() {
  const sports = ['football', 'golf', 'rally', 'basketball', 'swimming'];
  const BUCKET = 'destination-images';
  const BASE   = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

  const result = {};
  for (const sport of sports) {
    result[sport] = `${BASE}/heroes/hero-${sport}.jpg`;
  }
  return result;
}

/* Make getSportsDestinations available globally (for non-module scripts) */
window.getSportsDestinations = getSportsDestinations;
window.getHeroImages         = getHeroImages;
