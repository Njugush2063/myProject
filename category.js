/* ══════════════════════════════════════════════════════
   STATIC FALLBACK DATA — 15 per sport, balanced feed
   All cards link to attraction-details.html?id={slug}
   Schedule links open official venue/event pages
══════════════════════════════════════════════════════ */
const STATIC_SPORTS = {

  football: [
    { slug:'kasarani-stadium', name:'Moi International Sports Centre, Kasarani', county:'Nairobi', difficulty:'Easy', rating:4.8, best_time:'Year-round', description:'Kenya\'s premier national stadium with 60,000+ capacity, home of the Harambee Stars and major AFCON qualifiers.', image:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', highlights:['60,000 Capacity','AFCON Qualifiers','Olympic Track'], featured:true, schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'nyayo-stadium', name:'Nyayo National Stadium', county:'Nairobi', difficulty:'Easy', rating:4.6, best_time:'Year-round', description:'Iconic 30,000-seat multi-use stadium in Nairobi, regularly hosting KPL matches and national events.', image:'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80', highlights:['30,000 Capacity','KPL Matches','National Events'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'afraha-stadium', name:'Afraha Stadium', county:'Nakuru', difficulty:'Easy', rating:4.4, best_time:'Year-round', description:'The heartbeat of Rift Valley football — home to Nakuru All Stars and rowdy western Kenya derbies.', image:'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80', highlights:['Western Derbies','Rift Valley Hub','Local Passion'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'kinoru-stadium', name:'Kinoru Stadium', county:'Meru', difficulty:'Easy', rating:4.3, best_time:'Year-round', description:'Central Kenya\'s principal football ground serving the Mount Kenya region clubs and regional tournaments.', image:'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80', highlights:['Regional Hub','Mt Kenya Region','Modern Facilities'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'mbaraki-stadium', name:'Mbaraki Sports Ground', county:'Mombasa', difficulty:'Easy', rating:4.2, best_time:'October – March', description:'Coastal football in the sea breeze — home ground for Bandari FC, Kenya\'s Premier League coastal powerhouse.', image:'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=600&q=80', highlights:['Bandari FC','Coastal Atmosphere','Sea Breeze'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'bukhungu-stadium', name:'Bukhungu Stadium', county:'Kakamega', difficulty:'Easy', rating:4.5, best_time:'Year-round', description:'Western Kenya\'s fortress stadium — home to Kakamega Homeboyz and arguably the most passionate crowds in Kenya.', image:'https://images.unsplash.com/photo-1562077981-4d7eafd44932?w=600&q=80', highlights:['Kakamega Homeboyz','Passionate Crowds','Western Hub'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'thika-stadium', name:'Thika Municipal Stadium', county:'Kiambu', difficulty:'Easy', rating:4.2, best_time:'Year-round', description:'Modern stadium serving the Thika sub-region and home to AFC Leopards pre-match training sessions.', image:'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&q=80', highlights:['AFC Leopards','Modern Facilities','Sub-Regional Hub'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'mamboleo-stadium', name:'Mamboleo Stadium', county:'Kisumu', difficulty:'Easy', rating:4.3, best_time:'Year-round', description:'Lakeside football at its finest — Kisumu\'s premier ground hosting Gor Mahia away matches and lake region derbies.', image:'https://images.unsplash.com/photo-1551958219-acbc630e2914?w=600&q=80', highlights:['Lake Region Derby','Gor Mahia','Lakeside City'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'kericho-stadium', name:'Kericho Green Stadium', county:'Kericho', difficulty:'Easy', rating:4.1, best_time:'Year-round', description:'Perched in Kenya\'s tea highlands, this ground offers a unique backdrop of rolling green tea plantations.', image:'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80', highlights:['Tea Highlands','Unique Setting','Rift Valley League'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'machakos-stadium', name:'Machakos People\'s Park Stadium', county:'Machakos', difficulty:'Easy', rating:4.4, best_time:'Year-round', description:'One of Kenya\'s newest and most modern football facilities, built as part of the People\'s Park development.', image:'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=600&q=80', highlights:['Modern Facility','People\'s Park','Eastern Hub'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'camp-toyoyo', name:'Camp Toyoyo Ground', county:'Nairobi', difficulty:'Easy', rating:4.0, best_time:'Year-round', description:'Legendary grassroots football hub in Nairobi\'s Jericho estate — where many KPL stars began their journey.', image:'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80', highlights:['Grassroots Hub','Jericho Estate','Star Factory'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'kenyatta-stadium-kitui', name:'Kenyatta Stadium Kitui', county:'Kitui', difficulty:'Easy', rating:4.1, best_time:'Year-round', description:'Eastern Kenya\'s football anchor — serving the vast Ukambani region and semi-arid football community.', image:'https://images.unsplash.com/photo-1474680296168-f9b52dfa27be?w=600&q=80', highlights:['Eastern Kenya','Ukambani Region','Community Football'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'gusii-stadium', name:'Gusii Stadium', county:'Kisii', difficulty:'Easy', rating:4.3, best_time:'Year-round', description:'Nyanza\'s premier stadium hosting fiercely contested South Nyanza football rivalries.', image:'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600&q=80', highlights:['South Nyanza Derby','Passionate Fans','Regional Pride'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'moi-stadium-mombasa', name:'Moi Municipal Stadium Mombasa', county:'Mombasa', difficulty:'Easy', rating:4.2, best_time:'October – April', description:'Historic coastal stadium that hosted Kenyan football\'s greatest coastal rivalries for over five decades.', image:'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80', highlights:['Coastal Rivalries','Historic Ground','Swahili Coast'], schedule:'https://www.fkf.co.ke/fixtures' },
    { slug:'ole-kasasi-stadium', name:'Ole Kasasi Stadium', county:'Kajiado', difficulty:'Easy', rating:4.0, best_time:'Year-round', description:'Maasai land\'s football home — blending traditional culture with the passion of the beautiful game.', image:'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80', highlights:['Maasai Land','Cultural Mix','Rift Valley'], schedule:'https://www.fkf.co.ke/fixtures' }
  ],

  golf: [
    { slug:'muthaiga-golf-club', name:'Muthaiga Golf Club', county:'Nairobi', difficulty:'Moderate', rating:4.9, best_time:'Year-round', description:'Kenya\'s most prestigious golf club, established in 1913. Hosting the Kenya Open since 1967 on a Championship course with towering indigenous trees.', image:'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=80', highlights:['Est. 1913','Kenya Open Host','18-Hole Championship'], featured:true, schedule:'https://www.kenyaopen.com/schedule' },
    { slug:'karen-country-club', name:'Karen Country Club', county:'Nairobi', difficulty:'Moderate', rating:4.8, best_time:'Year-round', description:'World-class golf in the leafy Karen suburb, set among manicured fairways with views of the Ngong Hills.', image:'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&q=80', highlights:['Ngong Hills Views','Championship Course','18 Holes'], schedule:'https://www.karencountryclub.org' },
    { slug:'vipingo-ridge', name:'Vipingo Ridge Golf Club', county:'Kilifi', difficulty:'Moderate', rating:4.9, best_time:'October – March', description:'Designed by David Jones — 18 holes of championship golf on the Kenya coast with stunning Indian Ocean panoramas and cooling sea breezes.', image:'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=600&q=80', highlights:['Ocean Panoramas','Coastal Breeze','David Jones Design'], featured:true, schedule:'https://www.vipingoridge.com' },
    { slug:'windsor-golf', name:'Windsor Golf & Country Club', county:'Kiambu', difficulty:'Moderate', rating:4.7, best_time:'Year-round', description:'An 18-hole championship course set on the outskirts of Nairobi in a lush forested valley with dramatic elevation changes.', image:'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&q=80', highlights:['Forested Valley','18 Holes','Elevation Changes'], schedule:'https://www.windsorgolfhotel.co.ke' },
    { slug:'royal-nairobi-golf', name:'Royal Nairobi Golf Club', county:'Nairobi', difficulty:'Moderate', rating:4.6, best_time:'Year-round', description:'Est. 1906 — one of the oldest golf clubs in Africa, sitting minutes from the city centre with a rich colonial heritage.', image:'https://images.unsplash.com/photo-1519670107408-851db02d9b83?w=600&q=80', highlights:['Est. 1906','Africa\'s Oldest','City Centre'], schedule:'https://www.royalnairobigolfclub.com' },
    { slug:'vet-lab-golf', name:'Vet Lab Sports Club', county:'Nairobi', difficulty:'Easy', rating:4.3, best_time:'Year-round', description:'Friendly 9-hole course popular with beginners and corporate golf days — great value in the heart of Nairobi.', image:'https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=600&q=80', highlights:['9 Holes','Beginner Friendly','Corporate Events'], schedule:'https://www.fkf.co.ke' },
    { slug:'limuru-country-club', name:'Limuru Country Club', county:'Kiambu', difficulty:'Moderate', rating:4.5, best_time:'Year-round', description:'Elevated highland golf among Kenya\'s famous tea estates — crisp air, dramatic views and a challenging layout.', image:'https://images.unsplash.com/photo-1534126509751-61f0c4b4adb1?w=600&q=80', highlights:['Tea Estate Views','Highland Golf','Crisp Air'], schedule:'https://www.limurucountryclub.co.ke' },
    { slug:'sigona-golf-club', name:'Sigona Golf Club', county:'Kiambu', difficulty:'Moderate', rating:4.4, best_time:'Year-round', description:'A scenic 18-hole parkland course 20km from Nairobi, beloved for its welcoming atmosphere and excellent greens.', image:'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?w=600&q=80', highlights:['Parkland Course','Excellent Greens','Family Friendly'], schedule:'https://www.sigonagolfclub.com' },
    { slug:'nakuru-golf-club', name:'Nakuru Golf Club', county:'Nakuru', difficulty:'Easy', rating:4.3, best_time:'Year-round', description:'Rift Valley golf at its relaxed best — 18 holes on the outskirts of Nakuru town with views towards the escarpment.', image:'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=600&q=80', highlights:['Rift Valley Views','18 Holes','Relaxed Atmosphere'], schedule:'https://www.nakurugolfclub.co.ke' },
    { slug:'nanyuki-sports-club', name:'Nanyuki Sports Club Golf Course', county:'Laikipia', difficulty:'Easy', rating:4.4, best_time:'June – October', description:'Golf at the equator with Mount Kenya as your backdrop — a unique 9-hole course that straddles the equator line.', image:'https://images.unsplash.com/photo-1576406571946-b3e0f68e00a2?w=600&q=80', highlights:['Equator Golf','Mt Kenya Views','9 Holes'], schedule:'https://www.nanyukisportsclub.com' },
    { slug:'mombasa-golf-club', name:'Mombasa Golf Club', county:'Mombasa', difficulty:'Easy', rating:4.4, best_time:'October – March', description:'Coastal golf with an old-world charm — 18 holes weaving through tropical vegetation near the Indian Ocean.', image:'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600&q=80', highlights:['Coastal Golf','Tropical Setting','Historic Club'], schedule:'https://www.mombasagolfclub.co.ke' },
    { slug:'nyali-golf-club', name:'Nyali Golf & Country Club', county:'Mombasa', difficulty:'Easy', rating:4.5, best_time:'October – March', description:'Premier Mombasa golf experience — challenging 18-hole layout with ocean glimpses and a vibrant clubhouse.', image:'https://images.unsplash.com/photo-1540126034813-121bf29033d2?w=600&q=80', highlights:['Ocean Glimpses','18 Holes','Vibrant Clubhouse'], schedule:'https://www.nyaligolfclub.com' },
    { slug:'eldoret-golf-club', name:'Eldoret Golf Club', county:'Uasin Gishu', difficulty:'Easy', rating:4.2, best_time:'Year-round', description:'High-altitude golf in Kenya\'s athletics capital — the thin air and cool temperatures make for a unique game.', image:'https://images.unsplash.com/photo-1604481546979-c8b8f8e7f1e4?w=600&q=80', highlights:['High Altitude','Athletics Capital','Cool Climate'], schedule:'https://www.eldoretgolfclub.co.ke' },
    { slug:'kisumu-golf-club', name:'Kisumu Golf Club', county:'Kisumu', difficulty:'Easy', rating:4.2, best_time:'Year-round', description:'Lakeside golf on the shores of Lake Victoria — the only golf club in Kenya with lake views from every hole.', image:'https://images.unsplash.com/photo-1593988649880-2e84b2e2cedd?w=600&q=80', highlights:['Lake Victoria Views','Unique Setting','9 Holes'], schedule:'https://www.kisumugolfclub.co.ke' },
    { slug:'mountain-lodge-golf', name:'Fairmont Mount Kenya Safari Club Golf', county:'Nyeri', difficulty:'Moderate', rating:4.7, best_time:'January – March', description:'Golf against the breathtaking backdrop of Mount Kenya — a 9-hole course at altitude with wildlife on the fairways.', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', highlights:['Mt Kenya Views','Wildlife on Fairways','Altitude Golf'], schedule:'https://www.fairmont.com/mount-kenya-safari' }
  ],

  rally: [
    { slug:'naivasha-rally-stage', name:'Naivasha Rally Hub', county:'Nakuru', difficulty:'Moderate', rating:4.9, best_time:'June – July', description:'The beating heart of the WRC Safari Rally — service park, super-special stages and fan zones in the stunning Rift Valley.', image:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80', highlights:['WRC Safari Rally','Service Park','Fan Zones'], featured:true, schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'kedong-stage', name:'Kedong Valley Stage', county:'Nakuru', difficulty:'Challenging', rating:4.8, best_time:'June – July', description:'Legendary Kedong stage through the Great Rift Valley floor — fast, flat and spectacularly wild terrain.', image:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80', highlights:['Rift Valley Floor','Fast Flat Stage','WRC Speed'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'soysambu-stage', name:'Soysambu Conservancy Stage', county:'Nakuru', difficulty:'Challenging', rating:4.7, best_time:'June – July', description:'Rally through a wildlife conservancy — drivers navigate murram roads as giraffes and zebras watch on.', image:'https://images.unsplash.com/photo-1606357005238-1e1fce3c5a06?w=600&q=80', highlights:['Wildlife Stage','Murram Roads','Unique Experience'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'kasarani-sss', name:'Kasarani Super Special Stage', county:'Nairobi', difficulty:'Easy', rating:4.6, best_time:'June – July', description:'The crowd-pleasing Kasarani Super Special Stage brings WRC action to 40,000 fans in the national stadium.', image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', highlights:['Stadium Stage','40,000 Fans','Head-to-Head Duel'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'sleeping-warrior-stage', name:'Sleeping Warrior Stage', county:'Nakuru', difficulty:'Challenging', rating:4.7, best_time:'June – July', description:'Technical twisting stage around the flanks of the Sleeping Warrior extinct volcano near Lake Naivasha.', image:'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80', highlights:['Volcanic Terrain','Technical Stage','WRC Challenge'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'oserian-stage', name:'Oserian Stage', county:'Nakuru', difficulty:'Challenging', rating:4.6, best_time:'June – July', description:'The infamous Oserian stage through flower farms and rough volcanic rock — one of the most feared in WRC.', image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', highlights:['Volcanic Rock','Feared Stage','Flower Farm Backdrop'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'hell-gate-rally-stage', name:'Hell\'s Gate Rally Stage', county:'Nakuru', difficulty:'Challenging', rating:4.8, best_time:'June – July', description:'Through Hell\'s Gate gorge — dramatic red volcanic cliffs tower over drivers as they navigate one of rally\'s most photogenic stages.', image:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80', highlights:['Volcanic Cliffs','Most Photogenic','Dramatic Scenery'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'elmenteita-stage', name:'Lake Elmenteita Stage', county:'Nakuru', difficulty:'Moderate', rating:4.6, best_time:'June – July', description:'Flanking a flamingo lake — this stage offers surreal scenery with pink birds in the background and rally cars in the foreground.', image:'https://images.unsplash.com/photo-1541562232579-512a21360020?w=600&q=80', highlights:['Flamingo Lake Views','Surreal Scenery','Rift Valley'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'gilgil-stage', name:'Gilgil Military Stage', county:'Nakuru', difficulty:'Moderate', rating:4.4, best_time:'June – July', description:'Through the Gilgil military area — fast and flowing with wide murram roads through classic African bush.', image:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80', highlights:['Fast & Flowing','Wide Murram Roads','African Bush'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'safari-rally-museum', name:'Safari Rally Heritage Museum', county:'Nairobi', difficulty:'Easy', rating:4.5, best_time:'Year-round', description:'Relive 70+ years of Safari Rally history — vintage cars, legendary driver trophies and immersive rally exhibits.', image:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', highlights:['70+ Year History','Vintage Cars','Rally Legends'], schedule:'https://www.kenyasafari.com' },
    { slug:'maai-mahiu-stage', name:'Mai Mahiu Descent Stage', county:'Nakuru', difficulty:'Challenging', rating:4.7, best_time:'June – July', description:'The terrifying descent from the Rift Valley escarpment — blind crests and sharp drops make this a driver\'s nightmare.', image:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80', highlights:['Escarpment Descent','Blind Crests','Driver\'s Nightmare'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'nakuru-super-stage', name:'Nakuru Town Super Stage', county:'Nakuru', difficulty:'Easy', rating:4.5, best_time:'June – July', description:'Rally action in Nakuru town centre — street stage where thousands of fans pack the barriers for close-up action.', image:'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', highlights:['Street Stage','Town Centre','Close-up Action'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'delamere-stage', name:'Delamere Estate Stage', county:'Nakuru', difficulty:'Moderate', rating:4.4, best_time:'June – July', description:'Historic farmland stage across the iconic Delamere Estate — wide open roads through golden wheat fields.', image:'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80', highlights:['Historic Farmland','Wheat Field Roads','Delamere Legacy'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'longonot-stage', name:'Mount Longonot Stage', county:'Nakuru', difficulty:'Challenging', rating:4.8, best_time:'June – July', description:'Volcanic stage circling the base of Mount Longonot — jagged terrain and loose gravel push cars to their limits.', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', highlights:['Volcanic Terrain','Loose Gravel','Longonot Crater'], schedule:'https://www.wrc.com/en/events/safari-rally-kenya' },
    { slug:'naivasha-power-stage', name:'Naivasha Power Stage', county:'Nakuru', difficulty:'Challenging', rating:4.9, best_time:'June – July', description:'The final WRC Power Stage — bonus points and maximum drama as drivers push absolutely everything on the last test.', image:'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80', highlights:['Power Stage','Bonus Points','Maximum Drama'], featured:true, schedule:'https://www.wrc.com/en/events/safari-rally-kenya' }
  ],

  basketball: [
    { slug:'nyayo-indoor-arena', name:'Nyayo National Stadium Indoor Arena', county:'Nairobi', difficulty:'Easy', rating:4.7, best_time:'Year-round', description:'Kenya\'s premier indoor basketball arena hosting KBF Premier League finals and FIBA Africa qualifying rounds.', image:'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80', highlights:['FIBA Africa Venue','KBF Finals','Premier Arena'], featured:true, schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'kasarani-indoor', name:'Kasarani Gymnasium', county:'Nairobi', difficulty:'Easy', rating:4.6, best_time:'Year-round', description:'Part of the Moi International Sports Centre complex — large indoor arena with excellent lighting and seating for major tournaments.', image:'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', highlights:['Major Tournaments','International Events','Large Capacity'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'kicc-sports-hall', name:'KICC Sports & Events Hall', county:'Nairobi', difficulty:'Easy', rating:4.5, best_time:'Year-round', description:'The iconic Kenya International Conference Centre hosts basketball exhibition matches, sports galas and community leagues in its versatile indoor hall.', image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', highlights:['Iconic Nairobi Venue','Exhibition Matches','Community Leagues'], schedule:'https://www.kicc.co.ke/events' },
    { slug:'upper-hill-courts', name:'Upper Hill School Courts', county:'Nairobi', difficulty:'Easy', rating:4.3, best_time:'Year-round', description:'Premier school basketball in Kenya — Upper Hill\'s courts produce a remarkable number of national team players each season.', image:'https://images.unsplash.com/photo-1475440197469-e367e36e7054?w=600&q=80', highlights:['School Basketball','National Players','Development Hub'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'strathmore-university-gym', name:'Strathmore University Sports Hall', county:'Nairobi', difficulty:'Easy', rating:4.5, best_time:'Year-round', description:'University-level basketball at its finest — Strathmore Blades dominate the Kenya University Sports Association (KUSA) league.', image:'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80', highlights:['KUSA League','Strathmore Blades','University Basketball'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'uon-hall', name:'University of Nairobi Sports Hall', county:'Nairobi', difficulty:'Easy', rating:4.2, best_time:'Year-round', description:'Historic UoN gym — a cornerstone of Kenyan university basketball with decades of passionate rivalry.', image:'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&q=80', highlights:['University Rival','Historic Venue','UoN Rockets'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'mombasa-sports-club-bball', name:'Mombasa Sports Club Courts', county:'Mombasa', difficulty:'Easy', rating:4.3, best_time:'October – March', description:'Coastal basketball hub — the Mombasa Sports Club courts host the KBF Coast region league and youth development programs.', image:'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=600&q=80', highlights:['Coast Region League','Youth Development','Coastal Hub'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'kisumu-indoor', name:'Kisumu Indoor Arena', county:'Kisumu', difficulty:'Easy', rating:4.2, best_time:'Year-round', description:'Lake Victoria basin basketball — Kisumu\'s arena serves the western Kenya basketball community and national league clubs.', image:'https://images.unsplash.com/photo-1626379961798-54f819ee896a?w=600&q=80', highlights:['Western Kenya','KBF Western','Lakeside City'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'eldoret-ymca-courts', name:'Eldoret YMCA Courts', county:'Uasin Gishu', difficulty:'Easy', rating:4.1, best_time:'Year-round', description:'Basketball in the home of runners — Eldoret\'s YMCA courts are a hub for Rift Valley youth sport development.', image:'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=600&q=80', highlights:['Youth Development','Rift Valley Hub','YMCA Community'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'daystar-university-courts', name:'Daystar University Courts', county:'Machakos', difficulty:'Easy', rating:4.2, best_time:'Year-round', description:'Eastern Kenya\'s top university basketball facility — Daystar Warriors compete fiercely in the KUSA championship.', image:'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80', highlights:['KUSA Championship','Eastern Kenya','Daystar Warriors'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'kenyatta-university-gym', name:'Kenyatta University Sports Hall', county:'Kiambu', difficulty:'Easy', rating:4.3, best_time:'Year-round', description:'Large university sports hall hosting inter-university championships and national training camps for the Morans.', image:'https://images.unsplash.com/photo-1509116547734-2bd09b30a87b?w=600&q=80', highlights:['Morans Training','Inter-University','Large Capacity'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'thika-sports-club-bball', name:'Thika Sports Club Court', county:'Kiambu', difficulty:'Easy', rating:4.0, best_time:'Year-round', description:'Community basketball in Thika — a well-maintained court that doubles as a development centre for youth hoops.', image:'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&q=80', highlights:['Community Basketball','Youth Hoops','Development Centre'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'nakuru-sports-club-bball', name:'Nakuru Athletic Club Courts', county:'Nakuru', difficulty:'Easy', rating:4.1, best_time:'Year-round', description:'Rift Valley basketball hub — Nakuru\'s courts host the regional KBF Rift Valley zone league games.', image:'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', highlights:['KBF Rift Valley','Regional League','Athletic Club'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'jkuat-sports-hall', name:'JKUAT Sports Hall', county:'Kiambu', difficulty:'Easy', rating:4.2, best_time:'Year-round', description:'Technical university campus with a modern sports hall frequently hosting KBF development league and KUSA fixtures.', image:'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80', highlights:['KBF Development','KUSA Fixtures','Modern Hall'], schedule:'https://www.kenyabasketball.com/schedule' },
    { slug:'pwani-university-courts', name:'Pwani University Courts', county:'Kilifi', difficulty:'Easy', rating:4.1, best_time:'October – March', description:'Coastal university basketball — Pwani Univeristy\'s courts overlook the Indian Ocean, making training sessions uniquely refreshing.', image:'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&q=80', highlights:['Ocean Views','Coastal University','Coast Zone League'], schedule:'https://www.kenyabasketball.com/schedule' }
  ],

  swimming: [
    { slug:'kasarani-aquatic-centre', name:'Kasarani Aquatic Centre', county:'Nairobi', difficulty:'Easy', rating:4.8, best_time:'Year-round', description:'Kenya\'s only Olympic-standard 50m pool — home of the Kenya Aquatics Federation national championships and the Aqua Stars club.', image:'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80', highlights:['50m Olympic Pool','National Championships','Olympic Standard'], featured:true, schedule:'https://www.kenyaaquatics.org/events' },
    { slug:'nyayo-swimming-pool', name:'Nyayo National Stadium Pool', county:'Nairobi', difficulty:'Easy', rating:4.5, best_time:'Year-round', description:'Official 50m competition pool at Nyayo National Stadium — host to KAF opens and East African aquatics competitions.', image:'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80', highlights:['50m Pool','East African Meets','KAF Opens'], schedule:'https://www.kenyaaquatics.org/events' },
    { slug:'westwood-pool', name:'Westwood Health Club Pool', county:'Nairobi', difficulty:'Easy', rating:4.4, best_time:'Year-round', description:'Nairobi\'s premier leisure pool complex — heated, well-maintained and a favourite training venue for top swimming clubs.', image:'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=600&q=80', highlights:['Heated Pool','Top Clubs','Leisure Complex'], schedule:'https://www.westwoodhealth.co.ke' },
    { slug:'karen-cc-pool', name:'Karen Country Club Pool', county:'Nairobi', difficulty:'Easy', rating:4.6, best_time:'Year-round', description:'Beautifully maintained outdoor pool in the lush Karen estate — cool highland temperatures make for perfect lap sessions.', image:'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&q=80', highlights:['Outdoor Pool','Karen Estate','Highland Cool'], schedule:'https://www.karencountryclub.org' },
    { slug:'peponi-school-pool', name:'Peponi School Aquatic Centre', county:'Kiambu', difficulty:'Easy', rating:4.5, best_time:'Year-round', description:'Elite school swimming facility producing Kenya\'s most decorated young swimmers — regular inter-school galas.', image:'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=600&q=80', highlights:['Elite School Pool','Inter-School Galas','Young Champions'], schedule:'https://www.kenyaaquatics.org/events' },
    { slug:'diani-reef-pool', name:'Diani Reef Beach Resort Pool', county:'Kwale', difficulty:'Easy', rating:4.7, best_time:'October – March', description:'Infinity pool overlooking the Indian Ocean — open-water swimming training on Kenya\'s most beautiful coastline.', image:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', highlights:['Infinity Pool','Ocean Views','Open Water Training'], schedule:'https://www.dianibeach.com' },
    { slug:'lake-victoria-swim', name:'Lake Victoria Open Water Swim, Kisumu', county:'Kisumu', difficulty:'Moderate', rating:4.6, best_time:'June – September', description:'Africa\'s largest lake hosts the annual Kisumu Open Water Classic — a bucket-list swim through freshwater history.', image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', highlights:['Africa\'s Largest Lake','Open Water Classic','Freshwater Swim'], schedule:'https://www.kenyaaquatics.org/events' },
    { slug:'watamu-marine-swim', name:'Watamu Open Water Swim', county:'Kilifi', difficulty:'Moderate', rating:4.8, best_time:'October – March', description:'Swim through the Watamu Marine National Park — crystal-clear waters with coral reefs and tropical fish as company.', image:'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80', highlights:['Marine Park Swim','Coral Reefs','Crystal Clear Water'], schedule:'https://www.watamu.com/events' },
    { slug:'nairobi-club-pool', name:'Nairobi Club Pool', county:'Nairobi', difficulty:'Easy', rating:4.4, best_time:'Year-round', description:'Historic colonial-era club with a full competition pool — site of Kenya\'s first ever organised swimming competitions in 1935.', image:'https://images.unsplash.com/photo-1593988649880-2e84b2e2cedd?w=600&q=80', highlights:['Historic 1935 Pool','Competition Pool','Colonial Heritage'], schedule:'https://www.nairobiclub.com' },
    { slug:'strathmore-pool', name:'Strathmore University Pool', county:'Nairobi', difficulty:'Easy', rating:4.3, best_time:'Year-round', description:'University-level competition pool hosting KUSA swimming championships and open-club training sessions.', image:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', highlights:['KUSA Swimming','University Pool','Open Training'], schedule:'https://www.kenyaaquatics.org/events' },
    { slug:'impala-club-pool', name:'Impala Club Pool', county:'Nairobi', difficulty:'Easy', rating:4.3, best_time:'Year-round', description:'Well-kept suburban pool popular with Nairobi\'s swimming clubs for early morning training and evening galas.', image:'https://images.unsplash.com/photo-1555817128-342b3d51c574?w=600&q=80', highlights:['Morning Training','Suburban Pool','Swimming Galas'], schedule:'https://www.kenyaaquatics.org/events' },
    { slug:'mombasa-sports-club-pool', name:'Mombasa Sports Club Pool', county:'Mombasa', difficulty:'Easy', rating:4.4, best_time:'Year-round', description:'Premier coastal swimming facility — well-maintained 25m pool with a thriving junior development programme.', image:'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=600&q=80', highlights:['Coastal Pool','Junior Programme','25m Lane Pool'], schedule:'https://www.kenyaaquatics.org/events' },
    { slug:'nakuru-sports-club-pool', name:'Nakuru Athletic Club Pool', county:'Nakuru', difficulty:'Easy', rating:4.2, best_time:'Year-round', description:'Rift Valley\'s primary training pool — the Nakuru AC Sharks consistently produce competitive regional swimmers.', image:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', highlights:['Rift Valley Pool','Nakuru Sharks','Regional Championships'], schedule:'https://www.kenyaaquatics.org/events' },
    { slug:'eldoret-swimming-pool', name:'Eldoret Sports Club Pool', county:'Uasin Gishu', difficulty:'Easy', rating:4.1, best_time:'Year-round', description:'High-altitude swimming — Eldoret\'s pool is a unique training advantage, with thin-air conditioning boosting swimmers\' lung capacity.', image:'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=600&q=80', highlights:['High Altitude','Lung Capacity Boost','Athletics City Pool'], schedule:'https://www.kenyaaquatics.org/events' },
    { slug:'kisumu-swimming-pool', name:'Kisumu Sports Club Pool', county:'Kisumu', difficulty:'Easy', rating:4.2, best_time:'Year-round', description:'Lakeside pool where the warm climate allows year-round training — home to Western Kenya\'s most promising young swimmers.', image:'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80', highlights:['Warm Climate','Year-round Training','Young Talent'], schedule:'https://www.kenyaaquatics.org/events' }
  ]
};

/* ══════════════════════════════════════════════════════
   SPORT META — intro copy + stats per sport
══════════════════════════════════════════════════════ */
const SPORT_META = {
  football: {
    label: '⚽ Football in Kenya',
    title: 'The Beautiful Game <em>Across Kenya</em>',
    desc:  'Kenya\'s football scene is vibrant and passionate — from Kasarani\'s 60,000-seat national stadium hosting AFCON qualifiers, to grassroots pitches in Kisumu and Mombasa producing world-class talent.',
    stats: [{ val:'15', lbl:'Stadiums & Venues' },{ val:'18', lbl:'KPL Clubs' },{ val:'60K+', lbl:'Max Capacity' }],
    grid:  'Football Stadiums & Venues'
  },
  golf: {
    label: '⛳ Golf in Kenya',
    title: 'Championship Courses <em>Under African Skies</em>',
    desc:  'Kenya boasts some of Africa\'s finest golf courses — from Muthaiga Golf Club (est. 1913) to Vipingo Ridge on the coast with Indian Ocean panoramas. Playing golf against a backdrop of wildlife is uniquely Kenyan.',
    stats: [{ val:'15', lbl:'Golf Courses' },{ val:'110+', lbl:'Years of Golf' },{ val:'4.9★', lbl:'Avg Rating' }],
    grid:  'Golf Courses & Clubs'
  },
  rally: {
    label: '🚗 Safari Rally in Kenya',
    title: 'The World\'s Most <em>Legendary Rally</em>',
    desc:  'The Safari Rally Kenya is a WRC round and the most iconic rally on earth. Drivers battle through red murram roads, dramatic Rift Valley stages, and unpredictable African weather.',
    stats: [{ val:'15', lbl:'Rally Stages' },{ val:'70+', lbl:'Years of History' },{ val:'WRC', lbl:'World Championship' }],
    grid:  'Safari Rally Stages & Venues'
  },
  basketball: {
    label: '🏀 Basketball in Kenya',
    title: 'Kenya\'s Rising <em>Basketball Nation</em>',
    desc:  'Kenya\'s basketball scene has exploded in recent years. The KBF league features fierce rivalries and world-class facilities in Nairobi have helped Kenyan players earn NBA G-League contracts.',
    stats: [{ val:'15', lbl:'Arenas & Courts' },{ val:'KBF', lbl:'National League' },{ val:'4.7★', lbl:'Avg Rating' }],
    grid:  'Basketball Arenas & Courts'
  },
  swimming: {
    label: '🏊 Swimming in Kenya',
    title: 'Olympic Pools & <em>Coastal Waters</em>',
    desc:  'From Olympic-standard pools in Nairobi to open-water swimming in the Indian Ocean and freshwater Lake Victoria — Kenya offers world-class aquatic experiences for every level.',
    stats: [{ val:'15', lbl:'Pools & Venues' },{ val:'50m', lbl:'Olympic Pools' },{ val:'4.8★', lbl:'Avg Rating' }],
    grid:  'Swimming Pools & Aquatic Venues'
  }
};

/* ══════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════ */
let currentSport = 'football';

/* ══════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  });

  const param = new URLSearchParams(window.location.search).get('sport') ||
                new URLSearchParams(window.location.search).get('type') || 'football';
  const valid = Object.keys(SPORT_META);
  currentSport = valid.includes(param) ? param : 'football';

  const activeTab = document.querySelector(`.sport-tab[data-sport="${currentSport}"]`);
  if (activeTab) activeTab.classList.add('active');

  loadSport(currentSport);
});

/* ══════════════════════════════════════════════════════
   SWITCH SPORT
══════════════════════════════════════════════════════ */
window.switchSport = function(sport, btn) {
  if (sport === currentSport) return;
  currentSport = sport;
  document.querySelectorAll('.sport-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  history.replaceState(null, '', `?sport=${sport}`);
  loadSport(sport);
};

/* ══════════════════════════════════════════════════════
   LOAD — try Supabase first, fall back to static data
══════════════════════════════════════════════════════ */
async function loadSport(sport) {
  updateIntro(sport);
  showSkeletons();

  let destinations = [];

  /* Try Supabase */
  try {
    if (typeof getSportsDestinations === 'function') {
      const supabaseData = await getSportsDestinations(sport);
      if (supabaseData && supabaseData.length > 0) {
        destinations = supabaseData;
      }
    }
  } catch (err) {
    console.warn('Supabase unavailable, using static data:', err);
  }

  /* Fall back to static */
  if (!destinations.length) {
    destinations = STATIC_SPORTS[sport] || [];
  }

  const cntEl = document.getElementById(`cnt-${sport}`);
  if (cntEl) cntEl.textContent = destinations.length;
  document.getElementById('gridCount').textContent =
    `${destinations.length} destination${destinations.length !== 1 ? 's' : ''}`;

  renderGrid(destinations);
}

/* ══════════════════════════════════════════════════════
   UPDATE INTRO
══════════════════════════════════════════════════════ */
function updateIntro(sport) {
  const m = SPORT_META[sport];
  document.getElementById('introLabel').textContent = m.label;
  document.getElementById('introTitle').innerHTML   = m.title;
  document.getElementById('introDesc').textContent  = m.desc;
  document.getElementById('panelStats').innerHTML   = m.stats.map(s =>
    `<div class="stat-box"><strong>${s.val}</strong><span>${s.lbl}</span></div>`
  ).join('');
  document.getElementById('gridTitle').textContent  = m.grid;
}

/* ══════════════════════════════════════════════════════
   RENDER GRID
══════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════
   BUILD CARD
══════════════════════════════════════════════════════ */
function buildCard(d) {
  const diff     = (d.difficulty || 'Easy').toLowerCase();
  const fallback = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80';
  const img      = d.image_hero || d.image || fallback;
  const tags     = Array.isArray(d.highlights) ? d.highlights.slice(0,3) : [];
  const schedURL = d.schedule || '#';
  const county   = d.county || '';
  const bestTime = d.best_time || 'Year-round';

  return `
    <div class="dest-card" onclick="window.location.href='attraction-details.html?id=${d.slug}'">
      <div class="dest-img-wrap">
        <img src="${img}" alt="${d.name}" loading="lazy" onerror="this.src='${fallback}'"/>
        <span class="difficulty-badge diff-${diff}">${d.difficulty || 'Easy'}</span>
        <span class="rating-badge">⭐ ${d.rating}</span>
        ${d.featured ? '<span class="featured-badge">⭐ Featured</span>' : ''}
      </div>
      <div class="dest-body">
        <div class="dest-name">${d.name}</div>
        <div class="dest-desc">${d.description}</div>
        <div class="dest-meta">
          ${county ? `<div class="dest-meta-item">📍 ${county} County</div>` : ''}
          <div class="dest-meta-item">🕐 Best: ${bestTime}</div>
        </div>
        <div class="dest-tags">
          ${tags.map(h => `<span class="tag">${h}</span>`).join('')}
        </div>
        <div class="dest-footer">
          <a href="attraction-details.html?id=${d.slug}" class="explore-link" onclick="event.stopPropagation()">⚡ Explore →</a>
          <a href="${schedURL}" class="schedule-btn" target="_blank" rel="noopener" onclick="event.stopPropagation()">📅 Schedule</a>
        </div>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════
   SKELETONS
══════════════════════════════════════════════════════ */
function showSkeletons() {
  document.getElementById('sportsGrid').innerHTML = Array(9).fill(`
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>`).join('');
}
