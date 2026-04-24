/**
 * Restaurant Order Checkout with M-Pesa Integration
 * Handles order confirmation, M-Pesa STK push, and Supabase order storage
 */

(function() {
  'use strict';

  const LS_KEY = 'sq_pending_restaurant_order';
  const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNieWlwbXJvenFzbnRvamlhcnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTkxNTQsImV4cCI6MjA4ODk3NTE1NH0.31TAhmUCV_Uh0W8FGnR2_TLCZDU4YBM1U5LMSMc5JZs';

  // Get M-Pesa backend URL
  function getMpesaBackendUrl() {
    const ls = localStorage.getItem('sq_mpesa_backend_url');
    const meta = document.querySelector('meta[name="mpesa-backend-url"]');
    const m = meta && meta.getAttribute('content');
    const raw = (ls || m || '').trim();
    if (raw && raw !== 'https://YOUR-BACKEND.onrender.com') return raw.replace(/\/$/, '');
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return 'http://localhost:3000';
    return '';
  }

  // Check if M-Pesa backend is available
  function isMpesaBackendAvailable() {
    const url = getMpesaBackendUrl();
    return url && url.length > 0;
  }

  // Validate phone number format
  function validatePhone(phone) {
    const cleaned = phone.replace(/\s+/g, '').replace(/^\+/, '');
    // Accept 07XXXXXXXX, 2547XXXXXXXX, 01XXXXXXXX, 2541XXXXXXXX
    return /^(07|01)\d{8}$/.test(cleaned) || /^254(7|1)\d{8}$/.test(cleaned);
  }

  // Normalize phone to 254 format
  function normalizePhone(phone) {
    let cleaned = phone.replace(/\s+/g, '').replace(/^\+/, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    return cleaned;
  }

  // Show toast message
  function showToast(message, type = 'info') {
    const statusMsg = document.getElementById('rqStatusMessage');
    if (!statusMsg) return;
    
    statusMsg.textContent = message;
    statusMsg.style.display = 'block';
    
    // Set colors based on type
    if (type === 'success') {
      statusMsg.style.backgroundColor = '#d4edda';
      statusMsg.style.color = '#155724';
      statusMsg.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
      statusMsg.style.backgroundColor = '#f8d7da';
      statusMsg.style.color = '#721c24';
      statusMsg.style.border = '1px solid #f5c6cb';
    } else if (type === 'warning') {
      statusMsg.style.backgroundColor = '#fff3cd';
      statusMsg.style.color = '#856404';
      statusMsg.style.border = '1px solid #ffeaa7';
    } else {
      statusMsg.style.backgroundColor = '#d1ecf1';
      statusMsg.style.color = '#0c5460';
      statusMsg.style.border = '1px solid #bee5eb';
    }
  }

  // Hide toast message
  function hideToast() {
    const statusMsg = document.getElementById('rqStatusMessage');
    if (statusMsg) statusMsg.style.display = 'none';
  }

  // Set button loading state
  function setButtonLoading(button, loading, originalText = 'Confirm order') {
    if (loading) {
      button.disabled = true;
      button.textContent = 'Processing...';
      button.style.opacity = '0.7';
    } else {
      button.disabled = false;
      button.textContent = originalText;
      button.style.opacity = '1';
    }
  }

  // Save order to Supabase
  async function saveOrderToSupabase(orderData) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Supabase error: ${error}`);
      }

      const result = await response.json();
      return result[0]; // Return the created order
    } catch (error) {
      console.error('Error saving order to Supabase:', error);
      throw error;
    }
  }

  // Update order status in Supabase
  async function updateOrderStatus(orderId, status, paymentRef = null) {
    try {
      const updateData = { status };
      if (paymentRef) updateData.payment_ref = paymentRef;

      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Initiate M-Pesa STK push
  async function initiateMpesaStkPush(phone, amount, orderReference) {
    const backendUrl = getMpesaBackendUrl();
    if (!backendUrl) {
      throw new Error('M-Pesa backend URL not configured. Set it with: localStorage.setItem("sq_mpesa_backend_url", "http://localhost:3000")');
    }

    try {
      const response = await fetch(`${backendUrl}/mpesa/stkpush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: normalizePhone(phone),
          amount: Math.round(amount),
          accountReference: orderReference,
          transactionDesc: `Restaurant Order - ${orderReference}`
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'STK push failed' }));
        throw new Error(error.error || 'STK push request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('M-Pesa STK push error:', error);
      // Provide more helpful error message
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to M-Pesa backend at ${backendUrl}. Make sure the backend server is running.`);
      }
      throw error;
    }
  }

  // Poll payment status
  async function pollPaymentStatus(checkoutRequestId, orderId, maxAttempts = 30) {
    const backendUrl = getMpesaBackendUrl();
    if (!backendUrl) return;

    let attempts = 0;
    const pollInterval = setInterval(async () => {
      attempts++;

      try {
        const response = await fetch(`${backendUrl}/mpesa/status/${checkoutRequestId}`);
        const data = await response.json();

        if (data.status === 'completed' || data.status === 'paid') {
          clearInterval(pollInterval);
          await updateOrderStatus(orderId, 'completed', data.mpesaReceiptNumber || data.payment_ref);
          showToast('Payment confirmed! Order received.', 'success');
          
          // Clear cart and order after successful payment
          setTimeout(() => {
            clearOrderAndCart();
          }, 3000);
        } else if (data.status === 'failed' || data.status === 'cancelled') {
          clearInterval(pollInterval);
          await updateOrderStatus(orderId, 'failed');
          showToast('Payment failed or cancelled. Please try again.', 'error');
        }

        // Stop polling after max attempts
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          showToast('Payment confirmation pending. Check "My Bookings" for status.', 'warning');
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    }, 2000); // Poll every 2 seconds
  }

  // Clear order and cart
  function clearOrderAndCart() {
    try {
      const order = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      localStorage.removeItem(LS_KEY);
      if (order.restaurantSlug) {
        localStorage.removeItem(`sq_cart_${order.restaurantSlug}`);
      }
    } catch (e) {
      console.error('Error clearing order:', e);
    }

    const panel = document.getElementById('restaurantOrderCheckout');
    if (panel) panel.hidden = true;

    // Reset form
    const mpesaPhoneField = document.getElementById('rqMpesaPhoneField');
    if (mpesaPhoneField) mpesaPhoneField.style.display = 'none';
    
    const phoneInput = document.getElementById('rqMpesaPhone');
    if (phoneInput) phoneInput.value = '';
    
    const methodSelect = document.getElementById('rqPaymentMethod');
    if (methodSelect) methodSelect.value = 'cash';
    
    const noteInput = document.getElementById('rqPaymentNote');
    if (noteInput) noteInput.value = '';
    
    hideToast();
  }

  // Handle M-Pesa order
  async function handleMpesaOrder(order, phone, note) {
    const button = document.getElementById('rqConfirmBtn');
    
    // Validate phone number
    if (!phone) {
      showToast('Please enter your M-Pesa phone number.', 'error');
      document.getElementById('rqMpesaPhone').focus();
      return;
    }

    if (!validatePhone(phone)) {
      showToast('Please enter a valid phone number (07XXXXXXXX or 2547XXXXXXXX).', 'error');
      document.getElementById('rqMpesaPhone').focus();
      return;
    }

    // Check if M-Pesa backend is configured
    if (!isMpesaBackendAvailable()) {
      showToast('M-Pesa backend not configured. Please set up the backend URL first.', 'error');
      console.error('Configure M-Pesa backend: localStorage.setItem("sq_mpesa_backend_url", "http://localhost:3000")');
      return;
    }

    setButtonLoading(button, true);
    hideToast();

    try {
      // Generate order reference
      const timestamp = Date.now();
      const orderReference = `Table ${order.tableNumber} - ${order.customerName} - ${timestamp}`;
      
      // Prepare order data for Supabase
      const orderData = {
        customer_name: order.customerName,
        table_number: order.tableNumber,
        restaurant_name: order.restaurantName,
        restaurant_slug: order.restaurantSlug,
        items: order.items,
        amount: order.totalAmount,
        payment_method: 'M-Pesa',
        phone_number: normalizePhone(phone),
        status: 'pending_payment',
        order_reference: orderReference,
        special_instructions: note || null,
        created_at: new Date().toISOString()
      };

      // Initiate STK push
      showToast('Sending payment request to your phone...', 'info');
      const stkResponse = await initiateMpesaStkPush(phone, order.totalAmount, orderReference);
      
      // Save order to Supabase after successful STK push
      showToast('STK push sent. Enter PIN on your phone.', 'success');
      const savedOrder = await saveOrderToSupabase(orderData);
      
      // Start polling for payment confirmation
      if (stkResponse.CheckoutRequestID && savedOrder.id) {
        pollPaymentStatus(stkResponse.CheckoutRequestID, savedOrder.id);
      }

    } catch (error) {
      console.error('M-Pesa order error:', error);
      showToast(error.message || 'STK push failed. Please try again.', 'error');
    } finally {
      setButtonLoading(button, false);
    }
  }

  // Handle cash/card order
  async function handleCashOrder(order, note) {
    const button = document.getElementById('rqConfirmBtn');
    setButtonLoading(button, true);
    hideToast();

    try {
      const timestamp = Date.now();
      const orderReference = `Table ${order.tableNumber} - ${order.customerName} - ${timestamp}`;
      
      const orderData = {
        customer_name: order.customerName,
        table_number: order.tableNumber,
        restaurant_name: order.restaurantName,
        restaurant_slug: order.restaurantSlug,
        items: order.items,
        amount: order.totalAmount,
        payment_method: 'Cash/Card',
        phone_number: order.customerPhone || null,
        status: 'pending_payment',
        order_reference: orderReference,
        special_instructions: note || null,
        created_at: new Date().toISOString()
      };

      await saveOrderToSupabase(orderData);
      showToast('Order confirmed! Pay at the table when your food arrives.', 'success');
      
      setTimeout(() => {
        clearOrderAndCart();
      }, 2000);

    } catch (error) {
      console.error('Cash order error:', error);
      showToast('Failed to save order. Please try again.', 'error');
    } finally {
      setButtonLoading(button, false);
    }
  }

  // Expose functions globally
  window.RestaurantOrderCheckout = {
    handleMpesaOrder,
    handleCashOrder,
    clearOrderAndCart
  };

})();
