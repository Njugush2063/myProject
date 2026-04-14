/* ============================================================
   SAFARIQUEST — dashboard.js
   Merges all original functionality with new dashboard features.
============================================================ */

/* ════════════════════════════════════════════════════════════
   SEARCH DATA — destinations used by the live search feature
════════════════════════════════════════════════════════════ */
var SEARCH_DATA = [
  { icon: '🦁', name: 'Maasai Mara',        loc: 'Kenya',       href: 'destinations.html' },
  { icon: '🏔', name: 'Mount Kilimanjaro',   loc: 'Tanzania',    href: 'destinations.html' },
  { icon: '🏖', name: 'Diani Beach',         loc: 'Kenya',       href: 'destinations.html' },
  { icon: '🌊', name: 'Zanzibar',            loc: 'Tanzania',    href: 'destinations.html' },
  { icon: '🐘', name: 'Amboseli NP',         loc: 'Kenya',       href: 'destinations.html' },
  { icon: '🌋', name: 'Great Rift Valley',   loc: 'Kenya',       href: 'destinations.html' },
  { icon: '🦒', name: 'Samburu NP',          loc: 'Kenya',       href: 'destinations.html' },
  { icon: '🐆', name: 'Tsavo East',          loc: 'Kenya',       href: 'destinations.html' },
  { icon: '☕', name: 'Kericho Tea Farms',   loc: 'Kenya',       href: 'destinations.html' },
  { icon: '🏨', name: 'Nairobi Serena',      loc: 'Hotel',       href: 'hotels.html'       },
  { icon: '🍽', name: 'Carnivore Restaurant',loc: 'Restaurant',  href: 'restaurants.html'  },
  { icon: '🎯', name: 'Hot Air Balloon',     loc: 'Activity',    href: 'activities.html'   },
];

/* ════════════════════════════════════════════════════════════
   MAIN — runs after DOM ready
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. AUTH GUARD ──────────────────────────────────────── */
  if (!Auth.isLoggedIn()) {
    Auth.requireAuth({ action: 'dashboard' });
    return;
  }

  /* ── 2. LOAD USER FROM localStorage ────────────────────── */
  var user = Auth.getUser() || {};

  var userName  = user.name || 'Traveller';
  var firstName = userName.split(' ')[0];

  /* Update all name-bearing elements */
  var userNameEl = document.getElementById('userName');
  if (userNameEl) userNameEl.textContent = userName;

  /* Avatar initials */
  var initials = firstName.charAt(0).toUpperCase() +
                 (userName.split(' ')[1] ? userName.split(' ')[1].charAt(0).toUpperCase() : '');
  var avatarEls = document.querySelectorAll('#userAvatar, #heroAvatar');
  avatarEls.forEach(function (el) { el.textContent = initials || 'S'; });

  /* ── 3. GREETING (topbar + hero) ───────────────────────── */
  setGreeting(firstName);

  /* ── 4. LOAD BOOKINGS FROM localStorage ────────────────── */
  var bookings = [];
  try { bookings = JSON.parse(localStorage.getItem('sq_bookings') || '[]'); } catch (e) {}

  /* Update bookings badge in sidebar */
  var bookingsBadge = document.getElementById('bookingsBadge');
  if (bookingsBadge) bookingsBadge.textContent = bookings.length;

  /* Render trip list */
  renderTripList(bookings);

  /* Update stat card [0] with real booking count */
  var statVals = document.querySelectorAll('.stat-val');
  if (statVals.length > 0) {
    statVals[0].dataset.count = bookings.length;
  }

  /* ── 5. PROGRESS BAR ────────────────────────────────────── */
  setTimeout(function () {
    var fill = document.getElementById('goalFill');
    if (!fill) return;
    var pct = bookings.length > 0
      ? Math.min(bookings.length * 10 + 20, 95)
      : 53; /* default 53% when no bookings (matches original) */
    fill.style.width = pct + '%';

    var pctEl = document.getElementById('goalPct');
    if (pctEl) pctEl.textContent = pct + '%';
  }, 500);

  /* ── 6. DESTINATION TAGS ────────────────────────────────── */
  var destinations = ['Kenya','Tanzania','Uganda','Rwanda','Ethiopia','Somalia','Namibia','South Africa'];
  var tagsEl = document.getElementById('destTags');
  if (tagsEl) {
    destinations.forEach(function (name, i) {
      var tag = document.createElement('span');
      tag.className = 'dest-tag';
      tag.textContent = '✓ ' + name;
      tag.style.animationDelay = (i * 0.07) + 's';
      tagsEl.appendChild(tag);
    });
  }

  /* ── 7. ANIMATED STAT COUNTERS ─────────────────────────── */
  setTimeout(function () {
    document.querySelectorAll('.stat-val').forEach(function (el) {
      animateCount(el, parseInt(el.dataset.count, 10) || 0, 1400);
    });
  }, 350);

  /* ── 8. NAV ACTIVE STATE ────────────────────────────────── */
  document.querySelectorAll('.nav-item').forEach(function (item) {
    item.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* ── 9. HEART / SAVE BUTTONS ────────────────────────────── */
  initHeartButtons();

  /* ── 10. HERO PILL CLICK FEEDBACK ──────────────────────── */
  document.querySelectorAll('.hero-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      this.style.transform = 'scale(0.93)';
      var self = this;
      setTimeout(function () { self.style.transform = ''; }, 150);
    });
  });

  /* ── 11. FILTER TABS (Recommended section) ──────────────── */
  initFilterTabs();

  /* ── 12. TOPBAR LIVE SEARCH ─────────────────────────────── */
  initTopbarSearch();

  /* ── 13. SIDEBAR SEARCH ─────────────────────────────────── */
  initSidebarSearch();

  /* ── 14. TRIP ACTION BUTTONS ────────────────────────────── */
  initTripActions();

  /* ── 15. MOBILE SIDEBAR ─────────────────────────────────── */
  initMobileSidebar();

  /* ── 16. LOGOUT BUTTON ──────────────────────────────────── */
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function () {
      await Auth.signOut();
      window.location.href = 'login.html';
    });
  }

}); /* end DOMContentLoaded */


