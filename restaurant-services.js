/* ============================================================
   RESTAURANT SERVICES & MENU — restaurant-services.js

   DEPENDS ON: supabase-config.js (must load first in HTML)
   Provides: SUPABASE_URL, SUPABASE_KEY, getRestaurant(), sbFetch()
   ============================================================ */

/* ── Guard: catch missing supabase-config.js early ── */
if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_KEY === 'undefined') {
  console.error(
    '❌ supabase-config.js did not load. ' +
    'Make sure <script src="supabase-config.js"></script> appears BEFORE ' +
    '<script src="restaurant-services.js"></script> in your HTML.'
  );
}

/* ── Cart localStorage key (one per restaurant slug) ── */
function cartKey() {
  const slug = new URLSearchParams(window.location.search).get('id') || 'default';
  return `sq_cart_${slug}`;
}

/* ── Load cart from localStorage ── */
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(cartKey());
    if (!saved) return {};
    const items = JSON.parse(saved);
    const cart = {};
    items.forEach(item => {
      const key = item.db_id || item.id;
      cart[key] = {
        id:          item.db_id || item.id,
        item_name:   item.name,
        price:       item.price,
        image:       item.image || '',
        description: item.desc  || '',
        qty:         item.qty,
        available:   true,
        _fromStorage: true
      };
    });
    return cart;
  } catch (e) { return {}; }
}

/* ── Save cart to localStorage ── */
function saveCartToStorage() {
  try {
    const items = Object.values(window._cart).map(item => ({
      id:    typeof item.id === 'number'
               ? (item.item_name + '_' + item.price).toLowerCase().replace(/[^a-z0-9]/g, '_')
               : item.id,
      db_id: typeof item.id === 'number' ? item.id : null,
      name:  item.item_name,
      price: item.price,
      image: item.image || '',
      desc:  item.description || '',
      qty:   item.qty
    }));
    localStorage.setItem(cartKey(), JSON.stringify(items));
  } catch (e) {}
}

