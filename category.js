/* ══════════════════════════════════════════════════════════════════════
   category.js  —  SafariQuest Kenya
   Images come from Supabase DB (image_hero column).
   Falls back to STATIC_SPORTS if Supabase is unavailable.
   Requires: supabase-config.js loaded first (via CDN Supabase library)
══════════════════════════════════════════════════════════════════════ */



function storageUrl(path) {
  return `${STORAGE_BASE}/${path}`;
}

/* ─────────────────────────────────────────────────────────────────────
   SPORT META  —  hero copy + stats per sport
───────────────────────────────────────────────────────────────────── */
const SPORT_META = {
  football: {
    label:      '⚽ Football in Kenya',
    badge:      '🏆 Sports & Recreation',
    heroTitle:  'Kenya\'s World-Class <em>Football Scene</em>',
    heroDesc:   'Home of Talanta Stadium — Africa\'s most beloved football fortress. Explore stadiums, training grounds and fan culture across Kenya.',
    heroBg:     'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Talanta_FC_stadium_Nairobi.jpg/1280px-Talanta_FC_stadium_Nairobi.jpg',
    introTitle: 'The Beautiful Game <em>Across Kenya</em>',
    introDesc:  'Kenya\'s football scene is vibrant and passionate — from Kasarani\'s 60,000-seat national stadium hosting AFCON qualifiers, to grassroots pitches in Kisumu and Mombasa producing world-class talent.',
    stats:      [{ val:'15', lbl:'Stadiums & Venues' }, { val:'18', lbl:'KPL Clubs' }, { val:'60K+', lbl:'Max Capacity' }],
    grid:       'Football Stadiums & Venues',
    breadcrumb: 'Football'
  },
  golf: {
    label:      '⛳ Golf in Kenya',
    badge:      '⛳ Golf & Country Clubs',
    heroTitle:  'Championship Courses <em>Under African Skies</em>',
    heroDesc:   'Kenya boasts some of Africa\'s finest golf courses — from Muthaiga Golf Club (est. 1913) to Vipingo Ridge with Indian Ocean panoramas.',
    heroBg:     'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Muthaiga_Golf_Club.jpg/1280px-Muthaiga_Golf_Club.jpg',
    introTitle: 'Championship Courses <em>Under African Skies</em>',
    introDesc:  'Kenya boasts some of Africa\'s finest golf courses — from Muthaiga Golf Club (est. 1913) to Vipingo Ridge on the coast with Indian Ocean panoramas. Playing golf against a backdrop of wildlife is uniquely Kenyan.',
    stats:      [{ val:'15', lbl:'Golf Courses' }, { val:'110+', lbl:'Years of Golf' }, { val:'4.9★', lbl:'Avg Rating' }],
    grid:       'Golf Courses & Clubs',
    breadcrumb: 'Golf'
  },
  rally: {
    label:      '🚗 Safari Rally in Kenya',
    badge:      '🚗 WRC Safari Rally',
    heroTitle:  'The World\'s Most <em>Legendary Rally</em>',
    heroDesc:   'WRC Safari Rally Kenya — drivers battle through red murram roads, dramatic Rift Valley stages and unpredictable African weather.',
    heroBg:     'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/WRC_Safari_Rally_Kenya_2021.jpg/1280px-WRC_Safari_Rally_Kenya_2021.jpg',
    introTitle: 'The World\'s Most <em>Legendary Rally</em>',
    introDesc:  'The Safari Rally Kenya is a WRC round and the most iconic rally on earth. Drivers battle through red murram roads, dramatic Rift Valley stages, and unpredictable African weather.',
    stats:      [{ val:'15', lbl:'Rally Stages' }, { val:'70+', lbl:'Years of History' }, { val:'WRC', lbl:'World Championship' }],
    grid:       'Safari Rally Stages & Venues',
    breadcrumb: 'Safari Rally'
  },
  basketball: {
    label:      '🏀 Basketball in Kenya',
    badge:      '🏀 Basketball',
    heroTitle:  'Kenya\'s Rising <em>Basketball Nation</em>',
    heroDesc:   'From FIBA Africa qualifiers at Nyayo Indoor Arena to university rivalries — Kenyan basketball is on the rise.',
    heroBg:     'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Nyayo_National_Stadium.jpg/1280px-Nyayo_National_Stadium.jpg',
    introTitle: 'Kenya\'s Rising <em>Basketball Nation</em>',
    introDesc:  'Kenya\'s basketball scene has exploded in recent years. The KBF league features fierce rivalries and world-class facilities in Nairobi have helped Kenyan players earn NBA G-League contracts.',
    stats:      [{ val:'15', lbl:'Arenas & Courts' }, { val:'KBF', lbl:'National League' }, { val:'4.7★', lbl:'Avg Rating' }],
    grid:       'Basketball Arenas & Courts',
    breadcrumb: 'Basketball'
  },
  swimming: {
    label:      '🏊 Swimming in Kenya',
    badge:      '🏊 Aquatics',
    heroTitle:  'Olympic Pools & <em>Coastal Waters</em>',
    heroDesc:   'From Olympic-standard pools in Nairobi to open-water swimming in the Indian Ocean and freshwater Lake Victoria.',
    heroBg:     'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Diani_Beach_Kenya.jpg/1280px-Diani_Beach_Kenya.jpg',
    introTitle: 'Olympic Pools & <em>Coastal Waters</em>',
    introDesc:  'From Olympic-standard pools in Nairobi to open-water swimming in the Indian Ocean and freshwater Lake Victoria — Kenya offers world-class aquatic experiences for every level.',
    stats:      [{ val:'15', lbl:'Pools & Venues' }, { val:'50m', lbl:'Olympic Pools' }, { val:'4.8★', lbl:'Avg Rating' }],
    grid:       'Swimming Pools & Aquatic Venues',
    breadcrumb: 'Swimming'
  }
};