/* ════════════════════════════════════════════════════════════
   GREETING
════════════════════════════════════════════════════════════ */
function setGreeting(firstName) {
  var hour = new Date().getHours();
  var period;
  if (hour < 12)      period = 'morning';
  else if (hour < 17) period = 'afternoon';
  else                period = 'evening';

  var greetText  = 'Good ' + period + ' 👋';
  var heroGreet  = 'Good ' + period + ', ' + (firstName || 'Traveller') + ' 👋';

  var topbarEl = document.getElementById('greeting-text');
  if (topbarEl) topbarEl.textContent = greetText;

  var heroTitleEl = document.getElementById('heroTitle');
  if (heroTitleEl) heroTitleEl.textContent = heroGreet;
}


/* ════════════════════════════════════════════════════════════
   RENDER TRIP LIST
   — Shows real bookings from localStorage, or keeps the
     static fallback trips already in the HTML.
════════════════════════════════════════════════════════════ */
function renderTripList(bookings) {
  var tripList = document.getElementById('tripList');
  if (!tripList) return;

  if (bookings.length === 0) {
    /* No bookings — show static demo trips (already in HTML) */
    return;
  }

  /* Real bookings exist — replace HTML with dynamic list */
  tripList.innerHTML = bookings.map(function (b) {
    var statusColor = b.status === 'Confirmed' ? '#1ec99a' : '#C8A24E';
    var statusBg    = b.status === 'Confirmed' ? 'rgba(30,201,154,0.12)' : 'rgba(200,162,78,0.15)';
    return '<div class="trip-item">' +
      '<div style="width:52px;height:52px;border-radius:8px;background:rgba(107,76,42,0.1);' +
           'display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0">🌍</div>' +
      '<div class="trip-info">' +
        '<div class="trip-name">' + escHtml(b.attraction) + '</div>' +
        '<div class="trip-meta">' +
          '<span>📅 ' + escHtml(b.checkIn) + ' → ' + escHtml(b.checkOut) + '</span>' +
          '<span>👥 ' + escHtml(String(b.guests)) + ' guests</span>' +
        '</div>' +
        '<div style="font-size:11px;color:var(--text-muted);margin-top:4px">Ref: <strong>' + escHtml(b.id) + '</strong></div>' +
      '</div>' +
      '<div style="text-align:right;flex-shrink:0">' +
        '<span style="display:inline-block;padding:4px 10px;background:' + statusBg + ';' +
              'color:' + statusColor + ';border-radius:20px;font-size:11px;font-weight:700">' +
          escHtml(b.status) +
        '</span>' +
      '</div>' +
    '</div>';
  }).join('') +
  /* Add "Browse" empty-state append at bottom */
  '<div style="padding:14px 20px;border-top:1px solid var(--border)">' +
    '<a href="destinations.html" style="font-size:13px;color:var(--savanna);font-weight:500;text-decoration:none">' +
      '+ Browse more destinations →' +
    '</a>' +
  '</div>';
}


