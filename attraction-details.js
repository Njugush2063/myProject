/* ============================================================
   ATTRACTION DETAILS — attraction-details.js
   SafariQuest Kenya
   Reads from window.ATTRACTIONS_DATA (local, attractions-data.js).
   NO Supabase dependency — works fully on GitHub Pages.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Navbar scroll shadow ── */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (navbar) {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(0,0,0,.12)'
        : '0 2px 12px rgba(0,0,0,.07)';
    }
    var st = document.getElementById('scrollTop');
    if (st) st.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  document.getElementById('scrollTop') &&
    document.getElementById('scrollTop').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  /* ── Hero bg zoom ── */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) setTimeout(function () { heroBg.classList.add('loaded'); }, 100);

  /* ── Intersection observer for fade-in ── */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in').forEach(function (el) { observer.observe(el); });

  /* ── Toast helper ── */
  function toast(msg, type) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast ' + (type || 'info') + ' show';
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 3000);
  }

  /* ══════════════════════════════════════
     1. READ SLUG FROM URL
  ══════════════════════════════════════ */
  var params = new URLSearchParams(window.location.search);
  var slug   = params.get('id');

  if (!slug) {
    showError('No attraction specified. Please go back and select a destination.');
    return;
  }

  /* Immediate breadcrumb fallback from slug */
  var bc = document.querySelector('.breadcrumb span');
  if (bc) {
    bc.textContent = slug.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  /* ══════════════════════════════════════
     2. FIND IN LOCAL DATA
  ══════════════════════════════════════ */
  if (!window.ATTRACTIONS_DATA || !Array.isArray(window.ATTRACTIONS_DATA)) {
    showError('Attraction data could not be loaded. Please refresh the page.');
    return;
  }

  var attraction = window.ATTRACTIONS_DATA.find(function (d) { return d.slug === slug; });

  if (!attraction) {
    showError('Destination "' + slug + '" was not found. Please go back and select a valid destination.');
    return;
  }

  /* ══════════════════════════════════════
     3. POPULATE PAGE
  ══════════════════════════════════════ */
  populatePage(attraction);

  /* ══════════════════════════════════════
     4. SIMILAR DESTINATIONS (from local data)
  ══════════════════════════════════════ */
  var similar = window.ATTRACTIONS_DATA
    .filter(function (d) { return d.slug !== attraction.slug && d.category === attraction.category; })
    .slice(0, 3);
  renderSimilar(similar);

  /* ══════════════════════════════════════
     5. INIT INTERACTIVE FEATURES
  ══════════════════════════════════════ */
  var gallery = attraction.image_gallery || [];
  if (typeof gallery === 'string') {
    try { gallery = JSON.parse(gallery); } catch (e) { gallery = []; }
  }
  if (!Array.isArray(gallery)) gallery = [];
  gallery = gallery.filter(Boolean);
  if (attraction.image_hero && gallery.indexOf(attraction.image_hero) === -1) {
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
   POPULATE PAGE
──────────────────────────────────────── */
function populatePage(a) {
  function set(id, val) {
    var el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.textContent = val;
  }
  function setHTML(id, val) {
    var el = document.getElementById(id);
    if (el && val !== undefined) el.innerHTML = val;
  }
  function setQ(sel, val) {
    var el = document.querySelector(sel);
    if (el && val !== undefined && val !== null) el.textContent = val;
  }
  function setQHTML(sel, val) {
    var el = document.querySelector(sel);
    if (el && val !== undefined) el.innerHTML = val;
  }

  document.title = a.name + ' — SafariQuest Kenya';

  /* Hero background */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg && a.image_hero) {
    heroBg.style.backgroundImage = "url('" + a.image_hero + "')";
  }

  /* Badges */
  var diffBadge = document.querySelector('.badge-difficulty');
  if (diffBadge) {
    diffBadge.textContent = a.difficulty || '';
    diffBadge.className   = 'badge-difficulty ' + (a.difficulty || '').toLowerCase();
  }
  var catBadge = document.querySelector('.badge-category');
  if (catBadge) catBadge.textContent = '🌍 ' + (a.category || 'Safari');

  /* Hero title */
  var h1 = document.querySelector('.hero-content h1');
  if (h1) h1.textContent = a.name;

  /* Hero meta */
  setQHTML('.meta-location', '📍 ' + (a.region || a.location || 'Kenya'));
  setQHTML('.meta-rating',   '⭐ ' + a.rating + ' (' + ((a.reviewCount || a.review_count || 128)) + ' reviews)');
  setQHTML('.meta-time',     '🕐 Best: ' + (a.bestTime || a.best_time || 'Year-round'));

  /* Breadcrumb */
  var bc = document.querySelector('.breadcrumb span');
  if (bc) bc.textContent = a.name;

  /* Quick info bar */
  set('info-best-time',  a.bestTime || a.best_time || '—');
  set('info-difficulty', a.difficulty || '—');
  set('info-climate',    a.climate || '—');

  /* Sidebar rating */
  set('sidebar-rating-score', a.rating || '—');
  set('sidebar-rating-count', '(' + (a.reviewCount || a.review_count || 128) + ' reviews)');

  /* Sidebar quick details */
  set('sidebar-duration',    a.duration   || '3–7 days');
  set('sidebar-group',       a.group_size || a.groupSize || 'Any size');

  var priceMin = a.price_from || a.price_min || 0;
  var priceMax = a.price_max  || Math.round(priceMin * 2.5);
  set('sidebar-price-range', 'KSh ' + Number(priceMin).toLocaleString() + ' – KSh ' + Number(priceMax).toLocaleString());

  var priceKsh = document.querySelector('.price-ksh');
  if (priceKsh) priceKsh.textContent = 'KSh ' + Number(priceMin).toLocaleString();

  /* Overview */
  var overviewEl = document.getElementById('overview-text');
  if (overviewEl) overviewEl.innerHTML = '<strong>' + a.name + '</strong> — ' + (a.description || '');

  /* Highlights */
  var hlList = document.getElementById('highlights-list');
  if (hlList) {
    var highlights = a.highlights || [];
    if (typeof highlights === 'string') {
      try { highlights = JSON.parse(highlights); } catch (e) { highlights = []; }
    }
    if (Array.isArray(highlights) && highlights.length) {
      hlList.innerHTML = highlights.map(function (h) {
        return '<div class="highlight-item"><div class="hl-dot"></div><span>' + h + '</span></div>';
      }).join('');
    } else {
      hlList.innerHTML = '<p style="color:#999;font-size:.9rem">No highlights listed.</p>';
    }
  }

  /* Gallery */
  var gallery = a.image_gallery || [];
  if (typeof gallery === 'string') { try { gallery = JSON.parse(gallery); } catch (e) { gallery = []; } }
  if (!Array.isArray(gallery)) gallery = [];
  gallery = gallery.filter(Boolean);
  if (a.image_hero && gallery.indexOf(a.image_hero) === -1) gallery.unshift(a.image_hero);
  if (gallery.length === 0 && a.image_hero) gallery = [a.image_hero];

  var galMain = document.querySelector('.gal-main');
  if (galMain && gallery[0]) galMain.style.backgroundImage = "url('" + gallery[0] + "')";
  document.querySelectorAll('.gal-thumb').forEach(function (el, i) {
    var src = gallery[i + 1] || gallery[0];
    if (src) el.style.backgroundImage = "url('" + src + "')";
  });

  /* Map */
  set('map-pin-title', a.name);
  set('location-note', 'Located in ' + (a.region || 'Kenya') + '. Duration: ' + (a.duration || '—') + '. Best visited: ' + (a.bestTime || a.best_time || '—') + '.');
  var mapsLink = document.getElementById('maps-link');
  if (mapsLink) mapsLink.href = 'https://maps.google.com/?q=' + encodeURIComponent(a.name + ' ' + (a.region || 'Kenya'));

  /* Reviews */
  set('rating-score', a.rating || '—');
  set('rating-count', (a.reviewCount || a.review_count || 128) + ' reviews');
}

/* ────────────────────────────────────────
   RENDER SIMILAR DESTINATIONS
──────────────────────────────────────── */
function renderSimilar(similar) {
  var grid = document.getElementById('similar-grid');
  if (!grid) return;
  if (!similar || similar.length === 0) {
    grid.innerHTML = '<p style="color:#999;font-size:.9rem">No similar destinations found.</p>';
    return;
  }
  grid.innerHTML = similar.map(function (a) {
    var priceMin = a.price_from || a.price_min || 0;
    var priceMax = a.price_max  || Math.round(priceMin * 2.5);
    return '<div class="sim-card fade-in">' +
      '<div class="sim-img" style="background-image:url(\'' + (a.image_hero || '') + '\')">' +
        '<span class="sim-badge ' + (a.difficulty || '').toLowerCase() + '">' + (a.difficulty || '') + '</span>' +
      '</div>' +
      '<div class="sim-body">' +
        '<div class="sim-name">' + a.name + '</div>' +
        '<div class="sim-loc">📍 ' + (a.region || '') + '</div>' +
        '<div class="sim-row">' +
          '<span class="sim-stars">★★★★★ ' + a.rating + '</span>' +
          '<span class="sim-price">KSh ' + Number(priceMin).toLocaleString() + '–' + Number(priceMax).toLocaleString() + '</span>' +
        '</div>' +
        '<a href="attraction-details.html?id=' + a.slug + '" class="sim-link">Explore →</a>' +
      '</div>' +
    '</div>';
  }).join('');

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.fade-in').forEach(function (el) { obs.observe(el); });
}

/* ────────────────────────────────────────
   BOOKING PANEL
──────────────────────────────────────── */
function initBooking(a, toast) {
  var count    = 2;
  var priceMin = a.price_from || a.price_min || 0;
  var basePrice = priceMin;
  var nights   = 3;

  var packages = {
    standard: { price: priceMin,                        nights: 3 },
    premium:  { price: Math.round(priceMin * 1.5),      nights: 5 },
    luxury:   { price: a.price_max || Math.round(priceMin * 2.5), nights: 7 },
    budget:   { price: Math.round(priceMin * 0.7),      nights: 2 }
  };

  function fmtK(n)  { return 'KSh ' + Math.round(n).toLocaleString(); }
  function fmtD(d)  { return d.toISOString().split('T')[0]; }

  var today = new Date();
  var w1 = new Date(today); w1.setDate(today.getDate() + 7);
  var w2 = new Date(today); w2.setDate(today.getDate() + 10);

  var ci = document.getElementById('checkIn');
  var co = document.getElementById('checkOut');
  if (ci) { ci.value = fmtD(w1); ci.min = fmtD(today); }
  if (co) { co.value = fmtD(w2); co.min = fmtD(w1); }

  function getNights() {
    if (ci && co && ci.value && co.value) {
      var diff = (new Date(co.value) - new Date(ci.value)) / 86400000;
      return diff > 0 ? Math.round(diff) : nights;
    }
    return nights;
  }

  function el(id) { return document.getElementById(id); }

  function update() {
    var n     = getNights();
    var base  = basePrice * n * count;
    var tax   = Math.round(base * 0.0333);
    var total = base + tax;

    var priceKsh = document.querySelector('.price-ksh');
    if (priceKsh) priceKsh.textContent = 'KSh ' + Math.round(basePrice).toLocaleString();
    if (el('travCount'))  el('travCount').textContent  = count;
    if (el('pb-nights'))  el('pb-nights').textContent  = n + ' nights × ' + count + ' traveler' + (count !== 1 ? 's' : '');
    if (el('pb-label'))   el('pb-label').textContent   = fmtK(basePrice) + ' × ' + n + ' nights × ' + count;
    if (el('pbBase'))     el('pbBase').textContent     = fmtK(base);
    if (el('pb-tax'))     el('pb-tax').textContent     = fmtK(tax);
    if (el('pbTotal'))    el('pbTotal').textContent    = fmtK(total);

    var minus = el('travMinus');
    var plus  = el('travPlus');
    if (minus) minus.disabled = count <= 1;
    if (plus)  plus.disabled  = count >= 12;
  }

  el('travMinus') && el('travMinus').addEventListener('click', function () { if (count > 1)  { count--; update(); } });
  el('travPlus')  && el('travPlus').addEventListener('click',  function () { if (count < 12) { count++; update(); } });

  el('packageType') && el('packageType').addEventListener('change', function () {
    var pkg = packages[this.value];
    if (pkg) {
      basePrice = pkg.price || 0;
      nights    = pkg.nights;
      if (ci && ci.value) {
        var d = new Date(ci.value);
        d.setDate(d.getDate() + pkg.nights);
        if (co) { co.min = ci.value; co.value = fmtD(d); }
      }
    }
    update();
  });

  ci && ci.addEventListener('change', function () {
    var d = new Date(this.value);
    d.setDate(d.getDate() + nights);
    if (co) { co.min = this.value; co.value = fmtD(d); }
    update();
  });

  co && co.addEventListener('change', function () { update(); });

  el('bookNowBtn') && el('bookNowBtn').addEventListener('click', function () {
    if (!ci || !ci.value || !co || !co.value) {
      toast('Please select your travel dates', 'info');
      return;
    }

    var btn  = this;
    var orig = btn.innerHTML;
    btn.textContent = '⏳ Processing...';
    btn.disabled = true;
    btn.style.background = '#1ec99a';

    setTimeout(function () {
      var n     = getNights();
      var base  = basePrice * n * count;
      var tax   = Math.round(base * 0.0333);
      var total = base + tax;

      var booking = {
        id: 'SQ' + Math.floor(100000 + Math.random() * 900000),
        attraction: a.name,
        slug: a.slug,
        checkIn:  ci.value,
        checkOut: co.value,
        guests:   count,
        nights:   n,
        total:    'KSh ' + total.toLocaleString(),
        status:   'Confirmed',
        bookedAt: new Date().toISOString()
      };

      var existing = [];
      try { existing = JSON.parse(localStorage.getItem('sq_bookings') || '[]'); } catch (e) {}
      existing.unshift(booking);
      localStorage.setItem('sq_bookings', JSON.stringify(existing));

      btn.innerHTML = orig;
      btn.disabled = false;
      btn.style.background = '';

      showBookingConfirmation(booking);
    }, 1500);
  });

  update();
}

/* ────────────────────────────────────────
   LIGHTBOX
──────────────────────────────────────── */
function initLightbox(images) {
  if (!images || images.length === 0) return;
  var current = 0;
  var lb    = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbDots = document.getElementById('lbDots');
  if (!lb || !lbImg) return;

  if (lbDots) {
    lbDots.innerHTML = '';
    images.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'lb-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function () { setImg(i); });
      lbDots.appendChild(dot);
    });
  }

  function setImg(idx) {
    current = (idx + images.length) % images.length;
    lbImg.src = images[current];
    document.querySelectorAll('.lb-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function open(idx)  { setImg(idx); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close()    { lb.classList.remove('open'); document.body.style.overflow = ''; }

  var og  = document.getElementById('openGallery');
  var og2 = document.getElementById('openGallery2');
  if (og)  og.addEventListener('click',  function () { open(0); });
  if (og2) og2.addEventListener('click', function () { open(0); });

  document.querySelectorAll('.gal-thumb').forEach(function (el, i) {
    el.addEventListener('click', function () { open(i + 1); });
  });

  var lbClose = document.getElementById('lbClose');
  var lbPrev  = document.getElementById('lbPrev');
  var lbNext  = document.getElementById('lbNext');
  if (lbClose) lbClose.addEventListener('click', close);
  if (lbPrev)  lbPrev.addEventListener('click',  function () { setImg(current - 1); });
  if (lbNext)  lbNext.addEventListener('click',  function () { setImg(current + 1); });

  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
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
  var saved = false;
  var btn = document.getElementById('wishlistBtn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    saved = !saved;
    btn.classList.toggle('saved', saved);
    btn.innerHTML = saved
      ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Saved!'
      : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Save to Wishlist';
    toast(saved ? '❤️ Added to your wishlist!' : 'Removed from wishlist', saved ? 'success' : 'info');
  });
}

