/* ============================================================
   RESTAURANTS PAGE — restaurants.js
   SafariQuest Kenya
   Fully self-contained static data. NO Supabase dependency.
   Works on GitHub Pages without any backend.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Static restaurant data ── */
  var ALL_RESTAURANTS = [
    {
      slug: 'carnivore-restaurant',
      name: 'Carnivore Restaurant',
      city: 'Nairobi',
      cuisine: 'BBQ & Steakhouse',
      price_level: 3,
      featured: true,
      rating: 4.8,
      description: 'World-famous all-you-can-eat nyama choma experience. A Nairobi icon since 1980, serving exotic meats on Maasai swords in a spectacular outdoor setting.',
      image_hero: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
      tags: ['Iconic', 'All-you-can-eat', 'Outdoor']
    },
    {
      slug: 'mama-oliech',
      name: 'Mama Oliech Restaurant',
      city: 'Nairobi',
      cuisine: 'Kenyan',
      price_level: 1,
      featured: true,
      rating: 4.6,
      description: "Nairobi's most famous fried tilapia restaurant — a legendary local institution loved by everyone from street vendors to presidents.",
      image_hero: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
      tags: ['Local Favourite', 'Tilapia', 'Authentic']
    },
    {
      slug: 'tamarind-mombasa',
      name: 'Tamarind Mombasa',
      city: 'Mombasa',
      cuisine: 'Seafood',
      price_level: 4,
      featured: true,
      rating: 4.7,
      description: 'Romantic dhow-style dining on the Mombasa Creek. Renowned for fresh lobster, prawns, and Swahili-spiced seafood platters with harbour views.',
      image_hero: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
      tags: ['Waterfront', 'Romantic', 'Seafood']
    },
    {
      slug: 'talisman-nairobi',
      name: 'Talisman Restaurant',
      city: 'Nairobi',
      cuisine: 'International',
      price_level: 3,
      featured: false,
      rating: 4.5,
      description: 'A Karen institution with beautiful fairy-lit garden dining and an eclectic world menu. Perfect for a relaxed dinner in leafy Nairobi.',
      image_hero: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80',
      tags: ['Garden Dining', 'Romantic', 'International']
    },
    {
      slug: 'moorings-kisumu',
      name: 'The Moorings',
      city: 'Kisumu',
      cuisine: 'African & Seafood',
      price_level: 2,
      featured: false,
      rating: 4.4,
      description: 'A floating restaurant on Lake Victoria with spectacular sunset views. Fresh tilapia and Nile perch are the specialities of the house.',
      image_hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      tags: ['Lakeside', 'Sunset Views', 'Fresh Fish']
    },
    {
      slug: 'forodhani-mombasa',
      name: 'Forodhani Restaurant',
      city: 'Mombasa',
      cuisine: 'Swahili',
      price_level: 2,
      featured: false,
      rating: 4.5,
      description: "Authentic Swahili coastal cuisine in the heart of Mombasa's historic Old Town. Pilau, biryani, and coconut curries prepared with generations of tradition.",
      image_hero: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&q=80',
      tags: ['Swahili', 'Old Town', 'Coastal']
    },
    {
      slug: 'java-house-nairobi',
      name: 'Java House',
      city: 'Nairobi',
      cuisine: 'Café & Coffee',
      price_level: 2,
      featured: false,
      rating: 4.2,
      description: "Kenya's beloved coffee chain — great all-day breakfast, fresh sandwiches, and the finest locally sourced Kenyan coffee in a comfortable café setting.",
      image_hero: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
      tags: ['Coffee', 'Breakfast', 'Casual']
    },
    {
      slug: 'swahili-plate-nakuru',
      name: 'Swahili Plate',
      city: 'Nakuru',
      cuisine: 'Kenyan',
      price_level: 1,
      featured: false,
      rating: 4.3,
      description: 'Hearty local Kenyan favourites — nyama choma, ugali, sukuma wiki and fresh tilapia served in generous portions at honest prices.',
      image_hero: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
      tags: ['Local', 'Nyama Choma', 'Budget-friendly']
    },
    {
      slug: 'olepolos-nairobi',
      name: 'Olepolos Country Club',
      city: 'Nairobi',
      cuisine: 'BBQ & Steakhouse',
      price_level: 2,
      featured: false,
      rating: 4.4,
      description: 'An open-air nyama choma hotspot on the outskirts of Nairobi. A relaxed country atmosphere, great grilled meats, and cold Tusker on tap.',
      image_hero: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      tags: ['Outdoor', 'Nyama Choma', 'Country']
    },
    {
      slug: 'about-thyme-nairobi',
      name: 'About Thyme',
      city: 'Nairobi',
      cuisine: 'European',
      price_level: 3,
      featured: false,
      rating: 4.5,
      description: 'Garden restaurant in Karen offering Mediterranean-inspired cuisine with fresh, locally sourced ingredients in a charming lush outdoor setting.',
      image_hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      tags: ['Garden', 'Mediterranean', 'Karen']
    },
    {
      slug: 'nyama-mama-nairobi',
      name: 'Nyama Mama',
      city: 'Nairobi',
      cuisine: 'Kenyan',
      price_level: 2,
      featured: false,
      rating: 4.6,
      description: 'A modern upscale take on Kenyan street food — nyama choma tacos, ugali fries, and creative cocktails in a vibrant Westlands setting.',
      image_hero: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
      tags: ['Modern Kenyan', 'Cocktails', 'Trendy']
    },
    {
      slug: 'neptune-beach-mombasa',
      name: 'Neptune Beach Restaurant',
      city: 'Mombasa',
      cuisine: 'Seafood',
      price_level: 2,
      featured: false,
      rating: 4.3,
      description: 'Beachfront dining on Bamburi Beach with tables in the sand and a menu packed with fresh catch, grilled lobster, and tropical cocktails.',
      image_hero: 'https://images.unsplash.com/photo-1510784722466-f2aa240d9562?w=800&q=80',
      tags: ['Beachfront', 'Lobster', 'Sunset']
    },
    {
      slug: 'serene-hotel-kisumu',
      name: 'Serene Hotel Restaurant',
      city: 'Kisumu',
      cuisine: 'African',
      price_level: 2,
      featured: false,
      rating: 4.1,
      description: 'Lakeside dining in Kisumu with an extensive menu of East African specialities, fresh Lake Victoria fish, and a warm, welcoming atmosphere.',
      image_hero: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
      tags: ['Lakeside', 'East African', 'Kisumu']
    },
    {
      slug: 'la-brasserie-nairobi',
      name: 'La Brasserie',
      city: 'Nairobi',
      cuisine: 'Italian',
      price_level: 3,
      featured: false,
      rating: 4.4,
      description: 'Authentic Italian dining in the heart of Westlands — wood-fired Neapolitan pizzas, house-made pasta, and an extensive Italian wine list.',
      image_hero: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      tags: ['Pizza', 'Pasta', 'Italian Wine']
    },
    {
      slug: 'spice-garden-nakuru',
      name: 'Spice Garden',
      city: 'Nakuru',
      cuisine: 'Indian',
      price_level: 2,
      featured: false,
      rating: 4.3,
      description: 'Nakuru\'s best Indian restaurant — rich curries, tandoori specialities, fresh naan, and vegetarian-friendly options for the whole family.',
      image_hero: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
      tags: ['Curry', 'Vegetarian', 'Family-friendly']
    }
  ];

  /* ── State ── */
  var allRestaurants = ALL_RESTAURANTS;
  var filtered = allRestaurants.slice();
  var activeCity = 'all';

  /* ── Navbar scroll ── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── Update total count stat ── */
  var statTotal = document.getElementById('statTotal');
  if (statTotal) statTotal.textContent = allRestaurants.length;

  /* ── Render both sections ── */
  function renderAll() {
    var featured = filtered.filter(function (r) { return r.featured; });
    var rest     = filtered.filter(function (r) { return !r.featured; });

    /* Featured section */
    var featuredSection = document.getElementById('featuredSection');
    var featuredGrid    = document.getElementById('featuredGrid');
    if (featuredSection && featuredGrid) {
      if (featured.length > 0) {
        featuredSection.style.display = 'block';
        featuredGrid.innerHTML = featured.map(buildCard).join('');
      } else {
        featuredSection.style.display = 'none';
        featuredGrid.innerHTML = '';
      }
    }

    /* Main grid */
    var grid  = document.getElementById('restaurantsGrid');
    var count = document.getElementById('resultsCount');
    var empty = document.getElementById('emptyState');

    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'block';
    } else {
      if (empty) empty.style.display = 'none';
      /* Show non-featured in main grid; if all are featured, show all anyway */
      var mainItems = rest.length > 0 ? rest : filtered;
      grid.innerHTML = mainItems.map(buildCard).join('');
    }

    if (count) count.textContent = filtered.length + ' restaurant' + (filtered.length !== 1 ? 's' : '');
  }

  /* ── Build card HTML ── */
  function buildCard(r) {
    var priceLabel = ['', 'Budget', 'Mid-range', 'Upscale', 'Fine Dining'][r.price_level] || '';
    var priceSymbols = '';
    for (var i = 1; i <= 4; i++) {
      priceSymbols += '<span style="opacity:' + (i <= r.price_level ? '1' : '0.25') + '">KSh</span> ';
    }
    var desc = r.description || '';
    var shortDesc = desc.length > 110 ? desc.substring(0, 110) + '…' : desc;
    var image = r.image_hero || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80';

    return '<div class="rest-card" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.07);transition:transform .25s,box-shadow .25s;cursor:pointer" ' +
      'onmouseover="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 12px 32px rgba(0,0,0,.13)\'" ' +
      'onmouseout="this.style.transform=\'\';this.style.boxShadow=\'0 4px 18px rgba(0,0,0,.07)\'">' +
      '<div style="position:relative;height:190px;overflow:hidden">' +
        '<img src="' + image + '" alt="' + r.name + '" loading="lazy" ' +
          'style="width:100%;height:100%;object-fit:cover" ' +
          'onerror="this.src=\'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80\'">' +
        (r.featured ? '<div style="position:absolute;top:10px;left:10px;background:#E8732A;color:#fff;padding:3px 10px;border-radius:20px;font-size:.72rem;font-weight:700">⭐ Featured</div>' : '') +
        '<div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.5);color:#fff;padding:3px 10px;border-radius:20px;font-size:.72rem">' + r.cuisine + '</div>' +
      '</div>' +
      '<div style="padding:18px">' +
        '<div style="font-size:.78rem;color:#777;margin-bottom:4px">📍 ' + r.city + '</div>' +
        '<div style="font-family:serif;font-size:1.1rem;color:#1a3c2e;font-weight:700;margin-bottom:8px">' + r.name + '</div>' +
        '<div style="font-size:.84rem;color:#666;line-height:1.55;margin-bottom:14px">' + shortDesc + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<div style="font-size:.8rem;color:#555">' + priceSymbols + '<span style="font-size:.72rem;color:#999">' + priceLabel + '</span></div>' +
          '<span style="font-size:.78rem;color:#E8732A;font-weight:600">★ ' + r.rating + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ── Filter function ── */
  window.applyFilters = function () {
    var cuisine = (document.getElementById('cuisineFilter') || {}).value || 'all';
    var price   = (document.getElementById('priceFilter')   || {}).value || 'all';
    var sort    = (document.getElementById('sortFilter')    || {}).value || 'featured';
    var search  = ((document.getElementById('searchInput')  || {}).value || '').toLowerCase().trim();

    filtered = allRestaurants.filter(function (r) {
      var matchCity    = activeCity === 'all' || r.city === activeCity;
      var matchCuisine = cuisine === 'all' || (r.cuisine || '').toLowerCase().includes(cuisine.toLowerCase());
      var matchPrice   = price === 'all' || String(r.price_level) === price;
      var matchSearch  = !search ||
        (r.name        || '').toLowerCase().includes(search) ||
        (r.city        || '').toLowerCase().includes(search) ||
        (r.cuisine     || '').toLowerCase().includes(search) ||
        (r.description || '').toLowerCase().includes(search);
      return matchCity && matchCuisine && matchPrice && matchSearch;
    });

    if (sort === 'name') {
      filtered.sort(function (a, b) { return (a.name || '').localeCompare(b.name || ''); });
    } else if (sort === 'price-asc') {
      filtered.sort(function (a, b) { return (a.price_level || 0) - (b.price_level || 0); });
    } else if (sort === 'price-desc') {
      filtered.sort(function (a, b) { return (b.price_level || 0) - (a.price_level || 0); });
    } else {
      filtered.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    }

    var titleEl = document.getElementById('resultsTitle');
    if (titleEl) {
      if (activeCity !== 'all') titleEl.textContent = 'Restaurants in ' + activeCity;
      else if (cuisine !== 'all') titleEl.textContent = cuisine + ' Restaurants';
      else titleEl.textContent = 'All Restaurants';
    }

    renderAll();
  };

  /* ── City pill filter ── */
  window.filterCity = function (el, city) {
    document.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
    el.classList.add('active');
    activeCity = city;
    window.applyFilters();
  };

  /* ── Search ── */
  window.applySearch = window.applyFilters;
  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') window.applyFilters();
    });
  }

  /* ── Cuisine section click ── */
  window.setCuisineFilter = function (cuisine) {
    var cf = document.getElementById('cuisineFilter');
    if (cf) cf.value = cuisine;
    window.applyFilters();
    var mc = document.querySelector('.main-content');
    if (mc) mc.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── Clear all ── */
  window.clearFilters = function () {
    activeCity = 'all';
    document.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
    var firstPill = document.querySelector('.pill');
    if (firstPill) firstPill.classList.add('active');
    var cf = document.getElementById('cuisineFilter');
    var pf = document.getElementById('priceFilter');
    var sf = document.getElementById('sortFilter');
    var si = document.getElementById('searchInput');
    if (cf) cf.value = 'all';
    if (pf) pf.value = 'all';
    if (sf) sf.value = 'featured';
    if (si) si.value = '';
    filtered = allRestaurants.slice();
    var titleEl = document.getElementById('resultsTitle');
    if (titleEl) titleEl.textContent = 'All Restaurants';
    renderAll();
  };

  /* ── Init ── */
  renderAll();
});