/* ════════════════════════════════════════════════════════════
   ANIMATED COUNTER
════════════════════════════════════════════════════════════ */
function animateCount(el, target, duration) {
  var start = performance.now();
  (function step(now) {
    var progress = Math.min((now - start) / duration, 1);
    var ease     = 1 - Math.pow(1 - progress, 3); /* cubic ease-out */
    el.textContent = Math.round(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  })(performance.now());
}


/* ════════════════════════════════════════════════════════════
   HEART / SAVE BUTTONS
════════════════════════════════════════════════════════════ */
function initHeartButtons() {
  document.querySelectorAll('.heart-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.classList.toggle('liked');
      var self = this;
      this.style.transform = 'scale(1.35)';
      setTimeout(function () { self.style.transform = ''; }, 200);
    });
  });
}


/* ════════════════════════════════════════════════════════════
   EXPLORE FILTER TABS
════════════════════════════════════════════════════════════ */
function initFilterTabs() {
  var tabs  = document.querySelectorAll('.filter-tab');
  var cards = document.querySelectorAll('.explore-card');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      var filter = this.getAttribute('data-filter');
      cards.forEach(function (card) {
        var cat = card.getAttribute('data-category');
        card.classList.toggle('hidden', filter !== 'all' && cat !== filter);
      });
    });
  });
}


/* ════════════════════════════════════════════════════════════
   TOPBAR LIVE SEARCH  (with dropdown results)
════════════════════════════════════════════════════════════ */
function initTopbarSearch() {
  var input    = document.getElementById('topbarSearch');
  var dropdown = document.getElementById('searchDropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', function () {
    var q = this.value.trim().toLowerCase();
    if (q.length < 1) { closeDropdown(); return; }

    var matches = SEARCH_DATA.filter(function (item) {
      return item.name.toLowerCase().includes(q) || item.loc.toLowerCase().includes(q);
    }).slice(0, 6);

    if (matches.length === 0) { closeDropdown(); return; }

    dropdown.innerHTML = matches.map(function (item) {
      return '<a class="search-result-item" href="' + item.href + '">' +
        '<span class="search-result-icon">' + item.icon + '</span>' +
        '<div>' +
          '<div class="search-result-name">' + escHtml(item.name) + '</div>' +
          '<div class="search-result-loc">' + escHtml(item.loc) + '</div>' +
        '</div>' +
      '</a>';
    }).join('');

    dropdown.classList.add('open');
  });

  /* Close on Escape */
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { input.value = ''; closeDropdown(); input.blur(); }
  });

  /* Close when clicking outside */
  document.addEventListener('click', function (e) {
    if (!input.closest('.topbar-search').contains(e.target)) closeDropdown();
  });

  function closeDropdown() { dropdown.classList.remove('open'); dropdown.innerHTML = ''; }
}


/* ════════════════════════════════════════════════════════════
   SIDEBAR SEARCH  (filters nav items)
════════════════════════════════════════════════════════════ */
function initSidebarSearch() {
  var input = document.getElementById('sidebarSearch');
  if (!input) return;

  input.addEventListener('input', function () {
    var q = this.value.trim().toLowerCase();
    document.querySelectorAll('.nav-item').forEach(function (item) {
      var text = item.textContent.toLowerCase();
      item.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  });
}


/* ════════════════════════════════════════════════════════════
   TRIP ACTION BUTTONS
════════════════════════════════════════════════════════════ */
function initTripActions() {
  /* Delegate from the list container so dynamic items also work */
  var tripList = document.getElementById('tripList');
  if (!tripList) return;

  tripList.addEventListener('click', function (e) {
    var actionBtn = e.target.closest('.trip-action');
    var secBtn    = e.target.closest('.trip-action-sec');
    var tripItem  = e.target.closest('.trip-item');

    if (actionBtn) {
      e.stopPropagation();
      var name = tripItem ? tripItem.querySelector('.trip-name') : null;
      /* TODO: open details modal or navigate */
      console.log('View details:', name ? name.textContent : '');
      return;
    }
    if (secBtn) {
      e.stopPropagation();
      var name2 = tripItem ? tripItem.querySelector('.trip-name') : null;
      /* TODO: open edit modal */
      console.log('Edit trip:', name2 ? name2.textContent : '');
      return;
    }
    /* Clicking anywhere else on the row */
    if (tripItem) {
      console.log('Row clicked');
    }
  });
}


/* ════════════════════════════════════════════════════════════
   MOBILE SIDEBAR  (toggle + Escape key)
════════════════════════════════════════════════════════════ */
function initMobileSidebar() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('overlay').classList.remove('open');
    }
  });
}

/* Called by the hamburger button and the overlay (inline onclick) */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}


/* ════════════════════════════════════════════════════════════
   UTILITY — escape HTML to prevent XSS in dynamic content
════════════════════════════════════════════════════════════ */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}