/* ══════════════════════════════════════════════════════════════════════
   category.js  —  SafariQuest Kenya
   Reads ?sport=football | ?type=adventure (legacy).
   Images (hero + destination cards) come from Supabase Storage.
   Falls back to STATIC_SPORTS if Supabase is unavailable.
══════════════════════════════════════════════════════════════════════ */

/* SUPABASE_URL is declared in supabase-config.js — do not redeclare here */
const STORAGE_BASE  = 'https://cbyipmrozqsntojiartw.supabase.co/storage/v1/object/public/destination-images';

/* ─────────────────────────────────────────────────────────────────────
   Helper: build a Supabase Storage public URL
   e.g. storageUrl('football/kasarani-stadium.jpg')
───────────────────────────────────────────────────────────────────── */
function storageUrl(path) {
  return `${STORAGE_BASE}/${path}`;
}

/* ─────────────────────────────────────────────────────────────────────
   SPORT META  —  hero copy + stats per sport
   heroBg now points to Supabase Storage (populated by setup script).
   heroFallbackBg is used if the Supabase image hasn't loaded yet.
───────────────────────────────────────────────────────────────────── */
const SPORT_META = {
  football: {
    label:         '⚽ Football in Kenya',
    badge:         '🏆 Sports & Recreation',
    heroTitle:     'Kenya\'s World-Class <em>Football Scene</em>',
    heroDesc:      'Home of Talanta Stadium — Africa\'s most beloved football fortress. Explore stadiums, training grounds and fan culture across Kenya.',
    heroBg:        storageUrl('heroes/hero-football.jpg'),
    heroFallbackBg:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Talanta_FC_stadium_Nairobi.jpg/1280px-Talanta_FC_stadium_Nairobi.jpg',
    introTitle:    'The Beautiful Game <em>Across Kenya</em>',
    introDesc:     'Kenya\'s football scene is vibrant and passionate — from Kasarani\'s 60,000-seat national stadium hosting AFCON qualifiers, to grassroots pitches in Kisumu and Mombasa producing world-class talent.',
    stats:         [{ val:'15', lbl:'Stadiums & Venues' }, { val:'18', lbl:'KPL Clubs' }, { val:'60K+', lbl:'Max Capacity' }],
    grid:          'Football Stadiums & Venues',
    breadcrumb:    'Football'
  },
  golf: {
    label:         '⛳ Golf in Kenya',
    badge:         '⛳ Golf & Country Clubs',
    heroTitle:     'Championship Courses <em>Under African Skies</em>',
    heroDesc:      'Kenya boasts some of Africa\'s finest golf courses — from Muthaiga Golf Club (est. 1913) to Vipingo Ridge with Indian Ocean panoramas.',
    heroBg:        storageUrl('heroes/hero-golf.jpg'),
    heroFallbackBg:'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1400&q=80',
    introTitle:    'Championship Courses <em>Under African Skies</em>',
    introDesc:     'Kenya boasts some of Africa\'s finest golf courses — from Muthaiga Golf Club (est. 1913) to Vipingo Ridge on the coast with Indian Ocean panoramas. Playing golf against a backdrop of wildlife is uniquely Kenyan.',
    stats:         [{ val:'15', lbl:'Golf Courses' }, { val:'110+', lbl:'Years of Golf' }, { val:'4.9★', lbl:'Avg Rating' }],
    grid:          'Golf Courses & Clubs',
    breadcrumb:    'Golf'
  },
  rally: {
    label:         '🚗 Safari Rally in Kenya',
    badge:         '🚗 WRC Safari Rally',
    heroTitle:     'The World\'s Most <em>Legendary Rally</em>',
    heroDesc:      'WRC Safari Rally Kenya — drivers battle through red murram roads, dramatic Rift Valley stages and unpredictable African weather.',
    heroBg:        storageUrl('heroes/hero-rally.jpg'),
    heroFallbackBg:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1400&q=80',
    introTitle:    'The World\'s Most <em>Legendary Rally</em>',
    introDesc:     'The Safari Rally Kenya is a WRC round and the most iconic rally on earth. Drivers battle through red murram roads, dramatic Rift Valley stages, and unpredictable African weather.',
    stats:         [{ val:'15', lbl:'Rally Stages' }, { val:'70+', lbl:'Years of History' }, { val:'WRC', lbl:'World Championship' }],
    grid:          'Safari Rally Stages & Venues',
    breadcrumb:    'Safari Rally'
  },
  basketball: {
    label:         '🏀 Basketball in Kenya',
    badge:         '🏀 Basketball',
    heroTitle:     'Kenya\'s Rising <em>Basketball Nation</em>',
    heroDesc:      'From FIBA Africa qualifiers at Nyayo Indoor Arena to university rivalries — Kenyan basketball is on the rise.',
    heroBg:        storageUrl('heroes/hero-basketball.jpg'),
    heroFallbackBg:'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1400&q=80',
    introTitle:    'Kenya\'s Rising <em>Basketball Nation</em>',
    introDesc:     'Kenya\'s basketball scene has exploded in recent years. The KBF league features fierce rivalries and world-class facilities in Nairobi have helped Kenyan players earn NBA G-League contracts.',
    stats:         [{ val:'15', lbl:'Arenas & Courts' }, { val:'KBF', lbl:'National League' }, { val:'4.7★', lbl:'Avg Rating' }],
    grid:          'Basketball Arenas & Courts',
    breadcrumb:    'Basketball'
  },
  swimming: {
    label:         '🏊 Swimming in Kenya',
    badge:         '🏊 Aquatics',
    heroTitle:     'Olympic Pools & <em>Coastal Waters</em>',
    heroDesc:      'From Olympic-standard pools in Nairobi to open-water swimming in the Indian Ocean and freshwater Lake Victoria.',
    heroBg:        storageUrl('heroes/hero-swimming.jpg'),
    heroFallbackBg:'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=1400&q=80',
    introTitle:    'Olympic Pools & <em>Coastal Waters</em>',
    introDesc:     'From Olympic-standard pools in Nairobi to open-water swimming in the Indian Ocean and freshwater Lake Victoria — Kenya offers world-class aquatic experiences for every level.',
    stats:         [{ val:'15', lbl:'Pools & Venues' }, { val:'50m', lbl:'Olympic Pools' }, { val:'4.8★', lbl:'Avg Rating' }],
    grid:          'Swimming Pools & Aquatic Venues',
    breadcrumb:    'Swimming'
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
   STATIC FALLBACK DATA  —  used when Supabase returns nothing.
   image_hero field now points to Supabase Storage paths so both
   live DB data and static fallback render via the same img tag.
───────────────────────────────────────────────────────────────────── */
function makeStatic(sport, slug, name, county, difficulty, rating, best_time, description, highlights, featured, schedule) {
  return {
    sport, slug, name, county, difficulty, rating, best_time, description,
    highlights, featured: featured || false, schedule,
    image_hero: storageUrl(`${sport}/${slug}.jpg`),
  };
}

const STATIC_SPORTS = {
  football: [
    makeStatic('football','kasarani-stadium','Moi International Sports Centre, Kasarani','Nairobi','Easy',4.8,'Year-round',"Kenya's premier national stadium with 60,000+ capacity, home of the Harambee Stars and major AFCON qualifiers.",['60,000 Capacity','AFCON Qualifiers','Olympic Track'],true,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','nyayo-stadium','Nyayo National Stadium','Nairobi','Easy',4.6,'Year-round','Iconic 30,000-seat multi-use stadium in Nairobi, regularly hosting KPL matches and national events.',['30,000 Capacity','KPL Matches','National Events'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','afraha-stadium','Afraha Stadium','Nakuru','Easy',4.4,'Year-round','The heartbeat of Rift Valley football — home to Nakuru All Stars and rowdy western Kenya derbies.',['Western Derbies','Rift Valley Hub','Local Passion'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','kinoru-stadium','Kinoru Stadium','Meru','Easy',4.3,'Year-round',"Central Kenya's principal football ground serving the Mount Kenya region clubs and regional tournaments.",['Regional Hub','Mt Kenya Region','Modern Facilities'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','mbaraki-stadium','Mbaraki Sports Ground','Mombasa','Easy',4.2,'October – March',"Coastal football in the sea breeze — home ground for Bandari FC, Kenya's Premier League coastal powerhouse.",['Bandari FC','Coastal Atmosphere','Sea Breeze'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','bukhungu-stadium','Bukhungu Stadium','Kakamega','Easy',4.5,'Year-round',"Western Kenya's fortress stadium — home to Kakamega Homeboyz and arguably the most passionate crowds in Kenya.",['Kakamega Homeboyz','Passionate Crowds','Western Hub'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','thika-stadium','Thika Municipal Stadium','Kiambu','Easy',4.2,'Year-round','Modern stadium serving the Thika sub-region and home to AFC Leopards pre-match training sessions.',['AFC Leopards','Modern Facilities','Sub-Regional Hub'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','mamboleo-stadium','Mamboleo Stadium','Kisumu','Easy',4.3,'Year-round',"Lakeside football at its finest — Kisumu's premier ground hosting Gor Mahia away matches and lake region derbies.",['Lake Region Derby','Gor Mahia','Lakeside City'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','kericho-stadium','Kericho Green Stadium','Kericho','Easy',4.1,'Year-round',"Perched in Kenya's tea highlands, this ground offers a unique backdrop of rolling green tea plantations.",['Tea Highlands','Unique Setting','Rift Valley League'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','machakos-stadium',"Machakos People's Park Stadium",'Machakos','Easy',4.4,'Year-round',"One of Kenya's newest and most modern football facilities, built as part of the People's Park development.",["Modern Facility","People's Park",'Eastern Hub'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','camp-toyoyo','Camp Toyoyo Ground','Nairobi','Easy',4.0,'Year-round',"Legendary grassroots football hub in Nairobi's Jericho estate — where many KPL stars began their journey.",['Grassroots Hub','Jericho Estate','Star Factory'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','kenyatta-stadium-kitui','Kenyatta Stadium Kitui','Kitui','Easy',4.1,'Year-round','Eastern Kenya football anchor — serving the vast Ukambani region and semi-arid football community.',['Eastern Kenya','Ukambani Region','Community Football'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','gusii-stadium','Gusii Stadium','Kisii','Easy',4.3,'Year-round',"Nyanza's premier stadium hosting fiercely contested South Nyanza football rivalries.",['South Nyanza Derby','Passionate Fans','Regional Pride'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','moi-stadium-mombasa','Moi Municipal Stadium Mombasa','Mombasa','Easy',4.2,'October – April',"Historic coastal stadium that hosted Kenyan football's greatest coastal rivalries for over five decades.",['Coastal Rivalries','Historic Ground','Swahili Coast'],false,'https://www.fkf.co.ke/fixtures'),
    makeStatic('football','ole-kasasi-stadium','Ole Kasasi Stadium','Kajiado','Easy',4.0,'Year-round','Maasai land football home — blending traditional culture with the passion of the beautiful game.',['Maasai Land','Cultural Mix','Rift Valley'],false,'https://www.fkf.co.ke/fixtures'),
  ],
  golf: [
    makeStatic('golf','muthaiga-golf-club','Muthaiga Golf Club','Nairobi','Moderate',4.9,'Year-round',"Kenya's most prestigious golf club, established in 1913. Hosting the Kenya Open since 1967 on a Championship course with towering indigenous trees.",['Est. 1913','Kenya Open Host','18-Hole Championship'],true,'https://www.kenyaopen.com/schedule'),
    makeStatic('golf','karen-country-club','Karen Country Club','Nairobi','Moderate',4.8,'Year-round','World-class golf in the leafy Karen suburb, set among manicured fairways with views of the Ngong Hills.',['Ngong Hills Views','Championship Course','18 Holes'],false,'https://www.karencountryclub.org'),
    makeStatic('golf','vipingo-ridge','Vipingo Ridge Golf Club','Kilifi','Moderate',4.9,'October – March','Designed by David Jones — 18 holes of championship golf on the Kenya coast with stunning Indian Ocean panoramas and cooling sea breezes.',['Ocean Panoramas','Coastal Breeze','David Jones Design'],true,'https://www.vipingoridge.com'),
    makeStatic('golf','windsor-golf','Windsor Golf & Country Club','Kiambu','Moderate',4.7,'Year-round','An 18-hole championship course set on the outskirts of Nairobi in a lush forested valley with dramatic elevation changes.',['Forested Valley','18 Holes','Elevation Changes'],false,'https://www.windsorgolfhotel.co.ke'),
    makeStatic('golf','royal-nairobi-golf','Royal Nairobi Golf Club','Nairobi','Moderate',4.6,'Year-round',"Est. 1906 — one of the oldest golf clubs in Africa, sitting minutes from the city centre with a rich colonial heritage.",["Est. 1906","Africa's Oldest",'City Centre'],false,'https://www.royalnairobigolfclub.com'),
    makeStatic('golf','vet-lab-golf','Vet Lab Sports Club','Nairobi','Easy',4.3,'Year-round','Friendly 9-hole course popular with beginners and corporate golf days — great value in the heart of Nairobi.',['9 Holes','Beginner Friendly','Corporate Events'],false,'#'),
    makeStatic('golf','limuru-country-club','Limuru Country Club','Kiambu','Moderate',4.5,'Year-round',"Elevated highland golf among Kenya's famous tea estates — crisp air, dramatic views and a challenging layout.",['Tea Estate Views','Highland Golf','Crisp Air'],false,'https://www.limurucountryclub.co.ke'),
    makeStatic('golf','sigona-golf-club','Sigona Golf Club','Kiambu','Moderate',4.4,'Year-round','A scenic 18-hole parkland course 20km from Nairobi, beloved for its welcoming atmosphere and excellent greens.',['Parkland Course','Excellent Greens','Family Friendly'],false,'https://www.sigonagolfclub.com'),
    makeStatic('golf','nakuru-golf-club','Nakuru Golf Club','Nakuru','Easy',4.3,'Year-round','Rift Valley golf at its relaxed best — 18 holes on the outskirts of Nakuru town with views towards the escarpment.',['Rift Valley Views','18 Holes','Relaxed Atmosphere'],false,'https://www.nakurugolfclub.co.ke'),
    makeStatic('golf','nanyuki-sports-club','Nanyuki Sports Club Golf Course','Laikipia','Easy',4.4,'June – October','Golf at the equator with Mount Kenya as your backdrop — a unique 9-hole course that straddles the equator line.',['Equator Golf','Mt Kenya Views','9 Holes'],false,'https://www.nanyukisportsclub.com'),
    makeStatic('golf','mombasa-golf-club','Mombasa Golf Club','Mombasa','Easy',4.4,'October – March','Coastal golf with an old-world charm — 18 holes weaving through tropical vegetation near the Indian Ocean.',['Coastal Golf','Tropical Setting','Historic Club'],false,'https://www.mombasagolfclub.co.ke'),
    makeStatic('golf','nyali-golf-club','Nyali Golf & Country Club','Mombasa','Easy',4.5,'October – March','Premier Mombasa golf experience — challenging 18-hole layout with ocean glimpses and a vibrant clubhouse.',['Ocean Glimpses','18 Holes','Vibrant Clubhouse'],false,'https://www.nyaligolfclub.com'),
    makeStatic('golf','eldoret-golf-club','Eldoret Golf Club','Uasin Gishu','Easy',4.2,'Year-round',"High-altitude golf in Kenya's athletics capital — the thin air and cool temperatures make for a unique game.",['High Altitude','Athletics Capital','Cool Climate'],false,'https://www.eldoretgolfclub.co.ke'),
    makeStatic('golf','kisumu-golf-club','Kisumu Golf Club','Kisumu','Easy',4.2,'Year-round','Lakeside golf on the shores of Lake Victoria — the only golf club in Kenya with lake views from every hole.',['Lake Victoria Views','Unique Setting','9 Holes'],false,'https://www.kisumugolfclub.co.ke'),
    makeStatic('golf','mountain-lodge-golf','Fairmont Mount Kenya Safari Club Golf','Nyeri','Moderate',4.7,'January – March','Golf against the breathtaking backdrop of Mount Kenya — a 9-hole course at altitude with wildlife on the fairways.',['Mt Kenya Views','Wildlife on Fairways','Altitude Golf'],false,'https://www.fairmont.com/mount-kenya-safari'),
  ],
  rally: [
    makeStatic('rally','naivasha-rally-stage','Naivasha Rally Hub','Nakuru','Moderate',4.9,'June – July','The beating heart of the WRC Safari Rally — service park, super-special stages and fan zones in the stunning Rift Valley.',['WRC Safari Rally','Service Park','Fan Zones'],true,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','kedong-stage','Kedong Valley Stage','Nakuru','Challenging',4.8,'June – July','Legendary Kedong stage through the Great Rift Valley floor — fast, flat and spectacularly wild terrain.',['Rift Valley Floor','Fast Flat Stage','WRC Speed'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','soysambu-stage','Soysambu Conservancy Stage','Nakuru','Challenging',4.7,'June – July','Rally through a wildlife conservancy — drivers navigate murram roads as giraffes and zebras watch on.',['Wildlife Stage','Murram Roads','Unique Experience'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','kasarani-sss','Kasarani Super Special Stage','Nairobi','Easy',4.6,'June – July','The crowd-pleasing Kasarani Super Special Stage brings WRC action to 40,000 fans in the national stadium.',['Stadium Stage','40,000 Fans','Head-to-Head Duel'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','sleeping-warrior-stage','Sleeping Warrior Stage','Nakuru','Challenging',4.7,'June – July','Technical twisting stage around the flanks of the Sleeping Warrior extinct volcano near Lake Naivasha.',['Volcanic Terrain','Technical Stage','WRC Challenge'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','oserian-stage','Oserian Stage','Nakuru','Challenging',4.6,'June – July','The infamous Oserian stage through flower farms and rough volcanic rock — one of the most feared in WRC.',['Volcanic Rock','Feared Stage','Flower Farm Backdrop'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','hell-gate-rally-stage',"Hell's Gate Rally Stage",'Nakuru','Challenging',4.8,'June – July',"Through Hell's Gate gorge — dramatic red volcanic cliffs tower over drivers as they navigate one of rally's most photogenic stages.",['Volcanic Cliffs','Most Photogenic','Dramatic Scenery'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','elmenteita-stage','Lake Elmenteita Stage','Nakuru','Moderate',4.6,'June – July','Flanking a flamingo lake — this stage offers surreal scenery with pink birds in the background and rally cars in the foreground.',['Flamingo Lake Views','Surreal Scenery','Rift Valley'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','gilgil-stage','Gilgil Military Stage','Nakuru','Moderate',4.4,'June – July','Through the Gilgil military area — fast and flowing with wide murram roads through classic African bush.',['Fast & Flowing','Wide Murram Roads','African Bush'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','safari-rally-museum','Safari Rally Heritage Museum','Nairobi','Easy',4.5,'Year-round','Relive 70+ years of Safari Rally history — vintage cars, legendary driver trophies and immersive rally exhibits.',['70+ Year History','Vintage Cars','Rally Legends'],false,'https://www.kenyasafari.com'),
    makeStatic('rally','maai-mahiu-stage','Mai Mahiu Descent Stage','Nakuru','Challenging',4.7,'June – July',"The terrifying descent from the Rift Valley escarpment — blind crests and sharp drops make this a driver's nightmare.",['Escarpment Descent','Blind Crests',"Driver's Nightmare"],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','nakuru-super-stage','Nakuru Town Super Stage','Nakuru','Easy',4.5,'June – July','Rally action in Nakuru town centre — street stage where thousands of fans pack the barriers for close-up action.',['Street Stage','Town Centre','Close-up Action'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','delamere-stage','Delamere Estate Stage','Nakuru','Moderate',4.4,'June – July','Historic farmland stage across the iconic Delamere Estate — wide open roads through golden wheat fields.',['Historic Farmland','Wheat Field Roads','Delamere Legacy'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','longonot-stage','Mount Longonot Stage','Nakuru','Challenging',4.8,'June – July','Volcanic stage circling the base of Mount Longonot — jagged terrain and loose gravel push cars to their limits.',['Volcanic Terrain','Loose Gravel','Longonot Crater'],false,'https://www.wrc.com/en/events/safari-rally-kenya'),
    makeStatic('rally','naivasha-power-stage','Naivasha Power Stage','Nakuru','Challenging',4.9,'June – July','The final WRC Power Stage — bonus points and maximum drama as drivers push absolutely everything on the last test.',['Power Stage','Bonus Points','Maximum Drama'],true,'https://www.wrc.com/en/events/safari-rally-kenya'),
  ],
  basketball: [
    makeStatic('basketball','nyayo-indoor-arena','Nyayo National Stadium Indoor Arena','Nairobi','Easy',4.7,'Year-round',"Kenya's premier indoor basketball arena hosting KBF Premier League finals and FIBA Africa qualifying rounds.",['FIBA Africa Venue','KBF Finals','Premier Arena'],true,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','kasarani-indoor','Kasarani Gymnasium','Nairobi','Easy',4.6,'Year-round','Part of the Moi International Sports Centre complex — large indoor arena with excellent lighting and seating for major tournaments.',['Major Tournaments','International Events','Large Capacity'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','kicc-sports-hall','KICC Sports & Events Hall','Nairobi','Easy',4.5,'Year-round','The iconic Kenya International Conference Centre hosts basketball exhibition matches and community leagues in its versatile indoor hall.',['Iconic Nairobi Venue','Exhibition Matches','Community Leagues'],false,'https://www.kicc.co.ke/events'),
    makeStatic('basketball','upper-hill-courts','Upper Hill School Courts','Nairobi','Easy',4.3,'Year-round',"Premier school basketball in Kenya — Upper Hill's courts produce a remarkable number of national team players each season.",['School Basketball','National Players','Development Hub'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','strathmore-university-gym','Strathmore University Sports Hall','Nairobi','Easy',4.5,'Year-round','University-level basketball at its finest — Strathmore Blades dominate the Kenya University Sports Association (KUSA) league.',['KUSA League','Strathmore Blades','University Basketball'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','uon-hall','University of Nairobi Sports Hall','Nairobi','Easy',4.2,'Year-round','Historic UoN gym — a cornerstone of Kenyan university basketball with decades of passionate rivalry.',['University Rival','Historic Venue','UoN Rockets'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','mombasa-sports-club-bball','Mombasa Sports Club Courts','Mombasa','Easy',4.3,'October – March','Coastal basketball hub — the Mombasa Sports Club courts host the KBF Coast region league and youth development programs.',['Coast Region League','Youth Development','Coastal Hub'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','kisumu-indoor','Kisumu Indoor Arena','Kisumu','Easy',4.2,'Year-round',"Lake Victoria basin basketball — Kisumu's arena serves the western Kenya basketball community and national league clubs.",['Western Kenya','KBF Western','Lakeside City'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','eldoret-ymca-courts','Eldoret YMCA Courts','Uasin Gishu','Easy',4.1,'Year-round',"Basketball in the home of runners — Eldoret's YMCA courts are a hub for Rift Valley youth sport development.",['Youth Development','Rift Valley Hub','YMCA Community'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','daystar-university-courts','Daystar University Courts','Machakos','Easy',4.2,'Year-round',"Eastern Kenya's top university basketball facility — Daystar Warriors compete fiercely in the KUSA championship.",['KUSA Championship','Eastern Kenya','Daystar Warriors'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','kenyatta-university-gym','Kenyatta University Sports Hall','Kiambu','Easy',4.3,'Year-round','Large university sports hall hosting inter-university championships and national training camps for the Morans.',['Morans Training','Inter-University','Large Capacity'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','thika-sports-club-bball','Thika Sports Club Court','Kiambu','Easy',4.0,'Year-round','Community basketball in Thika — a well-maintained court that doubles as a development centre for youth hoops.',['Community Basketball','Youth Hoops','Development Centre'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','nakuru-sports-club-bball','Nakuru Athletic Club Courts','Nakuru','Easy',4.1,'Year-round',"Rift Valley basketball hub — Nakuru's courts host the regional KBF Rift Valley zone league games.",['KBF Rift Valley','Regional League','Athletic Club'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','jkuat-sports-hall','JKUAT Sports Hall','Kiambu','Easy',4.2,'Year-round','Technical university campus with a modern sports hall frequently hosting KBF development league and KUSA fixtures.',['KBF Development','KUSA Fixtures','Modern Hall'],false,'https://www.kenyabasketball.com/schedule'),
    makeStatic('basketball','pwani-university-courts','Pwani University Courts','Kilifi','Easy',4.1,'October – March',"Coastal university basketball — Pwani University's courts overlook the Indian Ocean, making training sessions uniquely refreshing.",['Ocean Views','Coastal University','Coast Zone League'],false,'https://www.kenyabasketball.com/schedule'),
  ],
  swimming: [
    makeStatic('swimming','kasarani-aquatic-centre','Kasarani Aquatic Centre','Nairobi','Easy',4.8,'Year-round',"Kenya's only Olympic-standard 50m pool — home of the Kenya Aquatics Federation national championships and the Aqua Stars club.",['50m Olympic Pool','National Championships','Olympic Standard'],true,'https://www.kenyaaquatics.org/events'),
    makeStatic('swimming','nyayo-swimming-pool','Nyayo National Stadium Pool','Nairobi','Easy',4.5,'Year-round','Official 50m competition pool at Nyayo National Stadium — host to KAF opens and East African aquatics competitions.',['50m Pool','East African Meets','KAF Opens'],false,'https://www.kenyaaquatics.org/events'),
    makeStatic('swimming','westwood-pool','Westwood Health Club Pool','Nairobi','Easy',4.4,'Year-round',"Nairobi's premier leisure pool complex — heated, well-maintained and a favourite training venue for top swimming clubs.",['Heated Pool','Top Clubs','Leisure Complex'],false,'https://www.westwoodhealth.co.ke'),
    makeStatic('swimming','karen-cc-pool','Karen Country Club Pool','Nairobi','Easy',4.6,'Year-round','Beautifully maintained outdoor pool in the lush Karen estate — cool highland temperatures make for perfect lap sessions.',['Outdoor Pool','Karen Estate','Highland Cool'],false,'https://www.karencountryclub.org'),
    makeStatic('swimming','peponi-school-pool','Peponi School Aquatic Centre','Kiambu','Easy',4.5,'Year-round',"Elite school swimming facility producing Kenya's most decorated young swimmers — regular inter-school galas.",['Elite School Pool','Inter-School Galas','Young Champions'],false,'https://www.kenyaaquatics.org/events'),
    makeStatic('swimming','diani-reef-pool','Diani Reef Beach Resort Pool','Kwale','Easy',4.7,'October – March',"Infinity pool overlooking the Indian Ocean — open-water swimming training on Kenya's most beautiful coastline.",['Infinity Pool','Ocean Views','Open Water Training'],false,'https://www.dianibeach.com'),
    makeStatic('swimming','lake-victoria-swim','Lake Victoria Open Water Swim, Kisumu','Kisumu','Moderate',4.6,'June – September',"Africa's largest lake hosts the annual Kisumu Open Water Classic — a bucket-list swim through freshwater history.",["Africa's Largest Lake",'Open Water Classic','Freshwater Swim'],false,'https://www.kenyaaquatics.org/events'),
    makeStatic('swimming','watamu-marine-swim','Watamu Open Water Swim','Kilifi','Moderate',4.8,'October – March','Swim through the Watamu Marine National Park — crystal-clear waters with coral reefs and tropical fish as company.',['Marine Park Swim','Coral Reefs','Crystal Clear Water'],false,'https://www.watamu.com/events'),
    makeStatic('swimming','nairobi-club-pool','Nairobi Club Pool','Nairobi','Easy',4.4,'Year-round',"Historic colonial-era club with a full competition pool — site of Kenya's first ever organised swimming competitions in 1935.",['Historic 1935 Pool','Competition Pool','Colonial Heritage'],false,'https://www.nairobiclub.com'),
    makeStatic('swimming','strathmore-pool','Strathmore University Pool','Nairobi','Easy',4.3,'Year-round','University-level competition pool hosting KUSA swimming championships and open-club training sessions.',['KUSA Swimming','University Pool','Open Training'],false,'https://www.kenyaaquatics.org/events'),
    makeStatic('swimming','impala-club-pool','Impala Club Pool','Nairobi','Easy',4.3,'Year-round',"Well-kept suburban pool popular with Nairobi's swimming clubs for early morning training and evening galas.",['Morning Training','Suburban Pool','Swimming Galas'],false,'https://www.kenyaaquatics.org/events'),
    makeStatic('swimming','mombasa-sports-club-pool','Mombasa Sports Club Pool','Mombasa','Easy',4.4,'Year-round','Premier coastal swimming facility — well-maintained 25m pool with a thriving junior development programme.',['Coastal Pool','Junior Programme','25m Lane Pool'],false,'https://www.kenyaaquatics.org/events'),
    makeStatic('swimming','nakuru-sports-club-pool','Nakuru Athletic Club Pool','Nakuru','Easy',4.2,'Year-round','Rift Valley primary training pool — the Nakuru AC Sharks consistently produce competitive regional swimmers.',['Rift Valley Pool','Nakuru Sharks','Regional Championships'],false,'https://www.kenyaaquatics.org/events'),
    makeStatic('swimming','eldoret-swimming-pool','Eldoret Sports Club Pool','Uasin Gishu','Easy',4.1,'Year-round',"High-altitude swimming — Eldoret's pool is a unique training advantage, with thin-air conditioning boosting swimmers' lung capacity.",['High Altitude','Lung Capacity Boost','Athletics City Pool'],false,'https://www.kenyaaquatics.org/events'),
    makeStatic('swimming','kisumu-swimming-pool','Kisumu Sports Club Pool','Kisumu','Easy',4.2,'Year-round',"Lakeside pool where the warm climate allows year-round training — home to Western Kenya's most promising young swimmers.",['Warm Climate','Year-round Training','Young Talent'],false,'https://www.kenyaaquatics.org/events'),
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

  const params   = new URLSearchParams(window.location.search);
  const param    = params.get('sport') || params.get('type') || 'football';
  const valid    = Object.keys(SPORT_META);
  currentSport   = valid.includes(param) ? param : 'football';

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
   UPDATE HERO SECTION
   Sets hero background to the Supabase-stored image for this sport.
   Uses heroFallbackBg until the image loads, then transitions in.
───────────────────────────────────────────────────────────────────── */
function updateHero(sport) {
  const m    = SPORT_META[sport];
  const hero = document.getElementById('catHero');

  if (hero) {
    /* Start with fallback, then load the Supabase image */
    hero.style.backgroundImage = `url('${m.heroFallbackBg}')`;
    const img = new Image();
    img.onload = () => {
      hero.style.backgroundImage = `url('${m.heroBg}')`;
    };
    img.onerror = () => { /* keep fallback */ };
    img.src = m.heroBg;
  }

  const el = (id) => document.getElementById(id);
  if (el('heroBreadcrumb')) el('heroBreadcrumb').textContent = m.breadcrumb;
  if (el('heroBadge'))      el('heroBadge').textContent      = m.badge;
  if (el('heroTitle'))      el('heroTitle').innerHTML         = m.heroTitle;
  if (el('heroDesc'))       el('heroDesc').textContent        = m.heroDesc;
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
      const supabaseData = await getSportsDestinations(sport);
      if (supabaseData && supabaseData.length > 0) {
        destinations = supabaseData;
      }
    }
  } catch (err) {
    console.warn('Supabase unavailable, using static fallback:', err);
  }

  if (!destinations.length) {
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
   image_hero: Supabase Storage URL (set by setup script or makeStatic)
───────────────────────────────────────────────────────────────────── */
function buildCard(d) {
  const diff     = (d.difficulty || 'Easy').toLowerCase();

  /* Resolve image: image_hero (DB/static) → fallback */
  const fallback  = `${STORAGE_BASE}/football/kasarani-stadium.jpg`;
  let img         = d.image_hero || fallback;

  /* Handle legacy JSON-array image_hero just in case */
  if (typeof img === 'string' && img.startsWith('[')) {
    try { img = JSON.parse(img)[0] || fallback; } catch (_) { img = fallback; }
  }

  const tags     = Array.isArray(d.highlights) ? d.highlights.slice(0, 3) : [];
  const schedURL = d.schedule || '#';
  const county   = d.county   || '';
  const bestTime = d.best_time || 'Year-round';

  return `
    <div class="dest-card" onclick="window.location.href='sports-details.html?id=${d.slug}'">
      <div class="dest-img-wrap" style="position:relative;overflow:hidden;height:200px;border-radius:16px 16px 0 0;">
        <img
          src="${img}"
          alt="${d.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='${fallback}'"
          style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.4s;"
        />
        <span class="difficulty-badge diff-${diff}"
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
          <a href="sports-details.html?id=${d.slug}"
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

function showError() {
  document.getElementById('sportsGrid').innerHTML = `
    <div class="state-box">
      <div class="state-icon">⚠️</div>
      <h4>Failed to load destinations</h4>
      <p>Something went wrong. Please refresh the page or try again later.</p>
    </div>`;
}
