/* ============================================================
   SAFARIQUEST — script.js
   ============================================================ */

/* ─────────────────────────────────────────
   DATA: DESTINATIONS
───────────────────────────────────────── */
const destinations = [
  {
    name:   'Maasai Mara',
    tag:    'Safari Tours',
    rating: 4.8,
    stars:  5,
    slug:   'maasai-mara',
    img:    'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=600&q=80'
  },
  {
    name:   'Diani Beach',
    tag:    'Beach Paradise',
    rating: 4.6,
    stars:  4,
    slug:   'diani-beach',
    img:    'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&q=80'
  },
  {
    name:   'Mount Kenya',
    tag:    'Mountain Adventure',
    rating: 4.9,
    stars:  5,
    slug:   'mount-kenya',
    img:    'https://images.unsplash.com/photo-1589825743638-54a8ee3b6d67?w=600&q=80'
  },
  {
    name:   'Lake Nakuru',
    tag:    'Flamingo Paradise',
    rating: 4.7,
    stars:  4,
    slug:   'lake-nakuru',
    img:    'https://images.unsplash.com/photo-1564760290292-23341e4df6ec?w=600&q=80'
  },
  {
    name:   'Amboseli National Park',
    tag:    'Elephant Safari',
    rating: 4.8,
    stars:  5,
    slug:   'amboseli',
    img:    'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=600&q=80'
  },
  {
    name:   'Samburu National Reserve',
    tag:    'Rare Wildlife',
    rating: 4.7,
    stars:  4,
    slug:   'samburu',
    img:    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80'
  }
];

/* ─────────────────────────────────────────
   DATA: EVENTS
───────────────────────────────────────── */
const events = [
  {
    title:    'Lamu Cultural Festival',
    date:     'March 15–17, 2026',
    location: 'Lamu Island',
    desc:     'Experience traditional Swahili culture with dhow races, donkey races, and local cuisine.',
    img:      'https://images.unsplash.com/photo-1541532713592-79a0317b272b?w=500&q=80'
  },
  {
    title:    'Nairobi Music Festival',
    date:     'April 8–10, 2026',
    location: 'Nairobi',
    desc:     'Three days of incredible music featuring local and international artists.',
    img:      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&q=80'
  },
  {
    title:    'Maasai Mara Migration',
    date:     'July – September',
    location: 'Maasai Mara',
    desc:     'Witness the greatest wildlife show on earth — the Great Wildebeest Migration.',
    img:      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=500&q=80'
  },
  {
    title:    'Mombasa Carnival',
    date:     'December 20–25, 2026',
    location: 'Mombasa',
    desc:     'Coastal celebration with street parades, music, dance, and authentic cuisine.',
    img:      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80'
  }
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function renderStars(count, total = 5) {
  return Array.from({ length: total }, (_, i) =>
    `<span style="color:${i < count ? '#F5A623' : '#ddd'}">&#9733;</span>`
  ).join('');
}

function calendarIcon() {
  return `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>`;
}

function pinIcon() {
  return `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
  </svg>`;
}

/* ─────────────────────────────────────────
   RENDER: DESTINATION CARDS
───────────────────────────────────────── */
function renderDestinations() {
  const grid = document.getElementById('destGrid');
  if (!grid) return;

  destinations.forEach(dest => {
    const card = document.createElement('div');
    card.className = 'dest-card';
    card.style.cursor = 'pointer';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'View ' + dest.name);

    card.innerHTML = `
      <div class="dest-img-wrap">
        <img src="${dest.img}" alt="${dest.name}" loading="lazy" />
        <div class="dest-overlay">
          <h3>${dest.name}</h3>
          <span>${dest.tag}</span>
        </div>
      </div>
      <div class="dest-footer">
        <span class="stars">${renderStars(dest.stars)}</span>
        <span class="rating">${dest.rating}</span>
      </div>
    `;

    const navigate = () => {
      window.location.href = 'attraction-details.html?id=' + dest.slug;
    };
    card.addEventListener('click', navigate);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(); }
    });

    grid.appendChild(card);
  });
}

/* ─────────────────────────────────────────
   SEARCH WITH SUPABASE SUGGESTIONS
───────────────────────────────────────── */

/* Cache so we don't re-fetch on every keystroke */
let _attractionsCache = null;

async function fetchAttractions() {
  if (_attractionsCache) return _attractionsCache;
  try {
    _attractionsCache = await db.getAttractions();
    return _attractionsCache;
  } catch {
    /* Fall back to local destinations array so search still works offline */
    _attractionsCache = destinations.map(d => ({
      slug: d.slug, name: d.name,
      region: '', category: d.tag,
      image_hero: d.img
    }));
    return _attractionsCache;
  }
}

