/* ============================================================
   SAFARIQUEST — dashboard.js
   Loads real user data and bookings from localStorage.
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Auth guard: redirect to login if no session ── */
  if (localStorage.getItem('sq_session') !== 'active') {
    window.location.href = 'login.html';
    return;
  }

  /* ── Load user from localStorage ── */
  var user = {};
  try { user = JSON.parse(localStorage.getItem('sq_user') || '{}'); } catch(e) {}
  var userName = user.name || 'Traveller';
  var firstName = userName.split(' ')[0];

  /* ── Update greeting with real name ── */
  var heroTitle = document.querySelector('.hero-title');
  if (heroTitle) heroTitle.textContent = 'Welcome back, ' + firstName + '!';

  var heroSub = document.querySelector('.hero-sub');
  if (heroSub) heroSub.textContent = 'Track your travel goals, bookings, and explore the magic of Kenya';

  /* ── Load bookings from localStorage ── */
  var bookings = [];
  try { bookings = JSON.parse(localStorage.getItem('sq_bookings') || '[]'); } catch(e) {}

  /* ── Update trip count stat card ── */
  var statCards = document.querySelectorAll('.stat-val');
  if (statCards.length > 0) {
    statCards[0].dataset.count = bookings.length;
  }

  /* ── Render bookings in the trip list ── */
  var tripList = document.querySelector('.trip-list');
  if (tripList) {
    if (bookings.length === 0) {
      tripList.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:#999">
          <div style="font-size:3rem;margin-bottom:12px">🗺️</div>
          <p style="font-size:1rem;font-weight:600;color:#555;margin:0 0 6px">No bookings yet</p>
          <p style="font-size:.85rem;margin:0 0 16px">Explore destinations and book your first adventure!</p>
          <a href="destinations.html"
            style="display:inline-block;padding:10px 20px;background:#E8732A;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:.85rem">
            Browse Destinations
          </a>
        </div>`;
    } else {
      tripList.innerHTML = bookings.map(function(b) {
        var statusColor = b.status === 'Confirmed' ? '#1ec99a' : '#E8732A';
        return `
          <div class="trip-item" style="display:flex;align-items:center;gap:16px;padding:16px;border-radius:12px;background:#f9f9f9;margin-bottom:12px">
            <div style="width:64px;height:64px;border-radius:10px;background:#e0f2eb;display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0">
              🌍
            </div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:.95rem;color:#1a3c2e;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.attraction}</div>
              <div style="font-size:.8rem;color:#666;margin-bottom:4px">📅 ${b.checkIn} → ${b.checkOut} &nbsp;·&nbsp; 👥 ${b.guests} guests</div>
              <div style="font-size:.75rem;color:#999">Ref: <strong>${b.id}</strong></div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <span style="display:inline-block;padding:4px 10px;background:${statusColor}22;color:${statusColor};border-radius:20px;font-size:.75rem;font-weight:700">${b.status}</span>
            </div>
          </div>`;
      }).join('');
    }
  }

  /* ── Progress bar ── */
  setTimeout(function () {
    var fill = document.getElementById('goalFill');
    if (fill) fill.style.width = (bookings.length > 0 ? Math.min(bookings.length * 10 + 20, 95) : 5) + '%';
  }, 500);

  /* ── Destination tags ── */
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

  /* ── Animated counters ── */
  function animateCount(el, target, duration) {
    var start = performance.now();
    (function step(now) {
      var p = Math.min((now - start) / duration, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    })(performance.now());
  }

  setTimeout(function () {
    document.querySelectorAll('.stat-val').forEach(function (el) {
      animateCount(el, parseInt(el.dataset.count, 10) || 0, 1400);
    });
  }, 350);

  /* ── Nav switching ── */
  document.querySelectorAll('.nav-item').forEach(function (item) {
    item.addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* ── Heart toggle ── */
  document.querySelectorAll('.heart-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      this.classList.toggle('liked');
      this.style.transform = 'scale(1.3)';
      setTimeout(function () { btn.style.transform = ''; }, 200);
    });
  });

  /* ── Hero pill hover ── */
  document.querySelectorAll('.hero-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      this.style.transform = 'scale(0.94)';
      setTimeout(function () { pill.style.transform = ''; }, 150);
    });
  });

  /* ── Logout button (if present) ── */
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem('sq_session');
      window.location.href = 'login.html';
    });
  }

});