/* ============================================================
   MAIN INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', async function () {

  /* ── Navbar scroll shadow ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── Read slug from URL ── */
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('id');

  if (!slug) {
    document.getElementById('heroTitle').textContent = 'Restaurant not found';
    document.getElementById('heroDesc').textContent  = 'No restaurant ID was provided in the URL.';
    return;
  }

  /* ── Update back link ── */
  document.getElementById('backLink').href = `restaurant-details.html?id=${slug}`;

  /* ── Fetch restaurant info (uses getRestaurant from supabase-config.js) ── */
  let restaurant = null;
  try {
    restaurant = await getRestaurant(slug);
  } catch (e) {
    console.error('Could not load restaurant info:', e.message);
  }

  if (restaurant) {
    document.title = `${restaurant.name} — Menu & Services | SafariQuest`;
    if (restaurant.image_hero) {
      document.getElementById('heroBg').style.backgroundImage = `url('${restaurant.image_hero}')`;
    }
    document.getElementById('heroTitle').textContent    = restaurant.name;
    document.getElementById('heroCuisine').textContent  = restaurant.cuisine  || '';
    document.getElementById('heroCity').textContent     = `📍 ${restaurant.city || ''}`;
    document.getElementById('heroDesc').textContent     = restaurant.description
      ? restaurant.description.substring(0, 120) + '…'
      : 'Explore our full menu and services below.';
    window._restaurantName = restaurant.name;
  } else {
    /* Restaurant row missing from DB — show a helpful message but keep going
       so menu items can still render if the menus table has rows */
    document.getElementById('heroDesc').textContent =
      'Explore our full menu and services below.';
  }

  /* ── Pre-load cart from storage before items arrive ── */
  window._cart = loadCartFromStorage();
  updateCartSidebar();

  /* ── Fetch menu items ── */
  showSkeletons();
  let allItems = [];
  try {
    /* Uses sbFetch from supabase-config.js — no need to repeat headers here */
    allItems = await sbFetch(
      `restaurant_menus?restaurant_slug=eq.${encodeURIComponent(slug)}&order=category.asc,popular.desc&select=*`
    );
  } catch (e) {
    console.error('Menu fetch error:', e.message);
  }

  /* ── Guard: Supabase sometimes returns an error object instead of array ── */
  if (!Array.isArray(allItems)) {
    console.warn('Unexpected menu response:', allItems);
    allItems = [];
  }

  if (allItems.length === 0) {
    document.getElementById('menuGrid').innerHTML  = '';
    document.getElementById('menuEmpty').style.display = 'block';
    document.getElementById('tabsScroll').innerHTML =
      '<span style="padding:16px;color:#8C7B6B;font-size:0.85rem">No menu items yet.</span>';
    return;
  }

  window._allItems = allItems;

  /* ── Merge storage cart with live DB items ── */
  const mergedCart = {};
  Object.values(window._cart).forEach(stored => {
    const live = allItems.find(i => i.id === stored.id || i.item_name === stored.item_name);
    if (live) {
      mergedCart[live.id] = { ...live, qty: stored.qty };
    } else {
      mergedCart[stored.id] = stored;
    }
  });
  window._cart = mergedCart;
  updateCartSidebar();

  /* ── Group items by category ── */
  const categories = {};
  allItems.forEach(item => {
    const cat = item.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });
  window._categories = categories;

  /* ── Category emoji map ── */
  const catIcons = {
    'Starters':               '🥗',
    'Mains':                  '🍽️',
    'Desserts':               '🍮',
    'Drinks':                 '🥂',
    'Events & Private Dining':'🎉',
    'Rooms':                  '🛏️',
    'Spa & Wellness':         '💆',
    'Sides':                  '🥘',
    'Breakfast':              '🍳',
    'Lunch':                  '☀️',
    'Dinner':                 '🌙',
    'Seafood':                '🦐',
    'BBQ':                    '🔥',
    'Other':                  '🍴'
  };

  /* ── Build category tabs ── */
  const tabsEl  = document.getElementById('tabsScroll');
  const catKeys = ['All', ...Object.keys(categories)];

  tabsEl.innerHTML = catKeys.map((cat, i) => {
    const count = cat === 'All' ? allItems.length : categories[cat].length;
    const icon  = cat === 'All' ? '🍴' : (catIcons[cat] || '🍽️');
    return `
      <button class="tab-btn ${i === 0 ? 'active' : ''}"
              onclick="switchTab('${cat}', this)">
        <span class="tab-icon">${icon}</span>
        ${cat}
        <span class="tab-count">${count}</span>
      </button>`;
  }).join('');

  /* ── Render all items initially ── */
  renderItems(allItems);

}); // end DOMContentLoaded


/* ============================================================
   TABS
   ============================================================ */
window.switchTab = function (cat, el) {
  document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const items = cat === 'All' ? window._allItems : (window._categories[cat] || []);
  document.getElementById('menuCatTitle').textContent = cat === 'All' ? 'All Items' : cat;
  renderItems(items);
};


/* ============================================================
   RENDER MENU ITEMS
   ============================================================ */
