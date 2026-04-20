/* ═══════════════════════════════════════════════════════════════════════════
   SafariQuest — mpesa.js
   Frontend M-Pesa helper. Include BEFORE booking.html's inline script.
   ───────────────────────────────────────────────────────────────────────────
   Exposes window.MpesaHelper with:
     formatPhone(phone)            → normalized "2547XXXXXXXX" or null
     initiateStkPush(opts)         → Promise<{ checkoutRequestId }>
     pollPaymentStatus(opts)       → starts polling; calls onPaid/onFailed/onTimeout
     cancelPolling()               → stop any running poll
   ═══════════════════════════════════════════════════════════════════════════ */

window.MpesaHelper = (() => {

  let _pollTimer  = null;
  let _pollCount  = 0;
  const MAX_POLLS = 24;   // 24 × 5s = 2 minutes

  // ── Phone normalizer ──────────────────────────────────────────────────────
  /**
   * Accepts:  07XXXXXXXX  |  +2547XXXXXXXX  |  2547XXXXXXXX  |  01XXXXXXXX
   * Returns:  "2547XXXXXXXX" if valid Kenyan mobile, null otherwise
   */
  function formatPhone(raw) {
    if (!raw) return null;
    let p = String(raw).replace(/[\s\-()]/g, '');
    if (p.startsWith('+')) p = p.slice(1);
    if (p.startsWith('0') && p.length === 10) p = '254' + p.slice(1);
    // Allow 2547XXXXXXXX and 2541XXXXXXXX (Safaricom prefixes: 7x, 1x)
    if (/^254[17]\d{8}$/.test(p)) return p;
    return null;
  }

  // ── STK Push initiator ────────────────────────────────────────────────────
  /**
   * opts: {
   *   backendUrl:  string,     // e.g. 'https://xxx.onrender.com'
   *   phone:       string,     // raw phone from input
   *   amount:      number,     // KES integer
   *   bookingId:   string,     // UUID of the bookings row
   *   description: string,     // optional
   * }
   * Returns { checkoutRequestId } on success, throws on error.
   */
  async function initiateStkPush({ backendUrl, phone, amount, bookingId, description }) {
    const normalizedPhone = formatPhone(phone);
    if (!normalizedPhone) throw new Error('Invalid phone number. Use format 07XXXXXXXX.');

    const url = `${backendUrl.replace(/\/$/, '')}/mpesa/stk-push`;
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        phone:       normalizedPhone,
        amount:      Math.round(amount),
        bookingId,
        description: description || 'SafariQuest Booking',
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'STK Push failed. Try again.');
    return data; // { checkoutRequestId, merchantRequestId, responseDescription }
  }

  // ── Status poller ─────────────────────────────────────────────────────────
  /**
   * opts: {
   *   backendUrl:          string,
   *   checkoutRequestId:   string,
   *   onPaid:              (info) => void,
   *   onFailed:            (reason) => void,
   *   onTimeout:           () => void,
   *   onPoll?:             (attempt, max) => void,   // optional progress callback
   * }
   */
  function pollPaymentStatus({ backendUrl, checkoutRequestId, onPaid, onFailed, onTimeout, onPoll }) {
    cancelPolling(); // cancel any previous poll
    _pollCount = 0;

    const url = `${backendUrl.replace(/\/$/, '')}/mpesa/status/${encodeURIComponent(checkoutRequestId)}`;

    _pollTimer = setInterval(async () => {
      _pollCount++;
      if (typeof onPoll === 'function') onPoll(_pollCount, MAX_POLLS);

      try {
        const res  = await fetch(url);
        const info = await res.json();

        if (info.status === 'paid') {
          cancelPolling();
          if (typeof onPaid === 'function') onPaid(info);

        } else if (info.status === 'failed' || info.status === 'expired') {
          cancelPolling();
          if (typeof onFailed === 'function') onFailed(info.reason || 'Payment was not completed.');

        } else if (info.status === 'unknown') {
          // Server restarted — treat as timeout after a couple tries
          if (_pollCount >= 3) {
            cancelPolling();
            if (typeof onTimeout === 'function') onTimeout();
          }
        }
        // status === 'pending': keep polling
      } catch (err) {
        console.warn('[MpesaHelper] Poll error:', err.message);
      }

      if (_pollCount >= MAX_POLLS) {
        cancelPolling();
        if (typeof onTimeout === 'function') onTimeout();
      }
    }, 5000);
  }

  function cancelPolling() {
    if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null; }
    _pollCount = 0;
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  return { formatPhone, initiateStkPush, pollPaymentStatus, cancelPolling };
})();
