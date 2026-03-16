/* ============================================================
   ATTRACTION DETAILS — attraction-details.js
   Reads ?id=slug from URL, fetches from Supabase, populates page
   ============================================================ */

document.addEventListener('DOMContentLoaded', async function () {

  /* ── Navbar scroll shadow ── */
  window.addEventListener('scroll', function () {
    document.getElementById('navbar').style.boxShadow =
      window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,.12)' : '0 2px 12px rgba(0,0,0,.07)';
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
    setTimeout(() => t.classList.remove('show'), 3000);
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
  initBooking(attraction, toast);
  initLightbox(attraction.image_gallery || [attraction.image_hero]);
  initWishlist(toast);
  initShare(attraction, toast);
  initNewsletter(toast);

});

/* ────────────────────────────────────────
   POPULATE PAGE WITH SUPABASE DATA
──────────────────────────────────────── */
function populatePage(a) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

  // Page title
  document.title = `${a.name} — Discover the Magic of Kenya`;

  // Hero background
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.style.backgroundImage = `url('${a.image_hero}')`;

  // Hero badges
  const diffBadge = document.querySelector('.badge-difficulty');
  if (diffBadge) {
    diffBadge.textContent = a.difficulty;
    diffBadge.className = `badge-difficulty ${a.difficulty.toLowerCase()}`;
  }
  const catBadge = document.querySelector('.badge-category');
  if (catBadge) catBadge.textContent = `🌍 ${a.category}`;

  // Hero title
  const h1 = document.querySelector('.hero-content h1');
  if (h1) h1.textContent = a.name;

  // Hero meta spans
  const metaLoc    = document.querySelector('.meta-location');
  const metaRating = document.querySelector('.meta-rating');
  const metaTime   = document.querySelector('.meta-time');
  if (metaLoc)    metaLoc.innerHTML    = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg> ${a.location}`;
  if (metaRating) metaRating.innerHTML = `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ${a.rating} (${a.review_count.toLocaleString()} reviews)`;
  if (metaTime)   metaTime.innerHTML   = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Best: ${a.best_time}`;

  // Breadcrumb last item
  const bc = document.querySelector('.breadcrumb span');
  if (bc) bc.textContent = a.name;

  // Quick info bar — only 3 items now
  set('info-best-time', a.best_time);
  set('info-difficulty', a.difficulty);
  set('info-climate',   a.climate);

  // Booking sidebar trip details
  set('sidebar-duration',    a.duration);
  set('sidebar-group',       a.group_size);
  set('sidebar-price-range', `KSh ${a.price_min.toLocaleString('en-KE')} – KSh ${a.price_max.toLocaleString('en-KE')}`);
  set('sidebar-price',       `KSh ${a.price_min.toLocaleString('en-KE')}`);
  const overviewEl = document.getElementById('overview-text');
  if (overviewEl) overviewEl.innerHTML = `<strong>${a.name}</strong> — ${a.description}`;

  // Highlights
  const hlList = document.getElementById('highlights-list');
  if (hlList && a.highlights) {
    hlList.innerHTML = a.highlights.map(h => `
      <div class="highlight-item">
        <div class="hl-dot"></div>
        <span>${h}</span>
      </div>
    `).join('');
  }

  // Gallery images (set via JS so JS can also pass them to lightbox)
  const gallery = a.image_gallery && a.image_gallery.length ? a.image_gallery : [a.image_hero];
  const galMain = document.querySelector('.gal-main');
  if (galMain) galMain.style.backgroundImage = `url('${gallery[0]}')`;
  document.querySelectorAll('.gal-thumb').forEach((el, i) => {
    if (gallery[i + 1]) el.style.backgroundImage = `url('${gallery[i + 1]}')`;
  });

  // Map
  set('map-pin-title', a.name);
  set('location-note', `Located in ${a.location}. Duration: ${a.duration}. Best visited: ${a.best_time}.`);
  const mapsLink = document.getElementById('maps-link');
  if (mapsLink) mapsLink.href = `https://maps.google.com/?q=${encodeURIComponent(a.name)}`;

  // Reviews
  set('rating-score', a.rating);
  set('rating-count', `${a.review_count.toLocaleString()} reviews`);

  // Booking sidebar
  set('sidebar-rating', `${a.rating} (${a.review_count.toLocaleString()} reviews)`);
}

