/* ============================================================
   TRAVEL & TOURISM PORTAL — script.js
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
    stars:  4,
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
    desc:     'Witness the greatest wildlife show on earth — the Great Wildebeest Migration.',
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
function renderStars(count, total = 5) {
  return Array.from({ length: total }, (_, i) =>
    `<span style="color:${i < count ? '#F5A623' : '#ddd'}">&#9733;</span>`
  ).join('');
}

function calendarIcon() {
  return `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </svg>`;
}

function pinIcon() {
  return `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
  </svg>`;
}

/* ─────────────────────────────────────────
   RENDER: DESTINATION CARDS (clickable)
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

    /* Click — navigate to attraction details */
    card.addEventListener('click', function () {
      window.location.href = 'attraction-details.html?id=' + dest.slug;
    });

    /* Keyboard Enter / Space also triggers navigation */
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = 'attraction-details.html?id=' + dest.slug;
      }
    });

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
  hero.addEventListener('mouseenter', stopTimer);
  hero.addEventListener('mouseleave', startTimer);

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
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
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
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initSlideshow();
  renderDestinations();
  renderEvents();
  initSmoothScroll();
  initNavbarScroll();
});
