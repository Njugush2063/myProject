/* ============================================================
   ATTRACTION DETAILS — attraction-details.js
   Reads ?id=slug from URL, fetches from Supabase, populates page.
   ============================================================ */

document.addEventListener('DOMContentLoaded', async function () {

  /* ── Navbar scroll shadow ── */
  window.addEventListener('scroll', function () {
    const nav = document.getElementById('navbar');
    if (nav) {
      nav.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(0,0,0,.12)'
        : '0 2px 12px rgba(0,0,0,.07)';
    }
    const st = document.getElementById('scrollTop');
    if (st) st.classList.toggle('visible', window.scrollY > 400);
  });

  document.getElementById('scrollTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Intersection observer for fade-in ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ── Toast helper ── */
  function toast(msg, type) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast ' + (type || 'info') + ' show';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  /* ══════════════════════════════════════
     1. READ SLUG FROM URL
  ══════════════════════════════════════ */
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('id');

  if (!slug) {
    showError('No attraction specified. Please go back and select a destination.');
    return;
  }

  /* FIX: Set a readable breadcrumb immediately from the slug as a fallback,
     so it never stays as "Loading..." if data is slow or fails. */
  const bc = document.querySelector('.breadcrumb span');
  if (bc) {
    bc.textContent = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  /* ══════════════════════════════════════
     2. FETCH FROM SUPABASE
  ══════════════════════════════════════ */
  let attraction;
  try {
    attraction = await db.getAttraction(slug);
    if (!attraction) {
      showError('Attraction not found. The link may be incorrect.');
      return;
    }
  } catch (err) {
    console.error('Fetch error:', err);
    showError('Could not load details. Check your connection and try again.');
    return;
  }

  /* ══════════════════════════════════════
     3. POPULATE PAGE
  ══════════════════════════════════════ */
  populatePage(attraction);

  /* ══════════════════════════════════════
     4. FETCH SIMILAR DESTINATIONS
  ══════════════════════════════════════ */
  try {
    const similar = await db.getSimilar(attraction.category, attraction.slug);
    renderSimilar(similar);
  } catch (err) {
    console.error('Similar fetch error:', err);
  }

  /* ══════════════════════════════════════
     5. INIT INTERACTIVE FEATURES
  ══════════════════════════════════════ */

  /* Parse image_gallery safely — Supabase may return it as a JSON string.
     Always ensure image_hero is present so lightbox has at least one image. */
  let gallery = attraction.image_gallery;
  if (typeof gallery === 'string') {
    try { gallery = JSON.parse(gallery); } catch { gallery = []; }
  }
  if (!Array.isArray(gallery)) gallery = [];
  gallery = gallery.filter(Boolean);
  if (attraction.image_hero && !gallery.includes(attraction.image_hero)) {
    gallery.unshift(attraction.image_hero);
  }
  if (gallery.length === 0 && attraction.image_hero) gallery = [attraction.image_hero];

  initBooking(attraction, toast);
  initLightbox(gallery);
  initWishlist(toast);
  initShare(attraction, toast);
  initNewsletter(toast);

});

/* ────────────────────────────────────────
   POPULATE PAGE WITH SUPABASE DATA
──────────────────────────────────────── */
function populatePage(a) {
  const set    = (id, val)  => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML   = val; };

  /* Page title */
  document.title = `${a.name} — SafariQuest Kenya`;

  /* Hero background */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && a.image_hero) {
    heroBg.style.backgroundImage = `url('${a.image_hero}')`;
  }

  /* Hero badges */
  const diffBadge = document.querySelector('.badge-difficulty');
  if (diffBadge) {
    diffBadge.textContent = a.difficulty;
    diffBadge.className   = `badge-difficulty ${(a.difficulty || '').toLowerCase()}`;
  }
  const catBadge = document.querySelector('.badge-category');
  if (catBadge) catBadge.textContent = `🌍 ${a.category || 'Safari'}`;

  /* Hero title */
  const h1 = document.querySelector('.hero-content h1');
  if (h1) h1.textContent = a.name;

  /* Hero meta spans */
  const metaLoc    = document.querySelector('.meta-location');
  const metaRating = document.querySelector('.meta-rating');
  const metaTime   = document.querySelector('.meta-time');
  if (metaLoc)    metaLoc.innerHTML    = `📍 ${a.location || 'Kenya'}`;
  if (metaRating) metaRating.innerHTML = `⭐ ${a.rating} (${(a.review_count || 0).toLocaleString()} reviews)`;
  if (metaTime)   metaTime.innerHTML   = `🕐 Best: ${a.best_time || 'Year-round'}`;

  /* Breadcrumb — update with actual name now data has loaded */
  const bc = document.querySelector('.breadcrumb span');
  if (bc) bc.textContent = a.name;

  /* Quick info bar */
  set('info-best-time', a.best_time  || '—');
  set('info-difficulty', a.difficulty || '—');
  set('info-climate',    a.climate    || '—');

  /* Sidebar rating */
  set('sidebar-rating-score', a.rating || '—');
  set('sidebar-rating-count', `(${(a.review_count || 0).toLocaleString()} reviews)`);

  /* Sidebar quick details */
  set('sidebar-duration',    a.duration   || '—');
  set('sidebar-group',       a.group_size || '—');
  set('sidebar-price-range', `KSh ${(a.price_min || 0).toLocaleString('en-KE')} – KSh ${(a.price_max || 0).toLocaleString('en-KE')}`);

  /* Price display in sidebar header */
  const priceKsh = document.querySelector('.price-ksh');
  if (priceKsh) priceKsh.textContent = `KSh ${(a.price_min || 0).toLocaleString('en-KE')}`;

  /* Overview */
  const overviewEl = document.getElementById('overview-text');
  if (overviewEl) overviewEl.innerHTML = `<strong>${a.name}</strong> — ${a.description || ''}`;

  /* Highlights */
  const hlList = document.getElementById('highlights-list');
  if (hlList) {
    /* FIX: highlights may be a JSON string in Supabase */
    let highlights = a.highlights;
    if (typeof highlights === 'string') {
      try { highlights = JSON.parse(highlights); } catch { highlights = []; }
    }
    if (Array.isArray(highlights) && highlights.length) {
      hlList.innerHTML = highlights.map(h => `
        <div class="highlight-item">
          <div class="hl-dot"></div>
          <span>${h}</span>
        </div>
      `).join('');
    } else {
      hlList.innerHTML = '<p style="color:#999;font-size:.9rem">No highlights listed.</p>';
    }
  }

  /* Gallery images */
  /* FIX: parse safely in case Supabase returns image_gallery as a JSON string */
  let gallery = a.image_gallery;
  if (typeof gallery === 'string') {
    try { gallery = JSON.parse(gallery); } catch { gallery = []; }
  }
  if (!Array.isArray(gallery)) gallery = [];
  /* Remove any null/undefined/empty entries */
  gallery = gallery.filter(Boolean);

  /* Always ensure image_hero is in the gallery so the main slot is never black */
  if (a.image_hero && !gallery.includes(a.image_hero)) {
    gallery.unshift(a.image_hero);
  }
  /* Final fallback if still empty */
  if (gallery.length === 0 && a.image_hero) gallery = [a.image_hero];

  const galMain = document.querySelector('.gal-main');
  if (galMain && gallery[0]) galMain.style.backgroundImage = `url('${gallery[0]}')`;

  document.querySelectorAll('.gal-thumb').forEach((el, i) => {
    /* i+1 so thumbs show images after the main slot */
    const src = gallery[i + 1] || gallery[0]; /* fallback to first if not enough images */
    if (src) el.style.backgroundImage = `url('${src}')`;
  });

  /* Map */
  set('map-pin-title', a.name);
  set('location-note', `Located in ${a.location || 'Kenya'}. Duration: ${a.duration || '—'}. Best visited: ${a.best_time || '—'}.`);
  const mapsLink = document.getElementById('maps-link');
  if (mapsLink) mapsLink.href = `https://maps.google.com/?q=${encodeURIComponent(a.name + ' ' + (a.location || 'Kenya'))}`;

  /* Reviews section */
  set('rating-score', a.rating || '—');
  set('rating-count', `${(a.review_count || 0).toLocaleString()} reviews`);

  /* FIX: removed dead set('display-price') and set('sidebar-rating') calls —
     those element IDs do not exist in the HTML */
}