const PAGE_TITLES = {
  football:   'Football Destinations',
  golf:       'Golf Destinations',
  rally:      'Safari Rally Stages',
  basketball: 'Basketball Venues',
  swimming:   'Swimming Venues',
  adventure:  'Adventure Destinations',
  beach:      'Beach Destinations',
  wildlife:   'Wildlife Destinations',
  culture:    'Cultural Destinations',
  nature:     'Nature Destinations',
};

/* ─────────────────────────────────────────────────────────────────────
   STATIC FALLBACK — used only if Supabase fails completely
───────────────────────────────────────────────────────────────────── */
function makeStatic(sport, slug, name, county, difficulty, rating, best_time, description, highlights, featured, schedule, image_hero) {
  return { sport, slug, name, county, difficulty, rating, best_time, description, highlights, featured: featured || false, schedule, image_hero };
}

const STATIC_SPORTS = {
  football: [
    makeStatic('football','kasarani-stadium','Moi International Sports Centre, Kasarani','Nairobi','Easy',4.8,'Year-round',"Kenya's premier national stadium with 60,000+ capacity, home of the Harambee Stars and major AFCON qualifiers.",['60,000 Capacity','AFCON Qualifiers','Olympic Track'],true,'https://www.fkf.co.ke/fixtures','https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Kasarani_stadium_-_panoramio.jpg/1280px-Kasarani_stadium_-_panoramio.jpg'),
    makeStatic('football','nyayo-stadium','Nyayo National Stadium','Nairobi','Easy',4.6,'Year-round','Iconic 30,000-seat multi-use stadium in Nairobi, regularly hosting KPL matches and national events.',['30,000 Capacity','KPL Matches','National Events'],false,'https://www.fkf.co.ke/fixtures','https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Nyayo_National_Stadium.jpg/1280px-Nyayo_National_Stadium.jpg'),
    makeStatic('football','afraha-stadium','Afraha Stadium','Nakuru','Easy',4.4,'Year-round','The heartbeat of Rift Valley football.',['Western Derbies','Rift Valley Hub','Local Passion'],false,'https://www.fkf.co.ke/fixtures','https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Afraha_Stadium%2C_Nakuru.jpg/1280px-Afraha_Stadium%2C_Nakuru.jpg'),
  ],
  golf: [
    makeStatic('golf','muthaiga-golf-club','Muthaiga Golf Club','Nairobi','Moderate',4.9,'Year-round',"Kenya's most prestigious golf club, established in 1913.",['Est. 1913','Kenya Open Host','18-Hole Championship'],true,'https://www.kenyaopen.com/schedule','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Muthaiga_Golf_Club.jpg/1280px-Muthaiga_Golf_Club.jpg'),
    makeStatic('golf','vipingo-ridge','Vipingo Ridge Golf Club','Kilifi','Moderate',4.9,'October – March','18 holes of championship golf on the Kenya coast with stunning Indian Ocean panoramas.',['Ocean Panoramas','Coastal Breeze','David Jones Design'],true,'https://www.vipingoridge.com','https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Vipingo_Ridge.jpg/1280px-Vipingo_Ridge.jpg'),
  ],
  rally: [
    makeStatic('rally','naivasha-rally-stage','Naivasha Rally Hub','Nakuru','Moderate',4.9,'June – July','The beating heart of the WRC Safari Rally.',['WRC Safari Rally','Service Park','Fan Zones'],true,'https://www.wrc.com/en/events/safari-rally-kenya','https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/WRC_Safari_Rally_Kenya_2021.jpg/1280px-WRC_Safari_Rally_Kenya_2021.jpg'),
  ],
  basketball: [
    makeStatic('basketball','nyayo-indoor-arena','Nyayo National Stadium Indoor Arena','Nairobi','Easy',4.7,'Year-round',"Kenya's premier indoor basketball arena.",['FIBA Africa Venue','KBF Finals','Premier Arena'],true,'https://www.kenyabasketball.com/schedule','https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Nyayo_National_Stadium.jpg/1280px-Nyayo_National_Stadium.jpg'),
  ],
  swimming: [
    makeStatic('swimming','kasarani-aquatic-centre','Kasarani Aquatic Centre','Nairobi','Easy',4.8,'Year-round',"Kenya's only Olympic-standard 50m pool.",['50m Olympic Pool','National Championships','Olympic Standard'],true,'https://www.kenyaaquatics.org/events','https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Kasarani_stadium_-_panoramio.jpg/640px-Kasarani_stadium_-_panoramio.jpg'),
  ],
};

