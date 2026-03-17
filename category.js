/* ============================================================
   CATEGORY LISTING — category.js
   ============================================================ */

/* ────────────────────────────────────────
   CATEGORY CONFIG
──────────────────────────────────────── */
const CATEGORY_CONFIG = {
  'big-five': {
    label:  'Big Five Safari',
    icon:   '🦁',
    desc:   'Track lion, leopard, elephant, buffalo & rhino across Kenya\'s world-class game reserves.',
    hero:   'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1800&q=90',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3245760!2d37.0!3d-1.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1'
  },
  'birds': {
    label:  'Bird Watching',
    icon:   '🦅',
    desc:   'Discover 1,100+ bird species — from flamingos at Nakuru to eagles over the Rift Valley.',
    hero:   'https://images.unsplash.com/photo-1585389639821-a4c1c2886aab?w=1800&q=90',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3245760!2d36.2!3d-0.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1'
  },
  'mountain': {
    label:  'Mountain Treks',
    icon:   '⛰️',
    desc:   'Conquer Mount Kenya and explore Kenya\'s dramatic volcanic craters and highland wilderness.',
    hero:   'https://images.unsplash.com/photo-1589825743638-54a8ee3b6d67?w=1800&q=90',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000000!2d37.3!3d-0.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1'
  },
  'beach': {
    label:  'Beach Escapes',
    icon:   '🏖️',
    desc:   'Unwind on Kenya\'s stunning Indian Ocean coast from Diani to Lamu.',
    hero:   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=90',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1500000!2d40.1!3d-2.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1'
  },
  'cultural': {
    label:  'Cultural Tours',
    icon:   '🎭',
    desc:   'Visit Maasai villages, Swahili coastal towns and Kenya\'s rich heritage sites.',
    hero:   'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1800&q=90',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3245760!2d38.0!3d-1.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1'
  },
  'adventure': {
    label:  'Adventure Sports',
    icon:   '🪂',
    desc:   'White water rafting, rock climbing, cycling safaris and hot air balloon rides.',
    hero:   'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=1800&q=90',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3245760!2d36.5!3d-0.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1'
  }
};

