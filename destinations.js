// ── SCROLL TO TOP BUTTON ──
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  btn.classList.toggle('visible', window.scrollY > 400);
});

// ── SCROLL-TRIGGERED FADE-IN ANIMATIONS ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = `${i * 0.05}s`;
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── TYPE IMAGE BUTTON FILTER ──
function filterType(btn, type) {
  document.querySelectorAll('.type-img-btn').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
}

// ── EXPERIENCE CARD ACTIVE STATE ──
document.querySelectorAll('.exp-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.exp-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
});

// ── LOAD MORE DESTINATIONS ──
let loaded = false;

function loadMore() {
  if (!loaded) {
    ['extra-dest-1', 'extra-dest-2', 'extra-dest-3', 'extra-dest-4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'block';
        el.style.animation = 'fadeUp .5s ease';
      }
    });
    const btn = document.querySelector('.btn-load-more');
    btn.textContent = 'Showing All Destinations';
    btn.disabled = true;
    loaded = true;
  }
}

// ── NEWSLETTER SIGNUP ──
document.querySelector('.btn-signup').addEventListener('click', () => {
  const input = document.querySelector('.cta-input');
  if (input.value.includes('@')) {
    input.value = '';
    input.placeholder = '✓ Thanks! You\'re subscribed.';
    setTimeout(() => { input.placeholder = 'Enter your email'; }, 3000);
  } else {
    input.style.outline = '2px solid red';
    setTimeout(() => { input.style.outline = 'none'; }, 1500);
  }
});

// ── HERO CTA SCROLL ──
document.querySelector('.btn-hero-primary').addEventListener('click', () => {
  document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
});

// ── SCROLL TOP CLICK ──
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
