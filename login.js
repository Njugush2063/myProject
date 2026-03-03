/* ============================================================
   TRAVEL PORTAL — login.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Element references ── */
  const form        = document.getElementById('loginForm');
  const emailInput  = document.getElementById('email');
  const pwInput     = document.getElementById('password');
  const emailError  = document.getElementById('emailError');
  const pwError     = document.getElementById('passwordError');
  const togglePwBtn = document.getElementById('togglePw');
  const eyeOpen     = togglePwBtn.querySelector('.eye-open');
  const eyeClosed   = togglePwBtn.querySelector('.eye-closed');
  const loginBtn    = document.getElementById('loginBtn');
  const btnText     = loginBtn.querySelector('.btn-text');
  const btnSpinner  = document.getElementById('btnSpinner');

  /* ═══════════════════════════════════════
     AUTHORISED CREDENTIALS
     Add or edit entries here as needed.
  ════════════════════════════════════════ */
  const VALID_USERS = [
    { email: 'samuelkamande997@gmail.com', password: '12345678' }
  ];

  /* ═══════════════════════════════════════
     PASSWORD VISIBILITY TOGGLE
  ════════════════════════════════════════ */
  togglePwBtn.addEventListener('click', function () {
    const isPassword = pwInput.type === 'password';
    pwInput.type = isPassword ? 'text' : 'password';
    eyeOpen.style.display   = isPassword ? 'none'  : 'block';
    eyeClosed.style.display = isPassword ? 'block' : 'none';
  });

  /* ═══════════════════════════════════════
     VALIDATION HELPERS
  ════════════════════════════════════════ */
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function showError(inputWrap, errorEl, message) {
    inputWrap.classList.add('error');
    errorEl.textContent = message;
  }

  function clearError(inputWrap, errorEl) {
    inputWrap.classList.remove('error');
    errorEl.textContent = '';
  }

  /* ── Live validation: clear error as user types ── */
  emailInput.addEventListener('input', function () {
    clearError(emailInput.closest('.input-wrap'), emailError);
  });

  pwInput.addEventListener('input', function () {
    clearError(pwInput.closest('.input-wrap'), pwError);
  });

  /* ═══════════════════════════════════════
     FORM VALIDATION
  ════════════════════════════════════════ */
  function validateForm() {
    let isValid = true;

    const emailWrap = emailInput.closest('.input-wrap');
    const pwWrap    = pwInput.closest('.input-wrap');

    // Email checks
    if (!emailInput.value.trim()) {
      showError(emailWrap, emailError, 'Email address is required.');
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      showError(emailWrap, emailError, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailWrap, emailError);
    }

    // Password checks
    if (!pwInput.value) {
      showError(pwWrap, pwError, 'Password is required.');
      isValid = false;
    } else if (pwInput.value.length < 6) {
      showError(pwWrap, pwError, 'Password must be at least 6 characters.');
      isValid = false;
    } else {
      clearError(pwWrap, pwError);
    }

    return isValid;
  }

  /* ═══════════════════════════════════════
     TOAST NOTIFICATIONS
  ════════════════════════════════════════ */
  function showToast(message, type, duration) {
    duration = duration || 3000;

    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add('show');
      });
    });

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 350);
    }, duration);
  }

  /* ═══════════════════════════════════════
     LOADING STATE
  ════════════════════════════════════════ */
  function setLoading(isLoading) {
    loginBtn.disabled        = isLoading;
    btnText.style.display    = isLoading ? 'none'        : 'inline';
    btnSpinner.style.display = isLoading ? 'inline-flex' : 'none';
  }

  /* ═══════════════════════════════════════
     FORM SUBMIT
  ════════════════════════════════════════ */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate network delay
    setTimeout(function () {
      setLoading(false);

      const enteredEmail    = emailInput.value.trim().toLowerCase();
      const enteredPassword = pwInput.value;

      // Check against valid users list
      const match = VALID_USERS.find(function (user) {
        return user.email.toLowerCase() === enteredEmail &&
               user.password            === enteredPassword;
      });

      if (match) {
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(function () {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        showToast('Invalid email or password. Please try again.', 'error');
      }

    }, 1200);
  });

  /* ═══════════════════════════════════════
     SOCIAL BUTTON FEEDBACK
  ════════════════════════════════════════ */
  document.querySelectorAll('.btn-social').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const provider = btn.textContent.trim();
      showToast('Connecting to ' + provider + '...', 'success', 2000);
    });
  });

  /* ═══════════════════════════════════════
     FORGOT PASSWORD LINK
  ════════════════════════════════════════ */
  document.querySelector('.forgot-link').addEventListener('click', function (e) {
    e.preventDefault();
    showToast('Password reset link sent to your email.', 'success', 3000);
  });

  /* ═══════════════════════════════════════
     SIGN UP LINK
  ════════════════════════════════════════ */
  document.querySelector('.signup-link').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'register.html';
  });

});