/* ────────────────────────────────────────
   SHARE
──────────────────────────────────────── */
function initShare(a, toast) {
  var btn = document.querySelector('.btn-share');
  if (!btn) return;
  btn.addEventListener('click', function () {
    if (navigator.share) {
      navigator.share({ title: a.name, url: window.location.href });
    } else if (navigator.clipboard) {
      var self = this;
      var orig = self.innerHTML;
      navigator.clipboard.writeText(window.location.href).then(function () {
        self.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
        setTimeout(function () { self.innerHTML = orig; }, 2000);
      });
    }
  });
}

/* ────────────────────────────────────────
   NEWSLETTER
──────────────────────────────────────── */
function initNewsletter(toast) {
  var newsBtn = document.querySelector('.newsletter-btn');
  if (newsBtn) {
    newsBtn.addEventListener('click', function () {
      var input = document.querySelector('.newsletter-input');
      if (input && input.value.includes('@')) {
        toast('✓ Subscribed! Welcome aboard.', 'success');
        input.value = '';
      } else if (input) {
        input.classList.add('input-error');
        setTimeout(function () { input.classList.remove('input-error'); }, 1500);
      }
    });
  }
  var reviewsBtn = document.querySelector('.btn-all-reviews');
  if (reviewsBtn) {
    reviewsBtn.addEventListener('click', function () {
      toast('Full reviews coming soon!', 'info');
    });
  }
}

