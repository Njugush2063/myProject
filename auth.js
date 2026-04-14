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
const SUPABASE_URL  = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNieWlwbXJvenFzbnRvamlhcnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTkxNTQsImV4cCI6MjA4ODk3NTE1NH0.31TAhmUCV_Uh0W8FGnR2_TLCZDU4YBM1U5LMSMc5JZs';
const DEV_USERS_KEY = 'sq_dev_users';
const DEV_BYPASS_FLAG_KEY = 'sq_enable_dev_auth_bypass';
const DEV_AUTH_BYPASS =
  localStorage.getItem(DEV_BYPASS_FLAG_KEY) === '1' ||
  window.location.protocol === 'file:' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

// ─── SUPABASE HELPER ─────────────────────────────────────────────────────────
const SQ = (() => {

  // ── Session storage ────────────────────────────────────────────────────────

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

  function isLoggedIn() {
    return !!getAccessToken();
  }

  function getDevUsers() {
    try { return JSON.parse(localStorage.getItem(DEV_USERS_KEY) || '{}'); }
    catch { return {}; }
  }

  function saveDevUser(email, password, meta = {}) {
    const users = getDevUsers();
    users[email.toLowerCase()] = {
      password,
      full_name: meta.full_name || '',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(DEV_USERS_KEY, JSON.stringify(users));
  }

  function createDevSession(email, meta = {}) {
    const fullName = meta.full_name || email.split('@')[0];
    const session = {
      access_token: 'dev_' + Date.now(),
      refresh_token: 'dev_refresh',
      expires_at: Date.now() + 24 * 60 * 60 * 1000,
      user: {
        id: 'dev_' + email.toLowerCase(),
        email: email.toLowerCase(),
        user_metadata: { full_name: fullName }
      },
      is_dev_auth: true
    };
    saveSession(session);
    return session;
  }

  // ── OAuth hash handling ────────────────────────────────────────────────────

  function handleHashSession() {
    const hash = window.location.hash;
    if (!hash.includes('access_token')) return false;

    const params  = new URLSearchParams(hash.slice(1));
    const session = {
      access_token:  params.get('access_token'),
      refresh_token: params.get('refresh_token'),
      expires_at:    Date.now() + Number(params.get('expires_in') || 3600) * 1000,
      user: null,
    };
    saveSession(session);
    history.replaceState(null, '', window.location.pathname + window.location.search);
    return true;
  }

  // ── Remote user fetch ──────────────────────────────────────────────────────

  async function fetchUser() {
    const token = getAccessToken();
    if (!token) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'apikey':        SUPABASE_ANON,
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) { saveSession(null); return null; }
      const user    = await res.json();
      const session = getSession();
      if (session) { session.user = user; saveSession(session); }
      return user;
    } catch { return null; }
  }

  // ── Sign In ────────────────────────────────────────────────────────────────

  async function signInWithEmail(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method:  'POST',
      headers: { 'apikey': SUPABASE_ANON, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (DEV_AUTH_BYPASS) {
        const users = getDevUsers();
        const devUser = users[email.toLowerCase()];
        if (devUser && devUser.password === password) {
          createDevSession(email, { full_name: devUser.full_name });
          return { user: getUser(), access_token: getAccessToken(), dev_bypass: true };
        }
      }
      throw new Error(data.error_description || data.msg || 'Login failed');
    }
    saveSession(data);
    return data;
  }

  // ── Sign Up ────────────────────────────────────────────────────────────────
  /**
   * Registers a new user via Supabase Auth, then writes a matching row into
   * the `profiles` table so credentials/metadata are stored in the DB.
   *
   * Supabase Auth already stores email + hashed password automatically;
   * the profiles upsert adds full_name and any extra metadata you want to
   * persist server-side.
   */
  async function signUp(email, password, meta = {}) {
    // 1. Create the auth account
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method:  'POST',
      headers: { 'apikey': SUPABASE_ANON, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password, data: meta }),
    });
    const data = await res.json();

    if (!res.ok) {
      if (DEV_AUTH_BYPASS) {
        saveDevUser(email, password, meta);
        createDevSession(email, meta);
        return { user: getUser(), access_token: getAccessToken(), dev_bypass: true };
      }
      throw new Error(data.error_description || data.msg || 'Sign-up failed');
    }

    // 2. Persist session if Supabase returned one immediately
    //    (happens when "Confirm email" is disabled in your project settings)
    if (data.access_token) {
      saveSession(data);

      // 3. Write profile row to `profiles` table
      //    Uses the access token so RLS policies can identify the user.
      try {
        await upsertProfile({
          id:         data.user?.id,
          email:      email,
          full_name:  meta.full_name || '',
          created_at: new Date().toISOString(),
        }, data.access_token);
      } catch (profileErr) {
        // Non-fatal — auth succeeded even if profile write fails
        console.warn('SafariQuest: profile upsert failed', profileErr);
      }
    } else if (DEV_AUTH_BYPASS) {
      // Local dev shortcut when Supabase requires email confirmation.
      saveDevUser(email, password, meta);
      createDevSession(email, meta);
    }

    return data;
  }

  // ── Profile upsert ────────────────────────────────────────────────────────
  /**
   * Writes (or updates) a row in the public.profiles table.
   * Your Supabase table should have at minimum: id (uuid), email, full_name.
   *
   * Make sure you have an RLS policy that allows:
   *   INSERT / UPDATE for authenticated users WHERE id = auth.uid()
   */
  async function upsertProfile(profile, accessToken) {
    if (!profile.id) return; // no-op if no user id
    const token = accessToken || getAccessToken();
    if (!token) return;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method:  'POST',
      headers: {
        'apikey':        SUPABASE_ANON,
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
        'Prefer':        'resolution=merge-duplicates', // upsert behaviour
      },
      body: JSON.stringify(profile),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Profile write failed');
    }
  }

  // ── Sign Out ───────────────────────────────────────────────────────────────

  async function signOut() {
    const token = getAccessToken();
    if (token) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method:  'POST',
        headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${token}` },
      }).catch(() => {});
    }
    saveSession(null);
  }

  // ── OAuth (Google / Facebook) ─────────────────────────────────────────────
  /**
   * Redirects to Supabase's OAuth flow.
   * provider: 'google' | 'facebook'
   */
  function signInWithOAuth(provider) {
    const redirectTo = encodeURIComponent(window.location.origin + '/register.html');
    window.location.href =
      `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectTo}`;
  }

  return {
    setSession: saveSession,
    saveSession,
    getSession,
    getAccessToken,
    getUser,
    isLoggedIn,
    handleHashSession,
    fetchUser,
    signInWithEmail,
    signUp,
    upsertProfile,
    signOut,
    signInWithOAuth,
  };
})();


// ─── INTENT STORAGE ──────────────────────────────────────────────────────────
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

const AvatarStore = {
  key: 'sq_profile_avatars',
  getAll() {
    try { return JSON.parse(localStorage.getItem(this.key) || '{}'); }
    catch { return {}; }
  },
  get(email) {
    if (!email) return '';
    return this.getAll()[email.toLowerCase()] || '';
  },
  set(email, dataUrl) {
    if (!email) return;
    const all = this.getAll();
    all[email.toLowerCase()] = dataUrl;
    localStorage.setItem(this.key, JSON.stringify(all));
  }
};


// ─── NAV UPDATE ──────────────────────────────────────────────────────────────
function updateNavForUser(user) {
  document.querySelectorAll('.sq-avatar-menu').forEach(node => node.remove());
  const loginBtn =
    document.querySelector('.nav-login, a[href*="login.html"], button[onclick*="login.html"]') ||
    Array.from(document.querySelectorAll('button,a')).find(el => {
      const t = (el.textContent || '').trim().toLowerCase();
      return t === 'sign in' || t === 'login' || t === 'log in';
    });
  const registerBtn =
    document.querySelector('.nav-register, a[href*="register.html"], button[onclick*="register.html"]') ||
    Array.from(document.querySelectorAll('button,a')).find(el => {
      const t = (el.textContent || '').trim().toLowerCase();
      return t.includes('sign up') || t.includes('register');
    });

  if (!loginBtn && !registerBtn) return;

  if (user) {
    const displayName = getDisplayName(user);
    const avatarUrl   = getAvatarUrl(user);
    const initials   = getInitials(user);
    const avatarMenu = document.createElement('div');
    avatarMenu.className = 'sq-avatar-menu';
    avatarMenu.innerHTML = `
      <button class="sq-avatar-btn" aria-label="My account" aria-expanded="false">
        <span class="sq-avatar-initials sq-avatar-wrap" title="${displayName}">
          ${avatarUrl
            ? `<img src="${avatarUrl}" alt="${displayName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
            : `<span>${initials}</span>`
          }
        </span>
        <span class="sq-avatar-name">My Account</span>
        <svg class="sq-chevron" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"/>
        </svg>
      </button>
      <ul class="sq-avatar-dropdown" role="menu">
        <li style="padding:8px 10px;font-size:.83rem;color:#6b7280;">${displayName}</li>
        <li><a href="/dashboard.html" role="menuitem">My Dashboard</a></li>
        <li><a href="/bookings.html" role="menuitem">My Bookings</a></li>
        <li><a href="/profile.html" role="menuitem">Profile</a></li>
        <li><button id="sq-upload-avatar-btn" type="button" role="menuitem">Upload Photo</button></li>
        <li class="sq-divider"></li>
        <li><button id="sq-logout-btn" role="menuitem">Logout</button></li>
      </ul>`;

    const parent = loginBtn?.parentNode || registerBtn?.parentNode;
    loginBtn?.remove();
    registerBtn?.remove();
    parent?.appendChild(avatarMenu);

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

    document.getElementById('sq-logout-btn')?.addEventListener('click', async () => {
      await SQ.signOut();
      window.location.href = '/index.html';
    });

    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.accept = 'image/*';
    uploadInput.style.display = 'none';
    avatarMenu.appendChild(uploadInput);

    document.getElementById('sq-upload-avatar-btn')?.addEventListener('click', () => {
      uploadInput.click();
    });

    uploadInput.addEventListener('change', async () => {
      const file = uploadInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = String(reader.result || '');
        AvatarStore.set(user.email, dataUrl);
        if (user.user_metadata) user.user_metadata.avatar_url = dataUrl;
        const session = SQ.getSession();
        if (session?.user) {
          session.user.user_metadata = session.user.user_metadata || {};
          session.user.user_metadata.avatar_url = dataUrl;
          SQ.saveSession(session);
        }
        try {
          await SQ.upsertProfile({
            id: session?.user?.id,
            email: user.email,
            full_name: displayName,
            avatar_url: dataUrl
          }, SQ.getAccessToken());
        } catch (_) {}
        updateNavForUser(session?.user || user);
      };
      reader.readAsDataURL(file);
    });

  } else {
    loginBtn?.style.removeProperty('display');
    registerBtn?.style.removeProperty('display');
  }
}

