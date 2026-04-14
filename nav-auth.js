/* ============================================================
   nav-auth.js — SafariQuest Shared Nav Auth UI
   Add this file to your myProject/ root.
   Load it on every public page AFTER auth.js.

   What it does:
   - If user is logged in: hides Login/Sign Up buttons,
     shows a "Dashboard →" link and user avatar instead.
   - If not logged in: leaves the buttons as-is.

   Works with any of these nav auth container class names:
     .nav-cta        (restaurants.html)
     .nav-auth       (hotels.html)
     .nav-actions    (destinations.html)
   ============================================================ */

(function () {
  function updateNav() {
    // Find whichever auth container this page uses
    const navAuth =
      document.querySelector('.nav-cta') ||
      document.querySelector('.nav-auth') ||
      document.querySelector('.nav-actions');

    if (!navAuth) return;

    if (Auth.isLoggedIn()) {
      const user = Auth.getUser();
      const name = user?.name || user?.email?.split('@')[0] || 'You';
      // Initial for avatar
      const initial = name.charAt(0).toUpperCase();

      // Replace login/signup buttons with dashboard link + avatar
      navAuth.innerHTML = `
        <a href="dashboard.html" style="
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: #E8732A;
          color: #fff;
          border-radius: 10px;
          text-decoration: none;
          font-size: .88rem;
          font-weight: 600;
          font-family: inherit;
          transition: background .2s;
        " onmouseover="this.style.background='#c9621e'"
           onmouseout="this.style.background='#E8732A'">
          <span style="
            width: 26px; height: 26px;
            background: rgba(255,255,255,0.25);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: .78rem;
            font-weight: 700;
          ">${initial}</span>
          Dashboard →
        </a>
      `;
    }
    // If not logged in, do nothing — buttons stay as normal
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNav);
  } else {
    updateNav();
  }
})();