/* ══════════════════════════════════════════════════════════════════════
   category.js  —  SafariQuest Kenya
   Requires: supabase-js CDN + supabase-config.js loaded before this.
══════════════════════════════════════════════════════════════════════ */

const STORAGE_BASE = 'https://cbyipmrozqsntojiartw.supabase.co/storage/v1/object/public/destination-images';

function storageUrl(path) {
  return `${STORAGE_BASE}/${path}`;
}

/* ─────────────────────────────────────────────────────────────────────
   SPORT META
───────────────────────────────────────────────────────────────────── */
const SPORT_META = {
  football: {
    label:      '⚽ Football in Kenya',
    badge:      '🏆 Sports & Recreation',
    heroTitle:  'Kenya\'s World-Class <em>Football Scene</em>',
    heroDesc:   'Home of Talanta Stadium — Africa\'s most beloved football fortress. Explore stadiums, training grounds and fan culture across Kenya.',
    heroBg:     'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?w=1400&q=90',
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
    heroBg:     'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1400&q=90',
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
    heroBg:     'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1400&q=90',
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
    heroBg:     'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1400&q=90',
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
    heroBg:     'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=1400&q=90',
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
   STATIC FALLBACK
───────────────────────────────────────────────────────────────────── */
const STATIC_SPORTS = {
  football: [
    { slug:'kasarani-stadium', name:'Moi International Sports Centre, Kasarani', county:'Nairobi',  difficulty:'Easy', rating:4.8, best_time:'Year-round', description:"Kenya's premier national stadium with 60,000+ capacity, home of the Harambee Stars and major AFCON qualifiers.", highlights:['60,000 Capacity','AFCON Qualifiers','Olympic Track'],  featured:true,  image_hero:'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?w=800&q=80' },
    { slug:'nyayo-stadium',    name:'Nyayo National Stadium',                    county:'Nairobi',  difficulty:'Easy', rating:4.6, best_time:'Year-round', description:'Iconic 30,000-seat multi-use stadium in Nairobi, regularly hosting KPL matches and national events.',          highlights:['30,000 Capacity','KPL Matches','National Events'],    featured:false, image_hero:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80' },
    { slug:'bukhungu-stadium', name:'Bukhungu Stadium',                          county:'Kakamega', difficulty:'Easy', rating:4.5, best_time:'Year-round', description:"Western Kenya's fortress stadium — home to Kakamega Homeboyz and the most passionate crowds in Kenya.",         highlights:['Kakamega Homeboyz','Passionate Crowds','Western Hub'], featured:false, image_hero:'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80' },
  ],
  golf: [
    { slug:'muthaiga-golf-club', name:'Muthaiga Golf Club',     county:'Nairobi', difficulty:'Moderate', rating:4.9, best_time:'Year-round',       description:"Kenya's most prestigious golf club, established in 1913.", highlights:['Est. 1913','Kenya Open Host','18-Hole Championship'], featured:true,  image_hero:'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80' },
    { slug:'vipingo-ridge',      name:'Vipingo Ridge Golf Club', county:'Kilifi',  difficulty:'Moderate', rating:4.9, best_time:'October – March', description:'18 holes of championship golf on the Kenya coast with stunning Indian Ocean panoramas.',                           highlights:['Ocean Panoramas','Coastal Breeze','David Jones Design'], featured:true, image_hero:'https://images.unsplash.com/photo-1611374243147-44a702c2d44c?w=800&q=80' },
  ],
  rally: [
    { slug:'naivasha-rally-stage', name:'Naivasha Rally Hub', county:'Nakuru', difficulty:'Moderate', rating:4.9, best_time:'June – July', description:'The beating heart of the WRC Safari Rally — service park, super-special stages and fan zones in the stunning Rift Valley.', highlights:['WRC Safari Rally','Service Park','Fan Zones'], featured:true, image_hero:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80' },
  ],
  basketball: [
    { slug:'nyayo-indoor-arena', name:'Nyayo National Stadium Indoor Arena', county:'Nairobi', difficulty:'Easy', rating:4.7, best_time:'Year-round', description:"Kenya's premier indoor basketball arena hosting KBF Premier League finals and FIBA Africa qualifying rounds.", highlights:['FIBA Africa Venue','KBF Finals','Premier Arena'], featured:true, image_hero:'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80' },
  ],
  swimming: [
    { slug:'kasarani-aquatic-centre', name:'Kasarani Aquatic Centre', county:'Nairobi', difficulty:'Easy', rating:4.8, best_time:'Year-round', description:"Kenya's only Olympic-standard 50m pool — home of the Kenya Aquatics Federation national championships.", highlights:['50m Olympic Pool','National Championships','Olympic Standard'], featured:true, image_hero:'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80' },
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

  const params = new URLSearchParams(window.location.search);
  const param  = params.get('sport') || params.get('type') || 'football';
  const valid  = Object.keys(SPORT_META);
  currentSport = valid.includes(param) ? param : 'football';

  document.title = `${PAGE_TITLES[currentSport] || 'Destinations'} — SafariQuest Kenya`;

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
  if (hero) hero.style.backgroundImage = `url('${m.heroBg}')`;

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
  document.getElementById('panelStats').innerHTML   = m.stats.map(s =>
    `<div class="stat-box"><strong>${s.val}</strong><span>${s.lbl}</span></div>`
  ).join('');
  document.getElementById('gridTitle').textContent = m.grid;
}

/* ─────────────────────────────────────────────────────────────────────
   LOAD DESTINATIONS
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
        console.log(`✅ Loaded ${data.length} from Supabase for: ${sport}`);
      }
    }
  } catch (err) {
    console.warn('Supabase error, using static fallback:', err);
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
  const diff     = (d.difficulty || 'Easy').toLowerCase();
  const fallback = 'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?w=800&q=80';

  let img = d.image_hero || fallback;
  if (typeof img === 'string' && img.trim().startsWith('[')) {
    try { img = JSON.parse(img)[0] || fallback; } catch (_) { img = fallback; }
  }

  const tags     = Array.isArray(d.highlights) ? d.highlights.slice(0, 3) : [];
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
          ${county ? `<div class="dest-meta-item">📍 ${county} County</div>` : ''}
          <div class="dest-meta-item">🕐 Best: ${bestTime}</div>
        </div>
        <div class="dest-tags">
          ${tags.map(h => `<span class="tag">${h}</span>`).join('')}
        </div>
        <div class="dest-footer">
          <a href="sports-details.html?id=${d.slug}"
             class="explore-link"
             onclick="event.stopPropagation()">⚡ Explore →</a>
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