/* ────────────────────────────────────────
   RENDER SIMILAR DESTINATIONS
──────────────────────────────────────── */
function renderSimilar(similar) {
  const grid = document.getElementById('similar-grid');
  if (!grid || !similar || similar.length === 0) {
    if (grid) grid.innerHTML = '<p style="color:#999;font-size:.9rem">No similar destinations found.</p>';
    return;
  }

  grid.innerHTML = similar.map(a => `
    <div class="sim-card fade-in">
      <div class="sim-img" style="background-image:url('${a.image_hero || ''}')">
        <span class="sim-badge ${(a.difficulty || '').toLowerCase()}">${a.difficulty || ''}</span>
      </div>
      <div class="sim-body">
        <div class="sim-name">${a.name}</div>
        <div class="sim-loc">📍 ${a.county || ''} County</div>
        <div class="sim-row">
          <span class="sim-stars">★★★★★ ${a.rating || ''}</span>
          <span class="sim-price">KSh ${(a.price_min || 0).toLocaleString('en-KE')}–${(a.price_max || 0).toLocaleString('en-KE')}</span>
        </div>
        <a href="attraction-details.html?id=${a.slug}" class="sim-link">Explore →</a>
      </div>
    </div>
  `).join('');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

/* ────────────────────────────────────────
   BOOKING PANEL
──────────────────────────────────────── */
function initBooking(a, toast) {
  let count     = 2;
  let basePrice = a.price_min || 0;
  let nights    = 3;

  const packages = {
    standard: { price: a.price_min,                          nights: 3 },
    premium:  { price: Math.round((a.price_min || 0) * 1.5), nights: 5 },
    luxury:   { price: a.price_max,                          nights: 7 },
    budget:   { price: Math.round((a.price_min || 0) * 0.7), nights: 2 }
  };

  const fmtK  = n => 'KSh ' + Math.round(n).toLocaleString('en-KE');
  const fmtD  = d => d.toISOString().split('T')[0];
  const today = new Date();
  const w1    = new Date(today); w1.setDate(today.getDate() + 7);
  const w2    = new Date(today); w2.setDate(today.getDate() + 10);

  const ci = document.getElementById('checkIn');
  const co = document.getElementById('checkOut');

  if (ci) { ci.value = fmtD(w1); ci.min = fmtD(today); }
  /* FIX: checkOut was missing a min attribute, allowing invalid past/same-day dates */
  if (co) { co.value = fmtD(w2); co.min = fmtD(w1); }

  function getNights() {
    if (ci?.value && co?.value) {
      const diff = (new Date(co.value) - new Date(ci.value)) / 86400000;
      return diff > 0 ? Math.round(diff) : nights;
    }
    return nights;
  }

  function update() {
    const n     = getNights();
    const base  = basePrice * n * count;
    const tax   = Math.round(base * 0.0333);
    const total = base + tax;

    const priceKsh = document.querySelector('.price-ksh');
    if (priceKsh) priceKsh.textContent = `KSh ${Math.round(basePrice).toLocaleString('en-KE')}`;

    const el = id => document.getElementById(id);
    if (el('travCount'))  el('travCount').textContent  = count;
    if (el('pb-nights'))  el('pb-nights').textContent  = `${n} nights × ${count} traveler${count !== 1 ? 's' : ''}`;
    if (el('pb-label'))   el('pb-label').textContent   = `${fmtK(basePrice)} × ${n} nights × ${count}`;
    if (el('pbBase'))     el('pbBase').textContent     = fmtK(base);
    if (el('pb-tax'))     el('pb-tax').textContent     = fmtK(tax);
    if (el('pbTotal'))    el('pbTotal').textContent    = fmtK(total);

    const minus = el('travMinus');
    const plus  = el('travPlus');
    if (minus) minus.disabled = count <= 1;
    if (plus)  plus.disabled  = count >= 12;
  }

  document.getElementById('travMinus')?.addEventListener('click', () => { if (count > 1)  { count--; update(); } });
  document.getElementById('travPlus')?.addEventListener('click',  () => { if (count < 12) { count++; update(); } });

  document.getElementById('packageType')?.addEventListener('change', function () {
    const pkg = packages[this.value];
    if (pkg) {
      basePrice = pkg.price || 0;
      nights    = pkg.nights;
      if (ci?.value) {
        const d = new Date(ci.value);
        d.setDate(d.getDate() + pkg.nights);
        if (co) { co.min = ci.value; co.value = fmtD(d); }
      }
    }
    update();
  });

  ci?.addEventListener('change', function () {
    const d = new Date(this.value);
    d.setDate(d.getDate() + nights);
    if (co) { co.min = this.value; co.value = fmtD(d); }
    update();
  });
  co?.addEventListener('change', () => update());

  document.getElementById('bookNowBtn')?.addEventListener('click', function () {
    if (!ci?.value || !co?.value) {
      toast('Please select your travel dates', 'info');
      return;
    }
    const orig = this.innerHTML;
    this.textContent = '🎉 Redirecting...';
    this.style.background = '#1ec99a';
    setTimeout(() => {
      this.innerHTML = orig;
      this.style.background = '';
      window.location.href = 'login.html';
    }, 1800);
  });

  update();
}

/* ────────────────────────────────────────
   LIGHTBOX
──────────────────────────────────────── */
function initLightbox(images) {
  if (!images || images.length === 0) return;

  let current  = 0;
  const lb     = document.getElementById('lightbox');
  const lbImg  = document.getElementById('lbImg');
  const lbDots = document.getElementById('lbDots');
  if (!lb || !lbImg) return;

  /* Build dot navigation */
  lbDots.innerHTML = '';
  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'lb-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => setImg(i));
    lbDots.appendChild(dot);
  });

  function setImg(idx) {
    current  = (idx + images.length) % images.length;
    lbImg.src = images[current];
    document.querySelectorAll('.lb-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  const open  = idx => { setImg(idx); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = ()  => { lb.classList.remove('open'); document.body.style.overflow = ''; };

  document.getElementById('openGallery')?.addEventListener('click',  () => open(0));
  document.getElementById('openGallery2')?.addEventListener('click', () => open(0));
  document.querySelectorAll('.gal-thumb').forEach((el, i) => el.addEventListener('click', () => open(i + 1)));
  document.getElementById('lbClose')?.addEventListener('click', close);
  document.getElementById('lbPrev')?.addEventListener('click',  () => setImg(current - 1));
  document.getElementById('lbNext')?.addEventListener('click',  () => setImg(current + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  setImg(current - 1);
    if (e.key === 'ArrowRight') setImg(current + 1);
    if (e.key === 'Escape')     close();
  });
}

/* ────────────────────────────────────────
   WISHLIST
──────────────────────────────────────── */
function initWishlist(toast) {
  let saved = false;
  document.getElementById('wishlistBtn')?.addEventListener('click', function () {
    saved = !saved;
    this.classList.toggle('saved', saved);
    /* FIX: removed <br> tag from innerHTML — it caused icon + text misalignment */
    this.innerHTML = saved
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Saved!`
      : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Save to Wishlist`;
    toast(saved ? '❤️ Added to your wishlist!' : 'Removed from wishlist', saved ? 'success' : 'info');
  });
}

/* ────────────────────────────────────────
   SHARE
──────────────────────────────────────── */
function initShare(a, toast) {
  document.querySelector('.btn-share')?.addEventListener('click', function () {
    if (navigator.share) {
      navigator.share({ title: a.name, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href).then(() => {
        const orig = this.innerHTML;
        this.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
        setTimeout(() => { this.innerHTML = orig; }, 2000);
      });
    }
  });
}

/* ────────────────────────────────────────
   NEWSLETTER
──────────────────────────────────────── */
function initNewsletter(toast) {
  document.querySelector('.newsletter-btn')?.addEventListener('click', function () {
    const input = document.querySelector('.newsletter-input');
    if (input?.value.includes('@')) {
      toast('✓ Subscribed! Welcome aboard.', 'success');
      input.value = '';
    } else if (input) {
      input.classList.add('input-error');
      setTimeout(() => input.classList.remove('input-error'), 1500);
    }
  });

  document.querySelector('.btn-all-reviews')?.addEventListener('click', () => {
    toast('Full reviews coming soon!', 'info');
  });
}

/* ────────────────────────────────────────
   ERROR STATE
──────────────────────────────────────── */
function showError(message) {
  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Oops!</h2>
        <p>${message}</p>
        <a href="destinations.html" class="btn-book" style="display:inline-flex;text-decoration:none">← Back to Destinations</a>
      </div>`;
  }
}