/* ────────────────────────────────────────
   DESTINATIONS DATA
   available: true  = links to attraction-details.html
   available: false = Coming Soon badge
──────────────────────────────────────── */
const ALL_DESTINATIONS = {

  'big-five': [
    { slug:'maasai-mara',   name:'Maasai Mara National Reserve',  county:'Narok',        region:'rift-valley', difficulty:'Moderate',    rating:4.9, best_time:'July – October',      available:true,  image:'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=85', desc:'Home to the Great Wildebeest Migration and all Big Five in breathtaking golden savanna.', highlights:['Great Migration','Lions & Cheetahs'] },
    { slug:'amboseli',      name:'Amboseli National Park',         county:'Kajiado',      region:'rift-valley', difficulty:'Easy',         rating:4.8, best_time:'June – October',      available:true,  image:'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=85', desc:'Iconic Kilimanjaro backdrop with the largest elephant herds in East Africa.', highlights:['Elephants','Kilimanjaro Views'] },
    { slug:'tsavo',         name:'Tsavo National Park',            county:'Taita-Taveta', region:'eastern',     difficulty:'Moderate',    rating:4.7, best_time:'June – October',      available:true,  image:'https://images.unsplash.com/photo-1598886290734-c4dee49e29cc?w=800&q=85', desc:'Kenya\'s largest park — red-dusted elephants, Mzima Springs and vast wilderness.', highlights:['Red Elephants','Mzima Springs'] },
    { slug:'samburu',       name:'Samburu National Reserve',       county:'Samburu',      region:'northern',    difficulty:'Moderate',    rating:4.7, best_time:'July – September',    available:true,  image:'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=85', desc:'Remote northern reserve home to the rare Samburu Special Five.', highlights:['Special Five','Remote Wilderness'] },
    { slug:'lake-nakuru',   name:'Lake Nakuru National Park',      county:'Nakuru',       region:'rift-valley', difficulty:'Easy',         rating:4.7, best_time:'June – September',    available:true,  image:'https://images.unsplash.com/photo-1564760290292-23341e4df6ec?w=800&q=85', desc:'Critical rhino sanctuary with flamingos on a spectacular pink soda lake.', highlights:['Rhino Sanctuary','Flamingos'] },
    { slug:'nairobi-np',    name:'Nairobi National Park',          county:'Nairobi',      region:'nairobi',     difficulty:'Easy',         rating:4.6, best_time:'July – March',        available:false, image:'https://images.unsplash.com/photo-1612213938763-9ed26ab83a31?w=800&q=85', desc:'The world\'s only national park inside a capital — lions against a city skyline.', highlights:['City + Wildlife','Lions & Rhinos'] },
    { slug:'ol-pejeta',     name:'Ol Pejeta Conservancy',          county:'Laikipia',     region:'central',     difficulty:'Easy',         rating:4.8, best_time:'June – October',      available:false, image:'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&q=85', desc:'Africa\'s largest black rhino sanctuary and home to the last northern white rhinos.', highlights:['Last White Rhinos','Big Five'] },
    { slug:'meru-np',       name:'Meru National Park',             county:'Meru',         region:'eastern',     difficulty:'Moderate',    rating:4.6, best_time:'June – October',      available:false, image:'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=85', desc:'Where Elsa the lioness roamed — lush rivers, diverse wildlife, fewer crowds.', highlights:['Elsa\'s Homeland','Rivers & Wildlife'] }
  ],

  'birds': [
    { slug:'lake-nakuru',    name:'Lake Nakuru National Park',   county:'Nakuru',       region:'rift-valley', difficulty:'Easy',     rating:4.7, best_time:'Year-round',          available:true,  image:'https://images.unsplash.com/photo-1585389639821-a4c1c2886aab?w=800&q=85', desc:'Famous for flamingo carpets that paint the entire lake shore pink — 450+ species.', highlights:['Flamingo Carpets','450+ Species'] },
    { slug:'lake-bogoria',   name:'Lake Bogoria',                county:'Baringo',      region:'rift-valley', difficulty:'Easy',     rating:4.6, best_time:'November – April',    available:false, image:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=85', desc:'Geothermal geysers combined with millions of flamingos — a truly otherworldly scene.', highlights:['Geysers + Flamingos','Hot Springs'] },
    { slug:'lake-naivasha',  name:'Lake Naivasha',               county:'Nakuru',       region:'rift-valley', difficulty:'Easy',     rating:4.5, best_time:'Year-round',          available:false, image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85', desc:'Tranquil freshwater lake with hippos, fish eagles and hundreds of waterbird species.', highlights:['Fish Eagles','Hippos + Birds'] },
    { slug:'kakamega',       name:'Kakamega Forest',             county:'Kakamega',     region:'western',     difficulty:'Easy',     rating:4.6, best_time:'December – March',    available:false, image:'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=85', desc:'Kenya\'s only tropical rainforest — 330+ species including rare Central African endemics.', highlights:['330+ Species','Rainforest Birding'] },
    { slug:'arabuko-sokoke', name:'Arabuko Sokoke Forest',       county:'Kilifi',       region:'coast',       difficulty:'Easy',     rating:4.5, best_time:'November – April',    available:false, image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=85', desc:'Africa\'s largest protected coastal forest, home to rare globally threatened species.', highlights:['Rare Endemic Birds','Coastal Forest'] },
    { slug:'lake-baringo',   name:'Lake Baringo',                county:'Baringo',      region:'rift-valley', difficulty:'Easy',     rating:4.5, best_time:'Year-round',          available:false, image:'https://images.unsplash.com/photo-1504173010664-32509107de82?w=800&q=85', desc:'Fresh water Rift Valley lake with 470+ bird species and traditional fishermen.', highlights:['470+ Species','Local Culture'] },
    { slug:'mida-creek',     name:'Mida Creek',                  county:'Kilifi',       region:'coast',       difficulty:'Easy',     rating:4.4, best_time:'October – March',     available:false, image:'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=85', desc:'Pristine mangrove estuary with migratory shorebirds and boardwalk trails.', highlights:['Mangrove Boardwalk','Migratory Birds'] },
    { slug:'shimba-hills',   name:'Shimba Hills Reserve',        county:'Kwale',        region:'coast',       difficulty:'Easy',     rating:4.4, best_time:'June – October',      available:false, image:'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=85', desc:'Coastal forest reserve with rare sable antelopes and birds above the Indian Ocean.', highlights:['Sable Antelope','Ocean Views'] },
    { slug:'tana-delta',     name:'Tana River Delta',            county:'Tana River',   region:'eastern',     difficulty:'Moderate', rating:4.4, best_time:'November – April',    available:false, image:'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=85', desc:'Vast river delta with spectacular patterns of channels and massive waterbird flocks.', highlights:['Delta Landscape','Waterbird Flocks'] },
    { slug:'saiwa-swamp',    name:'Saiwa Swamp National Park',   county:'Trans-Nzoia',  region:'western',     difficulty:'Easy',     rating:4.3, best_time:'Year-round',          available:false, image:'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=85', desc:'Kenya\'s smallest national park — unique swampy habitat for sitatunga and waterbirds.', highlights:['Sitatunga Antelope','Wetland Trails'] }
  ],

  'mountain': [
    { slug:'mount-kenya',   name:'Mount Kenya National Park',  county:'Nyeri',   region:'central',     difficulty:'Challenging', rating:4.8, best_time:'January – February', available:true,  image:'https://images.unsplash.com/photo-1589825743638-54a8ee3b6d67?w=800&q=85', desc:'Africa\'s second highest peak — glaciers, moorlands and diverse wildlife.', highlights:['5,199m Summit','Glaciers & Tarns'] },
    { slug:'mount-longonot',name:'Mount Longonot',             county:'Nakuru',  region:'rift-valley', difficulty:'Moderate',    rating:4.5, best_time:'June – October',     available:false, image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85', desc:'Dramatic volcanic crater with a rim hike and panoramic Rift Valley views.', highlights:['Crater Rim Trek','Rift Valley Views'] },
    { slug:'aberdare',      name:'Aberdare National Park',     county:'Nyeri',   region:'central',     difficulty:'Moderate',    rating:4.6, best_time:'July – October',     available:false, image:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=85', desc:'Mist-shrouded highland forest with dramatic waterfalls and tree lodges.', highlights:['Gura Falls','Tree Lodges'] },
    { slug:'ngong-hills',   name:'Ngong Hills',                county:'Kajiado', region:'nairobi',     difficulty:'Easy',         rating:4.4, best_time:'Year-round',         available:false, image:'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=85', desc:'Rolling green ridges overlooking Nairobi — a popular day hike with sweeping views.', highlights:['Nairobi Views','Day Hike'] }
  ],

  'beach': [
    { slug:'diani-beach',  name:'Diani Beach',      county:'Kwale',    region:'coast', difficulty:'Easy', rating:4.8, best_time:'January – March',  available:true,  image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85', desc:'17km of powdery white sand with world-class coral reefs and kitesurfing.', highlights:['White Sand','Coral Reef Diving'] },
    { slug:'watamu',       name:'Watamu Beach',     county:'Kilifi',   region:'coast', difficulty:'Easy', rating:4.7, best_time:'October – March', available:false, image:'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=85', desc:'UNESCO Biosphere Reserve with stunning sandbars and whale shark encounters.', highlights:['Marine Park','Whale Sharks'] },
    { slug:'lamu-island',  name:'Lamu Island',      county:'Lamu',     region:'coast', difficulty:'Easy', rating:4.8, best_time:'October – March', available:false, image:'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=85', desc:'UNESCO World Heritage old town with Swahili architecture and dhow sailing.', highlights:['UNESCO Old Town','Dhow Sailing'] },
    { slug:'malindi',      name:'Malindi Beach',    county:'Kilifi',   region:'coast', difficulty:'Easy', rating:4.5, best_time:'October – March', available:false, image:'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=85', desc:'Historic Swahili coast town with traditional dhow boats and ancient ruins.', highlights:['Dhow Boats','Historic Ruins'] },
    { slug:'nyali-beach',  name:'Nyali Beach',      county:'Mombasa',  region:'coast', difficulty:'Easy', rating:4.5, best_time:'January – March', available:false, image:'https://images.unsplash.com/photo-1507881466959-c6af49fc97fb?w=800&q=85', desc:'Mombasa\'s most accessible beach — palm-fringed with gorgeous sunsets.', highlights:['Palm Sunsets','Beach Resorts'] },
    { slug:'tiwi-beach',   name:'Tiwi Beach',       county:'Kwale',    region:'coast', difficulty:'Easy', rating:4.5, best_time:'January – March', available:false, image:'https://images.unsplash.com/photo-1504173010664-32509107de82?w=800&q=85', desc:'Hidden secluded cove with natural rock pools and coral gardens.', highlights:['Secluded Cove','Natural Rock Pools'] }
  ],

  'cultural': [
    { slug:'lamu-old-town', name:'Lamu Old Town',          county:'Lamu',    region:'coast',       difficulty:'Easy', rating:4.8, best_time:'October – March', available:false, image:'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=85', desc:'The oldest living Swahili settlement in East Africa — ornate carved doors, no cars.', highlights:['Swahili Architecture','UNESCO Heritage'] },
    { slug:'maasai-village',name:'Maasai Village Experience',county:'Narok', region:'rift-valley', difficulty:'Easy', rating:4.7, best_time:'Year-round',        available:false, image:'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=85', desc:'Authentic Maasai warrior cultural encounters — dances, bead crafts and village life.', highlights:['Warrior Dances','Bead Crafts'] },
    { slug:'fort-jesus',    name:'Fort Jesus, Mombasa',    county:'Mombasa', region:'coast',       difficulty:'Easy', rating:4.6, best_time:'Year-round',        available:false, image:'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=85', desc:'Portuguese 16th-century coastal fort and UNESCO World Heritage site.', highlights:['16th Century Fort','UNESCO Heritage'] },
    { slug:'bomas-kenya',   name:'Bomas of Kenya',         county:'Nairobi', region:'nairobi',     difficulty:'Easy', rating:4.5, best_time:'Year-round',        available:false, image:'https://images.unsplash.com/photo-1612213938763-9ed26ab83a31?w=800&q=85', desc:'Kenya\'s premier cultural centre with daily performances of 40+ ethnic dances.', highlights:['40+ Ethnic Dances','Cultural Village'] },
    { slug:'karen-blixen',  name:'Karen Blixen Museum',    county:'Nairobi', region:'nairobi',     difficulty:'Easy', rating:4.6, best_time:'Year-round',        available:false, image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85', desc:'The historic Out of Africa farmhouse set among lush colonial gardens.', highlights:['Colonial History','Out of Africa'] },
    { slug:'thimlich-ohinga',name:'Thimlich Ohinga',       county:'Migori',  region:'nyanza',      difficulty:'Easy', rating:4.4, best_time:'Year-round',        available:false, image:'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=85', desc:'Largest dry-stone walled enclosure in sub-Saharan Africa — a UNESCO World Heritage site.', highlights:['Ancient Stone Walls','UNESCO Heritage'] },
    { slug:'kit-mikayi',    name:'Kit Mikayi Rock',        county:'Kisumu',  region:'nyanza',      difficulty:'Easy', rating:4.4, best_time:'Year-round',        available:false, image:'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=85', desc:'Sacred Luo rock formation rising 40 meters — a site of deep cultural significance.', highlights:['Sacred Rock','Luo Heritage'] },
    { slug:'koobi-fora',    name:'Koobi Fora',             county:'Marsabit',region:'northern',    difficulty:'Challenging', rating:4.5, best_time:'June – October', available:false, image:'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=85', desc:'One of the world\'s most important paleoanthropological sites — fossils 4M years old.', highlights:['4M Year Old Fossils','Anthropology Site'] }
  ],

  'adventure': [
    { slug:'hells-gate',    name:'Hell\'s Gate National Park', county:'Nakuru',     region:'rift-valley', difficulty:'Easy',         rating:4.6, best_time:'June – October',   available:true,  image:'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&q=85', desc:'Kenya\'s only park where you walk and cycle freely among wildlife through volcanic gorges.', highlights:['Cycling Safari','Gorge Walk'] },
    { slug:'mount-longonot',name:'Mount Longonot',             county:'Nakuru',     region:'rift-valley', difficulty:'Moderate',    rating:4.5, best_time:'June – October',   available:false, image:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85', desc:'Hike to the rim of an active volcanic crater for breathtaking 360° Rift Valley views.', highlights:['Crater Rim Trek','Active Volcano'] },
    { slug:'mount-kenya',   name:'Mount Kenya Trekking',       county:'Nyeri',      region:'central',     difficulty:'Challenging', rating:4.8, best_time:'Jan – Feb',         available:true,  image:'https://images.unsplash.com/photo-1589825743638-54a8ee3b6d67?w=800&q=85', desc:'Summit Africa\'s second highest peak through dramatic ecological zones.', highlights:['Summit Trek','Glacier Zones'] },
    { slug:'tana-rapids',   name:'Tana River Rafting',         county:'Tana River', region:'eastern',     difficulty:'Challenging', rating:4.7, best_time:'May – August',      available:false, image:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=85', desc:'Thrilling Grade 4–5 white water rafting through Kenya\'s most powerful river gorges.', highlights:['Grade 4–5 Rapids','River Gorges'] },
    { slug:'diani-sports',  name:'Diani Watersports',          county:'Kwale',      region:'coast',       difficulty:'Easy',         rating:4.7, best_time:'January – March', available:false, image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85', desc:'East Africa\'s kitesurfing capital — world-class winds, deep sea fishing and snorkelling.', highlights:['Kitesurfing','Deep Sea Fishing'] },
    { slug:'aberdare',      name:'Aberdare Forest Walks',      county:'Nyeri',      region:'central',     difficulty:'Moderate',    rating:4.6, best_time:'July – October',   available:false, image:'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=85', desc:'Night game walks through misty highland wilderness teeming with black leopard.', highlights:['Night Game Walks','Black Leopard'] },
    { slug:'ngong-hills',   name:'Ngong Hills Hiking',         county:'Kajiado',    region:'nairobi',     difficulty:'Easy',         rating:4.4, best_time:'Year-round',       available:false, image:'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=85', desc:'Easy ridge hike above Nairobi with sweeping views of the Rift Valley escarpment.', highlights:['Ridge Hike','City Views'] }
  ]
};

/* ────────────────────────────────────────
   STATE
──────────────────────────────────────── */
let currentType        = 'big-five';
let activeDiff         = 'all';
let activeRegion       = 'all';
let showComingSoon     = true;

/* ────────────────────────────────────────
   INIT
──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* Read type from URL */
  const params = new URLSearchParams(window.location.search);
  currentType  = params.get('type') || 'big-five';

  /* Setup hero */
  const cfg = CATEGORY_CONFIG[currentType];
  if (cfg) {
    document.getElementById('heroBg').style.backgroundImage    = `url('${cfg.hero}')`;
    document.getElementById('heroIcon').textContent            = cfg.icon;
    document.getElementById('heroTitle').textContent           = cfg.label;
    document.getElementById('heroDesc').textContent            = cfg.desc;
    document.getElementById('mapFrame').src                    = cfg.mapSrc;
    document.title = `${cfg.label} — Discover the Magic of Kenya`;
  }

  /* Scroll to top */
  window.addEventListener('scroll', () => {
    document.getElementById('scrollTop')?.classList.toggle('visible', window.scrollY > 400);
    document.getElementById('navbar').style.boxShadow =
      window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,.12)' : '0 2px 12px rgba(0,0,0,.07)';
  });
  document.getElementById('scrollTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Fade-in observer */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* Difficulty filter */
  document.getElementById('diffFilter')?.addEventListener('click', function (e) {
    const btn = e.target.closest('.fpill');
    if (!btn) return;
    document.querySelectorAll('#diffFilter .fpill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeDiff = btn.dataset.diff;
    renderGrid();
  });

  /* Region filter */
  document.getElementById('regionFilter')?.addEventListener('change', function () {
    activeRegion = this.value;
    renderGrid();
  });

  /* Populate region dropdown with available regions */
  populateRegionFilter();

  /* Initial render */
  renderGrid();

  /* Newsletter */
  document.querySelector('.newsletter-btn')?.addEventListener('click', () => {
    const input = document.querySelector('.newsletter-input');
    if (input?.value.includes('@')) {
      showToast('✓ Subscribed!', 'success');
      input.value = '';
    }
  });

});

/* ────────────────────────────────────────
   POPULATE REGION DROPDOWN
──────────────────────────────────────── */
function populateRegionFilter() {
  const destinations = ALL_DESTINATIONS[currentType] || [];
  const regions = [...new Set(destinations.map(d => d.region))];
  const select = document.getElementById('regionFilter');
  if (!select) return;

  const regionLabels = {
    'rift-valley': 'Rift Valley',
    'coast':       'Kenyan Coast',
    'central':     'Central Kenya',
    'northern':    'Northern Kenya',
    'nairobi':     'Nairobi',
    'western':     'Western Kenya',
    'eastern':     'Eastern Kenya',
    'nyanza':      'Nyanza'
  };

  select.innerHTML = '<option value="all">All Regions</option>';
  regions.forEach(r => {
    const opt = document.createElement('option');
    opt.value       = r;
    opt.textContent = regionLabels[r] || r;
    select.appendChild(opt);
  });
}

/* ────────────────────────────────────────
   TOGGLE COMING SOON
──────────────────────────────────────── */
window.toggleShowComingSoon = function (show) {
  showComingSoon = show;
  document.getElementById('showAll')?.classList.toggle('active', show);
  document.getElementById('showAvail')?.classList.toggle('active', !show);
  renderGrid();
};

/* ────────────────────────────────────────
   RENDER GRID
──────────────────────────────────────── */
function renderGrid() {
  const grid = document.getElementById('destGrid');
  if (!grid) return;

  let destinations = ALL_DESTINATIONS[currentType] || [];

  /* Apply filters */
  if (activeDiff !== 'all') {
    destinations = destinations.filter(d => d.difficulty.toLowerCase() === activeDiff);
  }
  if (activeRegion !== 'all') {
    destinations = destinations.filter(d => d.region === activeRegion);
  }
  if (!showComingSoon) {
    destinations = destinations.filter(d => d.available);
  }

  /* Update stats */
  const all = ALL_DESTINATIONS[currentType] || [];
  const counties = [...new Set(all.map(d => d.county))].length;
  const avgRating = (all.reduce((s, d) => s + d.rating, 0) / all.length).toFixed(1);
  document.getElementById('statCount').textContent   = all.length;
  document.getElementById('statCounties').textContent = counties;
  document.getElementById('statRating').textContent  = avgRating + '★';
  document.getElementById('resultCount').textContent =
    `${destinations.length} destination${destinations.length !== 1 ? 's' : ''}`;

  if (destinations.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="nr-icon">🔍</div>
        <h3>No destinations found</h3>
        <p>Try changing your filters to see more results.</p>
      </div>`;
    return;
  }

  grid.innerHTML = destinations.map(d => buildCard(d)).join('');

  /* Re-observe fade-ins */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05 });
  grid.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ────────────────────────────────────────
   BUILD CARD HTML
──────────────────────────────────────── */
function buildCard(d) {
  const clickAttr = d.available
    ? `onclick="window.location.href='attraction-details.html?id=${d.slug}'"` : '';
  const cardClass = d.available ? 'dest-card fade-in' : 'dest-card fade-in coming-soon';

  return `
    <div class="${cardClass}" ${clickAttr}>
      <div class="card-img-wrap">
        <div class="card-img" style="background-image:url('${d.image}')"></div>
        <span class="diff-badge diff-${d.difficulty.toLowerCase()}">${d.difficulty}</span>
        ${!d.available ? `<span class="coming-soon-badge">🕐 Coming Soon</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-header">
          <div class="card-name">${d.name}</div>
          <div class="card-rating">⭐ ${d.rating}</div>
        </div>
        <div class="card-desc">${d.desc}</div>
        <div class="card-meta">
          <div class="card-meta-item">📍 ${d.county} County</div>
          <div class="card-meta-item">🕐 Best: ${d.best_time}</div>
        </div>
        <div class="card-tags">
          ${d.highlights.map(h => `<span class="ctag">${h}</span>`).join('')}
        </div>
        <div class="card-footer">
          ${d.available
            ? `<a href="attraction-details.html?id=${d.slug}" class="explore-link" onclick="event.stopPropagation()">⚡ Explore →</a>`
            : `<span class="coming-soon-link">Available soon</span>`
          }
        </div>
      </div>
    </div>`;
}

/* ────────────────────────────────────────
   TOAST
──────────────────────────────────────── */
function showToast(msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast ' + (type || 'info') + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}