function renderItems(items) {
  const grid  = document.getElementById('menuGrid');
  const empty = document.getElementById('menuEmpty');

  document.getElementById('menuCatCount').textContent =
    `${items.length} item${items.length !== 1 ? 's' : ''}`;

  if (!items.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = items.map(item => buildCard(item)).join('');
}

/* ── Build a single menu card ── */
function buildCard(item) {
  const inCart = window._cart && window._cart[item.id] ? window._cart[item.id].qty : 0;

  const priceStr = item.price === 0
    ? '<span class="menu-card-price free">Complimentary</span>'
    : `<span class="menu-card-price">KSh ${Number(item.price).toLocaleString('en-KE')}</span>`;

  const control = item.available
    ? (inCart > 0
        ? `<div class="qty-control">
             <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
             <span class="qty-num" id="qty-${item.id}">${inCart}</span>
             <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
           </div>`
        : `<button class="btn-add-first" onclick="addToCart(${item.id})">+ Add</button>`)
    : `<button class="btn-add-first" disabled>Unavailable</button>`;

  const fallbackImg =
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80';

  return `
    <div class="menu-card" id="card-${item.id}">
      <div class="menu-card-img-wrap">
        <img class="menu-card-img"
             src="${item.image || fallbackImg}"
             alt="${item.item_name}"
             loading="lazy"
             onerror="this.src='${fallbackImg}'"/>
        <div class="menu-card-badges">
          ${item.popular   ? '<span class="badge-popular">⭐ Popular</span>'        : ''}
          ${!item.available? '<span class="badge-unavailable">Sold Out</span>' : ''}
        </div>
      </div>
      <div class="menu-card-body">
        <div class="menu-card-name">${item.item_name}</div>
        <div class="menu-card-desc">${item.description || ''}</div>
        <div class="menu-card-footer">
          ${priceStr}
          ${control}
        </div>
      </div>
    </div>`;
}


/* ============================================================
   CART OPERATIONS
   ============================================================ */
window.addToCart = function (id) {
  const item = window._allItems.find(i => i.id === id);
  if (!item) return;
  if (!window._cart[id]) window._cart[id] = { ...item, qty: 0 };
  window._cart[id].qty++;
  saveCartToStorage();
  refreshCard(id);
  updateCartSidebar();
};

window.changeQty = function (id, delta) {
  if (!window._cart[id]) return;
  window._cart[id].qty = Math.max(0, window._cart[id].qty + delta);
  if (window._cart[id].qty === 0) delete window._cart[id];
  saveCartToStorage();
  refreshCard(id);
  updateCartSidebar();
};

/* Refresh just the footer controls of a single card */
function refreshCard(id) {
  const card = document.getElementById(`card-${id}`);
  if (!card) return;
  const item   = window._allItems.find(i => i.id === id);
  if (!item) return;
  const inCart = window._cart[id] ? window._cart[id].qty : 0;
  const footer = card.querySelector('.menu-card-footer');
  if (!footer) return;

  const priceStr = item.price === 0
    ? '<span class="menu-card-price free">Complimentary</span>'
    : `<span class="menu-card-price">KSh ${Number(item.price).toLocaleString('en-KE')}</span>`;

  const control = inCart > 0
    ? `<div class="qty-control">
         <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
         <span class="qty-num" id="qty-${id}">${inCart}</span>
         <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
       </div>`
    : `<button class="btn-add-first" onclick="addToCart(${id})">+ Add</button>`;

  footer.innerHTML = priceStr + control;
}


/* ============================================================
   CART SIDEBAR
   ============================================================ */
function updateCartSidebar() {
  const cartItems  = Object.values(window._cart || {});
  const total      = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count      = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const cartEmptyEl  = document.getElementById('cartEmpty');
  const cartItemsEl  = document.getElementById('cartItems');
  const cartFooterEl = document.getElementById('cartFooter');
  const specialWrap  = document.getElementById('specialWrap');
  const fabCart      = document.getElementById('fabCart');

  if (cartItems.length === 0) {
    cartEmptyEl.style.display  = 'block';
    cartItemsEl.style.display  = 'none';
    cartFooterEl.style.display = 'none';
    if (specialWrap) specialWrap.style.display = 'none';
    if (fabCart) fabCart.classList.remove('has-items');
    return;
  }

  cartEmptyEl.style.display  = 'none';
  cartItemsEl.style.display  = 'block';
  cartFooterEl.style.display = 'block';
  if (specialWrap) specialWrap.style.display = 'block';
  if (fabCart) fabCart.classList.add('has-items');

  const fallbackImg =
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80';

  cartItemsEl.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <img class="cart-item-img"
           src="${item.image || fallbackImg}"
           alt="${item.item_name}"
           onerror="this.src='${fallbackImg}'"/>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.item_name}</div>
        <div class="cart-item-price">KSh ${(item.price * item.qty).toLocaleString('en-KE')}</div>
      </div>
      <div class="cart-item-qty">
        <button class="cart-qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span  class="cart-item-count">${item.qty}</span>
        <button class="cart-qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="changeQty(${item.id}, -${item.qty})">✕</button>
    </div>`).join('');

  document.getElementById('cartSubtotal').textContent = `KSh ${total.toLocaleString('en-KE')}`;
  document.getElementById('cartTotal').textContent    = `KSh ${total.toLocaleString('en-KE')}`;
  if (document.getElementById('fabCount')) document.getElementById('fabCount').textContent = count;
  if (document.getElementById('fabTotal')) document.getElementById('fabTotal').textContent =
    `KSh ${total.toLocaleString('en-KE')}`;
}


/* ============================================================
   PLACE ORDER
   ============================================================ */
window.placeOrder = async function () {
  const cartItems = Object.values(window._cart || {});
  if (!cartItems.length) { alert('Your cart is empty.'); return; }

  const tableNumber        = document.getElementById('tableNumber').value.trim();
  const customerName       = document.getElementById('customerName').value.trim();
  const customerPhone      = document.getElementById('customerPhone').value.trim();
  const specialInstructions= document.getElementById('specialInstructions').value.trim();

  if (!tableNumber) {
    alert('Please enter your table number.');
    document.getElementById('tableNumber').focus();
    return;
  }
  if (!customerName) {
    alert('Please enter your name.');
    document.getElementById('customerName').focus();
    return;
  }

  const slug  = new URLSearchParams(window.location.search).get('id');
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const btn = document.getElementById('placeOrderBtn');
  btn.disabled    = true;
  btn.textContent = '⏳ Placing Order…';

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        apikey:         SUPABASE_KEY,
        Authorization:  `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer:         'return=representation'
      },
      body: JSON.stringify({
        restaurant_slug:      slug,
        restaurant_name:      window._restaurantName || slug,
        table_number:         tableNumber,
        customer_name:        customerName,
        customer_phone:       customerPhone || null,
        items:                cartItems.map(i => ({
                                id:       i.id,
                                name:     i.item_name,
                                price:    i.price,
                                qty:      i.qty,
                                subtotal: i.price * i.qty
                              })),
        special_instructions: specialInstructions || null,
        total_amount:         total,
        status:               'pending'
      })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`Order failed (${res.status}): ${errText}`);
    }

    showSuccessModal(cartItems, total, tableNumber, customerName);

    /* Clear cart */
    window._cart = {};
    saveCartToStorage();
    updateCartSidebar();
    document.getElementById('tableNumber').value        = '';
    document.getElementById('customerName').value       = '';
    document.getElementById('customerPhone').value      = '';
    document.getElementById('specialInstructions').value= '';
    window._allItems.forEach(item => refreshCard(item.id));

  } catch (err) {
    console.error('Order error:', err);
    alert(`Could not place order: ${err.message}`);
  } finally {
    btn.disabled    = false;
    btn.textContent = '🍽️ Place Order';
  }
};