/* ────────────────────────────────────────
   RENDER SIMILAR DESTINATIONS
──────────────────────────────────────── */
function renderSimilar(similar) {
  const grid = document.getElementById('similar-grid');
  if (!grid || !similar || similar.length === 0) return;

  grid.innerHTML = similar.map(a => `
    <div class="sim-card fade-in">
      <div class="sim-img" style="background-image:url('${a.image_hero}')">
        <span class="sim-badge ${a.difficulty.toLowerCase()}">${a.difficulty}</span>
      </div>
      <div class="sim-body">
        <div class="sim-name">${a.name}</div>
        <div class="sim-loc">📍 ${a.county} County</div>
        <div class="sim-row">
          <span class="sim-stars">★★★★★ ${a.rating}</span>
          <span class="sim-price">KSh ${a.price_min.toLocaleString('en-KE')}–${a.price_max.toLocaleString('en-KE')}</span>
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
   BOOKING SIDEBAR
──────────────────────────────────────── */
function initBooking(a, toast) {
  let count     = 2;
  let basePrice = a.price_min;

  const packages = {
    standard: a.price_min,
    premium:  Math.round(a.price_min * 1.5),
    luxury:   a.price_max,
    budget:   Math.round(a.price_min * 0.7)
  };

  function updatePrice() {
    const base  = basePrice * count;
    const tax   = Math.round(a.price_min * 0.1) * count;
    const total = base + tax;
    const countEl = document.getElementById('travCount');
    const labelEl = document.getElementById('pb-label');
    const baseEl  = document.getElementById('pbBase');
    const taxEl   = document.getElementById('pb-tax');
    const totalEl = document.getElementById('pbTotal');
    if (countEl) countEl.textContent = count;
    if (labelEl) labelEl.textContent = `KSh ${basePrice.toLocaleString('en-KE')} × ${count} travelers`;
    if (baseEl)  baseEl.textContent  = `KSh ${base.toLocaleString('en-KE')}`;
    if (taxEl)   taxEl.textContent   = `KSh ${tax.toLocaleString('en-KE')}`;
    if (totalEl) totalEl.textContent = `KSh ${total.toLocaleString('en-KE')}`;
  }

  document.getElementById('travMinus')?.addEventListener('click', () => { if (count > 1)  { count--; updatePrice(); } });
  document.getElementById('travPlus')?.addEventListener('click',  () => { if (count < 12) { count++; updatePrice(); } });
  document.getElementById('packageType')?.addEventListener('change', function () {
    basePrice = packages[this.value] || a.price_min;
    updatePrice();
  });

  // Default dates
  const fmt   = d => d.toISOString().split('T')[0];
  const today = new Date();
  const w1    = new Date(today); w1.setDate(today.getDate() + 7);
  const w2    = new Date(today); w2.setDate(today.getDate() + 10);
  const ci    = document.getElementById('checkIn');
  const co    = document.getElementById('checkOut');
  if (ci) { ci.value = fmt(w1); ci.min = fmt(today); }
  if (co)   co.value = fmt(w2);
  ci?.addEventListener('change', function () {
    const d = new Date(this.value); d.setDate(d.getDate() + 3);
    if (co) { co.min = this.value; co.value = fmt(d); }
  });

  document.getElementById('bookNowBtn')?.addEventListener('click', function () {
    if (!ci?.value || !co?.value) { toast('Please select your travel dates', 'info'); return; }
    toast('🎉 Redirecting to checkout...', 'success');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  });

  updatePrice();
}

/* ────────────────────────────────────────
   LIGHTBOX
──────────────────────────────────────── */
function initLightbox(images) {
  let current  = 0;
  const lb     = document.getElementById('lightbox');
  const lbImg  = document.getElementById('lbImg');
  const lbDots = document.getElementById('lbDots');
  if (!lb || !lbImg) return;

  lbDots.innerHTML = '';
  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'lb-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => setImg(i));
    lbDots.appendChild(dot);
  });

  function setImg(idx) {
    current = (idx + images.length) % images.length;
    lbImg.src = images[current];
    document.querySelectorAll('.lb-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  const open  = idx => { setImg(idx); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = ()  => { lb.classList.remove('open'); document.body.style.overflow = ''; };

  document.getElementById('openGallery')?.addEventListener('click',  () => open(0));
  document.getElementById('openGallery2')?.addEventListener('click', () => open(0));
  document.querySelectorAll('.gal-thumb').forEach((el, i) => el.addEventListener('click', () => open(i + 1)));
  document.querySelector('.gal-more-overlay')?.addEventListener('click', () => open(images.length - 1));
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
    this.innerHTML = saved
      ? `<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Saved!`
      : `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Save to Wishlist`;
    toast(saved ? '❤️ Added to your wishlist!' : 'Removed from wishlist', saved ? 'success' : 'info');
  });
}

/* ────────────────────────────────────────
   SHARE
──────────────────────────────────────── */
function initShare(a, toast) {
  document.querySelector('.btn-share')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: a.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast('🔗 Link copied!', 'info'));
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
        <a href="destinations.html" class="btn-book">← Back to Destinations</a>
      </div>`;
  }
}
