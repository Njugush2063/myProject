/**
 * SafariQuest — auth.js
 * Supabase-backed authentication & session management.
 * Include this script on EVERY page of the site.
 *
 * Usage:
 *   <script src="/js/auth.js"></script>
 *
 * The script auto-runs on DOMContentLoaded and:
 *  1. Refreshes the Supabase session from the URL hash (OAuth callback).
 *  2. Reads the current session.
 *  3. Updates the nav (login/signup ↔ avatar menu).
 *  4. Wires up any logout buttons.
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SUPABASE_URL    = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_ANON   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNieWlwbXJvenFzbnRvamlhcnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTkxNTQsImV4cCI6MjA4ODk3NTE1NH0.31TAhmUCV_Uh0W8FGnR2_TLCZDU4YBM1U5LMSMc5JZs';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Lightweight Supabase REST + Auth helper.
 * We avoid a full SDK bundle so the script stays tiny on every page.
 */
const SQ = (() => {
  const headers = () => ({
    'apikey': SUPABASE_ANON,
    'Authorization': `Bearer ${getAccessToken() || SUPABASE_ANON}`,
    'Content-Type': 'application/json',
  });

  function saveSession(session) {
    if (!session) { localStorage.removeItem('sq_session'); return; }
    localStorage.setItem('sq_session', JSON.stringify(session));
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem('sq_session')); }
    catch { return null; }
  }

  function getAccessToken() {
    return getSession()?.access_token || null;
  }

  function getUser() {
    return getSession()?.user || null;
  }

  /** Parse and persist a session from the URL hash (OAuth / magic-link callbacks) */
  function handleHashSession() {
    const hash = window.location.hash;
    if (!hash.includes('access_token')) return false;

    const params = new URLSearchParams(hash.slice(1));
    const session = {
      access_token:  params.get('access_token'),
      refresh_token: params.get('refresh_token'),
      expires_at:    Date.now() + Number(params.get('expires_in') || 3600) * 1000,
      user: null, // fetched below
    };
    saveSession(session);

    // Clean the URL
    history.replaceState(null, '', window.location.pathname + window.location.search);
    return true;
  }

  /** Fetch the logged-in user profile from Supabase */
  async function fetchUser() {
    const token = getAccessToken();
    if (!token) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) { saveSession(null); return null; }
      const user = await res.json();
      // Merge user into existing session
      const session = getSession();
      if (session) { session.user = user; saveSession(session); }
      return user;
    } catch { return null; }
  }

  async function signInWithEmail(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.msg || 'Login failed');
    saveSession(data);
    return data;
  }

  async function signUp(email, password, meta = {}) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, data: meta }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.msg || 'Sign-up failed');
    if (data.access_token) saveSession(data);
    return data;
  }

  async function signOut() {
    const token = getAccessToken();
    if (token) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${token}` },
      }).catch(() => {});
    }
    saveSession(null);
  }

  return { saveSession, getSession, getAccessToken, getUser, handleHashSession, fetchUser, signInWithEmail, signUp, signOut };
})();


// ─── INTENT STORAGE ──────────────────────────────────────────────────────────
/**
 * "Pending intent" — what the user was trying to do before we forced login.
 * Stored in sessionStorage so it survives a redirect but not a new browser tab.
 *
 * Shape:
 * {
 *   returnUrl: '/tours/maasai-mara.html',
 *   action: 'book',          // 'book' | 'pay' | 'enquire'
 *   data: { tourId, date, travelers, ... }   // any serialisable payload
 * }
 */
const PendingIntent = {
  save(intent) {
    sessionStorage.setItem('sq_pending_intent', JSON.stringify(intent));
  },
  get() {
    try { return JSON.parse(sessionStorage.getItem('sq_pending_intent')); }
    catch { return null; }
  },
  clear() {
    sessionStorage.removeItem('sq_pending_intent');
  },
};


// ─── NAV UPDATE ──────────────────────────────────────────────────────────────
/**
 * Swap the header's login/register buttons for an avatar menu when logged in.
 * Expects the existing HTML to have:
 *   <a class="nav-login"  href="/login.html">Login</a>
 *   <a class="nav-register" href="/register.html">Register</a>
 *
 * Works with ANY page that includes those two elements.
 */
function updateNavForUser(user) {
  const loginBtn    = document.querySelector('.nav-login, a[href*="login.html"]');
  const registerBtn = document.querySelector('.nav-register, a[href*="register.html"]');

  if (!loginBtn && !registerBtn) return; // nav not found on this page

  if (user) {
    // Build avatar dropdown
    const initials = getInitials(user);
    const avatarMenu = document.createElement('div');
    avatarMenu.className = 'sq-avatar-menu';
    avatarMenu.innerHTML = `
      <button class="sq-avatar-btn" aria-label="My account" aria-expanded="false">
        <span class="sq-avatar-initials">${initials}</span>
        <span class="sq-avatar-name">${user.user_metadata?.full_name || user.email.split('@')[0]}</span>
        <svg class="sq-chevron" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/>
        </svg>
      </button>
      <ul class="sq-avatar-dropdown" role="menu">
        <li><a href="/dashboard.html" role="menuitem">🧭 My Dashboard</a></li>
        <li><a href="/bookings.html"  role="menuitem">🎟️ My Bookings</a></li>
        <li><a href="/profile.html"   role="menuitem">👤 Profile</a></li>
        <li class="sq-divider"></li>
        <li><button id="sq-logout-btn" role="menuitem">🚪 Log Out</button></li>
      </ul>`;

    // Replace both buttons with the menu
    const parent = loginBtn?.parentNode || registerBtn?.parentNode;
    loginBtn?.remove();
    registerBtn?.remove();
    parent?.appendChild(avatarMenu);

    // Toggle dropdown
    const btn      = avatarMenu.querySelector('.sq-avatar-btn');
    const dropdown = avatarMenu.querySelector('.sq-avatar-dropdown');
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      dropdown.classList.toggle('sq-open', !open);
    });
    document.addEventListener('click', e => {
      if (!avatarMenu.contains(e.target)) {
        btn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('sq-open');
      }
    });

    // Logout
    document.getElementById('sq-logout-btn')?.addEventListener('click', async () => {
      await SQ.signOut();
      window.location.href = '/Index.html';
    });

  } else {
    // Ensure login/register buttons are visible (no change needed normally)
    loginBtn?.style.removeProperty('display');
    registerBtn?.style.removeProperty('display');
  }
}

function getInitials(user) {
  const name = user.user_metadata?.full_name || user.email || '';
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}


// ─── BOOKING GATE ────────────────────────────────────────────────────────────
/**
 * Call this from any "Book Now" / "Pay" button handler.
 *
 * If the user is logged in  → runs `proceedFn()` immediately.
 * If the user is NOT logged in → saves intent, shows login modal (or redirects).
 *
 * @param {Object} intent   - { action, data } — what to resume after login
 * @param {Function} proceedFn - called if/once the user is authenticated
 */
function requireAuth(intent, proceedFn) {
  const user = SQ.getUser();
  if (user) {
    proceedFn(user);
    return;
  }

  // Save current URL + intent
  PendingIntent.save({
    returnUrl: window.location.href,
    ...intent,
  });

  // Try to show an inline modal first; fallback to redirect
  const modal = document.getElementById('sq-login-modal');
  if (modal) {
    modal.classList.add('sq-modal-open');
    modal.querySelector('[data-close]')?.addEventListener('click', () => {
      modal.classList.remove('sq-modal-open');
    });
  } else {
    window.location.href = '/login.html';
  }
}

/**
 * After a successful login (called from login.html / register.html),
 * restore the pending intent and redirect the user back.
 */
async function resumePendingIntent() {
  const intent = PendingIntent.get();
  PendingIntent.clear();

  if (!intent?.returnUrl) {
    window.location.href = '/dashboard.html';
    return;
  }

  // Build the return URL; pass the serialised data as a search param so the
  // target page can read it without needing a backend.
  const url = new URL(intent.returnUrl);
  if (intent.data) {
    url.searchParams.set('sq_resume', btoa(JSON.stringify(intent.data)));
    url.searchParams.set('sq_action', intent.action || 'book');
  }
  window.location.href = url.toString();
}

/**
 * On the booking/payment page, call this once to read back any saved data
 * that was in the URL and re-populate the form.
 *
 * Returns the decoded object, or null if nothing was saved.
 */
function readResumedData() {
  const params = new URLSearchParams(window.location.search);
  const raw    = params.get('sq_resume');
  const action = params.get('sq_action');
  if (!raw) return null;

  // Clean the URL (optional — keeps it tidy)
  params.delete('sq_resume');
  params.delete('sq_action');
  const clean = params.toString();
  history.replaceState(null, '', window.location.pathname + (clean ? '?' + clean : ''));

  try { return { action, data: JSON.parse(atob(raw)) }; }
  catch { return null; }
}


// ─── BOOTSTRAP ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Handle OAuth/magic-link callback
  const fromHash = SQ.handleHashSession();

  // 2. Get session + user
  let user = SQ.getUser();
  if (!user || fromHash) {
    user = await SQ.fetchUser(); // verify token is still valid
  }

  // 3. Update nav on every page
  updateNavForUser(user);

  // 4. If we just came back from OAuth, resume any pending intent
  if (fromHash && user) {
    await resumePendingIntent();
  }
});

// ─── PUBLIC API ──────────────────────────────────────────────────────────────
// Expose on window so any inline script can use it.
window.SQ             = SQ;
window.PendingIntent  = PendingIntent;
window.requireAuth    = requireAuth;
window.resumePendingIntent = resumePendingIntent;
window.readResumedData     = readResumedData;
