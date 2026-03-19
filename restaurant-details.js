// restaurant-details.js - Updated with debugging
console.log('🚀 Restaurant details page loaded');

// Get slug from URL
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('id');
console.log('📍 Looking for restaurant with slug:', slug);

// Show debug info on page
function showDebugInfo(message, isError = false) {
    const container = document.querySelector('.restaurant-detail-container');
    if (container) {
        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = `
            background: ${isError ? '#ffebee' : '#e8f5e8'};
            color: ${isError ? '#c62828' : '#2e7d32'};
            padding: 16px;
            margin: 16px;
            border-radius: 8px;
            font-family: monospace;
            white-space: pre-wrap;
            border: 1px solid ${isError ? '#ef9a9a' : '#a5d6a7'};
        `;
        debugDiv.innerHTML = `<strong>🔍 Debug:</strong> ${message}`;
        container.prepend(debugDiv);
    }
}

if (!slug) {
    showDebugInfo('❌ No restaurant ID provided in URL', true);
    document.querySelector('.restaurant-content').innerHTML = '<div class="error">No restaurant specified</div>';
    throw new Error('No slug provided');
}

// Show that we're trying to fetch
showDebugInfo(`⏳ Fetching restaurant with slug: "${slug}"...`);

// Supabase config
const SUPABASE_URL = 'https://cbyipmrozqsntojiartw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNieWlwbXJvenFzbnRvamlhcnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTkxNTQsImV4cCI6MjA4ODk3NTE1NH0.31TAhmUCV_Uh0W8FGnR2_TLCZDU4YBM1U5LMSMc5JZs';

async function fetchRestaurant() {
    try {
        console.log('📡 Fetching from Supabase...');
        
        // Try simple fetch first to test connection
        const testUrl = `${SUPABASE_URL}/rest/v1/restaurants?select=count`;
        console.log('🔗 Test URL:', testUrl);
        
        const testResponse = await fetch(testUrl, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        console.log('📊 Test response status:', testResponse.status);
        
        if (!testResponse.ok) {
            const testError = await testResponse.text();
            console.error('❌ Test failed:', testError);
            showDebugInfo(`❌ Connection test failed: Status ${testResponse.status} - ${testError}`, true);
            return;
        }
        
        console.log('✅ Connection test passed');
        showDebugInfo('✅ Supabase connection working! Now fetching restaurant...');
        
        // Now fetch the actual restaurant
        const url = `${SUPABASE_URL}/rest/v1/restaurants?slug=eq.${slug}&select=*`;
        console.log('🔗 Restaurant URL:', url);
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        console.log('📊 Restaurant response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Restaurant fetch failed:', errorText);
            showDebugInfo(`❌ Failed to fetch restaurant: Status ${response.status} - ${errorText}`, true);
            return;
        }
        
        const data = await response.json();
        console.log('✅ Restaurant data received:', data);
        
        if (data.length === 0) {
            showDebugInfo(`❌ No restaurant found with slug: "${slug}"`, true);
            return;
        }
        
        const restaurant = data[0];
        console.log('🍽️ Restaurant details:', restaurant);
        showDebugInfo(`✅ Found: ${restaurant.name}`);
        
        // Update the page with restaurant data
        updatePageWithRestaurant(restaurant);
        
    } catch (error) {
        console.error('💥 Fatal error:', error);
        showDebugInfo(`❌ Error: ${error.message}`, true);
    }
}

function updatePageWithRestaurant(restaurant) {
    // Update page title
    document.title = `${restaurant.name} - SafariQuest`;
    
    // Update hero section
    document.querySelector('.restaurant-hero').style.backgroundImage = `url('${restaurant.image_url || restaurant.featured_image}')`;
    document.querySelector('.restaurant-name').textContent = restaurant.name;
    
    // Update info strip
    document.querySelector('.cuisine-type').textContent = restaurant.cuisine_type || 'African';
    document.querySelector('.price-range').innerHTML = `<span class="price-value">KSh ${restaurant.price_per_person_min?.toLocaleString()} - ${restaurant.price_per_person_max?.toLocaleString()}</span> per person`;
    document.querySelector('.location-name').textContent = `${restaurant.city}, ${restaurant.area || ''}`;
    document.querySelector('.hours-value').textContent = restaurant.opening_hours || 'Daily 11am - 11pm';
    
    // Update description
    document.querySelector('.restaurant-description').innerHTML = `<p>${restaurant.description || ''}</p>`;
    
    // Update highlights
    if (restaurant.highlights) {
        const highlightsList = document.querySelector('.highlights-list');
        if (highlightsList) {
            highlightsList.innerHTML = restaurant.highlights.map(h => `<li>${h}</li>`).join('');
        }
    }
    
    // Update reservation sidebar
    document.querySelector('.reservation-card .price-display').innerHTML = `
        <span class="price-amount">KSh ${restaurant.price_per_person_min?.toLocaleString()} - ${restaurant.price_per_person_max?.toLocaleString()}</span>
        <span class="price-label">per person (avg.)</span>
    `;
    
    // Build menu section if exists
    if (restaurant.menu && restaurant.menu.length > 0) {
        buildMenuSection(restaurant.menu);
    }
}

function buildMenuSection(menuItems) {
    const menuSection = document.querySelector('.menu-section');
    if (!menuSection) return;
    
    // Group by category
    const categories = {};
    menuItems.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    });
    
    let menuHtml = '<div class="menu-tabs">';
    Object.keys(categories).forEach((category, index) => {
        menuHtml += `<button class="menu-tab ${index === 0 ? 'active' : ''}" data-category="${category}">${category}</button>`;
    });
    menuHtml += '</div><div class="menu-content">';
    
    // Show first category by default
    const firstCategory = Object.keys(categories)[0];
    menuHtml += buildCategoryMenu(firstCategory, categories[firstCategory]);
    menuHtml += '</div>';
    
    menuSection.innerHTML = menuHtml;
    
    // Add tab switching
    document.querySelectorAll('.menu-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.dataset.category;
            const menuContent = document.querySelector('.menu-content');
            menuContent.innerHTML = buildCategoryMenu(category, categories[category]);
        });
    });
}

function buildCategoryMenu(category, items) {
    return `
        <div class="menu-category">
            <h3>${category}</h3>
            <div class="menu-items">
                ${items.map(item => `
                    <div class="menu-item">
                        ${item.image ? `<img src="${item.image}" alt="${item.name}" class="menu-item-image">` : ''}
                        <div class="menu-item-details">
                            <div class="menu-item-header">
                                <span class="menu-item-name">${item.name}</span>
                                <span class="menu-item-price">KSh ${item.price?.toLocaleString()}</span>
                            </div>
                            ${item.description ? `<p class="menu-item-description">${item.description}</p>` : ''}
                            ${item.popular ? '<span class="popular-badge">⭐ Popular</span>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Start fetching when page loads
document.addEventListener('DOMContentLoaded', fetchRestaurant);