function getInitials(user) {
  const name = getDisplayName(user);
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function getDisplayName(user) {
  return user?.user_metadata?.full_name || user?.name || user?.email?.split('@')[0] || 'User';
}

function getAvatarUrl(user) {
  return user?.user_metadata?.avatar_url || AvatarStore.get(user?.email) || '';
}


// ─── AUTH GATE ────────────────────────────────────────────────────────────────
function requireAuth(intent, proceedFn) {
  const user = SQ.getUser();
  if (user) { proceedFn(user); return; }

  PendingIntent.save({ returnUrl: window.location.href, ...intent });

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

async function resumePendingIntent() {
  const intent = PendingIntent.get();
  PendingIntent.clear();

  if (!intent?.returnUrl) { window.location.href = '/dashboard.html'; return; }

  const url = new URL(intent.returnUrl);
  if (intent.data) {
    url.searchParams.set('sq_resume', btoa(JSON.stringify(intent.data)));
    url.searchParams.set('sq_action', intent.action || 'book');
  }
  window.location.href = url.toString();
}

function handlePostLoginRedirect(defaultUrl = 'dashboard.html') {
  const intent = PendingIntent.get();
  PendingIntent.clear();

  if (!intent?.returnUrl) {
    window.location.href = defaultUrl;
    return;
  }

  const url = new URL(intent.returnUrl, window.location.origin);
  if (intent.data) {
    url.searchParams.set('sq_resume', btoa(JSON.stringify(intent.data)));
    url.searchParams.set('sq_action', intent.action || 'book');
  }
  window.location.href = url.toString();
}

function readResumedData() {
  const params = new URLSearchParams(window.location.search);
  const raw    = params.get('sq_resume');
  const action = params.get('sq_action');
  if (!raw) return null;

  params.delete('sq_resume');
  params.delete('sq_action');
  const clean = params.toString();
  history.replaceState(null, '', window.location.pathname + (clean ? '?' + clean : ''));

  try { return { action, data: JSON.parse(atob(raw)) }; }
  catch { return null; }
}

function ensureAuthStyles() {
  const hasStyles = !!document.querySelector('link[href*="auth-ui.css"]');
  if (hasStyles) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'auth-ui.css';
  document.head.appendChild(link);
}


// ─── BOOTSTRAP ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  ensureAuthStyles();
  const fromHash = SQ.handleHashSession();

  let user = SQ.getUser();
  if (!user || fromHash) {
    user = await SQ.fetchUser();
  }

  updateNavForUser(user);

  if (fromHash && user) {
    await resumePendingIntent();
  }
});


// ─── PUBLIC API ───────────────────────────────────────────────────────────────
window.SQ                  = SQ;
window.Auth                = {
  ...SQ,
  requireAuth,
  resumePendingIntent,
  handlePostLoginRedirect,
  readResumedData,
};
window.PendingIntent       = PendingIntent;
window.requireAuth         = requireAuth;
window.resumePendingIntent = resumePendingIntent;
window.readResumedData     = readResumedData;