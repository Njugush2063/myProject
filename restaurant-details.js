/* ============================================================
   RESTAURANT DETAILS — restaurant-details.js
   Fetches a single restaurant from Supabase by slug
   ============================================================ */

document.addEventListener('DOMContentLoaded', async function () {

  /* ── Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── Get slug from URL ── */
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('id');

  if (!slug) {
    document.getElementById('heroTitle').textContent = 'Restaurant not found';
    return;
  }

  /* ── Fetch from Supabase ── */
  let restaurant = null;
  try {
    restaurant = await getRestaurant(slug);
  } catch (err) {
    console.error('Supabase error:', err);
    document.getElementById('heroTitle').textContent = 'Could not load restaurant';
    document.getElementById('heroBg').style.background = '#1a1a1a';
    document.getElementById('breadcrumbName').textContent = 'Error';
    return;
  }

  if (!restaurant) {
    document.getElementById('heroTitle').textContent = 'Restaurant not found';
    return;
  }

  /* ── Set page title ── */
  document.title = `${restaurant.name} — Discover the Magic of Kenya`;

  /* ── Populate Page ── */
  populatePage(restaurant);
  buildGallery(restaurant.image_gallery || [restaurant.image_hero]);
  buildHighlights(restaurant.highlights || []);
  buildExperience(restaurant);
  buildMenu(restaurant);
  populateSidebar(restaurant);
  updateMap(restaurant);
  fetchSimilar(restaurant);

  /* ── Set min date for reservation ── */
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('resDate').min = today;
  document.getElementById('resDate').value = today;

  /* ── Button listeners ── */
  document.getElementById('reserveBtn').addEventListener('click', () => {
    document.getElementById('bookingSidebar').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('galleryBtn').addEventListener('click', () => {
    openLightbox(0);
  });

  /* ── Menu & Services — all three entry points go to same page ── */
  const goToMenu = () => {
    window.location.href = `restaurant-services.html?id=${restaurant.slug}`;
  };
  document.getElementById('menuBtn').addEventListener('click', goToMenu);
  document.getElementById('menuSidebarBtn').addEventListener('click', goToMenu);
  document.getElementById('menuBannerBtn').addEventListener('click', goToMenu);

});

/* ── Populate Hero & Strip ── */
function populatePage(r) {
  document.getElementById('heroBg').style.backgroundImage = `url('${r.image_hero}')`;
  set('breadcrumbName', r.name);
  set('heroCuisine', r.cuisine);
  set('heroCity', `📍 ${r.city}`);
  set('heroTitle', r.name);

  if (r.price_per_person_min && r.price_per_person_max) {
    set('heroPriceRange', `KSh ${r.price_per_person_min.toLocaleString('en-KE')} – KSh ${r.price_per_person_max.toLocaleString('en-KE')} per person`);
  } else {
    set('heroPriceRange', r.price_range || '—');
  }
  set('heroHours', r.opening_hours || 'See details');

  set('stripCuisine', r.cuisine);
  set('stripPrice', r.price_range);
  set('stripLocation', `${r.city}, Kenya`);
  set('stripHours', r.opening_hours ? r.opening_hours.split('|')[0].trim() : '—');

  set('overviewText', r.description);
  set('mapCardName', r.name);
  set('mapCardLocation', `${r.location || ''}, ${r.city}`);
}

/* ── Populate Sidebar ── */
function populateSidebar(r) {
  const priceEl = document.getElementById('sidebarPriceKsh');
  if (r.price_per_person_min && r.price_per_person_max) {
    priceEl.innerHTML = `KSh ${r.price_per_person_min.toLocaleString('en-KE')} – ${r.price_per_person_max.toLocaleString('en-KE')}`;
  } else {
    priceEl.textContent = r.price_range || '—';
  }
  set('sidebarCuisine', r.cuisine);
  set('sidebarPriceRange', buildPriceSymbol(r.price_level));
  set('sidebarHours', r.opening_hours ? r.opening_hours.split('|')[0].trim() : '—');
  set('sidebarLocation', `${r.city}, Kenya`);
}

/* ── Build Gallery ── */
function buildGallery(images) {
  const grid = document.getElementById('galleryGrid');
  if (!images || images.length === 0) { grid.style.display = 'none'; return; }
  window._galleryImages = images;
  grid.innerHTML = images.slice(0, 5).map((src, i) => `
    <img class="gal-img" src="${src}" alt="Photo ${i + 1}" loading="lazy"
         onclick="openLightbox(${i})"
         onerror="this.style.display='none'"/>
  `).join('');
}

/* ── Build Highlights ── */
function buildHighlights(highlights) {
  const grid = document.getElementById('highlightsGrid');
  if (!highlights || !highlights.length) { grid.style.display = 'none'; return; }
  grid.innerHTML = highlights.map(h => `
    <div class="highlight-item">
      <span class="highlight-check">✓</span>
      <span class="highlight-text">${h}</span>
    </div>
  `).join('');
}

/* ── Build Experience cards ── */
function buildExperience(r) {
  const defaults = [
    { icon: '🍽️', name: 'Dining Experience', desc: `${r.cuisine} cuisine in ${r.city}` },
    { icon: '🛎️', name: 'Table Service', desc: 'Attentive and friendly staff' },
    { icon: '🥂', name: 'Beverages', desc: 'Curated drinks and cocktails' },
    { icon: '🌿', name: 'Fresh Ingredients', desc: 'Locally sourced where possible' },
    { icon: '📍', name: 'Location', desc: `Conveniently located in ${r.city}` },
    { icon: '🎉', name: 'Events & Groups', desc: 'Available for private bookings' }
  ];
  const items = (r.experiences && r.experiences.length > 0) ? r.experiences : defaults;
  document.getElementById('experienceGrid').innerHTML = items.map(e => `
    <div class="exp-card">
      <div class="exp-icon">${e.icon}</div>
      <div class="exp-name">${e.name}</div>
      <div class="exp-desc">${e.desc}</div>
    </div>
  `).join('');
}

/* ── Build Menu Section ── */
function buildMenu(r) {
  const tabsEl = document.getElementById('menuTabs');
  const bodyEl = document.getElementById('menuBody');

  if (!r.menu || !r.menu.length) {
    tabsEl.style.display = 'none';
    bodyEl.innerHTML = `
      <div class="menu-empty">
        <div style="font-size:2.5rem;margin-bottom:12px">🍽️</div>
        <p>Full menu coming soon. Contact the restaurant for current offerings.</p>
      </div>`;
    return;
  }

  tabsEl.innerHTML = r.menu.map((cat, i) => `
    <button class="menu-tab ${i === 0 ? 'active' : ''}"
      onclick="switchMenuTab(${i})">${cat.category}</button>
  `).join('');

  bodyEl.innerHTML = r.menu.map((cat, i) => `
    <div class="menu-category ${i === 0 ? 'active' : ''}" id="menuCat${i}">
      <div class="menu-category-title">${cat.category}</div>
      <div class="menu-items-grid">
        ${cat.items.map(item => buildMenuItem(item)).join('')}
      </div>
    </div>
  `).join('');
}

function buildMenuItem(item) {
  const priceStr = item.price === 0
    ? `<span class="menu-item-price free">Included</span>`
    : `<span class="menu-item-price">KSh ${item.price.toLocaleString('en-KE')}</span>`;
  return `
    <div class="menu-item-card">
      <div class="menu-item-img-wrap">
        <img class="menu-item-img" src="${item.image}" alt="${item.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80'"/>
        ${item.popular ? '<div class="popular-badge">⭐ Popular</div>' : ''}
      </div>
      <div class="menu-item-body">
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-desc">${item.desc}</div>
        <div class="menu-item-footer">
          ${priceStr}
          <button class="menu-item-add">+ Add to order</button>
        </div>
      </div>
    </div>`;
}

window.switchMenuTab = function(index) {
  document.querySelectorAll('.menu-tab').forEach((t, i) => t.classList.toggle('active', i === index));
  document.querySelectorAll('.menu-category').forEach((c, i) => c.classList.toggle('active', i === index));
};

/* ── Update Map ── */
function updateMap(r) {
  const query = encodeURIComponent(`${r.name}, ${r.city}, Kenya`);
  document.getElementById('mapFrame').src = `https://www.google.com/maps?q=${query}&output=embed`;
  document.getElementById('mapOpenLink').href = `https://www.google.com/maps/search/${query}`;
}

/* ── Fetch Similar Restaurants ── */
async function fetchSimilar(r) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/restaurants?city=eq.${encodeURIComponent(r.city)}&slug=neq.${r.slug}&select=slug,name,city,cuisine,image_hero,price_range&limit=3`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const data = await res.json();
    renderSimilar(data);
  } catch (err) {
    document.getElementById('similarGrid').innerHTML = '';
  }
}

function renderSimilar(restaurants) {
  const grid = document.getElementById('similarGrid');
  if (!restaurants || restaurants.length === 0) {
    grid.closest('.similar-section').style.display = 'none';
    return;
  }
  grid.innerHTML = restaurants.map(r => `
    <a class="similar-card" href="restaurant-details.html?id=${r.slug}">
      <img src="${r.image_hero}" alt="${r.name}"
           onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80'"/>
      <div class="similar-card-body">
        <div class="similar-card-cuisine">${r.cuisine}</div>
        <div class="similar-card-name">${r.name}</div>
        <div class="similar-card-city">📍 ${r.city}</div>
      </div>
    </a>
  `).join('');
}

/* ── Price helpers ── */
function buildPriceSymbol(level) {
  let s = '';
  for (let i = 1; i <= 4; i++) s += i <= level ? 'KSh ' : '<span style="opacity:.3">KSh </span>';
  return s;
}

/* ── Guests counter ── */
let guests = 2;
window.changeGuests = function (delta) {
  guests = Math.max(1, Math.min(20, guests + delta));
  document.getElementById('guestCount').textContent = guests;
};

/* ── Submit Reservation ── */
window.submitReservation = function () {
  const date = document.getElementById('resDate').value;
  const btn = document.getElementById('reserveSubmitBtn');
  if (!date) { alert('Please select a date.'); return; }
  btn.textContent = '✅ Reservation Requested!';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    btn.textContent = '🍽️ Reserve a Table';
    btn.style.background = '';
  }, 3000);
};

/* ── Wishlist ── */
let wishlisted = false;
window.toggleWishlist = function () {
  wishlisted = !wishlisted;
  document.getElementById('wishlistBtn').textContent = wishlisted ? '❤️ Saved' : '🤍 Save Restaurant';
};

/* ── Share ── */
window.shareRestaurant = function () {
  if (navigator.share) {
    navigator.share({ title: document.title, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
};

/* ── Lightbox ── */
let lbIndex = 0;
window.openLightbox = function (i) {
  const imgs = window._galleryImages || [];
  if (!imgs.length) return;
  lbIndex = i;
  document.getElementById('lightbox').classList.add('open');
  updateLightbox();
};
window.closeLightbox = function () {
  document.getElementById('lightbox').classList.remove('open');
};
window.moveLightbox = function (dir) {
  const imgs = window._galleryImages || [];
  lbIndex = (lbIndex + dir + imgs.length) % imgs.length;
  updateLightbox();
};
function updateLightbox() {
  const imgs = window._galleryImages || [];
  document.getElementById('lbImg').src = imgs[lbIndex];
  const dots = document.getElementById('lbDots');
  dots.innerHTML = imgs.map((_, i) =>
    `<div class="lb-dot ${i === lbIndex ? 'active' : ''}" onclick="openLightbox(${i})"></div>`
  ).join('');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') moveLightbox(-1);
  if (e.key === 'ArrowRight') moveLightbox(1);
});

/* ── Util ── */
function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val;
}