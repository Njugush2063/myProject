/* ============================================================
   SAFARIQUEST — dashboard.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Progress bar ── */
  setTimeout(function () {
    const fill = document.getElementById('goalFill');
    if (fill) fill.style.width = '53%';
  }, 500);

  /* ── Destination tags ── */
  const destinations = ['Kenya','Tanzania','Uganda','Rwanda','Ethiopia','Somalia','Namibia','South Africa'];
  const tagsEl = document.getElementById('destTags');
  if (tagsEl) {
    destinations.forEach(function (name, i) {
      const tag = document.createElement('span');
      tag.className = 'dest-tag';
      tag.textContent = '✓ ' + name;
      tag.style.animationDelay = (i * 0.07) + 's';
      tagsEl.appendChild(tag);
    });
  }

  /* ── Animated counters ── */
  function animateCount(el, target, duration) {
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    })(performance.now());
  }

  setTimeout(function () {
    document.querySelectorAll('.stat-val').forEach(function (el) {
      animateCount(el, parseInt(el.dataset.count, 10), 1400);
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

});
