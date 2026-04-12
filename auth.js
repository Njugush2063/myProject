/**
 * auth.js — SafariQuest Shared Auth Utility
 * Add this file to your myProject/ root folder.
 * Load it as the FIRST script in every HTML page's <head>.
 *
 * Usage on protected pages:
 *   <script src="auth.js"></script>
 *   <script>Auth.guard();</script>
 *
 * Usage on login page after successful login:
 *   Auth.login({ name: 'Jane', email: 'jane@email.com' });
 *
 * Usage for logout button:
 *   Auth.logout();
 */

const Auth = {
  SESSION_KEY: 'sqi_auth_session',

  /**
   * Call this after a successful login.
   * @param {object} userData - any user info you want to store
   */
  login(userData = {}) {
    const session = {
      user: userData,
      ts: Date.now()
    };
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    // Also mirror to localStorage for persistence across tabs
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  },

  /**
   * Returns true if the user is considered authenticated.
   * Checks (in order):
   *  1. sessionStorage (set when dashboard loads or login occurs)
   *  2. localStorage (persistent login)
   *  3. ?skipAuth=true URL param (dashboard navigation bypass)
   */
  isLoggedIn() {
    // 1. Check sessionStorage
    if (sessionStorage.getItem(this.SESSION_KEY)) return true;

    // 2. Check localStorage
    if (localStorage.getItem(this.SESSION_KEY)) {
      // Promote to sessionStorage so subsequent checks are faster
      sessionStorage.setItem(
        this.SESSION_KEY,
        localStorage.getItem(this.SESSION_KEY)
      );
      return true;
    }

    // 3. Check URL param (used when navigating from dashboard)
    const params = new URLSearchParams(window.location.search);
    if (params.get('skipAuth') === 'true') {
      // Stamp the session so further page navigations also pass
      this.login({ bypass: true });
      // Clean the URL (remove ?skipAuth=true from address bar)
      window.history.replaceState({}, '', window.location.pathname);
      return true;
    }

    return false;
  },

  /**
   * Call at the top of every protected page.
   * Redirects to login.html if not authenticated.
   */
  guard() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  },

  /**
   * Get the stored user object (or null).
   */
  getUser() {
    const raw =
      sessionStorage.getItem(this.SESSION_KEY) ||
      localStorage.getItem(this.SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw).user || null;
    } catch {
      return null;
    }
  },

  /**
   * Clears all auth state and redirects to login.
   */
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'login.html';
  }
};
