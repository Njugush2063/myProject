/* ============================================================
   TRAVEL PORTAL — login.js
   Authenticates users against localStorage (sq_user).
============================================================ */

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

  /* Redirect if already logged in */
  if (localStorage.getItem('sq_session') === 'active') {
    window.location.href = 'dashboard.html';
    return;
  }

  /* Password toggle */
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

  /* Validation */
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function showFieldError(inputEl, errorEl, msg) {
    if (!inputEl || !errorEl) return;
    var wrap = inputEl.closest('.input-wrap');
    if (wrap) wrap.classList.add('error');
    errorEl.textContent = msg;
  }

  function clearFieldError(inputEl, errorEl) {
    if (!inputEl || !errorEl) return;
    var wrap = inputEl.closest('.input-wrap');
    if (wrap) wrap.classList.remove('error');
    errorEl.textContent = '';
  }

  if (emailInput) emailInput.addEventListener('input', function () { clearFieldError(emailInput, emailError); });
  if (pwInput)    pwInput.addEventListener('input',    function () { clearFieldError(pwInput, pwError); });

  function validateForm() {
    var ok = true;
    if (!emailInput.value.trim()) {
      showFieldError(emailInput, emailError, 'Email address is required.'); ok = false;
    } else if (!isValidEmail(emailInput.value)) {
      showFieldError(emailInput, emailError, 'Please enter a valid email address.'); ok = false;
    } else { clearFieldError(emailInput, emailError); }

    if (!pwInput.value) {
      showFieldError(pwInput, pwError, 'Password is required.'); ok = false;
    } else if (pwInput.value.length < 6) {
      showFieldError(pwInput, pwError, 'Password must be at least 6 characters.'); ok = false;
    } else { clearFieldError(pwInput, pwError); }
    return ok;
  }

  /* Toast */
  function showToast(message, type, duration) {
    duration = duration || 3000;
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { toast.classList.add('show'); });
    });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 350);
    }, duration);
  }

  /* Loading state */
  function setLoading(on) {
    if (!loginBtn) return;
    loginBtn.disabled = on;
    if (btnText)    btnText.style.display    = on ? 'none'        : 'inline';
    if (btnSpinner) btnSpinner.style.display = on ? 'inline-flex' : 'none';
  }

  /* Auth from localStorage + demo bypass */
  function authenticate(email, password) {
    var stored = localStorage.getItem('sq_user');
    if (stored) {
      try {
        var user = JSON.parse(stored);
        if (user.email && user.email.toLowerCase() === email.toLowerCase() && user.password === password) {
          return { success: true, name: user.name };
        }
      } catch (e) {}
    }
    /* Demo account */
    if (email.toLowerCase() === 'demo@safariquest.com' && password === 'demo1234') {
      if (!stored) {
        localStorage.setItem('sq_user', JSON.stringify({ name: 'Demo Traveller', email: 'demo@safariquest.com', password: 'demo1234' }));
      }
      return { success: true, name: 'Demo Traveller' };
    }
    return { success: false };
  }

  /* Form submit */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;
      setLoading(true);
      setTimeout(function () {
        setLoading(false);
        var result = authenticate(emailInput.value.trim(), pwInput.value);
        if (result.success) {
          localStorage.setItem('sq_session', 'active');
          showToast('Welcome back, ' + result.name + '! Redirecting...', 'success');
          setTimeout(function () { window.location.href = 'dashboard.html'; }, 1400);
        } else {
          showToast('Invalid credentials. Try demo@safariquest.com / demo1234', 'error', 4000);
        }
      }, 1200);
    });
  }

  /* Social buttons */
  document.querySelectorAll('.btn-social').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showToast('Social login coming soon — use email/password or demo account', 'success', 3000);
    });
  });

  /* Forgot password */
  var forgotLink = document.querySelector('.forgot-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('Tip: Register a new account or use demo@safariquest.com / demo1234', 'success', 4000);
    });
  }

  /* Sign up link */
  var signupLink = document.querySelector('.signup-link');
  if (signupLink) {
    signupLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'register.html';
    });
  }

});
