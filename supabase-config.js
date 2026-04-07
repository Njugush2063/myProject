/* ══════════════════════════════════════════════════════════════════════
   supabase-config.js  —  SafariQuest Kenya
   Loaded as a regular <script> tag (NOT a module).
   Exposes globals:
     - getSportsDestinations(sport)   → category.js
     - db.getAttraction(slug)         → attraction-details.js
     - db.getAttractions()            → destinations.js (favorites)
     - db.getSimilar(category, slug)  → attraction-details.js
══════════════════════════════════════════════════════════════════════ */

const SUPABASE_URL  = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_eKZx3549j8unaFOQaZNGlQ_IdVWH5BI';
const SPORTS_TABLE  = 'sports_destinations';
const ATTRACT_TABLE = 'destinations';

/* ── fetch helper ── */
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
   getSportsDestinations(sport)  —  used by category.js
══════════════════════════════════════════════════════════════════════ */
window.getSportsDestinations = async function (sport) {
  try {
    const data = await sbFetch(
      `${SPORTS_TABLE}?sport=eq.${sport}&order=featured.desc,rating.desc&limit=50`
    );
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[Supabase] getSportsDestinations failed:', err.message);
    return [];
  }
};

/* ══════════════════════════════════════════════════════════════════════
   STATIC FALLBACK DATA for attraction-details & destinations pages
   Used when the `destinations` Supabase table doesn't exist yet.
══════════════════════════════════════════════════════════════════════ */
const STATIC_ATTRACTIONS = [
  {
    slug: 'maasai-mara', name: 'Masai Mara National Reserve',
    category: 'big-five', county: 'Narok', location: 'Narok County, Kenya',
    difficulty: 'Moderate', rating: 4.9, review_count: 2847,
    best_time: 'July – October', climate: 'Warm & Dry',
    duration: '3–7 days', group_size: '2–12 people',
    price_min: 25000, price_max: 150000,
    description: 'Home to the Great Wildebeest Migration and all Big Five in breathtaking golden savanna landscapes. The Masai Mara is Kenya\'s most celebrated wildlife reserve, offering year-round game drives, hot air balloon safaris and authentic Maasai cultural experiences.',
    highlights: ['Great Migration (Jul–Oct)', 'All Big Five', 'Hot Air Balloon Safaris', 'Maasai Cultural Visits', 'Predator Sightings', 'Sunset Game Drives'],
    image_hero: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=85',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=85',
      'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=85',
    ])
  },
  {
    slug: 'amboseli', name: 'Amboseli National Park',
    category: 'big-five', county: 'Kajiado', location: 'Kajiado County, Kenya',
    difficulty: 'Easy', rating: 4.8, review_count: 1923,
    best_time: 'June – October', climate: 'Warm & Semi-Arid',
    duration: '2–4 days', group_size: '2–8 people',
    price_min: 18000, price_max: 95000,
    description: 'Iconic views of Mount Kilimanjaro backdrop with the largest elephant herds in East Africa roaming freely. Amboseli offers some of the most dramatic wildlife photography opportunities on the continent.',
    highlights: ['Kilimanjaro Views', 'Largest Elephant Herds', 'Bird Watching', 'Maasai Community Visits', 'Swamp Ecosystem', 'Photography Paradise'],
    image_hero: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=85',
      'https://images.unsplash.com/photo-1612213938763-9ed26ab83a31?w=800&q=85',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=85',
    ])
  },
  {
    slug: 'lake-nakuru', name: 'Lake Nakuru National Park',
    category: 'big-five', county: 'Nakuru', location: 'Nakuru County, Kenya',
    difficulty: 'Easy', rating: 4.7, review_count: 1456,
    best_time: 'June – September', climate: 'Mild Highland',
    duration: '1–2 days', group_size: '2–10 people',
    price_min: 12000, price_max: 60000,
    description: 'A pink-fringed soda lake famous for millions of flamingos and a critical black rhino sanctuary. Lake Nakuru also hosts Rothschild giraffes, leopards and over 450 bird species.',
    highlights: ['Flamingo Carpets', 'Black Rhino Sanctuary', 'Rothschild Giraffes', '450+ Bird Species', 'Leopard Sightings', 'Lake Viewpoints'],
    image_hero: 'https://images.unsplash.com/photo-1564760290292-23341e4df6ec?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1564760290292-23341e4df6ec?w=800&q=85',
      'https://images.unsplash.com/photo-1585389639821-a4c1c2886aab?w=800&q=85',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=85',
    ])
  },
  {
    slug: 'tsavo', name: 'Tsavo National Park',
    category: 'big-five', county: 'Taita-Taveta', location: 'Coast & Taita-Taveta, Kenya',
    difficulty: 'Moderate', rating: 4.7, review_count: 1102,
    best_time: 'June – October', climate: 'Hot & Semi-Arid',
    duration: '3–5 days', group_size: '2–10 people',
    price_min: 15000, price_max: 80000,
    description: "Kenya's largest park — red-dusted elephants, Mzima Springs lava flows, and vast untamed wilderness. Tsavo East and West together form one of the world's largest game reserves.",
    highlights: ['Red-Dusted Elephants', 'Mzima Springs', 'Lava Flows', 'Lions & Leopards', 'Vast Wilderness', 'Lugard Falls'],
    image_hero: 'https://images.unsplash.com/photo-1598886290734-c4dee49e29cc?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1598886290734-c4dee49e29cc?w=800&q=85',
      'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=85',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=85',
    ])
  },
  {
    slug: 'mount-kenya', name: 'Mount Kenya National Park',
    category: 'mountain', county: 'Nyeri', location: 'Central Kenya',
    difficulty: 'Challenging', rating: 4.8, review_count: 892,
    best_time: 'January – February', climate: 'Alpine / Cool',
    duration: '4–7 days', group_size: '2–8 people',
    price_min: 30000, price_max: 120000,
    description: "Africa's second highest peak — a UNESCO World Heritage site with glaciers, alpine moorlands and diverse wildlife. Multiple trekking routes suit different fitness levels.",
    highlights: ['5,199m Summit', 'UNESCO World Heritage', 'Glaciers & Tarns', 'Unique Alpine Flora', 'Buffalo & Elephant', 'Multiple Trek Routes'],
    image_hero: 'https://images.unsplash.com/photo-1589825743638-54a8ee3b6d67?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1589825743638-54a8ee3b6d67?w=800&q=85',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=85',
    ])
  },
  {
    slug: 'samburu', name: 'Samburu National Reserve',
    category: 'big-five', county: 'Samburu', location: 'Samburu County, Kenya',
    difficulty: 'Moderate', rating: 4.7, review_count: 743,
    best_time: 'July – September', climate: 'Hot & Dry',
    duration: '2–4 days', group_size: '2–8 people',
    price_min: 20000, price_max: 100000,
    description: "Remote northern reserve home to the rare Samburu Special Five found nowhere else in Kenya. Grevy's zebra, reticulated giraffe, Somali ostrich, gerenuk and Beisa oryx roam this arid paradise.",
    highlights: ["Grevy's Zebra", 'Reticulated Giraffe', 'Gerenuk', 'Ewaso Nyiro River', 'Remote Wilderness', 'Samburu Culture'],
    image_hero: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=85',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=85',
      'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=85',
    ])
  },
  {
    slug: 'diani-beach', name: 'Diani Beach',
    category: 'beach', county: 'Kwale', location: 'Kwale County, Kenya',
    difficulty: 'Easy', rating: 4.8, review_count: 2104,
    best_time: 'January – March', climate: 'Tropical & Warm',
    duration: '3–7 days', group_size: '2–12 people',
    price_min: 15000, price_max: 90000,
    description: "Kenya's most celebrated beach — 17km of powdery white sands lapped by the warm turquoise Indian Ocean with world-class coral reefs just offshore.",
    highlights: ['17km White Sand Beach', 'Coral Reef Diving', 'Kitesurfing', 'Dolphin Encounters', 'Colobus Monkeys', 'Watersports Hub'],
    image_hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85',
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=85',
      'https://images.unsplash.com/photo-1504173010664-32509107de82?w=800&q=85',
    ])
  },
  {
    slug: 'hells-gate', name: "Hell's Gate National Park",
    category: 'adventure', county: 'Nakuru', location: 'Nakuru County, Kenya',
    difficulty: 'Easy', rating: 4.6, review_count: 987,
    best_time: 'June – October', climate: 'Warm & Dry',
    duration: '1–2 days', group_size: '2–15 people',
    price_min: 5000, price_max: 25000,
    description: "Kenya's only park where you walk and cycle freely among wildlife through dramatic volcanic gorges, towering cliffs and active geothermal features.",
    highlights: ['Cycling Among Wildlife', 'Gorge Walks', 'Rock Climbing', 'Geothermal Features', 'Olkaria Hot Springs', 'Fischer\'s Tower'],
    image_hero: 'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&q=85',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=85',
    ])
  },
  {
    slug: 'ol-pejeta', name: 'Ol Pejeta Conservancy',
    category: 'big-five', county: 'Laikipia', location: 'Laikipia County, Kenya',
    difficulty: 'Easy', rating: 4.8, review_count: 1344,
    best_time: 'June – October', climate: 'Mild Highland',
    duration: '2–4 days', group_size: '2–10 people',
    price_min: 22000, price_max: 110000,
    description: "Africa's largest black rhino sanctuary and home to the last two northern white rhinos on earth. Ol Pejeta combines conservation, community and wildlife in a uniquely Kenyan way.",
    highlights: ['Last Northern White Rhinos', 'Black Rhino Sanctuary', 'All Big Five', 'Chimpanzee Sanctuary', 'Community Conservancy', 'Night Game Drives'],
    image_hero: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&q=85',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=85',
      'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=85',
    ])
  },
  {
    slug: 'nairobi-np', name: 'Nairobi National Park',
    category: 'big-five', county: 'Nairobi', location: 'Nairobi City, Kenya',
    difficulty: 'Easy', rating: 4.6, review_count: 1678,
    best_time: 'July – March', climate: 'Mild & Pleasant',
    duration: '0.5–1 day', group_size: '2–10 people',
    price_min: 4000, price_max: 20000,
    description: "The world's only national park inside a capital city — lions, giraffes, rhinos and buffalo roam freely with Nairobi's iconic skyline as a backdrop.",
    highlights: ['City Skyline + Wildlife', 'Lions & Rhinos', 'Giraffe Centre Nearby', 'Half-Day Safari', 'Black Rhino Population', 'Bird Watching'],
    image_hero: 'https://images.unsplash.com/photo-1612213938763-9ed26ab83a31?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1612213938763-9ed26ab83a31?w=800&q=85',
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=85',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=85',
    ])
  },
  {
    slug: 'watamu', name: 'Watamu Beach',
    category: 'beach', county: 'Kilifi', location: 'Kilifi County, Kenya',
    difficulty: 'Easy', rating: 4.7, review_count: 876,
    best_time: 'October – March', climate: 'Tropical & Warm',
    duration: '3–7 days', group_size: '2–10 people',
    price_min: 12000, price_max: 70000,
    description: 'UNESCO Biosphere Reserve with stunning sandbars, marine national park snorkelling and seasonal whale shark encounters. One of Kenya\'s most unspoilt coastal gems.',
    highlights: ['UNESCO Biosphere Reserve', 'Whale Shark Encounters', 'Marine National Park', 'Turtle Nesting Site', 'Deep Sea Fishing', 'Watamu Treehouse'],
    image_hero: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85',
      'https://images.unsplash.com/photo-1504173010664-32509107de82?w=800&q=85',
    ])
  },
  {
    slug: 'lamu-island', name: 'Lamu Island',
    category: 'cultural', county: 'Lamu', location: 'Lamu County, Kenya',
    difficulty: 'Easy', rating: 4.8, review_count: 1023,
    best_time: 'October – March', climate: 'Tropical & Humid',
    duration: '3–5 days', group_size: '2–8 people',
    price_min: 18000, price_max: 85000,
    description: 'UNESCO World Heritage old town with Swahili architecture, traditional dhow sailing, car-free cobbled streets and a rich 700-year maritime history.',
    highlights: ['UNESCO World Heritage', 'Swahili Architecture', 'Dhow Sailing', 'Car-Free Town', 'Seafood Culture', 'Lamu Cultural Festival'],
    image_hero: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1400&q=90',
    image_gallery: JSON.stringify([
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85',
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=85',
    ])
  },
];

