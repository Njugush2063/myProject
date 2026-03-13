/* ============================================================
   TRAVEL & TOURISM PORTAL — script.js
   Complete consolidated JavaScript
   ============================================================ */

/* ─────────────────────────────────────────
   DATA: DESTINATIONS
───────────────────────────────────────── */
const destinations = [
  {
    name:   'Maasai Mara',
    tag:    'Safari Tours',
    rating: 4.8,
    stars:  4,
    img:    'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=600&q=80'
  },
  {
    name:   'Diani Beach',
    tag:    'Beach Paradise',
    rating: 4.6,
    stars:  4,
    img:    'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&q=80'
  },
  {
    name:   'Mount Kenya',
    tag:    'Mountain Adventure',
    rating: 4.9,
    stars:  4,
    img:    'data:image/jpeg;base64,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'
  },
  {
    name:   'Lake Nakuru',
    tag:    'Flamingo Paradise',
    rating: 4.7,
    stars:  4,
    img:    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80'
  },
  {
    name:   'Lake Victoria',
    tag:    'Serene Getaway',
    rating: 4.5,
    stars:  4,
    img:    'https://media.istockphoto.com/id/154024852/photo/man-contemplates-sunset.webp?a=1&b=1&s=612x612&w=0&k=20&c=7pC6A-kKgd0QZuVCKUs1Qb-jXmui_bSLEkR8vKReIH8='
  },
  {
    name:   'The Great Rift Valley',
    tag:    'Geological Wonder',
    rating: 4.8,
    stars:  5,
    img:    'data:image/jpeg;base64,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'
  }
];

/* ─────────────────────────────────────────
   DATA: EVENTS
───────────────────────────────────────── */
const events = [
  {
    title:    'Lamu Cultural Festival',
    date:     'March 15-17, 2026',
    location: 'Lamu Island',
    desc:     'Experience traditional Swahili culture with dhow races, donkey races, and local cuisine.',
    img:      'https://images.unsplash.com/photo-1541532713592-79a0317b272b?w=500&q=80'
  },
  {
    title:    'Nairobi Music Festival',
    date:     'April 8-10, 2026',
    location: 'Nairobi',
    desc:     'Three days of incredible music featuring local and international artists.',
    img:      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&q=80'
  },
  {
    title:    'Maasai Mara Migration',
    date:     'July - September',
    location: 'Maasai Mara',
    desc:     'Witness the greatest wildlife show on earth - the wildebeest migration.',
    img:      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=500&q=80'
  },
  {
    title:    'Mombasa Carnival',
    date:     'December 20-25, 2026',
    location: 'Mombasa',
    desc:     'Coastal celebration with street parades, music, dance, and authentic cuisine.',
    img:      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80'
  }
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

/**
 * Renders filled/empty star spans for a rating.
 * @param {number} count - Number of filled stars
 * @param {number} total - Total stars (default 5)
 * @returns {string} HTML string of star spans
 */
function renderStars(count, total = 5) {
  return Array.from({ length: total }, (_, i) =>
    `<span style="color:${i < count ? '#F5A623' : '#ddd'}">&#9733;</span>`
  ).join('');
}

/**
 * Returns inline SVG calendar icon string.
 */
function calendarIcon() {
  return `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>`;
}

/**
 * Returns inline SVG location pin icon string.
 */
function pinIcon() {
  return `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
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
    grid.appendChild(card);
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
      <img class="event-img" src="${event.img}" alt="${event.title}" loading="lazy" />
      <div class="event-body">
        <h3>${event.title}</h3>
        <div class="event-meta">${calendarIcon()} ${event.date}</div>
        <div class="event-meta">${pinIcon()} ${event.location}</div>
        <p>${event.desc}</p>
        <a href="#" class="learn-more-link">Learn More &#8594;</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ─────────────────────────────────────────
   HERO SLIDESHOW
   - Auto-advances every SLIDE_INTERVAL ms
   - Prev / Next arrow buttons
   - Clickable dot indicators (built by JS)
   - Pauses on hover, resumes on mouse-out
   - Keyboard: left / right arrow keys
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

  // Build dot indicators dynamically
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); });
    dotsWrap.appendChild(dot);
  });

  const allDots = () => dotsWrap.querySelectorAll('.slide-dot');

  // Core transition function
  function goTo(index) {
    slides[current].classList.remove('active');
    allDots()[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    allDots()[current].classList.add('active');
  }

  // Auto-play controls
  function startTimer() {
    timer = setInterval(() => goTo(current + 1), SLIDE_INTERVAL);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  // Arrow buttons
  prevBtn.addEventListener('click', () => { stopTimer(); goTo(current - 1); startTimer(); });
  nextBtn.addEventListener('click', () => { stopTimer(); goTo(current + 1); startTimer(); });

  // Pause on hover
  const hero = document.getElementById('hero');
  hero.addEventListener('mouseenter', stopTimer);
  hero.addEventListener('mouseleave', startTimer);

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft')  { stopTimer(); goTo(current - 1); startTimer(); }
    if (e.key === 'ArrowRight') { stopTimer(); goTo(current + 1); startTimer(); }
  });

  startTimer();
}

/* ─────────────────────────────────────────
   SMOOTH SCROLL
───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ─────────────────────────────────────────
   NAVBAR: DEEPEN SHADOW ON SCROLL
───────────────────────────────────────── */
function initNavbarScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0,0,0,0.12)'
      : '0 2px 12px rgba(0,0,0,0.07)';
  });
}

/* ─────────────────────────────────────────
   INIT — run everything on DOM ready
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initSlideshow();
  renderDestinations();
  renderEvents();
  initSmoothScroll();
  initNavbarScroll();
});