function initSearch() {
  const input       = document.getElementById('searchWhere');
  const dropdown    = document.getElementById('searchSuggestions');
  const searchBtn   = document.getElementById('btnSearch');
  if (!input || !dropdown) return;

  let debounceTimer = null;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (q.length < 1) { dropdown.innerHTML = ''; return; }
    debounceTimer = setTimeout(() => showSuggestions(q), 200);
  });

  async function showSuggestions(q) {
    const items = await fetchAttractions();
    const ql = q.toLowerCase();
    const matches = items.filter(a =>
      (a.name     || '').toLowerCase().includes(ql) ||
      (a.region   || '').toLowerCase().includes(ql) ||
      (a.category || '').toLowerCase().includes(ql)
    ).slice(0, 6);

    if (!matches.length) {
      dropdown.innerHTML = `<div class="suggestion-no-results">No destinations found for "<strong>${q}</strong>"</div>`;
      return;
    }

    dropdown.innerHTML = matches.map(a => `
      <div class="suggestion-item" data-slug="${a.slug}" role="button" tabindex="0">
        <img class="suggestion-img"
             src="${a.image_hero || 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=100&q=60'}"
             alt="${a.name}"
             onerror="this.src='https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=100&q=60'"/>
        <div class="suggestion-info">
          <div class="suggestion-name">${a.name}</div>
          <div class="suggestion-tag">${a.category || a.region || 'Destination'}</div>
        </div>
        <span class="suggestion-arrow">→</span>
      </div>
    `).join('');

    /* Click/keyboard on a suggestion */
    dropdown.querySelectorAll('.suggestion-item').forEach(el => {
      const go = () => {
        window.location.href = 'attraction-details.html?id=' + el.dataset.slug;
      };
      el.addEventListener('click', go);
      el.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    });
  }

  /* Search button — navigate to first match or destinations page */
  if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
      const q = input.value.trim();
      if (!q) { window.location.href = 'destinations.html'; return; }
      const items = await fetchAttractions();
      const match = items.find(a =>
        (a.name || '').toLowerCase().includes(q.toLowerCase())
      );
      if (match) {
        window.location.href = 'attraction-details.html?id=' + match.slug;
      } else {
        window.location.href = `destinations.html?search=${encodeURIComponent(q)}`;
      }
    });
  }

  /* Enter key in input */
  input.addEventListener('keydown', async e => {
    if (e.key === 'Enter') searchBtn && searchBtn.click();
  });

  /* Close dropdown when clicking outside */
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-field-wrap')) {
      dropdown.innerHTML = '';
    }
  });
}

/* ─────────────────────────────────────────
   RENDER: EVENT CARDS
───────────────────────────────────────── */
function renderEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <div class="event-img-wrap">
        <img class="event-img" src="${event.img}" alt="${event.title}" loading="lazy" />
        <div class="event-date-badge">${event.date}</div>
      </div>
      <div class="event-body">
        <h3>${event.title}</h3>
        <div class="event-meta">${calendarIcon()} ${event.date}</div>
        <div class="event-meta">${pinIcon()} ${event.location}</div>
        <p>${event.desc}</p>
        <a href="events.html" class="learn-more-link">Learn More &#8594;</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ─────────────────────────────────────────
   HERO SLIDESHOW
───────────────────────────────────────── */
const SLIDE_INTERVAL = 5000;

function initSlideshow() {
  const slides   = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('slideDots');
  const prevBtn  = document.querySelector('.slide-prev');
  const nextBtn  = document.querySelector('.slide-next');

  if (!slides.length || !dotsWrap || !prevBtn || !nextBtn) return;

  let current = 0;
  let timer   = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); });
    dotsWrap.appendChild(dot);
  });

  const allDots = () => dotsWrap.querySelectorAll('.slide-dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    allDots()[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    allDots()[current].classList.add('active');
  }

  function startTimer() { timer = setInterval(() => goTo(current + 1), SLIDE_INTERVAL); }
  function stopTimer()  { clearInterval(timer); }

  prevBtn.addEventListener('click', () => { stopTimer(); goTo(current - 1); startTimer(); });
  nextBtn.addEventListener('click', () => { stopTimer(); goTo(current + 1); startTimer(); });

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { stopTimer(); goTo(current - 1); startTimer(); }
    if (e.key === 'ArrowRight') { stopTimer(); goTo(current + 1); startTimer(); }
  });

  startTimer();
}

/* ─────────────────────────────────────────
   MOBILE HAMBURGER MENU
───────────────────────────────────────── */
function initHamburger() {
  const btn   = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    btn.classList.toggle('active');
  });

  /* Close when a link is clicked */
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('active');
    });
  });
}

/* ─────────────────────────────────────────
   SMOOTH SCROLL
───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ─────────────────────────────────────────
   NAVBAR SCROLL SHADOW
───────────────────────────────────────── */
function initNavbarScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(0,0,0,0.14)'
      : '0 2px 12px rgba(0,0,0,0.07)';
  });
}

/* ─────────────────────────────────────────
   SCROLL REVEAL (fade-in on scroll)
───────────────────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.dest-card, .why-card, .event-card, .testi-card'
  );
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    obs.observe(el);
  });
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSlideshow();
  renderDestinations();
  renderEvents();
  initSmoothScroll();
  initNavbarScroll();
  initHamburger();
  initScrollReveal();
  initSearch();
});
