/* ============================================================
   TRAVEL PORTAL — login.js  (Supabase edition)
   Authenticates users via Supabase email/password auth.
   Keeps all original UI: validation, toast, spinner, toggle.
   ============================================================

   SETUP — replace the two values below with your own:
     SUPABASE_URL  → Project Settings > API > Project URL
     SUPABASE_KEY  → Project Settings > API > anon / public key
*/

const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eKZx3549j8unaFOQaZNGlQ_IdVWH5BI';

/* ── Supabase client (loaded via CDN in login.html) ── */
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const form        = document.getElementById('loginForm');
  const emailInput  = document.getElementById('email');
  const pwInput     = document.getElementById('password');
  const emailError  = document.getElementById('emailError');
  const pwError     = document.getElementById('passwordError');
  const togglePwBtn = document.getElementById('togglePw');
  const loginBtn    = document.getElementById('loginBtn');
  const btnText     = loginBtn ? loginBtn.querySelector('.btn-text') : null;
  const btnSpinner  = document.getElementById('btnSpinner');

  /* ── Redirect if already logged in ── */
  if (Auth.isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  /* ── Password visibility toggle ── */
  if (togglePwBtn) {
    togglePwBtn.addEventListener('click', function () {
      const isPassword = pwInput.type === 'password';
      pwInput.type = isPassword ? 'text' : 'password';
      const eyeOpen   = togglePwBtn.querySelector('.eye-open');
      const eyeClosed = togglePwBtn.querySelector('.eye-closed');
      if (eyeOpen)   eyeOpen.style.display   = isPassword ? 'none'  : 'block';
      if (eyeClosed) eyeClosed.style.display = isPassword ? 'block' : 'none';
    });
  }

  /* ── Field validation helpers ── */
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function showFieldError(inputEl, errorEl, msg) {
    if (!inputEl || !errorEl) return;
    const wrap = inputEl.closest('.input-wrap');
    if (wrap) wrap.classList.add('error');
    errorEl.textContent = msg;
  }

  function clearFieldError(inputEl, errorEl) {
    if (!inputEl || !errorEl) return;
    const wrap = inputEl.closest('.input-wrap');
    if (wrap) wrap.classList.remove('error');
    errorEl.textContent = '';
  }

  if (emailInput) emailInput.addEventListener('input', () => clearFieldError(emailInput, emailError));
  if (pwInput)    pwInput.addEventListener('input',    () => clearFieldError(pwInput, pwError));

  function validateForm() {
    let ok = true;
    if (!emailInput.value.trim()) {
      showFieldError(emailInput, emailError, 'Email address is required.'); ok = false;
    } else if (!isValidEmail(emailInput.value)) {
      showFieldError(emailInput, emailError, 'Please enter a valid email address.'); ok = false;
    } else {
      clearFieldError(emailInput, emailError);
    }

    if (!pwInput.value) {
      showFieldError(pwInput, pwError, 'Password is required.'); ok = false;
    } else if (pwInput.value.length < 6) {
      showFieldError(pwInput, pwError, 'Password must be at least 6 characters.'); ok = false;
    } else {
      clearFieldError(pwInput, pwError);
    }
    return ok;
  }

  /* ── Toast notification ── */
  function showToast(message, type, duration) {
    duration = duration || 3000;
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }

  /* ── Button loading state ── */
  function setLoading(on) {
    if (!loginBtn) return;
    loginBtn.disabled = on;
    if (btnText)    btnText.style.display    = on ? 'none'        : 'inline';
    if (btnSpinner) btnSpinner.style.display = on ? 'inline-flex' : 'none';
  }

  /* ── Form submit → Supabase sign in ── */
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);

      try {
        const { data, error } = await sb.auth.signInWithPassword({
          email:    emailInput.value.trim(),
          password: pwInput.value
        });

        if (error) {
          // Supabase returns a message we can show directly
          showToast(error.message || 'Invalid credentials. Please try again.', 'error', 4000);
          setLoading(false);
          return;
        }

        // ✅ Success — store session via Auth utility
        Auth.setSession(data.session);

        const name = Auth.getUser()?.name || 'Traveller';
        showToast('Welcome back, ' + name + '! Redirecting...', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1400);

      } catch (err) {
        console.error('Login error:', err);
        showToast('Something went wrong. Please try again.', 'error', 4000);
        setLoading(false);
      }
    });
  }

  /* ── Social login buttons ── */
  document.querySelectorAll('.btn-social').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      const isGoogle   = btn.textContent.trim().toLowerCase().includes('google');
      const isFacebook = btn.textContent.trim().toLowerCase().includes('facebook');

      if (isGoogle) {
        const { error } = await sb.auth.signInWithOAuth({ provider: 'google' });
        if (error) showToast('Google login failed: ' + error.message, 'error');
      } else if (isFacebook) {
        const { error } = await sb.auth.signInWithOAuth({ provider: 'facebook' });
        if (error) showToast('Facebook login failed: ' + error.message, 'error');
      } else {
        showToast('Social login coming soon', 'success', 3000);
      }
    });
  });

  /* ── Forgot password ── */
  const forgotLink = document.querySelector('.forgot-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', async function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email || !isValidEmail(email)) {
        showToast('Enter your email above first, then click Forgot password.', 'error', 4000);
        emailInput.focus();
        return;
      }
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/myProject/reset-password.html'
      });
      if (error) {
        showToast('Could not send reset email: ' + error.message, 'error', 4000);
      } else {
        showToast('Password reset email sent! Check your inbox.', 'success', 5000);
      }
    });
  }

  /* ── Sign up link ── */
  const signupLink = document.querySelector('.signup-link');
  if (signupLink) {
    signupLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'register.html';
    });
  }

});