/* ─────────────────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────────────────── */
let currentSport = 'football';

/* ─────────────────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  });

  const params  = new URLSearchParams(window.location.search);
  const param   = params.get('sport') || params.get('type') || 'football';
  const valid   = Object.keys(SPORT_META);
  currentSport  = valid.includes(param) ? param : 'football';

  document.title = `${PAGE_TITLES[param] || 'Destinations'} — SafariQuest Kenya`;

  const activeTab = document.querySelector(`.sport-tab[data-sport="${currentSport}"]`);
  if (activeTab) activeTab.classList.add('active');

  updateHero(currentSport);
  loadSport(currentSport);
});

/* ─────────────────────────────────────────────────────────────────────
   SWITCH SPORT TAB
───────────────────────────────────────────────────────────────────── */
window.switchSport = function (sport, btn) {
  if (sport === currentSport) return;
  currentSport = sport;
  document.querySelectorAll('.sport-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  history.replaceState(null, '', `?sport=${sport}`);
  document.title = `${PAGE_TITLES[sport] || 'Destinations'} — SafariQuest Kenya`;
  updateHero(sport);
  loadSport(sport);
};

/* ─────────────────────────────────────────────────────────────────────
   UPDATE HERO
───────────────────────────────────────────────────────────────────── */
function updateHero(sport) {
  const m    = SPORT_META[sport];
  const hero = document.getElementById('catHero');
  if (hero) {
    hero.style.backgroundImage = `url('${m.heroBg}')`;
  }
  const el = id => document.getElementById(id);
  if (el('heroBreadcrumb')) el('heroBreadcrumb').textContent = m.breadcrumb;
  if (el('heroBadge'))      el('heroBadge').textContent      = m.badge;
  if (el('heroTitle'))      el('heroTitle').innerHTML        = m.heroTitle;
  if (el('heroDesc'))       el('heroDesc').textContent       = m.heroDesc;
}

/* ─────────────────────────────────────────────────────────────────────
   UPDATE INTRO PANEL
───────────────────────────────────────────────────────────────────── */
function updateIntro(sport) {
  const m = SPORT_META[sport];
  document.getElementById('introLabel').textContent = m.label;
  document.getElementById('introTitle').innerHTML   = m.introTitle;
  document.getElementById('introDesc').textContent  = m.introDesc;
  document.getElementById('panelStats').innerHTML   = m.stats.map(s => `
    <div class="stat-box">
      <strong>${s.val}</strong>
      <span>${s.lbl}</span>
    </div>`).join('');
  document.getElementById('gridTitle').textContent  = m.grid;
}

/* ─────────────────────────────────────────────────────────────────────
   LOAD DESTINATIONS  —  Supabase first, static fallback
───────────────────────────────────────────────────────────────────── */
async function loadSport(sport) {
  updateIntro(sport);
  showSkeletons();

  let destinations = [];

  try {
    if (typeof getSportsDestinations === 'function') {
      const data = await getSportsDestinations(sport);
      if (data && data.length > 0) {
        destinations = data;
        console.log(`✅ Loaded ${data.length} destinations from Supabase for: ${sport}`);
      }
    }
  } catch (err) {
    console.warn('Supabase unavailable, using static fallback:', err);
  }

  if (!destinations.length) {
    console.warn('Using static fallback for:', sport);
    destinations = STATIC_SPORTS[sport] || [];
  }

  const cntEl = document.getElementById(`cnt-${sport}`);
  if (cntEl) cntEl.textContent = destinations.length;

  document.getElementById('gridCount').textContent =
    `${destinations.length} destination${destinations.length !== 1 ? 's' : ''}`;

  renderGrid(destinations);
}

/* ─────────────────────────────────────────────────────────────────────
   RENDER GRID
───────────────────────────────────────────────────────────────────── */
function renderGrid(destinations) {
  const grid = document.getElementById('sportsGrid');
  if (!destinations.length) {
    grid.innerHTML = `
      <div class="state-box">
        <div class="state-icon">🏟️</div>
        <h4>No venues found</h4>
        <p>No destinations are listed for this sport yet. Check back soon!</p>
      </div>`;
    return;
  }
  grid.innerHTML = destinations.map(d => buildCard(d)).join('');
}

/* ─────────────────────────────────────────────────────────────────────
   BUILD CARD
───────────────────────────────────────────────────────────────────── */
function buildCard(d) {
  const diff    = (d.difficulty || 'Easy').toLowerCase();
  const fallback = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Kasarani_stadium_-_panoramio.jpg/640px-Kasarani_stadium_-_panoramio.jpg';

  /* Resolve image from DB image_hero column */
  let img = d.image_hero || fallback;

  /* Handle JSON string arrays just in case */
  if (typeof img === 'string' && img.trim().startsWith('[')) {
    try { img = JSON.parse(img)[0] || fallback; } catch (_) { img = fallback; }
  }

  const tags     = Array.isArray(d.highlights) ? d.highlights.slice(0, 3) : [];
  const schedURL = d.schedule  || '#';
  const county   = d.county    || '';
  const bestTime = d.best_time || 'Year-round';

  return `
    <div class="dest-card" onclick="window.location.href='attraction-details.html?id=${d.slug}'">
      <div style="position:relative;overflow:hidden;height:200px;border-radius:16px 16px 0 0;">
        <img
          src="${img}"
          alt="${d.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='${fallback}'"
          style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s;"
        />
        <span class="diff-${diff}"
              style="position:absolute;top:12px;left:12px;padding:4px 12px;border-radius:20px;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
          ${d.difficulty || 'Easy'}
        </span>
        <span style="position:absolute;top:12px;right:12px;background:rgba(26,26,26,0.8);backdrop-filter:blur(4px);color:#fff;font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:20px;">
          ⭐ ${d.rating}
        </span>
        ${d.featured ? '<span style="position:absolute;bottom:12px;left:12px;background:#E8541A;color:#fff;font-size:0.65rem;font-weight:700;padding:3px 10px;border-radius:12px;text-transform:uppercase;letter-spacing:0.5px;">⭐ Featured</span>' : ''}
      </div>
      <div class="dest-body">
        <div class="dest-header">
          <div class="dest-name">${d.name}</div>
          <div class="dest-rating" style="color:#E8541A;font-weight:700;font-size:0.82rem;white-space:nowrap;">⭐ ${d.rating}</div>
        </div>
        <div class="dest-desc">${d.description}</div>
        <div class="dest-meta">
          ${county   ? `<div class="dest-meta-item">📍 ${county} County</div>` : ''}
          <div class="dest-meta-item">🕐 Best: ${bestTime}</div>
        </div>
        <div class="dest-tags">
          ${tags.map(h => `<span class="tag">${h}</span>`).join('')}
        </div>
        <div class="dest-footer">
          <a href="attraction-details.html?id=${d.slug}"
             class="explore-link"
             onclick="event.stopPropagation()">⚡ Explore →</a>
          ${schedURL !== '#'
            ? `<a href="${schedURL}" class="schedule-btn" target="_blank" rel="noopener" onclick="event.stopPropagation()">📅 Schedule</a>`
            : ''}
        </div>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────────────
   SKELETON LOADERS
───────────────────────────────────────────────────────────────────── */
function showSkeletons() {
  document.getElementById('sportsGrid').innerHTML =
    Array(9).fill(`
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>`).join('');
}