/* ============================================================
   SUCCESS MODAL
   ============================================================ */
function showSuccessModal(items, total, table, name) {
  document.getElementById('modalSummary').innerHTML =
    items.map(i => `
      <div class="modal-summary-item">
        <span>${i.qty}× ${i.item_name}</span>
        <span>KSh ${(i.price * i.qty).toLocaleString('en-KE')}</span>
      </div>`).join('') +
    `<div class="modal-summary-total">
       <span>Total</span>
       <span>KSh ${total.toLocaleString('en-KE')}</span>
     </div>`;

  document.getElementById('modalMessage').textContent =
    `Thank you, ${name}! Your order for Table ${table} has been sent to the kitchen.`;
  document.getElementById('successModal').style.display = 'flex';
}

window.closeModal = function () {
  document.getElementById('successModal').style.display = 'none';
};


/* ============================================================
   HELPERS
   ============================================================ */
window.clearCart = function () {
  if (!Object.keys(window._cart || {}).length) return;
  if (!confirm('Clear your entire cart?')) return;
  window._cart = {};
  saveCartToStorage();
  updateCartSidebar();
  (window._allItems || []).forEach(item => refreshCard(item.id));
};

window.toggleMobileCart = function () {
  const card = document.querySelector('.cart-card');
  if (card) card.style.display = card.style.display === 'block' ? 'none' : 'block';
};

function showSkeletons() {
  document.getElementById('menuGrid').innerHTML = Array(6).fill(`
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>`).join('');
}