/* ────────────────────────────────────────
   ERROR STATE
──────────────────────────────────────── */
function showError(message) {
  var hero = document.querySelector('.hero-content');
  if (hero) {
    hero.innerHTML = '<div class="error-state">' +
      '<div class="error-icon">⚠️</div>' +
      '<h2>Oops!</h2>' +
      '<p>' + message + '</p>' +
      '<a href="destinations.html" class="btn-book" style="display:inline-flex;text-decoration:none">← Back to Destinations</a>' +
      '</div>';
  }
}

/* ────────────────────────────────────────
   BOOKING CONFIRMATION MODAL (M-Pesa sim)
──────────────────────────────────────── */
function showBookingConfirmation(booking) {
  var existing = document.getElementById('sq-booking-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'sq-booking-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;backdrop-filter:blur(4px);';
  modal.innerHTML = '<div style="background:#fff;border-radius:20px;max-width:420px;width:100%;padding:32px;text-align:center;animation:slideUp .3s ease">' +
    '<div style="font-size:3rem;margin-bottom:8px">🎉</div>' +
    '<h2 style="color:#1a3c2e;margin:0 0 6px">Booking Confirmed!</h2>' +
    '<p style="color:#666;margin:0 0 20px;font-size:.9rem">Booking ref: <strong>' + booking.id + '</strong></p>' +
    '<div style="background:#f0f9f4;border-radius:12px;padding:16px;margin-bottom:24px;text-align:left">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#666;font-size:.85rem">Destination</span><span style="font-weight:600;font-size:.85rem">' + booking.attraction + '</span></div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#666;font-size:.85rem">Check-in</span><span style="font-weight:600;font-size:.85rem">' + booking.checkIn + '</span></div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#666;font-size:.85rem">Check-out</span><span style="font-weight:600;font-size:.85rem">' + booking.checkOut + '</span></div>' +
      '<div style="display:flex;justify-content:space-between"><span style="color:#666;font-size:.85rem">Guests</span><span style="font-weight:600;font-size:.85rem">' + booking.guests + '</span></div>' +
    '</div>' +
    '<div style="background:#4caf50;border-radius:12px;padding:16px;margin-bottom:20px;color:#fff">' +
      '<div style="font-size:1.1rem;font-weight:700;margin-bottom:4px">🟢 M-Pesa Payment</div>' +
      '<div style="font-size:.82rem;opacity:.9">A payment request has been sent to your M-Pesa.</div>' +
      '<div style="font-size:.82rem;opacity:.9;margin-top:4px">Enter your PIN to complete the transaction.</div>' +
      '<div style="background:rgba(255,255,255,.2);border-radius:8px;padding:10px;margin-top:12px">' +
        '<div style="font-size:.78rem;opacity:.85">Transaction ID</div>' +
        '<div style="font-size:1rem;font-weight:700;letter-spacing:2px">MP' + booking.id + '</div>' +
      '</div>' +
    '</div>' +
    '<div style="display:flex;gap:12px">' +
      '<button onclick="document.getElementById(\'sq-booking-modal\').remove()" style="flex:1;padding:12px;border:2px solid #e0e0e0;border-radius:10px;background:#fff;cursor:pointer;font-size:.9rem">Close</button>' +
      '<a href="dashboard.html" style="flex:1;padding:12px;background:#E8732A;color:#fff;border-radius:10px;text-decoration:none;font-size:.9rem;font-weight:600;display:inline-flex;align-items:center;justify-content:center">View My Bookings</a>' +
    '</div>' +
  '</div>' +
  '<style>@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}</style>';

  document.body.appendChild(modal);
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
}
