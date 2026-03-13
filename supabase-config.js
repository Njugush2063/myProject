/* ============================================================
   SUPABASE CONFIG — supabase-config.js
   Include this file in every page that needs database access
   ============================================================ */

const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eKZx3549j8unaFOQaZNGlQ_IdVWH5BI';

// Simple Supabase REST API helper
const db = {

  // Fetch all attractions
  async getAttractions() {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/attractions?select=*&order=rating.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!res.ok) throw new Error('Failed to fetch attractions');
    return res.json();
  },

  // Fetch single attraction by slug
  async getAttraction(slug) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/attractions?slug=eq.${slug}&select=*&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!res.ok) throw new Error('Failed to fetch attraction');
    const data = await res.json();
    return data[0] || null;
  },

  // Fetch attractions by category
  async getByCategory(category) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/attractions?category=eq.${encodeURIComponent(category)}&select=*&order=rating.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!res.ok) throw new Error('Failed to fetch by category');
    return res.json();
  },

  // Fetch similar attractions (same category, excluding current)
  async getSimilar(category, excludeSlug) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/attractions?category=eq.${encodeURIComponent(category)}&slug=neq.${excludeSlug}&select=*&order=rating.desc&limit=3`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!res.ok) throw new Error('Failed to fetch similar');
    const data = await res.json();
    // If not enough in same category, fetch others
    if (data.length < 3) {
      const res2 = await fetch(
        `${SUPABASE_URL}/rest/v1/attractions?slug=neq.${excludeSlug}&select=*&order=rating.desc&limit=3`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return res2.json();
    }
    return data;
  }

};