/* ══════════════════════════════════════════════════════════════════════
   db object  —  used by attraction-details.js and destinations.js
══════════════════════════════════════════════════════════════════════ */
window.db = {

  /* Single attraction by slug — tries Supabase first, falls back to static */
  getAttraction: async function (slug) {
    try {
      const data = await sbFetch(
        `${ATTRACT_TABLE}?slug=eq.${encodeURIComponent(slug)}&limit=1`
      );
      if (Array.isArray(data) && data.length > 0) return data[0];
    } catch (err) {
      console.warn('[Supabase] getAttraction DB failed, using static data:', err.message);
    }
    /* Static fallback */
    return STATIC_ATTRACTIONS.find(a => a.slug === slug) || null;
  },

  /* All attractions — tries Supabase first, falls back to static */
  getAttractions: async function () {
    try {
      const data = await sbFetch(
        `${ATTRACT_TABLE}?order=rating.desc&limit=20`
      );
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      console.warn('[Supabase] getAttractions DB failed, using static data:', err.message);
    }
    return STATIC_ATTRACTIONS;
  },

  /* Similar destinations — same category, different slug */
  getSimilar: async function (category, currentSlug) {
    try {
      const data = await sbFetch(
        `${ATTRACT_TABLE}?category=eq.${encodeURIComponent(category)}&slug=neq.${encodeURIComponent(currentSlug)}&order=rating.desc&limit=4`
      );
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      console.warn('[Supabase] getSimilar DB failed, using static data:', err.message);
    }
    /* Static fallback */
    return STATIC_ATTRACTIONS
      .filter(a => a.category === category && a.slug !== currentSlug)
      .slice(0, 4);
  }

};
