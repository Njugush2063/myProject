/* ============================================================
   DESTINATIONS PAGE — destinations.js
   Fetches all attractions from Supabase and renders them
   ============================================================ */

document.addEventListener('DOMContentLoaded', async function () {

  /* ── Scroll animations ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ── Scroll to top ── */
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTop');
    if (btn) btn.style.opacity = window.scrollY > 400 ? '1' : '0';
  });
  document.getElementById('scrollTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Load More (static) ── */
  window.loadMore = function () {
    ['extra-dest-1','extra-dest-2','extra-dest-3','extra-dest-4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'block';
    });
    document.querySelector('.btn-load-more').style.display = 'none';
  };

  /* ── Filter by type ── */
  window.filterType = function (btn, type) {
    document.querySelectorAll('.type-img-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  /* ── FETCH & RENDER from Supabase ── */
  await loadAttractions();
  await loadFeaturedDestinations();

});

/* ────────────────────────────────────────
   FETCH ALL ATTRACTIONS → destinations grid
──────────────────────────────────────── */
async function loadAttractions() {
  const grid = document.getElementById('dest-grid');
  if (!grid) return;

  // Show loading skeleton
  grid.innerHTML = `
    <div class="loading-skeleton"></div>
    <div class="loading-skeleton"></div>
    <div class="loading-skeleton"></div>
  `;

  try {
    const attractions = await db.getAttractions();
    renderDestinationGrid(grid, attractions);
  } catch (err) {
    console.error('Error loading attractions:', err);
    grid.innerHTML = `<div class="fetch-error">⚠️ Could not load destinations. Please try again.</div>`;
  }
}

/* ────────────────────────────────────────
   FETCH TOP 4 → Traveler Favorites section
──────────────────────────────────────── */
async function loadFeaturedDestinations() {
  const favGrid = document.querySelector('.favorites-section .destinations-grid');
  if (!favGrid) return;

  try {
    const attractions = await db.getAttractions();
    const top4 = attractions.slice(0, 4);
    renderDestinationGrid(favGrid, top4, true);
  } catch (err) {
    console.error('Error loading favorites:', err);
  }
}

/* ────────────────────────────────────────
   RENDER: destination cards
──────────────────────────────────────── */
function renderDestinationGrid(container, attractions, isFavorites = false) {
  if (!attractions || attractions.length === 0) {
    container.innerHTML = `<div class="fetch-error">No destinations found.</div>`;
    return;
  }

  container.innerHTML = attractions.map(a => `
    <div class="dest-card">
      <div class="dest-img-wrap">
        <div class="dest-img" style="background-image:url('${a.image_hero}'); background-size:cover; background-position:center;"></div>
        <span class="difficulty-badge diff-${a.difficulty.toLowerCase()}">${a.difficulty}</span>
      </div>
      <div class="dest-body">
        <div class="dest-header">
          <div class="dest-name" ${isFavorites ? 'style="color:var(--orange)"' : ''}>${a.name}</div>
          <div class="dest-rating">⭐ ${a.rating}</div>
        </div>
        <div class="dest-desc">${a.description.substring(0, 120)}...</div>
        <div class="dest-meta">
          <div class="dest-meta-item">📍 ${a.county} County</div>
          <div class="dest-meta-item">🕐 Best: ${a.best_time}</div>
        </div>
        <div class="dest-tags">
          ${a.highlights.slice(0, 2).map(h => `<span class="tag">${h.split(' ').slice(0,2).join(' ')}</span>`).join('')}
          <span class="tag tag-more">+${a.highlights.length - 2} more</span>
        </div>
        <div class="dest-footer">
          <span class="dest-price">KSh ${Math.round(a.price_min * 129.38).toLocaleString()} – KSh ${Math.round(a.price_max * 129.38).toLocaleString()}</span>
          <a href="attraction-details.html?id=${a.slug}" class="explore-link">⚡ Explore →</a>
        </div>
      </div>
    </div>
  `).join('');
}
