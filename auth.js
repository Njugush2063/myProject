/* ============================================================
   auth.js — SafariQuest Shared Auth Utility (Supabase)
   Place this file in your myProject/ root folder.
   Load it as the FIRST <script> in every page's <head>.
   ============================================================

   HOW TO USE:
   - Protected pages:  <script src="auth.js"></script>
                       <script>Auth.guard();</script>
   - After login:      Auth.setSession(supabaseSession);
   - Logout button:    Auth.logout();
   - Get user info:    Auth.getUser(); // returns { email, name, ... }
*/

const Auth = {
  SESSION_KEY: 'sqi_auth_session',

  /**
   * Store a Supabase session object after successful login.
   * @param {object} session - the session object from Supabase
   */
  setSession(session) {
    if (!session) return;
    const data = {
      access_token: session.access_token,
      user: {
        id:    session.user?.id,
        email: session.user?.email,
        name:  session.user?.user_metadata?.full_name
               || session.user?.user_metadata?.name
               || session.user?.email?.split('@')[0]
               || 'Traveller'
      },
      ts: Date.now()
    };
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(data));
  },

  /**
   * Returns true if the user is authenticated.
   * Checks sessionStorage -> localStorage -> ?skipAuth URL param.
   */
  isLoggedIn() {
    if (sessionStorage.getItem(this.SESSION_KEY)) return true;

    const stored = localStorage.getItem(this.SESSION_KEY);
    if (stored) {
      sessionStorage.setItem(this.SESSION_KEY, stored);
      return true;
    }

    // Dashboard navigation bypass
    const params = new URLSearchParams(window.location.search);
    if (params.get('skipAuth') === 'true') {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({ bypass: true, ts: Date.now() }));
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
   * Get the stored user object.
   * @returns {{ id, email, name } | null}
   */
  getUser() {
    const raw = sessionStorage.getItem(this.SESSION_KEY)
             || localStorage.getItem(this.SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw).user || null; }
    catch { return null; }
  },

  /**
   * Clears all auth state and redirects to login.
   */
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    // Also clear the old localStorage keys from previous system
    localStorage.removeItem('sq_session');
    localStorage.removeItem('sq_user');
    window.location.href = 'login.html';
  }
};