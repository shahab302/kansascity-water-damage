/* Kansas City MO Water Damage — SSG build (no JS in shipped site).
   4 physical locations · 50 zip-code service areas · 6 service pages.
   Run: node build-pages.js */
const fs = require('fs');
const path = require('path');
const SRC = __dirname;
const out = path.join(__dirname, 'dist');
try { fs.rmSync(out, {recursive:true, force:true}); } catch(e) {}
fs.mkdirSync(out, {recursive:true});
fs.cpSync(path.join(SRC,'assets'), path.join(out,'assets'), {recursive:true, force:true});

// ---- drip schedule ----
const LAUNCH = process.env.LAUNCH_DATE || '2026-09-09';
const TODAY  = process.env.BUILD_DATE  || new Date().toISOString().slice(0,10);
function addDays(iso,n){ const d=new Date(iso+'T00:00:00Z'); d.setUTCDate(d.getUTCDate()+n); return d.toISOString().slice(0,10); }

const DOMAIN = 'kansascitymowaterdamage.com';
const PHONE_DISPLAY = '(816) 934-3188';
const PHONE_TEL = '+18169343188';
const BIZ_NAME = 'Kansas City MO Water Damage Restoration';

// ---- 4 physical locations ----
const LOCATIONS = [
  {
    id:'central', name:'Central Kansas City',
    addr:'Crown Center Area, Kansas City, MO 64108',
    short:'Central KC (64108)',
    mapEmbed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49562.28!2d-94.60!3d39.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0f05a0e89cf67%3A0x1d9f2b0c02ad5b3f!2sCrown%20Center%2C%20Kansas%20City%2C%20MO!5e0!3m2!1sen!2sus!4v1',
    gbp:'https://maps.app.goo.gl/PLACEHOLDER_CENTRAL',
    zips:['64101','64102','64105','64106','64108','64109','64110','64111','64112'],
    primary:true,
  },
  {
    id:'north', name:'North Kansas City / Gladstone',
    addr:'N Oak Trafficway & Vivion Rd Area, Kansas City, MO 64118',
    short:'North KC (64118)',
    mapEmbed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49500.0!2d-94.57!3d39.20!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c08e69e1d3c00d%3A0x2e3e2e2e2e2e2e2e!2sGladstone%2C%20MO!5e0!3m2!1sen!2sus!4v1',
    gbp:'https://maps.app.goo.gl/PLACEHOLDER_NORTH',
    zips:['64116','64117','64118','64119','64151','64152','64153','64154','64155','64156','64157','64158','64161','64163','64164','64165','64166','64167'],
  },
  {
    id:'south', name:'South Kansas City / Hickman Mills',
    addr:'Hillcrest Rd & Bannister Rd Area, Kansas City, MO 64134',
    short:'South KC (64134)',
    mapEmbed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49600.0!2d-94.52!3d38.93!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0e9f5e5e5e5e5%3A0x1a1a1a1a1a1a1a1a!2sHickman%20Mills%2C%20Kansas%20City%2C%20MO!5e0!3m2!1sen!2sus!4v1',
    gbp:'https://maps.app.goo.gl/PLACEHOLDER_SOUTH',
    zips:['64114','64131','64132','64134','64137','64138','64139','64145','64146','64147'],
  },
  {
    id:'east', name:'East Kansas City / Blue Ridge',
    addr:'Blue Ridge Blvd & 40 Hwy Area, Kansas City, MO 64133',
    short:'East KC (64133)',
    mapEmbed:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49550.0!2d-94.45!3d39.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0e0e0e0e0e0e0%3A0x2b2b2b2b2b2b2b2b!2sBlue%20Ridge%2C%20Kansas%20City%2C%20MO!5e0!3m2!1sen!2sus!4v1',
    gbp:'https://maps.app.goo.gl/PLACEHOLDER_EAST',
    zips:['64120','64123','64124','64125','64126','64127','64128','64129','64130','64133','64136','64149'],
  },
];
const primaryLoc = LOCATIONS.find(l=>l.primary);
const GBP = primaryLoc.gbp;
const MAP = primaryLoc.mapEmbed;

// ---------- icons ----------
const I = {
  phone:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 1 21h22L12 2zm0 6 6.5 11h-13L12 8zm-1 3v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>',
  drop:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.4 4 2.3-1 1.7-5-2.9V6h2v6.4z"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h9l5 5v15H6V2zm8 1.5V8h4.5L14 3.5z"/></svg>',
  people:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.7 0-8 1.3-8 4v3h8v-3c0-1 .4-1.9 1-2.6-.3 0-.7-.4-1-.4zm8 0c-.4 0-.9.1-1.4.2C15.9 14.2 16 15 16 16v3h8v-3c0-2.7-5.3-4-8-4z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.5 7 .6-5.3 4.6L18.3 21 12 17.3 5.7 21l1.6-7.3L2 9.1l7-.6L12 2z"/></svg>',
  tools:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8l-2-2-4 4-2-2 4-4-2-2a6 6 0 0 0-8 7l-6 6 3 3 6-6a6 6 0 0 0 7-8z"/></svg>',
  facebook:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  xtweet:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  linkedin:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>',
  envelope:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
};

// ---------- 50 zip-code service areas ----------
const AREAS = [
  // Central KC
  {n:'Downtown',z:'64101',area:'Downtown / River Market',d:'Emergency Water Extraction',zone:'central',feat:'the Missouri River waterfront',lm:'River Market, City Hall, Power & Light District, Berkley Riverfront',housing:'a mix of converted loft condos, historic brick buildings, and newer high-rise apartments'},
  {n:'Quality Hill',z:'64102',area:'Downtown / Quality Hill',d:'Burst Pipe Water Damage Repair',zone:'central',feat:'the West Bottoms and Penn Valley area',lm:'Penn Valley Park, Liberty Memorial, the West Bottoms entertainment district',housing:'historic brownstones, early 1900s apartment buildings, and renovated row homes with aging copper and galvanized plumbing'},
  {n:'City Market',z:'64105',area:'Downtown / City Market',d:'Flooded Basement Cleanup',zone:'central',feat:'the City Market and Missouri River area',lm:'Kansas City City Market, Steamboat Arabia Museum, the River Market neighborhood',housing:'converted warehouse lofts and older multi-family buildings, many with below-grade units near the Missouri River floodplain'},
  {n:'Columbus Park',z:'64106',area:'Columbus Park / Northeast',d:'Storm &amp; Flood Damage Restoration',zone:'central',feat:'the Missouri River and Independence Ave corridor',lm:'Columbus Park, Independence Avenue, the Northeast Arts District',housing:'post-war bungalows and older single-family homes, many built on sloped terrain that channels storm runoff toward foundations'},
  {n:'Midtown',z:'64108',area:'Midtown / Crown Center',d:'Emergency Water Extraction',zone:'central',feat:'the Hospital Hill and Crown Center area',lm:'Crown Center, Union Station, Hospital Hill medical campus, the Crossroads Arts District',housing:'a wide range from early 1900s Craftsmans to mid-century apartments, with Truman Medical Center and the Hallmark headquarters anchoring the area'},
  {n:'Westport',z:'64109',area:'Westport / Hyde Park',d:'Mold Remediation',zone:'central',feat:'Brush Creek and the Westport corridor',lm:'Westport entertainment district, Loose Park, Hyde Park neighborhood',housing:'1920s–1940s bungalows and Tudor-style homes near Brush Creek, where flooding history has left many properties with hidden moisture behind plaster walls'},
  {n:'Brookside North',z:'64110',area:'Rockhill / UMKC / Brookside North',d:'Ceiling Water Damage Repair',zone:'central',feat:'Brush Creek and the UMKC campus area',lm:'UMKC campus, Nelson-Atkins Museum of Art, the Brookside shops',housing:'1920s–1950s homes, many with original plaster ceilings and aging roof structures that make upstairs leaks and ceiling damage a recurring issue'},
  {n:'Valentine',z:'64111',area:'Westport / Valentine / Roanoke',d:'Burst Pipe Water Damage Repair',zone:'central',feat:'the Roanoke neighborhood and Westport area',lm:'Roanoke Park, the Valentine neighborhood, Mill Creek Park',housing:'century-old homes with original cast-iron and galvanized plumbing that is highly susceptible to bursting in Kansas City winters'},
  {n:'Country Club Plaza',z:'64112',area:'Country Club Plaza / Brookside',d:'Flooded Basement Cleanup',zone:'central',feat:'Brush Creek and the Country Club Plaza',lm:'Country Club Plaza, Brush Creek, the Brookside neighborhood, Ward Parkway',housing:'upscale homes from the 1920s–1960s along Brush Creek, where major flood events in 1977 and 1998 demonstrated the area vulnerability to rapid basement flooding'},
  // South KC
  {n:'Waldo',z:'64113',area:'Waldo / Ward Parkway',d:'Mold Remediation',zone:'south',feat:'the Ward Parkway corridor and Indian Creek',lm:'Waldo commercial district, Ward Parkway Shopping Center, Indian Creek Trail',housing:'post-war ranch homes and Cape Cods with finished basements, where Indian Creek proximity creates persistent moisture issues and hidden mold behind drywall'},
  {n:'Leawood Acres',z:'64114',area:'Leawood Acres / Hickman Mills North',d:'Storm &amp; Flood Damage Restoration',zone:'south',feat:'the Indian Creek and Blue River watershed',lm:'Indian Creek Greenway, Blue River, Leawood Acres neighborhood',housing:'1960s–1980s split-levels and ranch homes in the Indian Creek and Blue River watershed, exposed to flash flooding from severe Midwest thunderstorms'},
  {n:'Gregory Ridge',z:'64131',area:'Raytown West / Gregory Ridge',d:'Flooded Basement Cleanup',zone:'south',feat:'the Blue River area',lm:'Blue River, Raytown city limits, Gregory Boulevard corridor',housing:'1950s–1970s ranch homes and bi-levels near the Blue River, where heavy rain drives groundwater into older basements through cracked foundations'},
  {n:'Ruskin Heights',z:'64132',area:'Ruskin Heights / South Blue Ridge',d:'Storm &amp; Flood Damage Restoration',zone:'south',feat:'the Blue River and Little Blue River area',lm:'Ruskin Heights neighborhood, Blue Ridge Boulevard, Little Blue River',housing:'post-war subdivision homes rebuilt after the devastating 1957 Ruskin Heights tornado, sitting between two flood-prone rivers'},
  {n:'Hickman Mills',z:'64134',area:'Hickman Mills / Grandview North',d:'Flooded Basement Cleanup',zone:'south',feat:'the Little Blue River and Longview Lake area',lm:'Longview Lake, Hickman Mills neighborhood, Center High School area',housing:'1960s–1980s ranch and split-level homes near the Little Blue River, where aging sump pumps and clay soil create repeat basement flooding'},
  {n:'Longview',z:'64137',area:'Longview / Grandview Terrace',d:'Sewage Backup Cleanup',zone:'south',feat:'the Longview Lake and Little Blue River area',lm:'Longview Lake, Longview Community College area, View High Drive',housing:'suburban homes from the 1970s–1990s served by aging sewer infrastructure that backs up during heavy rain events'},
  {n:'Raytown South',z:'64138',area:'Raytown South / Bannister',d:'Mold Remediation',zone:'south',feat:'the Bannister area and Blue River watershed',lm:'Bannister Mall area, Raytown city limits, Blue River industrial corridor',housing:'1960s–1980s homes near the Blue River watershed, where recurring moisture from poor drainage fuels persistent mold growth in finished basements'},
  {n:'Lake City',z:'64139',area:'Lake City / Richards-Gebaur',d:'Storm &amp; Flood Damage Restoration',zone:'south',feat:'the former Richards-Gebaur area and surrounding creeks',lm:'former Richards-Gebaur Air Force Base, Lake City Army Ammunition Plant area',housing:'spread-out suburban homes and rural properties exposed to open-terrain wind and hail damage from Midwest supercell storms'},
  {n:'Holmes Park',z:'64145',area:'Holmes Park / South KC',d:'Burst Pipe Water Damage Repair',zone:'south',feat:'the Indian Creek watershed',lm:'Holmes Park, Indian Creek, Red Bridge Shopping area',housing:'1950s–1970s homes with original copper and galvanized plumbing prone to winter pipe bursts, especially in uninsulated crawl spaces'},
  {n:'Martin City',z:'64146',area:'Martin City / South KC',d:'Flooded Basement Cleanup',zone:'south',feat:'the Blue River and Indian Creek confluence area',lm:'Martin City neighborhood, Blue River confluence, Line Creek Trail',housing:'homes near where Blue River meets Indian Creek — a flood-prone confluence that sends water into basements during major rain events'},
  {n:'South Kansas City',z:'64147',area:'Belton North / South KC',d:'Storm &amp; Flood Damage Restoration',zone:'south',feat:'the South KC corridor near Belton',lm:'South KC border, Belton corridor, I-49 gateway',housing:'suburban ranch homes and newer developments on the metro edge, where storm damage from wind-driven rain and hail is the most common water emergency'},
  // East KC
  {n:'Sheffield',z:'64120',area:'Sheffield / Industrial',d:'Emergency Water Extraction',zone:'east',feat:'the Missouri River industrial corridor',lm:'Sheffield industrial district, Missouri River levees, Fairfax Industrial District',housing:'mixed industrial and residential properties along the Missouri River corridor, where levee overtopping and industrial water events require fast extraction'},
  {n:'Independence Ave East',z:'64123',area:'Independence Ave East / Lykins',d:'Burst Pipe Water Damage Repair',zone:'east',feat:'the Independence Ave corridor and Kensington area',lm:'Independence Avenue, Kensington neighborhood, Lykins Square Park',housing:'turn-of-the-century homes with some of the oldest plumbing in the metro — cast iron and lead pipes that burst under pressure or freeze quickly'},
  {n:'Northeast KC',z:'64124',area:'Independence Ave / Northeast KC',d:'Flooded Basement Cleanup',zone:'east',feat:'the Missouri River and Independence Ave area',lm:'Independence Ave business corridor, Pendleton Heights, Sheffield neighborhood edge',housing:'pre-war homes built on slopes above the Missouri River, where storm runoff pools in basements and crawl spaces during heavy rain'},
  {n:'Eastwood Hills',z:'64125',area:'Sheffield / Eastwood Hills',d:'Storm &amp; Flood Damage Restoration',zone:'east',feat:'the Blue River and Missouri River confluence',lm:'Blue River and Missouri River confluence, Eastwood Hills neighborhood',housing:'homes near the most flood-active river junction in the metro, where the 1977 and 1993 floods caused catastrophic property damage'},
  {n:'Leeds',z:'64126',area:'Blue River / Leeds',d:'Flooded Basement Cleanup',zone:'east',feat:'the Blue River corridor',lm:'Leeds neighborhood, Blue River Road, Swope Park east edge',housing:'homes along the Blue River corridor, which is one of the most flood-prone waterways in the Kansas City metro according to FEMA flood maps'},
  {n:'Prospect',z:'64127',area:'Prospect / Indiana / Ivanhoe',d:'Emergency Water Extraction',zone:'east',feat:'the Prospect Ave corridor and Paseo area',lm:'Prospect Avenue, The Paseo, Ivanhoe neighborhood, Research Medical Center',housing:'early 1900s homes with aging plumbing and flat-roof multifamily buildings where roof leaks and burst pipes cause rapid water intrusion'},
  {n:'Blue Hills',z:'64128',area:'Blue Hills / South Prospect',d:'Mold Remediation',zone:'east',feat:'the Blue Hills and Swope Park area',lm:'Blue Hills neighborhood, Swope Park edge, 63rd Street corridor',housing:'1930s–1950s homes near Swope Park, where tree canopy shade and poor ventilation create high-humidity conditions that drive mold in basements and crawl spaces'},
  {n:'Swope Park',z:'64129',area:'Swope Park / Marlborough Heights',d:'Storm &amp; Flood Damage Restoration',zone:'east',feat:'Swope Park and the Blue River',lm:'Swope Park, Kansas City Zoo, Starlight Theatre, Blue River',housing:'homes near the 1,805-acre Swope Park and the Blue River, exposed to severe storm damage from the open terrain and river flooding'},
  {n:'Key Coalition',z:'64130',area:'Swope Parkway / Key Coalition',d:'Ceiling Water Damage Repair',zone:'east',feat:'the Swope Parkway and Paseo corridor',lm:'Swope Parkway, The Paseo boulevard, Research Hospital area',housing:'1920s–1940s homes with aging flat and low-pitch roofs, where ice dams and roof deterioration cause leaks that appear as ceiling stains and sagging drywall'},
  {n:'Blue Ridge',z:'64133',area:'Englewood / Blue Ridge',d:'Flooded Basement Cleanup',zone:'east',feat:'the Blue Ridge area and Little Blue River',lm:'Blue Ridge Boulevard, Blue Ridge Mall area, Little Blue River',housing:'1960s–1980s suburban homes near the Little Blue River, where sump pump failures and groundwater seepage cause recurring basement floods'},
  {n:'Fairmount',z:'64136',area:'Fairmount / Little Blue',d:'Storm &amp; Flood Damage Restoration',zone:'east',feat:'the Little Blue River area',lm:'Fairmount neighborhood, Little Blue River, Fairmount Park',housing:'suburban homes in the Little Blue River floodplain, where severe storms send flash floods through the watershed fast'},
  {n:'Tiffany Springs',z:'64149',area:'Tiffany Springs / KCI Area',d:'Structural Drying &amp; Dehumidification',zone:'east',feat:'the Tiffany Springs and Platte Purchase area',lm:'Tiffany Springs Parkway, KCI Expo Center area, Zona Rosa nearby',housing:'newer 1990s–2000s construction with modern materials that still trap moisture behind vapor barriers, requiring professional monitoring and structural drying'},
  // North KC
  {n:'North Kansas City',z:'64116',area:'North Kansas City / Harlem',d:'Flooded Basement Cleanup',zone:'north',feat:'the Missouri River north bank',lm:'North Kansas City downtown, Macken Park, Harlem neighborhood, NKC Hospital',housing:'early-to-mid 1900s homes just north of the Missouri River, where river-level groundwater seeps into basements during high-water events'},
  {n:'Claycomo',z:'64117',area:'Claycomo / Randolph',d:'Storm &amp; Flood Damage Restoration',zone:'north',feat:'the Missouri River and Fishing River area',lm:'Ford Claycomo Assembly Plant, Claycomo downtown, Missouri River bluffs',housing:'post-war working-class homes near the Ford plant, exposed to Missouri River bluff runoff and severe Northland storm damage'},
  {n:'Gladstone',z:'64118',area:'Gladstone / Pleasant Valley',d:'Flooded Basement Cleanup',zone:'north',feat:'the Shoal Creek and Happy Rock Park area',lm:'Happy Rock Park, Oak Grove Park, Gladstone Community Center, Antioch Mall area',housing:'1960s–1980s ranch homes and split-levels with finished basements, where Shoal Creek flooding and clay soil combine to create chronic basement water intrusion'},
  {n:'Liberty West',z:'64119',area:'Liberty West / Nashua',d:'Mold Remediation',zone:'north',feat:'the Liberty area and Rush Creek',lm:'Liberty downtown square, William Jewell College area, Rush Creek',housing:'a mix of historic Liberty homes and newer developments, where Rush Creek moisture and poorly ventilated crawl spaces drive hidden mold growth'},
  {n:'Platte Woods',z:'64151',area:'Platte Woods / Weatherby Lake',d:'Storm &amp; Flood Damage Restoration',zone:'north',feat:'Weatherby Lake and the Platte River area',lm:'Weatherby Lake, Platte Woods village, Tiffany Springs area',housing:'lakefront and wooded-lot homes near Weatherby Lake, exposed to high winds and storm-driven rain through mature tree canopy'},
  {n:'Riverside West',z:'64152',area:'Platte City South / Riverside West',d:'Flooded Basement Cleanup',zone:'north',feat:'the Platte River and Missouri River area',lm:'Riverside Red X, Platte Landing Park, Argosy Casino area',housing:'homes between the Platte and Missouri Rivers — two major flood sources that threaten basements during high-water events'},
  {n:'KCI Airport',z:'64153',area:'KCI Airport / Tiffany Springs',d:'Emergency Water Extraction',zone:'north',feat:'the KCI Airport area and Platte Purchase',lm:'Kansas City International Airport (KCI), KCI Expo Center, Platte Purchase area',housing:'commercial properties and newer residential near the airport, where large flat-roof buildings and fast development create unique water intrusion risks'},
  {n:'Zona Rosa',z:'64154',area:'Shoal Creek / Zona Rosa North',d:'Burst Pipe Water Damage Repair',zone:'north',feat:'the Shoal Creek watershed',lm:'Zona Rosa shopping district, Shoal Creek Living History Museum, I-29 corridor',housing:'newer 2000s–2010s subdivision homes with PEX and CPVC plumbing that, while modern, can still burst at connection fittings during deep freezes'},
  {n:'Shoal Creek',z:'64155',area:'Liberty South / Shoal Creek',d:'Flooded Basement Cleanup',zone:'north',feat:'the Shoal Creek and Liberty corridor',lm:'Shoal Creek Parkway, Shoal Creek golf course, Liberty South corridor',housing:'newer suburban developments along Shoal Creek, where rapid watershed runoff during storms overwhelms French drains and sump systems'},
  {n:'Liberty North',z:'64156',area:'Liberty West / Kearney South',d:'Storm &amp; Flood Damage Restoration',zone:'north',feat:'the northern Liberty and Kearney area',lm:'Liberty North High School area, I-35 corridor, Kearney gateway',housing:'growing suburban communities on the metro edge, where new construction sits in open terrain vulnerable to severe Midwest storms and tornado-path winds'},
  {n:'Clayview',z:'64157',area:'Liberty East / Clayview',d:'Mold Remediation',zone:'north',feat:'the eastern Liberty area and Clayview',lm:'Clayview neighborhood, Liberty East corridor, Hwy 291 area',housing:'1980s–2000s homes in a humid, wooded area where poor air circulation and crawl space moisture drive persistent mold problems'},
  {n:'Pleasant Valley',z:'64158',area:'Liberty North / Pleasant Valley North',d:'Ceiling Water Damage Repair',zone:'north',feat:'the Pleasant Valley and Shoal Creek area',lm:'Pleasant Valley city, Shoal Creek corridor, Liberty Hospital area',housing:'1970s–1990s homes where aging roof materials and ice dam buildup cause leaks that damage ceilings and upper-floor walls'},
  {n:'Sugar Creek',z:'64161',area:'Sugar Creek / Courtney',d:'Flooded Basement Cleanup',zone:'north',feat:'the Missouri River and Sugar Creek area',lm:'Sugar Creek city, Courtney-Atherton area, Missouri River bottoms',housing:'older homes in the Missouri River bottomlands, where flooding risk is among the highest in the metro and basements are chronically vulnerable'},
  {n:'Platte City',z:'64163',area:'Platte City / KCI West',d:'Storm &amp; Flood Damage Restoration',zone:'north',feat:'the Platte River and KCI industrial area',lm:'Platte City downtown, Platte River, KCI industrial corridor',housing:'small-town homes and rural properties near the Platte River floodplain, where storm damage and river flooding are the primary water emergencies'},
  {n:'KCI Industrial',z:'64164',area:'Platte City East / KCI Industrial',d:'Emergency Water Extraction',zone:'north',feat:'the KCI logistics corridor',lm:'KCI Industrial Park, Platte County logistics hub, I-29 corridor',housing:'large commercial and industrial buildings where roof area and flat-roof design concentrate rainwater, making fast extraction critical'},
  {n:'North Platte',z:'64165',area:'North Platte / Dearborn South',d:'Storm &amp; Flood Damage Restoration',zone:'north',feat:'the Platte River valley',lm:'Platte River valley, Dearborn area, rural Platte County',housing:'rural and semi-rural properties in the Platte River valley, where storm damage and river flooding hit hard and response times from the city are longer'},
  {n:'Ridgely',z:'64166',area:'Platte North / Ridgely',d:'Mold Remediation',zone:'north',feat:'the northern Platte County area',lm:'Ridgely community, northern Platte County, Iatan area',housing:'rural homes in the northernmost part of our service area, where high humidity, poor ventilation, and long periods between inspections allow mold to spread undetected'},
  {n:'Kearney South',z:'64167',area:'Kearney South / Holt',d:'Storm &amp; Flood Damage Restoration',zone:'north',feat:'the southern Kearney and Holt area',lm:'Kearney south gateway, Holt community, Jesse James Farm area',housing:'growing suburban and rural properties on the metro edge, where severe weather passes through open terrain with minimal windbreak'},
];

function kebab(s){ return s.toLowerCase().replace(/&amp;/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
const imgPool=['hero-flood.jpg','water-damage-room.jpg','ceiling-damage.jpg','pipe-leak.jpg','storm-house.jpg','flooded-basement.jpg','mold.jpg','storm-damage.jpg','sewage-cleanup.jpg','mold-2.jpg','technician.jpg','fire-damage.jpg'];

const towns = AREAS.map((a,i)=>({
  name:a.n, slug:kebab(a.n)+'-mo-'+a.z, zip:a.z, area:a.area,
  zone:a.zone, feat:a.feat, demand:a.d,
  lm:a.lm||'', housing:a.housing||'',
  img:imgPool[i%imgPool.length],
  loc: LOCATIONS.find(l=>l.id===a.zone),
}));

// nearby: rotate within same zone first
const byZone={};
towns.forEach(t=>{(byZone[t.zone]=byZone[t.zone]||[]).push(t);});
towns.forEach((t,idx)=>{
  const grp=byZone[t.zone]; const j=grp.findIndex(x=>x.slug===t.slug); const near=[];
  for(let k=1;k<grp.length && near.length<4;k++) near.push(grp[(j+k)%grp.length]);
  for(let k=1;k<towns.length && near.length<4;k++){ const c=towns[(idx+k)%towns.length]; if(c.slug!==t.slug && c.zone!==t.zone && !near.includes(c)) near.push(c); }
  t.nearby=near.map(x=>x.slug);
});
const townBySlug = Object.fromEntries(towns.map(t=>[t.slug,t]));
function townUrl(t){ return '/water-damage-restoration-'+t.slug; }

// Drip schedule: launch batch = 4 zone anchors + a few key areas, rest drip every 2 days
const LAUNCH_BATCH = new Set([
  'downtown-mo-64101','midtown-mo-64108','gladstone-mo-64118',
  'hickman-mills-mo-64134','blue-ridge-mo-64133',
  'country-club-plaza-mo-64112','north-kansas-city-mo-64116',
  'westport-mo-64109','waldo-mo-64113','prospect-mo-64127',
]);
let _di = -1;
towns.forEach(t=>{ if(LAUNCH_BATCH.has(t.slug)){ t.pub=LAUNCH; } else { _di+=1; t.pub=addDays(LAUNCH,_di); } t.live = t.pub<=TODAY; });
const liveTowns = towns.filter(t=>t.live);

// ---------- services data ----------
const SVC = {
  water:{slug:'water-damage-restoration',label:'Water Damage Restoration',short:'water damage'},
  mold:{slug:'mold-remediation',label:'Mold Remediation',short:'mold'},
  basement:{slug:'flooded-basement-cleanup',label:'Flooded Basement Cleanup',short:'basement flooding'},
  storm:{slug:'storm-damage-restoration',label:'Storm &amp; Flood Damage',short:'storm damage'},
  sewage:{slug:'sewage-cleanup',label:'Sewage &amp; Biohazard Cleanup',short:'sewage cleanup'},
  fire:{slug:'fire-smoke-damage',label:'Fire &amp; Smoke Damage',short:'fire &amp; smoke damage'},
};
const svcCardData = [
  {s:SVC.water,i:I.drop,d:'Emergency water extraction, structural drying, and moisture control after leaks, burst pipes, and appliance failures.'},
  {s:SVC.basement,i:I.drop,d:'Water pump-outs, sump pump failures, and groundwater flooding cleaned up and dried fast.'},
  {s:SVC.mold,i:I.drop,d:'Containment, safe removal, and treatment of mold from hidden moisture and water damage.'},
  {s:SVC.storm,i:I.alert,d:'Fast response to roof leaks, wind-driven rain, and flooding from severe Kansas City storms.'},
  {s:SVC.sewage,i:I.alert,d:'Safe cleanup and full sanitization of sewage backups and contaminated (Category 3) water.'},
  {s:SVC.fire,i:I.alert,d:'Water and soot cleanup after fires, smoke odor removal, and complete property restoration.'},
];
function serviceCards(){
  return `<div class="grid grid-3">${svcCardData.map(c=>`<a class="card" href="/${c.s.slug}"><span class="ico">${c.i}</span><h3>${c.s.label}</h3><p>${c.d}</p><span class="more">Learn more →</span></a>`).join('')}</div>`;
}

// ---------- shared chrome ----------
const topbar = `<div class="topbar">🚨 24/7 Emergency Water Damage Response — Call now: <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></div>`;

function renderHeader(){
  const svc = svcCardData.map(c=>`<a href="/${c.s.slug}">${c.s.label}<small>${c.d.split(/[.,]/)[0]}.</small></a>`).join('');
  const buckets={Central:[],North:[],South:[],East:[]};
  liveTowns.forEach(t=>{
    const b=t.zone==='central'?'Central':t.zone==='north'?'North':t.zone==='south'?'South':'East';
    buckets[b].push(t);
  });
  const locCols=['Central','North','South','East'].filter(b=>buckets[b].length).map(b=>{
    const items=buckets[b].slice(0,8).map(t=>`<a href="${townUrl(t)}">${t.name} (${t.zip})</a>`).join('');
    const more=buckets[b].length>8?`<a href="/service-areas">+ ${buckets[b].length-8} more →</a>`:'';
    return `<div class="mega-col"><h5>${b} KC</h5>${items}${more}</div>`;
  }).join('');
  return `<header class="site-header"><div class="header-inner">
    <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">${I.drop}</span><span class="brand-text"><b>KC Water Damage</b><span>Restoration Services</span></span></a>
    <input type="checkbox" id="nav-toggle" class="nav-toggle">
    <label for="nav-toggle" class="nav-toggle-label" aria-label="Toggle menu"><span></span><span></span><span></span></label>
    <nav class="nav">
      <a href="/">Home</a>
      <div class="has-mega"><a class="megabtn" href="/services" tabindex="0">Services</a>
        <div class="mega mega-services">
          <div class="mega-head">Water Damage &amp; Restoration Services</div>
          <div class="mega-cols">${svc}</div>
          <div class="mega-foot"><a class="m-all" href="/services">View all services →</a><a class="m-cta" href="tel:${PHONE_TEL}">${I.phone} ${PHONE_DISPLAY}</a></div>
        </div>
      </div>
      <div class="has-mega"><a class="megabtn" href="/service-areas" tabindex="0">Locations</a>
        <div class="mega mega-locations">
          <div class="mega-head">Our 4 Kansas City Locations</div>
          <div class="mega-cols mega-loc-addrs">${LOCATIONS.map(l=>`<div class="mega-loc-card"><h5><a href="/locations">${l.name}</a></h5><small>${l.addr}</small><br><a href="tel:${PHONE_TEL}" style="font-weight:700">${PHONE_DISPLAY}</a></div>`).join('')}</div>
          <div class="mega-head" style="margin-top:14px;font-size:.95rem">Service Areas by Zone</div>
          <div class="mega-cols two">${locCols}</div>
          <div class="mega-foot"><a class="m-all" href="/service-areas">View all ${liveTowns.length} service areas →</a><a class="m-all" href="/locations">Our locations →</a><a class="m-cta" href="tel:${PHONE_TEL}">${I.phone} ${PHONE_DISPLAY}</a></div>
        </div>
      </div>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
    <a class="header-cta" href="tel:${PHONE_TEL}">${I.phone}<span class="cta-text">${PHONE_DISPLAY}</span></a>
  </div></header>`;
}

const popup = `
<input type="checkbox" id="promo" class="promo-toggle">
<label for="promo" class="promo-open">${I.alert} Get Emergency Help</label>
<div class="promo-overlay">
  <label for="promo" class="promo-scrim" aria-label="Close popup"></label>
  <div class="promo-card">
    <label for="promo" class="promo-close" aria-label="Close">&times;</label>
    <span class="promo-badge">24/7 Emergency Response</span>
    <h3>Water Damage? Get Help Now</h3>
    <p>Speak to a real person and get a crew dispatched fast across Kansas City, MO.</p>
    <a class="btn btn-call" href="tel:${PHONE_TEL}">${I.phone} Call ${PHONE_DISPLAY}</a>
    <small>No-obligation phone assessment · Direct insurance billing</small>
  </div>
</div>`;

function renderFooter(){
  const areaLinks = liveTowns.slice(0,32).map(t=>`<a href="${townUrl(t)}">${t.name} (${t.zip})</a>`).join('');
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <b>${BIZ_NAME}</b>
        <p style="margin-top:10px">24/7 emergency water damage, flood cleanup, and mold remediation across <a href="/" style="color:#fff">Kansas City, MO</a> — 4 locations for fast metro-wide response.</p>
        <a class="footer-call" href="tel:${PHONE_TEL}">${I.phone}${PHONE_DISPLAY}</a>
      </div>
      <div><h4>Services</h4><ul><li><a href="/water-damage-restoration">Water Damage Restoration</a></li><li><a href="/mold-remediation">Mold Remediation</a></li><li><a href="/flooded-basement-cleanup">Flooded Basement Cleanup</a></li><li><a href="/storm-damage-restoration">Storm &amp; Flood Damage</a></li><li><a href="/sewage-cleanup">Sewage &amp; Biohazard</a></li><li><a href="/fire-smoke-damage">Fire &amp; Smoke Damage</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="/">Home</a></li><li><a href="/about">About Us</a></li><li><a href="/services">All Services</a></li><li><a href="/service-areas">Service Areas</a></li><li><a href="/contact">Contact</a></li><li><a href="/locations">Our Locations</a></li></ul></div>
      <div><h4>Contact</h4><ul><li>📞 <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></li><li>🕐 Open 24/7 — Emergency Service</li><li><a href="${GBP}" rel="nofollow noopener" target="_blank">Find us on Google →</a></li></ul></div>
    </div>
    <div class="footer-locations">
      <h4>Our 4 Kansas City Locations</h4>
      <div class="footer-loc-grid">${LOCATIONS.map(l=>`<div class="footer-loc"><strong><a href="/locations" style="color:#fff">${l.name}</a></strong><br>${l.addr}<br><a href="tel:${PHONE_TEL}" style="color:var(--gold)">${PHONE_DISPLAY}</a><br><a href="${l.gbp}" rel="nofollow noopener" target="_blank" style="color:rgba(255,255,255,.7);font-size:.85em">Get directions →</a></div>`).join('')}</div>
    </div>
    <div class="footer-areas">
      <h4>Service Areas We Cover</h4>
      <div class="cols">${areaLinks}</div>
      <p style="margin-top:12px"><a href="/service-areas" style="color:#fff;font-weight:700">View all ${liveTowns.length} service areas →</a></p>
    </div>
    <div class="footer-bottom"><div>© 2026 ${BIZ_NAME}. All rights reserved.</div><div>Licensed &amp; Insured · Serving Kansas City 24/7</div></div>
  </div>
</footer>
${popup}
<div class="callbar"><a href="tel:${PHONE_TEL}">${I.phone}Tap to Call — 24/7 Emergency</a></div>`;
}

// ---------- shell ----------
function shell({title, desc, canonical, body, ld}){
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="https://${DOMAIN}/${canonical}">
<meta name="theme-color" content="#0a2540">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/styles.css">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://${DOMAIN}/${canonical}">
<meta property="og:image" content="https://${DOMAIN}/assets/hero-flood.jpg">
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head>
<body>
${topbar}
${renderHeader()}
${body}
${renderFooter()}
</body>
</html>
`;
}

// ---------- reusable sections ----------
function callBtn(label){ return `<a class="btn btn-call" href="tel:${PHONE_TEL}">${I.phone} ${label||('Call '+PHONE_DISPLAY)}</a>`; }
function ctaBand(h, p){ return `<section><div class="container"><div class="cta-band"><h2>${h}</h2><p>${p}</p>${callBtn()}</div></div></section>`; }

function whyChooseUs(where){
  const w = where || 'Kansas City';
  const cards = [
    {i:I.clock,t:'24/7 Live Response',d:`A real person answers every call, day or night, and we dispatch to ${w} right away.`},
    {i:I.pin,t:'4 KC Locations',d:'With crews stationed across central, north, south, and east KC, we reach you fast.'},
    {i:I.tools,t:'Pro-Grade Equipment',d:'Truck-mounted extractors, air movers, and dehumidifiers dry your property fast.'},
    {i:I.doc,t:'Insurance Support',d:'We document the damage with photos and readings and bill your insurer directly.'},
  ];
  return `<section class="section-navy"><div class="container">
    <div class="section-head"><div class="eyebrow" style="color:var(--gold)">Why Choose Us</div><h2>Why ${w} Trusts Our Crews</h2></div>
    <div class="why-grid">${cards.map(c=>`<div class="why-card"><span class="ico">${c.i}</span><h3>${c.t}</h3><p>${c.d}</p></div>`).join('')}</div>
  </div></section>`;
}

function processSection(title){
  const steps=[
    {t:'Inspect &amp; Assess',d:'We find the water source, measure moisture, and map the full extent of the damage.'},
    {t:'Extract Water',d:'Powerful pumps and extractors remove standing water fast to limit spreading.'},
    {t:'Dry &amp; Dehumidify',d:'Commercial air movers and dehumidifiers dry the structure, monitored daily.'},
    {t:'Clean &amp; Restore',d:'Sanitizing, mold prevention, and repairs return your property to normal.'},
  ];
  return `<section><div class="container">
    <div class="section-head"><div class="eyebrow">Our Process</div><h2>${title||'How Our Restoration Process Works'}</h2><p class="muted">A proven, step-by-step approach that gets your property dry, clean, and restored.</p></div>
    <div class="steps">${steps.map(s=>`<div class="step"><h3>${s.t}</h3><p>${s.d}</p></div>`).join('')}</div>
  </div></section>`;
}

function problemSolution(title, items){
  return `<section class="section-soft"><div class="container">
    <div class="section-head"><div class="eyebrow">Problems We Solve</div><h2>${title}</h2><p class="muted">Real situations we handle every day — and exactly how we fix them.</p></div>
    <div class="ps-grid">${items.map(it=>`<div class="ps-card">
      <div class="prob">${I.alert}<div><b>${it.p}</b></div></div>
      <div class="sol">${I.check}<span><b>Our solution:</b> ${it.s}</span></div>
    </div>`).join('')}</div>
  </div></section>`;
}

function subServicesSection(title, subs){
  return `<section><div class="container">
    <div class="section-head"><div class="eyebrow">What's Included</div><h2>${title}</h2></div>
    <div class="sub-grid">${subs.map(s=>`<div class="sub-card"><h3>${s.n}</h3><p>${s.d}</p></div>`).join('')}</div>
  </div></section>`;
}

function aboutSection(context){
  return `<section class="section-soft"><div class="container split">
    <div class="prose">
      <div class="eyebrow">About Us</div>
      <h2>Your Local Restoration Team</h2>
      <p>${BIZ_NAME} operates from <a href="/locations">four locations across the Kansas City metro</a>. ${context||''} We answer the phone around the clock and send trained, IICRC-standard crews to stop the damage before it spreads.</p>
      <p>From the first call to the final repair, we handle <a href="/water-damage-restoration">water extraction and drying</a>, <a href="/mold-remediation">mold remediation</a>, and full restoration — and we document everything for your insurance. Learn more <a href="/about">about our team</a> or see where we work on our <a href="${GBP}" rel="nofollow noopener" target="_blank">Google Business Profile</a>.</p>
      <p style="margin-top:20px">${callBtn()}</p>
    </div>
    <div><img class="feature-img" src="/assets/technician.jpg" alt="Water damage restoration technician at work in Kansas City, MO" loading="lazy"></div>
  </div></section>`;
}

function reviewsSection(){
  const rv=[
    {t:'Our basement flooded during a storm and they were here within the hour. Professional, fast, and they walked us through the insurance claim step by step.',w:'Homeowner, Midtown, Kansas City'},
    {t:'A pipe burst while we were away and water was everywhere. The crew dried everything out and saved our hardwood floors. Highly recommend.',w:'Homeowner, Gladstone, MO'},
    {t:'Responsive, honest, and thorough. They handled the water cleanup and the mold treatment so we did not have to worry about anything.',w:'Business Owner, Blue Ridge, Kansas City'},
  ];
  return `<section class="section-soft"><div class="container">
    <div class="section-head"><div class="eyebrow">Reputation</div><h2>What Kansas City Homeowners Say</h2></div>
    <div class="grid grid-3">${rv.map(r=>`<div class="review"><div class="stars">★★★★★</div><p>"${r.t}"</p><div class="who">— ${r.w}</div></div>`).join('')}</div>
    <p class="center" style="margin-top:26px"><a href="${GBP}" rel="nofollow noopener" target="_blank">See more reviews on Google →</a></p>
  </div></section>`;
}

function faqSection(title, faqs){
  return `<section class="section-soft"><div class="container">
    <div class="section-head"><div class="eyebrow">FAQ</div><h2>${title}</h2></div>
    <div class="faq">${faqs.map(f=>`<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</div>
  </div></section>`;
}

function socialShare(canonical, title){
  const u = encodeURIComponent('https://'+DOMAIN+'/' + canonical);
  const tt = encodeURIComponent(title.replace(/&amp;/g,'&').replace(/<[^>]+>/g,''));
  return `<section class="share-section"><div class="container center">
    <div class="share-bar">
      <a href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener noreferrer" class="share-btn share-fb">${I.facebook} Facebook</a>
      <a href="https://twitter.com/intent/tweet?url=${u}&text=${tt}" target="_blank" rel="noopener noreferrer" class="share-btn share-x">${I.xtweet} Share</a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${u}" target="_blank" rel="noopener noreferrer" class="share-btn share-li">${I.linkedin} LinkedIn</a>
      <a href="mailto:?subject=${tt}&body=Check%20this%20out%3A%20${u}" class="share-btn share-em">${I.envelope} Email</a>
    </div>
  </div></section>`;
}

// ---------- schema ----------
function localBusinessLD(url, loc){
  const l = loc || primaryLoc;
  return {"@context":"https://schema.org","@type":"EmergencyService","name":BIZ_NAME,"image":"https://"+DOMAIN+"/assets/hero-flood.jpg","url":url,"telephone":PHONE_TEL,"priceRange":"$$","address":{"@type":"PostalAddress","addressLocality":"Kansas City","addressRegion":"MO","postalCode":l.zips[0],"addressCountry":"US"},"geo":{"@type":"GeoCoordinates","latitude":39.0997,"longitude":-94.5786},"areaServed":towns.map(t=>t.name+', Kansas City, MO'),"openingHoursSpecification":{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"00:00","closes":"23:59"},"hasMap":l.gbp};
}
function faqLD(faqs){ return {"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(f=>({"@type":"Question","name":f.q.replace(/&amp;/g,'&'),"acceptedAnswer":{"@type":"Answer","text":f.a.replace(/&amp;/g,'&')}}))}; }
function serviceLD(name,desc,canonical){ return {"@context":"https://schema.org","@type":"Service","name":name.replace(/&amp;/g,'&'),"description":desc,"serviceType":name.replace(/&amp;/g,'&'),"url":"https://"+DOMAIN+"/"+canonical,"areaServed":{"@type":"City","name":"Kansas City","addressRegion":"MO"},"provider":{"@type":"EmergencyService","name":BIZ_NAME,"telephone":PHONE_TEL}}; }
function graph(arr){ return {"@context":"https://schema.org","@graph":arr.map(x=>{const c={...x};delete c["@context"];return c;})}; }

// ---------- demand content ----------
function dCat(d){
  if(d.includes('Burst Pipe')) return 'pipe';
  if(d.includes('Basement')) return 'basement';
  if(d.includes('Emergency')) return 'extract';
  if(d.includes('Mold')) return 'mold';
  if(d.includes('Storm')) return 'storm';
  if(d.includes('Ceiling')) return 'ceiling';
  if(d.includes('Sewage')) return 'sewage';
  if(d.includes('Structural')) return 'drying';
  return 'extract';
}

function demandIntro(t, place){
  const c = dCat(t.demand);
  if(c==='pipe') return `Properties in <strong>${place}</strong> with aging plumbing face a higher risk of burst pipe emergencies, especially during Kansas City winters when temperatures can plunge well below freezing. A single burst supply line can release hundreds of gallons per hour, flooding floors, walls, and ceilings before you notice. Our crews respond around the clock to ${t.name} — we shut down the water, extract every drop from affected surfaces, and dry the structure thoroughly to prevent the secondary mold and rot that follow untreated moisture.`;
  if(c==='basement') return `Homes in <strong>${place}</strong> near ${t.feat} sit where groundwater and stormwater runoff can overwhelm drainage systems and sump pumps. When water enters your basement — whether from a failed sump, foundation seepage, or heavy rain — it threatens your HVAC equipment, stored belongings, and foundation walls. We pump out standing water rapidly, dry the space with commercial dehumidifiers, and treat surfaces to stop mold before it takes hold.`;
  if(c==='mold') return `The humid conditions near ${t.feat} in <strong>${place}</strong> create an environment where mold can develop quickly after even minor water intrusion. Hidden leaks behind walls, condensation in crawl spaces, and lingering moisture from past flooding are the most common triggers we see in this area. Our <a href="/mold-remediation">mold remediation</a> process starts with a thorough inspection to locate all affected areas, followed by containment, safe removal, HEPA air filtration, and antimicrobial treatment to prevent regrowth.`;
  if(c==='storm') return `<strong>${place}</strong> sits in the path of severe weather patterns that sweep through the Kansas City metro, bringing heavy rain, high winds, hail, and flash flooding. Properties near ${t.feat} are particularly vulnerable when storm runoff rises fast. We respond before, during, and after storms to protect ${t.name} homes — extracting floodwater, drying the structure, and restoring damaged areas around the clock.`;
  if(c==='ceiling') return `Upstairs leaks, ice dams, and roof damage are common in <strong>${place}</strong>, and they often appear first as stained, bulging, or dripping ceilings. Ceiling water damage is deceptive — the visible stain is usually just a fraction of the moisture trapped in the cavity above. Our crews open the affected areas carefully, extract trapped water, dry the framing and insulation, and repair the finished surface so it looks and performs like new.`;
  if(c==='sewage') return `Sewer line backups in <strong>${place}</strong> are a serious health hazard that requires professional cleanup. When contaminated Category 3 water enters your home through floor drains or backed-up toilets, it carries bacteria and pathogens that make the area unsafe. Our hazmat-trained crews contain the zone, remove all affected materials, disinfect with hospital-grade products, and dry the space completely.`;
  if(c==='drying') return `After water damage in <strong>${place}</strong>, removing visible water is only the first step. Moisture trapped in wall cavities, under flooring, and inside structural framing continues to cause damage long after the puddles are gone. Our structural drying crews use commercial dehumidifiers, air movers, and daily moisture monitoring to ensure every surface reaches safe moisture levels — preventing warped framing, delaminating finishes, and mold growth.`;
  return `When water damage strikes in <strong>${place}</strong>, the first hours are critical. Every minute standing water remains, it soaks deeper into drywall, subfloors, and insulation — and within 24 to 48 hours, mold can begin growing. Our emergency extraction crews arrive with truck-mounted pumps and commercial-grade equipment to remove water fast and begin drying immediately.`;
}

function demandPS(t){
  const c = dCat(t.demand);
  if(c==='pipe') return [
    {p:`A pipe burst inside a wall in a ${t.name} home and water is spreading to adjacent rooms.`,s:'We locate the break, shut off the supply, extract water from both sides of the wall, and dry the cavity to prevent mold.'},
    {p:`Frozen pipes thawed overnight and are leaking at multiple joints in ${t.name}.`,s:'We address every leak point, extract accumulated water, and set up drying equipment across all affected areas in a single visit.'},
    {p:'A supply line under the kitchen failed and water is pooling under the cabinets.',s:'We pull standing water from underneath and behind cabinets, dry the subfloor, and check for hidden moisture in the wall cavity.'},
    {p:`An upstairs pipe burst in a ${t.name} two-story and water is dripping through the ceiling below.`,s:'We open the ceiling to release trapped water, dry the cavity and framing above, and repair the finished surface.'},
  ];
  if(c==='basement') return [
    {p:`The sump pump lost power during a storm and the ${t.name} basement is flooding fast.`,s:'We deploy portable pumps to remove the water immediately and begin drying before mold can start.'},
    {p:`Groundwater seepage is coming through foundation walls after heavy rain near ${t.feat}.`,s:'We extract the incoming water, set up commercial drying equipment, and identify the seepage points for repair.'},
    {p:`A finished basement in ${t.name} has standing water from a backed-up floor drain.`,s:'We pump it dry, remove saturated carpet and pad, and save what we can before moisture damages the drywall.'},
    {p:'The basement smells damp and musty weeks after what seemed like a minor flood.',s:'We find the trapped moisture behind walls or under the slab, dry it completely, and treat the area to eliminate odor and mold.'},
  ];
  if(c==='mold') return [
    {p:`Black mold is spreading on the basement walls of a ${t.name} home near the floor line.`,s:'We contain the area, remove affected drywall and insulation, treat the surface underneath, and fix the moisture source feeding the growth.'},
    {p:'A musty smell persists even though no visible water damage is present.',s:'We inspect behind walls and under flooring with moisture meters, locate the hidden mold, and remediate at the source.'},
    {p:'Mold reappeared after a previous cleanup attempt by another company.',s:'We address the underlying moisture problem the earlier cleanup missed, then remediate properly so it does not return.'},
    {p:`Allergy-like symptoms are worse indoors for a ${t.name} family, and mold is suspected.`,s:'We inspect, set up negative-air containment, HEPA-filter the air during removal, and treat all surfaces to protect indoor air quality.'},
  ];
  if(c==='storm') return [
    {p:`A severe Kansas City storm drove rain through a ${t.name} roof into the attic and upper floors.`,s:'We extract the water, dry the attic insulation and ceiling cavities, and prevent mold from developing in hidden spaces.'},
    {p:'Flash flooding sent water into the first floor and basement at the same time.',s:'We deploy pumps to both levels, prioritize protecting mechanicals and valuables, and dry the entire structure.'},
    {p:'Wind blew debris through a window during a storm and rain soaked the room.',s:'We secure the opening, extract water from carpet and pad, and dry the wall cavities before moisture travels further.'},
    {p:`After a storm, standing water near ${t.feat} seeped into a foundation in ${t.name}.`,s:'We pump out the interior water, dry the foundation walls, and treat surfaces to prevent mold.'},
  ];
  if(c==='ceiling') return [
    {p:`A water stain on the ceiling is growing and starting to bulge in a ${t.name} home.`,s:'We carefully open the area, drain the trapped water, find and address the source above, and dry and repair the ceiling.'},
    {p:'An upstairs bathroom leak has been dripping through the first-floor ceiling for days.',s:'We trace the leak to its source, extract water from the ceiling cavity, dry the framing, and repair the finished surface.'},
    {p:'Ice dam melt is seeping through the ceiling during a Kansas City winter.',s:'We extract the water entering the home, dry the affected ceiling and wall cavities, and prevent mold from developing.'},
    {p:'A ceiling partially collapsed from the weight of trapped water after a hidden leak.',s:'We clear the debris, extract water from the room and cavity above, dry the exposed framing, and rebuild the ceiling.'},
  ];
  if(c==='sewage') return [
    {p:`A sewer line backed up through the basement floor drain in a ${t.name} home.`,s:'We contain the contaminated area, remove the black water and all affected porous materials, and disinfect every surface.'},
    {p:'A toilet overflowed with contaminated water across the bathroom floor and into the hallway.',s:'We clean and sanitize the entire area with hospital-grade disinfectants and dry it completely.'},
    {p:'A persistent sewage odor remains after surface cleaning of a previous backup.',s:'We remove the contamination embedded in porous materials and use professional deodorizing equipment to eliminate the odor.'},
    {p:'Flood water carrying sewage contaminants entered the basement during heavy rain.',s:'We treat it as Category 3 contaminated water, removing and sanitizing all affected materials for safety.'},
  ];
  if(c==='drying') return [
    {p:`Floors in a ${t.name} home feel soft and spongy weeks after a water event.`,s:'We open the affected areas, position drying equipment under the subfloor, and monitor until moisture readings are within safe limits.'},
    {p:'Paint is bubbling and peeling on walls that were exposed to water.',s:'We test moisture levels behind the paint, dry the wall cavity completely, and refinish the surface once it reaches safe readings.'},
    {p:'A contractor said the structure is still too wet for repairs to begin.',s:'We deploy commercial dehumidifiers and air movers to accelerate drying and verify safe moisture levels with daily readings.'},
    {p:`Hardwood floors are cupping and buckling after water exposure in a ${t.name} home.`,s:'We set up targeted drying above and below the flooring to draw out trapped moisture gradually, giving the wood the best chance of recovery.'},
  ];
  return [
    {p:`Water is spreading across multiple rooms in a ${t.name} home from an unknown source.`,s:'We locate the source, stop the flow, and extract standing water from every affected room on the same visit.'},
    {p:'A water heater failed and released its full tank onto the floor.',s:'We extract the water immediately, move and protect nearby belongings, and dry the affected area completely.'},
    {p:`A washing machine hose burst while nobody was home in ${t.name}.`,s:'We pump out all accumulated water, dry soaked cabinets and flooring, and check for hidden moisture behind walls.'},
    {p:'Water damage was discovered a day late and the subfloor is thoroughly soaked.',s:'We extract remaining water, deploy intensive drying equipment, and apply antimicrobials to stop mold before it starts.'},
  ];
}

function demandFAQs(t){
  const c = dCat(t.demand);
  if(c==='pipe') return [
    {q:`Why do pipes burst in ${t.name}?`,a:`The most common causes are freezing temperatures, aging plumbing, and sudden pressure changes. Kansas City winters are hard on pipes, especially in older ${t.name} homes with uninsulated lines in exterior walls.`},
    {q:'Can you fix the broken pipe too, or just the water damage?',a:'We focus on water damage restoration — extraction, drying, and repair. We can coordinate with a licensed plumber for the pipe repair so both happen the same day.'},
    {q:'How much water can a burst pipe release?',a:'A typical supply line can release 4 to 8 gallons per minute. A pipe that bursts while you are at work can flood multiple rooms with hundreds of gallons.'},
    {q:`Does insurance cover burst pipe damage in ${t.name}?`,a:'Burst pipe damage is typically covered by homeowners insurance when the failure is sudden. We document the damage with photos and moisture readings and can bill your insurer directly.'},
  ];
  if(c==='basement') return [
    {q:`Why does my ${t.name} basement keep flooding?`,a:`Common causes include overwhelmed sump pumps, foundation cracks, and poor drainage grading. Proximity to ${t.feat} can also increase groundwater pressure during heavy rain and snowmelt.`},
    {q:'Is a little water in the basement a big deal?',a:'Even shallow standing water soaks into concrete, drywall, and stored items. Within 24 to 48 hours, it creates conditions for mold growth and structural damage that costs far more to fix later.'},
    {q:'Should I get a backup sump pump?',a:'If your basement has flooded from sump failure, a battery-backup or water-powered backup pump is a smart investment. We can recommend a solution after evaluating your current setup during cleanup.'},
    {q:`Can you save my finished basement after flooding in ${t.name}?`,a:'Often yes — if we respond quickly. Fast extraction and drying give the best chance of saving drywall, flooring, and trim. We document everything for your insurance claim.'},
  ];
  if(c==='mold') return [
    {q:`How do I know if I have mold in my ${t.name} home?`,a:`Common signs include a persistent musty odor, visible discoloration on walls or ceilings, and worsening allergy symptoms indoors. Moisture near ${t.feat} creates ideal conditions for hidden mold growth.`},
    {q:'Is all mold dangerous?',a:'All indoor mold signals a moisture problem that needs attention. While some species are more concerning than others, any mold growth can affect air quality and damage building materials if left untreated.'},
    {q:'Can I clean mold myself?',a:'Small surface patches on non-porous materials can sometimes be cleaned. However, mold in drywall, behind walls, or covering a larger area requires professional containment and removal to prevent spreading.'},
    {q:'How long does mold remediation take?',a:'Most residential jobs take 2 to 5 days, depending on the size of the affected area. We set up containment on day one and confirm the area is clear before releasing it back to you.'},
  ];
  if(c==='storm') return [
    {q:'Can you respond during an active storm?',a:'We answer calls 24/7 and dispatch as soon as travel is safe. During severe weather, we prioritize stopping active water intrusion and protecting the structure from further damage.'},
    {q:`Does insurance cover storm damage in ${t.name}?`,a:'Most homeowners policies cover wind and storm-driven rain damage. Rising floodwater may require separate flood insurance. We document the damage thoroughly to support either type of claim.'},
    {q:'What should I do while waiting for your storm damage crew?',a:'Move valuables away from water, avoid standing water near electrical outlets, and do not enter a room with a sagging ceiling. We will guide you by phone until we arrive.'},
    {q:'Will the damage get worse if I wait until the storm passes?',a:'Water damage worsens every hour. If it is safe to call, call right away — we can plan our response and arrive as soon as conditions allow.'},
  ];
  if(c==='ceiling') return [
    {q:'Why is water staining my ceiling?',a:'The most common causes are leaking plumbing above, roof damage, ice dams, or condensation from poor insulation. The stain you see is usually the low point of a wider moisture pocket inside the ceiling cavity.'},
    {q:'Is a ceiling water stain an emergency?',a:'If the ceiling is sagging, bubbling, or actively dripping, yes — trapped water can cause a sudden collapse. Even a dry-looking stain means moisture that can lead to mold if not dried properly.'},
    {q:'Will you need to cut into my ceiling?',a:'Usually, yes — we make controlled openings to drain trapped water and dry the cavity above. We keep cuts as small as possible and repair the finished surface once everything is confirmed dry.'},
    {q:`How fast can you reach ${t.name} for a ceiling leak?`,a:`We have crews stationed across Kansas City and can reach most ${t.name} addresses within about 45 minutes, day or night.`},
  ];
  if(c==='sewage') return [
    {q:'Is it safe to be in my home after a sewage backup?',a:'Avoid the contaminated area entirely until professionals have cleaned it. Sewage contains harmful bacteria and should not be touched or cleaned with regular household products.'},
    {q:'What materials need to be removed after sewage exposure?',a:'Porous materials that absorbed contaminated water — carpet, pad, drywall below the water line, and insulation — typically need removal and replacement. Hard surfaces can usually be disinfected.'},
    {q:'How do you eliminate the sewage smell?',a:'We remove the contamination at the source, not just the surface. Hospital-grade disinfectants and professional deodorizing equipment eliminate the odor rather than masking it.'},
    {q:'Can a sewage backup cause mold?',a:'Yes. The moisture from a sewage backup creates ideal mold conditions, often faster than clean water due to the organic matter involved. We dry and treat the area to prevent secondary mold growth.'},
  ];
  if(c==='drying') return [
    {q:'How do I know when my home is fully dry?',a:'We use professional moisture meters to measure content in walls, floors, and framing. We compare readings to dry-standard baselines and do not remove equipment until every surface is within safe limits.'},
    {q:'How long does structural drying take?',a:'Most residential drying takes 3 to 5 days. Concrete, plaster, and heavily saturated structures may take longer. We monitor daily and adjust equipment placement as the drying progresses.'},
    {q:'Is structural drying necessary if the water is already gone?',a:'Visible water is only part of the problem. Moisture trapped in wall cavities, subfloors, and framing continues to cause damage and mold growth long after the surface appears dry.'},
    {q:`How fast can your drying crews reach ${t.name}?`,a:`We have crews across Kansas City and can reach most ${t.name} addresses within about 45 minutes, around the clock.`},
  ];
  return [
    {q:'How quickly can you extract the water?',a:'Our truck-mounted extractors remove hundreds of gallons per hour. Most residential extractions are completed within a few hours of arrival, with drying equipment running continuously afterward.'},
    {q:'What happens after the water is removed?',a:'Extraction is just the first step. We then position commercial air movers and dehumidifiers to dry the structure, and we monitor moisture levels daily until everything is within safe limits.'},
    {q:`How fast can you reach ${t.name}?`,a:`We have four locations across Kansas City and can reach most ${t.name} addresses within about 45 minutes, 24 hours a day.`},
    {q:'Will my floors and walls survive the water damage?',a:'Speed matters. The faster we extract and begin drying, the better the odds of saving flooring, drywall, and trim. We assess each material and save everything we can.'},
  ];
}

// ===================== PAGE GENERATORS =====================

// ---------- SERVICE PAGES ----------
const services = [
  {
    key:'water', img:'water-damage-room.jpg', slug:'water-damage-restoration',
    title:`Water Damage Restoration Kansas City, MO | Water Extraction &amp; Drying | ${PHONE_DISPLAY}`,
    desc:`Emergency water damage restoration in Kansas City, MO: water extraction, structural drying, burst pipe cleanup, ceiling water damage repair, and carpet drying. Call ${PHONE_DISPLAY}.`,
    h1:'Water Damage Restoration &amp; Water Extraction in Kansas City, MO',
    lead:'Fast, professional water damage restoration for Kansas City homes and businesses — 24/7 water extraction, structural drying, and full repair from 4 metro locations.',
    intro:`When water invades your property, every hour matters. Our Kansas City water damage restoration team responds around the clock to extract water, dry your structure, and prevent the secondary damage that follows standing moisture. If the water has already reached below grade, we also handle <a href="/flooded-basement-cleanup">flooded basement cleanup</a>, and if it has sat long enough to cause growth, our <a href="/mold-remediation">mold remediation</a> crews can step in. We serve homeowners across <a href="/service-areas">all of Kansas City</a>.`,
    subsTitle:'Water Damage Services We Provide',
    subs:[
      {n:'Emergency Water Extraction',d:'Rapid removal of standing water with truck-mounted pumps and extractors.'},
      {n:'Burst &amp; Frozen Pipe Cleanup',d:'Cleanup and drying after burst, frozen, or leaking supply lines.'},
      {n:'Ceiling Water Damage Repair',d:'Drying and repair of water-stained, sagging ceilings and drywall.'},
      {n:'Structural Drying',d:'Air movers and dehumidifiers dry framing, subfloors, and walls.'},
      {n:'Carpet &amp; Flooring Water Removal',d:'Extraction and drying to save carpet, pad, and hardwood when possible.'},
      {n:'Appliance Leak Cleanup',d:'Water damage from dishwashers, washers, water heaters, and fridges.'},
    ],
    psTitle:'Common Water Damage Problems We Fix',
    ps:[
      {p:'A pipe burst and water is spreading across the floor.',s:'We shut down the spread, extract standing water immediately, and begin structural drying the same visit.'},
      {p:'The ceiling is stained and sagging from a leak upstairs.',s:'We locate the source, dry the cavity, and repair or replace the damaged drywall so it looks new.'},
      {p:'Carpet and padding are soaked and starting to smell.',s:'We extract the water, lift and dry or replace the pad, and sanitize to stop odor and mold.'},
      {p:'Water has been sitting for a day or two.',s:'We dry aggressively and treat with antimicrobial to prevent the mold that starts within 24–48 hours.'},
    ],
    faqs:[
      {q:'How much does water damage restoration cost?',a:'Cost depends on how much water is involved, the materials affected, and how far it spread. We provide a clear estimate after inspecting the damage and can bill your insurance directly in most cases.'},
      {q:'Will my homeowners insurance cover it?',a:'Most sudden, accidental water damage (like a burst pipe) is covered. We document everything with photos and moisture readings to support your claim.'},
      {q:'How long does drying take?',a:'Typically 3–5 days, depending on the extent of the damage and humidity. We monitor moisture daily and confirm the structure is fully dry before finishing.'},
      {q:'Can you save my hardwood floors and carpet?',a:'Often, yes — if we start drying quickly. Fast extraction gives the best chance of saving flooring, though heavily saturated materials sometimes need replacement.'},
    ],
    related:[SVC.basement,SVC.mold,SVC.storm,SVC.sewage],
    ctaH:'Water Damage? Call Now — We Respond 24/7',
    ctaP:'The faster we start, the more we can save. Speak to a real person any time, day or night.'
  },
  {
    key:'mold', img:'mold.jpg', slug:'mold-remediation',
    title:`Mold Remediation Kansas City, MO | Black Mold &amp; Basement Mold Removal | ${PHONE_DISPLAY}`,
    desc:`Professional mold remediation in Kansas City, MO: mold removal, black mold treatment, basement and attic mold removal, and mold inspection after water damage. Call ${PHONE_DISPLAY}.`,
    h1:'Mold Remediation &amp; Mold Removal in Kansas City, MO',
    lead:'Safe, thorough mold remediation for Kansas City homes and businesses — we contain, remove, and treat mold at the source.',
    intro:`Mold thrives on the moisture left behind by leaks and <a href="/water-damage-restoration">water damage</a>, and it can affect both your property and your indoor air. Our mold remediation process safely contains the affected area, removes mold-damaged materials, treats surfaces, and fixes the moisture problem that caused it. Damp basements are the most common trigger, which is why mold work often pairs with <a href="/flooded-basement-cleanup">flooded basement cleanup</a>. We help homeowners throughout <a href="/service-areas">Kansas City</a>.`,
    subsTitle:'Mold Remediation Services We Provide',
    subs:[
      {n:'Black Mold Removal',d:'Safe containment and removal of black mold from walls, ceilings, and framing.'},
      {n:'Basement Mold Removal',d:'Treatment of mold in damp, flood-prone basements and the moisture behind it.'},
      {n:'Attic Mold Treatment',d:'Remediation of attic mold from roof leaks and poor ventilation.'},
      {n:'Mold Inspection',d:'Moisture mapping and inspection to find hidden mold and its source.'},
      {n:'Air Scrubbing &amp; HEPA Filtration',d:'Negative-air containment and HEPA filtration to clean the air during removal.'},
      {n:'Antimicrobial Treatment',d:'Surface treatment to discourage regrowth after the mold is removed.'},
    ],
    psTitle:'Common Mold Problems We Fix',
    ps:[
      {p:'There is black mold spreading across a basement wall.',s:'We contain the area, remove the affected materials, treat the surface, and dry out the moisture feeding it.'},
      {p:'A musty smell keeps coming back even after cleaning.',s:'We find the hidden moisture source and remediate the mold behind it, not just the visible patch.'},
      {p:'Mold appeared after a leak or flood.',s:'We remediate the growth and address the underlying water damage so it does not return.'},
      {p:'Someone in the home has allergy-like symptoms indoors.',s:'We contain and HEPA-filter during removal to protect air quality throughout the process.'},
    ],
    faqs:[
      {q:'Is mold in my home dangerous?',a:'Mold can affect indoor air quality and may cause issues for people with allergies or respiratory sensitivities. Regardless of type, mold indoors signals a moisture problem that should be addressed promptly.'},
      {q:'How do you keep mold from coming back?',a:'We fix the underlying moisture source — the leak, flooding, or humidity that fed it. Removing mold without solving the moisture problem almost always leads to regrowth.'},
      {q:'Do I need to leave my home during remediation?',a:'For most localized jobs, no. For larger projects we set up containment and will advise you on any areas to avoid during the work.'},
      {q:'Does insurance cover mold remediation?',a:'It depends on the cause. Mold from a covered water event is often included, while mold from long-term neglect may not be. We help document the situation for your claim.'},
    ],
    related:[SVC.water,SVC.basement,SVC.sewage,SVC.storm],
    ctaH:'Think You Have Mold? Let Us Take a Look',
    ctaP:'Call for mold remediation across Kansas City. We contain it, remove it, and stop it from returning.'
  },
  {
    key:'basement', img:'flooded-basement.jpg', slug:'flooded-basement-cleanup',
    title:`Flooded Basement Cleanup Kansas City, MO | Water Pump-Out &amp; Sump Failure | ${PHONE_DISPLAY}`,
    desc:`Flooded basement cleanup in Kansas City, MO: water pump-outs, sump pump failure cleanup, groundwater flooding, and crawl space drying. Available 24/7 — call ${PHONE_DISPLAY}.`,
    h1:'Flooded Basement Cleanup &amp; Water Pump-Out in Kansas City, MO',
    lead:'Fast pump-outs and complete drying for flooded basements across Kansas City — available 24/7 from 4 metro locations.',
    intro:`A flooded basement can threaten your foundation, mechanical systems, and everything stored below grade. Our crews arrive quickly to pump out standing water, dry the space, and sanitize affected areas — helping you avoid the <a href="/mold-remediation">mold</a> and musty odors that follow. Basement flooding often overlaps with broader <a href="/water-damage-restoration">water damage restoration</a> and, after heavy weather, <a href="/storm-damage-restoration">storm and flood damage</a>. We respond throughout <a href="/service-areas">Kansas City</a>.`,
    subsTitle:'Basement Flood Services We Provide',
    subs:[
      {n:'Basement Water Extraction',d:'Rapid pump-outs of standing water, from a few inches to a full flood.'},
      {n:'Sump Pump Failure Cleanup',d:'Cleanup after sump pump failures, power loss, and overwhelmed pits.'},
      {n:'Groundwater &amp; Seepage Drying',d:'Drying and treatment after rain-driven seepage and foundation leaks.'},
      {n:'Crawl Space Drying',d:'Water removal and drying for damp, flood-prone crawl spaces.'},
      {n:'Contents Drying',d:'Moving and drying salvageable stored belongings and documenting losses.'},
      {n:'Sanitizing &amp; Deodorizing',d:'Antimicrobial treatment and deodorizing to prevent mold and odor.'},
    ],
    psTitle:'Common Basement Flooding Problems We Fix',
    ps:[
      {p:'The basement floods every time it rains hard.',s:'We clean up the flooding and identify the drainage or sump issues causing repeat flooding.'},
      {p:'The sump pump failed during a storm and water rose fast.',s:'We pump it out immediately, dry the space, and help you get ahead of the next storm.'},
      {p:'There is a few inches of water and boxes are soaked.',s:'We extract the water, dry and document contents, and treat the area to stop mold.'},
      {p:'The basement smells musty after drying on its own.',s:'We re-dry properly, sanitize, and address the trapped moisture behind the odor.'},
    ],
    faqs:[
      {q:'My basement floods every time it rains — can you help?',a:'Yes. We clean up the current flooding and can identify the drainage or sump issues causing repeat flooding so you can address the root cause.'},
      {q:'Is a little basement water really a problem?',a:'Even shallow water soaks into walls, flooring, and stored items, and can lead to mold within a day or two. Prompt cleanup and drying prevents bigger, costlier damage.'},
      {q:'How fast can you get here?',a:'With four locations across Kansas City, we aim to be on-site within about 45 minutes anywhere in the metro, 24 hours a day.'},
      {q:'Will you move my stored belongings?',a:'Yes — we help move and dry salvageable items and document anything damaged for your insurance claim.'},
    ],
    related:[SVC.water,SVC.mold,SVC.sewage,SVC.storm],
    ctaH:'Basement Under Water? Call Now',
    ctaP:'We pump it out, dry it down, and protect your home — 24/7 emergency response across Kansas City.'
  },
  {
    key:'storm', img:'storm-house.jpg', slug:'storm-damage-restoration',
    title:`Storm &amp; Flood Damage Restoration Kansas City, MO | Roof Leak &amp; Flood Cleanup | ${PHONE_DISPLAY}`,
    desc:`Storm and flood damage restoration in Kansas City, MO: roof leak water damage, wind-driven rain cleanup, flood water removal, and emergency response. Call ${PHONE_DISPLAY}.`,
    h1:'Storm &amp; Flood Damage Restoration in Kansas City, MO',
    lead:'Rapid emergency response to storm and flood damage across Kansas City — ready before, during, and after the storm.',
    intro:`Severe weather in the Kansas City metro can bring flooding, wind-driven rain, hail, and roof damage that lets water pour into your home. Our storm damage team responds fast to stop the intrusion, extract water, and begin <a href="/water-damage-restoration">drying and restoration</a>. Storms are also a leading cause of <a href="/flooded-basement-cleanup">basement flooding</a> when sump pumps lose power. We answer emergency calls 24/7 across <a href="/service-areas">Kansas City</a>.`,
    subsTitle:'Storm &amp; Flood Services We Provide',
    subs:[
      {n:'Flood Water Removal',d:'Extraction and drying after flooding from heavy rain and rising water.'},
      {n:'Roof Leak Water Damage',d:'Cleanup and drying of water intrusion from storm-damaged roofs.'},
      {n:'Wind-Driven Rain Cleanup',d:'Recovery from rain forced in through windows, siding, and openings.'},
      {n:'Emergency Water Extraction',d:'Fast pump-outs to limit spreading and protect your structure.'},
      {n:'Structural Drying',d:'Commercial drying of soaked framing, drywall, and flooring.'},
      {n:'Storm Debris &amp; Damaged Material Removal',d:'Removal of unsalvageable, water-damaged materials.'},
    ],
    psTitle:'Common Storm Damage Problems We Fix',
    ps:[
      {p:'A storm tore the roof and rain is coming inside.',s:'We respond fast, stop the intrusion, extract water, and dry the affected rooms.'},
      {p:'Flood water entered the first floor or basement.',s:'We pump it out, remove ruined materials, and dry and sanitize the structure.'},
      {p:'The power went out and the sump pump stopped.',s:'We clear the resulting basement flooding and help you plan a backup for next time.'},
      {p:'Wind pushed rain in around the windows.',s:'We dry the wall cavities and finishes before hidden moisture turns into mold.'},
    ],
    faqs:[
      {q:'Do you respond during active storms?',a:'We answer calls 24/7 and dispatch as soon as it is safe to reach your property. We prioritize stopping water intrusion and preventing further damage.'},
      {q:'Does insurance cover storm damage?',a:'Storm-related water damage is often covered, though flooding from rising water may require separate flood insurance. We document everything to support your claim.'},
      {q:'Can you help with roof leaks?',a:'Yes — we address the water damage from roof leaks and can advise on temporary protection until permanent repairs are made.'},
      {q:'What should I do while I wait for your crew?',a:'Stay safe, avoid standing water near electrical sources, and move valuables to a dry area if you can do so safely. We will guide you over the phone.'},
    ],
    related:[SVC.water,SVC.basement,SVC.mold,SVC.fire],
    ctaH:'Storm Damage? We Are Standing By 24/7',
    ctaP:'Call now for fast storm and flood damage response across all of Kansas City.'
  },
  {
    key:'sewage', img:'sewage-cleanup.jpg', slug:'sewage-cleanup',
    title:`Sewage Cleanup Kansas City, MO | Sewage Backup &amp; Black Water Removal | ${PHONE_DISPLAY}`,
    desc:`Safe sewage cleanup in Kansas City, MO: sewage backup cleanup, black water removal, toilet overflow cleanup, and full sanitizing. 24/7 — call ${PHONE_DISPLAY}.`,
    h1:'Sewage Cleanup &amp; Biohazard Removal in Kansas City, MO',
    lead:'Safe, thorough cleanup and sanitization of sewage backups and contaminated water for Kansas City homes and businesses.',
    intro:`Sewage backups involve Category 3 "black water" that can contain harmful bacteria, making professional cleanup essential. Our team removes the contaminated water, disposes of affected materials safely, and disinfects the area. Because sewage often surfaces in basements, this work frequently pairs with <a href="/flooded-basement-cleanup">flooded basement cleanup</a> and follow-up <a href="/mold-remediation">mold remediation</a>. We respond 24/7 across <a href="/service-areas">Kansas City</a>.`,
    subsTitle:'Sewage &amp; Biohazard Services We Provide',
    subs:[
      {n:'Sewage Backup Cleanup',d:'Safe removal and cleanup of sewage from backups and overflows.'},
      {n:'Black Water Removal',d:'Extraction and disposal of Category 3 contaminated water.'},
      {n:'Toilet Overflow Cleanup',d:'Cleanup and sanitizing after overflowing or clogged toilets.'},
      {n:'Sewage Sanitizing &amp; Disinfection',d:'Hospital-grade disinfection of affected surfaces and areas.'},
      {n:'Odor Removal',d:'Deodorizing to eliminate lingering sewage odor at the source.'},
      {n:'Structural Drying',d:'Drying and antimicrobial treatment to prevent mold afterward.'},
    ],
    psTitle:'Common Sewage &amp; Biohazard Problems We Fix',
    ps:[
      {p:'A sewer line backed up into the basement.',s:'We contain the area, remove the black water and affected materials, and disinfect thoroughly.'},
      {p:'A toilet overflowed and contaminated the floor.',s:'We clean up, sanitize with hospital-grade products, and dry the area completely.'},
      {p:'There is a strong sewage smell after a backup.',s:'We remove the contamination at the source and deodorize so the odor does not linger.'},
      {p:'Flood water may be carrying contaminants.',s:'We treat it as Category 3, removing and sanitizing affected materials for safety.'},
    ],
    faqs:[
      {q:'Is sewage backup a health hazard?',a:'Yes. Sewage contains bacteria and contaminants that can pose serious health risks. It should be handled by trained professionals — avoid contact and keep children and pets away.'},
      {q:'What should I do right after a sewage backup?',a:'Avoid the area, do not use affected plumbing, and call us right away. Do not attempt to clean it yourself.'},
      {q:'Do I need to replace flooring and drywall?',a:'Porous materials that absorb contaminated water often need to be removed for safety. We assess each situation and remove only what is necessary.'},
      {q:'Does insurance cover sewage cleanup?',a:'Many policies cover sudden sewer backups, sometimes with a specific endorsement. We document the damage thoroughly to support your claim.'},
    ],
    related:[SVC.water,SVC.basement,SVC.mold,SVC.storm],
    ctaH:'Sewage Backup? Do Not Touch It — Call Us',
    ctaP:'We safely clean, disinfect, and restore your property 24/7. Call now for immediate help.'
  },
  {
    key:'fire', img:'fire-damage.jpg', slug:'fire-smoke-damage',
    title:`Fire &amp; Smoke Damage Restoration Kansas City, MO | Soot &amp; Odor Removal | ${PHONE_DISPLAY}`,
    desc:`Fire and smoke damage restoration in Kansas City, MO: smoke damage cleanup, soot removal, odor removal, and water damage cleanup after firefighting. Call ${PHONE_DISPLAY}.`,
    h1:'Fire &amp; Smoke Damage Restoration in Kansas City, MO',
    lead:'Complete fire and smoke damage restoration for Kansas City homes and businesses — including the water damage left behind by firefighting.',
    intro:`After a fire, your property often faces three problems at once: fire and soot damage, lingering smoke odor, and <a href="/water-damage-restoration">water damage</a> from firefighting efforts. Our team addresses all of it — extracting water, cleaning soot and smoke residue, removing odors, and restoring your property. Left untreated, firefighting water can also lead to <a href="/mold-remediation">mold</a>, so fast drying matters. We help homeowners across <a href="/service-areas">Kansas City</a>.`,
    subsTitle:'Fire &amp; Smoke Services We Provide',
    subs:[
      {n:'Smoke Damage Cleanup',d:'Cleaning of smoke residue from surfaces, contents, and finishes.'},
      {n:'Soot Removal',d:'Safe removal of soot from walls, ceilings, and belongings.'},
      {n:'Odor Removal',d:'Air scrubbing and deodorizing to neutralize smoke odor, not mask it.'},
      {n:'Water Damage After Fire',d:'Extraction and drying of water used to extinguish the fire.'},
      {n:'Contents Cleaning',d:'Cleaning and restoring salvageable belongings where possible.'},
      {n:'Repairs &amp; Reconstruction',d:'Removal of unsalvageable materials and restoration of affected areas.'},
    ],
    psTitle:'Common Fire &amp; Smoke Problems We Fix',
    ps:[
      {p:'There is standing water everywhere after the fire was put out.',s:'We extract the firefighting water and dry the structure before mold sets in.'},
      {p:'Smoke odor is stuck in the walls and belongings.',s:'We clean residue and use air scrubbing and deodorizing to neutralize the odor.'},
      {p:'Soot has spread across rooms far from the fire.',s:'We clean soot from surfaces and contents throughout the affected areas.'},
      {p:'We do not know what can be saved.',s:'We assess and restore salvageable items and document losses for your insurance.'},
    ],
    faqs:[
      {q:'Why is there water damage after a fire?',a:'Firefighting uses large amounts of water, which soaks into floors, walls, and belongings. Left untreated, this leads to mold, so it needs prompt extraction and drying.'},
      {q:'Can you remove smoke odor completely?',a:'In most cases, yes. We use professional cleaning, air scrubbing, and deodorizing to neutralize smoke odor rather than just masking it.'},
      {q:'What belongings can be saved?',a:'It depends on the extent of the damage. We clean and restore salvageable items and carefully document those that cannot be saved for your insurance claim.'},
      {q:'Do you work with my insurance after a fire?',a:'Yes. We document the fire, smoke, and water damage thoroughly and can bill your insurance directly.'},
    ],
    related:[SVC.water,SVC.storm,SVC.mold,SVC.sewage],
    ctaH:'Recovering From a Fire? We Can Help',
    ctaP:'Call for complete fire, smoke, and water damage restoration across Kansas City.'
  },
];

function servicePage(s){
  const chips = s.related.map(r=>`<a href="/${r.slug}">${r.label}</a>`).join('');
  const body = `
<section class="page-hero"><div class="container">
  <div class="crumbs"><a href="/">Home</a> / <a href="/services">Services</a> / ${SVC[s.key].label}</div>
  <h1>${s.h1}</h1>
  <p class="lead">${s.lead}</p>
  <div style="margin-top:22px">${callBtn()}</div>
</div></section>

<section><div class="container split">
  <div class="prose">
    <p>${s.intro}</p>
    <p>Water damage only gets worse the longer it sits, so we treat every call as urgent. Whether it is a single room or your whole home, we bring the equipment and experience to dry it properly — and we keep you informed at every step. Not sure what you are dealing with? <a href="/contact">Call us</a> and describe what happened; we will tell you exactly what to do next.</p>
  </div>
  <div><img class="feature-img" src="/assets/${s.img}" alt="${SVC[s.key].label} service in Kansas City, MO" loading="lazy"></div>
</div></section>

${subServicesSection(s.subsTitle, s.subs)}
${problemSolution(s.psTitle, s.ps)}
${processSection('How We Handle '+SVC[s.key].label)}
${whyChooseUs('Kansas City')}
${aboutSection('We built this company around fast local response for water, flood, and storm emergencies.')}
${faqSection(SVC[s.key].label.replace('&amp;','&')+' — Questions', s.faqs)}

<section><div class="container center">
  <div class="eyebrow">Related Services</div>
  <div class="chips" style="justify-content:center;margin-top:14px">${chips}</div>
  <p class="muted" style="margin-top:22px">Serving <a href="/service-areas">all of Kansas City</a> · <a href="/">Back to homepage</a> · <a href="${GBP}" rel="nofollow noopener" target="_blank">Google Business Profile</a></p>
</div></section>

${socialShare(s.slug, SVC[s.key].label)}
${ctaBand(s.ctaH, s.ctaP)}
`;
  fs.writeFileSync(path.join(out,s.slug+'.html'), shell({
    title:s.title, desc:s.desc, canonical:s.slug, body,
    ld:graph([serviceLD(s.h1, s.desc, s.slug), faqLD(s.faqs), localBusinessLD('https://'+DOMAIN+'/'+s.slug)])
  }));
  console.log('wrote',s.slug+'.html');
}
services.forEach(servicePage);

// ---------- LOCATION PAGE (per zip area) ----------

// anchor text variation pools for interlinking
const waterAnchors = ['water damage restoration','emergency water extraction','water damage cleanup','professional water removal','24/7 water damage service'];
const moldAnchors = ['mold remediation','professional mold removal','mold treatment','mold cleanup and prevention','mold inspection and removal'];
const basementAnchors = ['flooded basement cleanup','basement water pump-out','basement flood restoration','emergency basement drying','basement flooding service'];
const stormAnchors = ['storm damage restoration','storm and flood cleanup','severe weather damage repair','flood damage restoration','emergency storm response'];
const sewageAnchors = ['sewage cleanup','sewage backup removal','biohazard cleanup','contaminated water cleanup','sewage and black water removal'];
const fireAnchors = ['fire and smoke damage restoration','fire damage cleanup','smoke and soot removal','post-fire water damage cleanup','fire restoration service'];
function pickAnchor(pool, seed){ return pool[Math.abs(seed)%pool.length]; }

function locationPage(t, idx){
  const canonical = 'water-damage-restoration-'+t.slug;
  const near = t.nearby.map(n=>townBySlug[n]).filter(n=>n && n.live);
  const nearLinks = near.length ? near.map(n=>`<a href="${townUrl(n)}">${n.name} (${n.zip})</a>`).join(', ') : '<a href="/service-areas">surrounding Kansas City areas</a>';
  const place = `the ${t.area} area of Kansas City (${t.zip})`;
  const demandLower = t.demand.replace(/&amp;/g,'and').toLowerCase();
  const demandPlain = t.demand.replace(/&amp;/g,'&');
  const introP = demandIntro(t, place);
  const ps = demandPS(t);
  const faqs = demandFAQs(t);
  const s = idx||0;

  // varied anchor texts per page
  const aWater = pickAnchor(waterAnchors, s);
  const aMold = pickAnchor(moldAnchors, s+1);
  const aBasement = pickAnchor(basementAnchors, s+2);
  const aStorm = pickAnchor(stormAnchors, s+3);
  const aSewage = pickAnchor(sewageAnchors, s+4);
  const aFire = pickAnchor(fireAnchors, s+5);

  // sub-services with links to parent service pages
  const allSubs = [
    {n:`<a href="/water-damage-restoration">Water Damage Restoration</a> in ${t.name}`,d:`Emergency water extraction, structural drying, and complete property repair for ${t.name} homes near ${t.feat}.`,k:'water'},
    {n:`<a href="/flooded-basement-cleanup">Flooded Basement Cleanup</a> in ${t.name}`,d:`Rapid pump-outs and thorough drying for flooded basements and sump failures in the ${t.area} area.`,k:'basement'},
    {n:`<a href="/mold-remediation">Mold Remediation</a> in ${t.name}`,d:`Professional containment, safe removal, and antimicrobial treatment of mold caused by water damage in ${t.zip}.`,k:'mold'},
    {n:`<a href="/storm-damage-restoration">Storm &amp; Flood Damage</a> in ${t.name}`,d:`Emergency response to roof leaks, wind-driven rain, and flash flooding near ${t.feat}.`,k:'storm'},
    {n:`<a href="/sewage-cleanup">Sewage Cleanup</a> in ${t.name}`,d:`Safe removal and hospital-grade sanitizing of sewage backups and contaminated water in the ${t.area} area.`,k:'sewage'},
    {n:`<a href="/fire-smoke-damage">Fire &amp; Smoke Damage</a> in ${t.name}`,d:`Water, soot, and smoke odor cleanup after fires for ${t.name} properties.`,k:'fire'},
  ];
  const km = {pipe:'water',basement:'basement',extract:'water',mold:'mold',storm:'storm',ceiling:'water',sewage:'sewage',drying:'water'};
  const lk = km[dCat(t.demand)]||'water';
  const lead = allSubs.find(ss=>ss.k===lk);
  const rest = allSubs.filter(ss=>ss.k!==lk);
  const subs = [lead,...rest];

  const areaMapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(t.name+', Kansas City, MO '+t.zip)}&z=13&output=embed`;

  // landmarks list
  const lmArr = t.lm ? t.lm.split(', ') : [];
  const lmSection = lmArr.length ? `
<section><div class="container">
  <div class="section-head"><div class="eyebrow">${t.name} Landmarks</div><h2>Serving Homes &amp; Businesses Near</h2></div>
  <div class="grid grid-3">${lmArr.map(l=>`<div class="card" style="text-align:center;padding:24px 16px"><span class="ico">${I.pin}</span><h3 style="font-size:1rem">${l}</h3></div>`).join('')}</div>
  <p class="center muted" style="margin-top:20px">If you live or work near any of these ${t.name} landmarks and need <a href="/water-damage-restoration">${aWater}</a>, we can be there fast — usually within 45 minutes from our <a href="/locations">${t.loc.short} location</a>.</p>
</div></section>` : '';

  // unique housing/area-risk paragraph
  const housingP = t.housing ? `<p>The ${t.name} area (zip code ${t.zip}) features ${t.housing}. This means <a href="/">${BIZ_NAME}</a> crews dispatched to ${t.name} need to be equipped for the specific challenges these properties present — and we are. Whether you need <a href="/flooded-basement-cleanup">${aBasement}</a> after groundwater intrusion, <a href="/mold-remediation">${aMold}</a> from lingering moisture, or <a href="/storm-damage-restoration">${aStorm}</a> after a severe weather event, our team knows the building types and common failure points in this part of Kansas City.</p>` : '';

  // deep-link paragraph with varied anchors into service pages
  const deepLinkP = `<p>As a full-service <a href="/">Kansas City water damage restoration company</a>, we handle the complete range of emergencies in ${t.name}: <a href="/water-damage-restoration">${aWater}</a> for burst pipes and appliance leaks, <a href="/flooded-basement-cleanup">${aBasement}</a> when rain or groundwater overwhelms your drainage, <a href="/mold-remediation">${aMold}</a> for moisture-related growth, <a href="/storm-damage-restoration">${aStorm}</a> from severe Kansas City weather, <a href="/sewage-cleanup">${aSewage}</a> when contaminated water enters your home, and <a href="/fire-smoke-damage">${aFire}</a> including the water damage firefighting leaves behind. We serve ${t.name} from our <a href="/locations">${t.loc.name} location</a> and cover <a href="/service-areas">50+ zip codes across Kansas City</a>.</p>`;

  // nearby areas section with more context
  const nearSection = near.length ? `
<section><div class="container">
  <div class="section-head"><div class="eyebrow">Nearby Areas</div><h2>We Also Serve These Areas Near ${t.name}</h2><p class="muted">Our ${t.loc.short} crew covers ${t.name} and all surrounding neighborhoods. Click any area below for local water damage details.</p></div>
  <div class="grid grid-3">${near.map(n=>`<a class="card" href="${townUrl(n)}"><span class="ico">${I.pin}</span><h3>${n.name} (${n.zip})</h3><p>24/7 ${n.demand.replace(/&amp;/g,'&').toLowerCase()} and water damage cleanup.</p><span class="more">View ${n.name} →</span></a>`).join('')}</div>
</div></section>` : '';

  // BreadcrumbList schema
  const breadcrumbLD = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item":"https://"+DOMAIN+"/"},
    {"@type":"ListItem","position":2,"name":"Service Areas","item":"https://"+DOMAIN+"/service-areas"},
    {"@type":"ListItem","position":3,"name":t.name+" ("+t.zip+")","item":"https://"+DOMAIN+"/"+canonical}
  ]};

  const body = `
<section class="page-hero"><div class="container">
  <div class="crumbs"><a href="/">Home</a> / <a href="/service-areas">Service Areas</a> / <a href="/locations">${t.loc.name}</a> / ${t.name} (${t.zip})</div>
  <h1>${t.demand} &amp; Water Damage Restoration in ${t.name}, Kansas City MO ${t.zip}</h1>
  <p class="lead">24/7 emergency ${demandLower}, water extraction, flood cleanup, and <a href="/mold-remediation" style="color:#fff;text-decoration:underline">mold remediation</a> for ${t.name} homes and businesses — fast local response from our <a href="/locations" style="color:#fff;text-decoration:underline">${t.loc.short} crew</a>. Serving all of <a href="/" style="color:#fff;text-decoration:underline">Kansas City, MO</a>.</p>
  <div style="margin-top:22px">${callBtn('Call Now — '+PHONE_DISPLAY)}<a class="btn btn-ghost" href="/services" style="margin-left:12px">All Services</a></div>
</div></section>

<section class="loc-map-band"><div class="container" style="max-width:100%;padding:0">
  <iframe src="${areaMapSrc}" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" title="Map of ${t.name}, Kansas City MO ${t.zip} — Water Damage Service Area"></iframe>
</div></section>

<section><div class="container split">
  <div class="prose">
    <h2>${demandPlain} for ${t.name} Properties (${t.zip})</h2>
    <p>${introP}</p>
    ${housingP}
    ${deepLinkP}
  </div>
  <div><img class="feature-img" src="/assets/${t.img}" alt="${demandPlain} and water damage restoration in ${t.name}, Kansas City MO ${t.zip}" loading="lazy"></div>
</div></section>

${lmSection}
${subServicesSection(t.demand+' &amp; Full Restoration Services in '+t.name+' ('+t.zip+')', subs)}
${problemSolution(demandPlain+' &amp; Other Problems We Fix in '+t.name, ps)}
${processSection('How We Restore '+t.name+' Properties After Water Damage')}
${whyChooseUs(t.name)}

<section class="section-soft"><div class="container split">
  <div class="prose">
    <div class="eyebrow">Your Local Team</div>
    <h2>Why ${t.name} Homeowners Trust ${BIZ_NAME}</h2>
    <p>We are a metro-wide Kansas City team with <a href="/locations">4 locations</a> strategically placed across the city, which is why we can respond so quickly to ${t.name} emergencies. Our <a href="/locations">${t.loc.name} location</a> is the closest crew to the ${t.area} area, giving you faster response times than companies that dispatch from across town.</p>
    <p>From initial <a href="/water-damage-restoration">${pickAnchor(waterAnchors, s+6)}</a> to final repairs, we handle every stage in-house — no subcontractors, no handoffs. We document the damage thoroughly for your insurance, and we can <a href="/contact">bill your insurer directly</a> so you are not stuck managing the claim alone. Our crews follow IICRC industry standards using commercial-grade equipment to ensure your ${t.name} property is dried properly, not just surface-dry.</p>
    <p>See what other Kansas City homeowners say about us on our <a href="${GBP}" rel="nofollow noopener" target="_blank">Google Business Profile</a>, or explore all the <a href="/service-areas">neighborhoods we serve</a>.</p>
    <p style="margin-top:22px">${callBtn()}</p>
  </div>
  <div><img class="feature-img" src="/assets/technician.jpg" alt="${BIZ_NAME} technician working in ${t.name}, Kansas City MO" loading="lazy"></div>
</div></section>

<section class="section-navy"><div class="container">
  <div class="section-head"><div class="eyebrow" style="color:var(--gold)">Find Us</div><h2 style="color:#fff">Serving ${t.name} (${t.zip}) From Our ${t.loc.short} Location</h2></div>
  <iframe class="map-frame" src="${t.loc.mapEmbed}" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" title="${BIZ_NAME} ${t.loc.name} location serving ${t.name}, Kansas City MO ${t.zip}" style="border:3px solid rgba(255,255,255,.15);border-radius:12px"></iframe>
  <p class="center" style="margin-top:18px;color:rgba(255,255,255,.8)"><strong>${t.loc.addr}</strong> · <a href="tel:${PHONE_TEL}" style="color:#fff;font-weight:700">${PHONE_DISPLAY}</a> · <a href="${t.loc.gbp}" rel="nofollow noopener" target="_blank" style="color:var(--gold)">Get directions →</a></p>
</div></section>

${nearSection}

${faqSection(demandPlain+' in '+t.name+', Kansas City MO '+t.zip+' — FAQs', faqs)}

<section><div class="container center">
  <div class="eyebrow">Related Services for ${t.name}</div>
  <div class="chips" style="justify-content:center;margin-top:14px">
    <a href="/water-damage-restoration">Water Damage</a>
    <a href="/mold-remediation">Mold Remediation</a>
    <a href="/flooded-basement-cleanup">Basement Flooding</a>
    <a href="/storm-damage-restoration">Storm Damage</a>
    <a href="/sewage-cleanup">Sewage Cleanup</a>
    <a href="/fire-smoke-damage">Fire Damage</a>
  </div>
  <p class="muted" style="margin-top:18px"><a href="/service-areas">All ${liveTowns.length} service areas</a> · <a href="/services">All services</a> · <a href="/">Kansas City water damage restoration homepage</a> · <a href="/about">About our team</a> · <a href="/contact">Contact us</a></p>
</div></section>

${socialShare(canonical, demandPlain+' in '+t.name+', Kansas City MO')}
${ctaBand(demandPlain+' in '+t.name+'? Call Now — 24/7', 'We dispatch to '+t.name+' ('+t.zip+') and the surrounding Kansas City metro around the clock. Speak to a real person right now.')}
`;
  fs.writeFileSync(path.join(out,canonical+'.html'), shell({
    title:`${demandPlain} & Water Damage Restoration ${t.name}, Kansas City MO ${t.zip} | ${PHONE_DISPLAY}`,
    desc:`24/7 ${demandLower} and water damage restoration in ${t.name}, Kansas City MO (${t.zip}). Water extraction, mold remediation, basement flooding, and storm cleanup near ${t.lm.split(', ')[0]||t.feat}. Fast local response — call ${PHONE_DISPLAY}.`,
    canonical, body,
    ld:graph([serviceLD(demandPlain+' & Water Damage Restoration in '+t.name+' ('+t.zip+')', `${demandPlain}, water damage restoration, flood cleanup, and mold remediation in ${t.name}, Kansas City MO ${t.zip}. Serving ${t.lm}.`, canonical), faqLD(faqs), localBusinessLD('https://'+DOMAIN+'/'+canonical, t.loc), breadcrumbLD])
  }));
  console.log('wrote',canonical+'.html');
}
liveTowns.forEach((t,i)=>locationPage(t,i));

// ---------- HOME ----------
(function home(){
  const body = `
<section class="hero"><div class="container">
  <span class="badge">⚡ Available 24/7 · 4 Locations Across Kansas City</span>
  <div class="split" style="align-items:center">
    <div>
      <h1>Water Damage Restoration in Kansas City, MO</h1>
      <p class="lead">Burst pipe, flooded basement, or storm damage? Our IICRC-standard crews are on call around the clock from four KC locations for fast water extraction, structural drying, and full restoration — so your home or business gets back to normal quickly.</p>
      <div class="hero-cta">${callBtn()}<a class="btn btn-ghost" href="/services">Our Services</a></div>
      <div class="hero-trust">
        <div>${I.shield} Licensed &amp; Insured</div>
        <div>${I.shield} IICRC-Standard Crews</div>
        <div>${I.shield} Direct Insurance Billing</div>
      </div>
    </div>
    <div class="hero-figure"><img src="/assets/hero-flood.jpg" alt="Flooded home needing water damage restoration in Kansas City, MO" loading="eager"></div>
  </div>
</div></section>

<section class="section-navy" style="padding:40px 0"><div class="container"><div class="stats">
  <div class="stat"><b>24/7</b><span>Emergency Dispatch</span></div>
  <div class="stat"><b>~45min</b><span>Local Response Time</span></div>
  <div class="stat"><b>4</b><span>Metro KC Locations</span></div>
  <div class="stat"><b>50+</b><span>Areas Served</span></div>
</div></div></section>

<section><div class="container">
  <div class="section-head"><div class="eyebrow">What We Do</div><h2>Complete Water Damage &amp; Restoration Services</h2><p class="muted">From the first emergency call to the final repair, we handle every stage of the restoration process for Kansas City homeowners and businesses.</p></div>
  ${serviceCards()}
</div></section>

<section class="section-soft"><div class="container split">
  <div>
    <div class="eyebrow">Why Kansas City Trusts Us</div>
    <h2>Fast, Professional Restoration When Every Minute Counts</h2>
    <p class="muted">Water spreads fast — within hours it soaks into drywall, subfloors, and framing, and within 24–48 hours mold can begin to grow. We answer the phone day and night and get a crew to your door quickly to stop the damage before it spreads.</p>
    <ul class="check-list">
      <li>${I.check} <span><b>24/7 live dispatch</b> — a real person answers, any hour, any day.</span></li>
      <li>${I.check} <span><b>4 locations across the metro</b> — central, north, south, and east KC.</span></li>
      <li>${I.check} <span><b>We work with your insurance</b> — documentation, photos, and direct billing.</span></li>
      <li>${I.check} <span><b>Industry-standard drying</b> using commercial extractors, air movers, and dehumidifiers.</span></li>
    </ul>
    <p style="margin-top:22px"><a class="btn btn-green" href="tel:${PHONE_TEL}">Call for Immediate Help</a></p>
  </div>
  <div><img class="feature-img" src="/assets/technician.jpg" alt="Water damage restoration technician working in a Kansas City home" loading="lazy"></div>
</div></section>

<section><div class="container"><div class="img-band">
  <img src="/assets/water-damage-room.jpg" alt="Water-damaged room being restored in Kansas City" loading="lazy">
  <img src="/assets/ceiling-damage.jpg" alt="Ceiling water damage repair in Kansas City, MO" loading="lazy">
  <img src="/assets/flooded-basement.jpg" alt="Flooded basement cleanup in Kansas City" loading="lazy">
</div></div></section>

${problemSolution('Common Water Emergencies We Solve', [
  {p:'A pipe burst and water is spreading fast.',s:'We extract standing water immediately and begin structural drying the same visit — see our <a href="/water-damage-restoration">water damage restoration</a> service.'},
  {p:'The basement flooded after heavy rain.',s:'We pump it out and dry it down with <a href="/flooded-basement-cleanup">flooded basement cleanup</a> before mold can start.'},
  {p:'There is mold from a slow, hidden leak.',s:'We contain and remove it with professional <a href="/mold-remediation">mold remediation</a> and fix the moisture source.'},
  {p:'A storm sent water pouring inside.',s:'We respond fast for <a href="/storm-damage-restoration">storm and flood damage</a>, stopping the intrusion and drying the structure.'},
])}

${processSection()}
${whyChooseUs('Kansas City')}
${reviewsSection()}

<section><div class="container">
  <div class="section-head"><div class="eyebrow">Our Locations</div><h2>4 Locations Across Kansas City</h2><p class="muted">Strategically positioned for fast response to any neighborhood in the metro.</p></div>
  <div class="loc-cards">${LOCATIONS.map(l=>`<div class="loc-card">
    <iframe src="${l.mapEmbed}" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" title="${l.name} location map"></iframe>
    <div class="loc-card-body"><h3>${l.name}</h3><p>${l.addr}</p><a href="/locations">${l.zips.length} zip codes served →</a></div>
  </div>`).join('')}</div>
</div></section>

<section><div class="container">
  <div class="section-head"><div class="eyebrow">Where We Work</div><h2>Serving 50+ Kansas City Neighborhoods</h2><p class="muted">Fast local response across Kansas City. Choose your area for local details.</p></div>
  <div class="area-grid">${liveTowns.map(t=>`<a href="${townUrl(t)}">${t.name} (${t.zip})</a>`).join('')}</div>
  <p class="center" style="margin-top:26px"><a class="btn btn-green" href="/service-areas">View All Service Areas</a></p>
</div></section>

${faqSection('Common Questions', [
  {q:'How fast can you get to my home?',a:'With four locations across Kansas City, we aim to have a crew on-site within about 45 minutes of your call anywhere in the metro. We treat every call as urgent and dispatch 24/7.'},
  {q:'Do you work with insurance companies?',a:'Yes. We document the damage with photos and moisture readings, provide detailed estimates, and can bill your insurance directly.'},
  {q:'How long does the drying process take?',a:'Most residential water damage takes 3–5 days to dry completely, depending on the amount of water, materials affected, and humidity. We monitor moisture levels daily.'},
  {q:'Can water damage cause mold?',a:'Yes — mold can begin growing within 24–48 hours of water exposure. That is why fast extraction and thorough drying are so important.'},
  {q:'What areas do you serve?',a:'We serve all of Kansas City, MO — from Downtown and Midtown to Gladstone, Hickman Mills, Blue Ridge, the Northland, and 50+ zip codes across the metro.'},
])}

${socialShare('', 'Water Damage Restoration in Kansas City, MO')}
${ctaBand('Water Damage Cannot Wait — Neither Do We', 'Call now for immediate 24/7 emergency response across Kansas City. A real person is standing by to help.')}
`;
  fs.writeFileSync(path.join(out,'index.html'), shell({
    title:`${BIZ_NAME} | 24/7 Water Extraction, Flood &amp; Mold Cleanup — ${PHONE_DISPLAY}`,
    desc:`24/7 emergency water damage restoration in Kansas City, MO. Water extraction, flooded basement cleanup, mold remediation, storm and sewage cleanup. 4 locations — call ${PHONE_DISPLAY}.`,
    canonical:'', body,
    ld:graph([localBusinessLD('https://'+DOMAIN+'/')])
  }));
  console.log('wrote index.html');
})();

// ---------- SERVICES HUB ----------
(function servicesHub(){
  const body = `
<section class="page-hero"><div class="container">
  <div class="crumbs"><a href="/">Home</a> / Services</div>
  <h1>Water Damage &amp; Restoration Services in Kansas City, MO</h1>
  <p class="lead">Complete emergency restoration for homes and businesses across Kansas City — available 24/7 from 4 metro locations.</p>
  <div style="margin-top:22px">${callBtn()}</div>
</div></section>
<section><div class="container">${serviceCards()}</div></section>
${problemSolution('Problems We Solve Every Day', [
  {p:'Sudden flooding from a pipe, appliance, or storm.',s:'Fast extraction and drying through our <a href="/water-damage-restoration">water damage restoration</a> service.'},
  {p:'Water pooling in a basement or crawl space.',s:'Complete pump-outs with <a href="/flooded-basement-cleanup">flooded basement cleanup</a>.'},
  {p:'Mold from moisture that was never fully dried.',s:'Safe containment and removal via <a href="/mold-remediation">mold remediation</a>.'},
  {p:'Contaminated water from a sewage backup.',s:'Safe, sanitized <a href="/sewage-cleanup">sewage and biohazard cleanup</a>.'},
])}
${processSection('The Restoration Process')}
${whyChooseUs('Kansas City')}
${aboutSection('Every service below is delivered by the same local, 24/7 team.')}
${socialShare('services', 'Water Damage Restoration Services')}
<section><div class="container"><div class="cta-band">
  <h2>Not Sure Which Service You Need?</h2>
  <p>Call us and describe what happened — we will tell you exactly what to do next and dispatch a crew right away.</p>
  ${callBtn()}
</div></div></section>
`;
  fs.writeFileSync(path.join(out,'services.html'), shell({
    title:`Water Damage &amp; Restoration Services Kansas City, MO | ${PHONE_DISPLAY}`,
    desc:`Full-service water damage restoration in Kansas City, MO: water extraction, structural drying, mold remediation, flooded basement, storm, sewage, and fire cleanup. Call ${PHONE_DISPLAY}.`,
    canonical:'services', body,
    ld:graph([localBusinessLD('https://'+DOMAIN+'/services')])
  }));
  console.log('wrote services.html');
})();

// ---------- ABOUT ----------
(function about(){
  const body = `
<section class="page-hero"><div class="container">
  <div class="crumbs"><a href="/">Home</a> / About</div>
  <h1>About ${BIZ_NAME}</h1>
  <p class="lead">Your local, 24/7 water damage and restoration team — 4 locations across the Kansas City metro.</p>
</div></section>

<section><div class="container split">
  <div class="prose">
    <p>${BIZ_NAME} is a locally operated emergency restoration company helping homeowners and businesses recover from water, flood, storm, mold, sewage, and fire damage across the entire Kansas City metro. We know how stressful a water emergency can be — that is why we answer the phone day and night and get a crew to your door fast.</p>
    <h2>4 Locations for Faster Response</h2>
    <p>With <a href="/locations">four strategically placed locations</a> — central KC, north KC/Gladstone, south KC/Hickman Mills, and east KC/Blue Ridge — we can reach any neighborhood in the metro within about 45 minutes. Whether you are in <a href="/water-damage-restoration-downtown-mo-64101">Downtown</a>, <a href="/water-damage-restoration-gladstone-mo-64118">Gladstone</a>, <a href="/water-damage-restoration-waldo-mo-64113">Waldo</a>, or <a href="/water-damage-restoration-blue-ridge-mo-64133">Blue Ridge</a>, there is a crew nearby.</p>
    <h2>Trained, Equipped, and Insured</h2>
    <p>Our crews follow IICRC industry standards and use commercial-grade extraction, drying, and sanitizing equipment for <a href="/water-damage-restoration">water damage restoration</a>, <a href="/mold-remediation">mold remediation</a>, and more. We are licensed and insured, and we document every job carefully so your insurance claim goes smoothly.</p>
  </div>
  <div><img class="feature-img" src="/assets/technician.jpg" alt="Kansas City water damage restoration team" loading="lazy"></div>
</div></section>

${problemSolution('What We Help People Through', [
  {p:'A water emergency at the worst possible time.',s:'We answer 24/7 and dispatch immediately from the nearest of our 4 locations.'},
  {p:'Confusion about the insurance claim.',s:'We document everything and can bill your insurer directly to simplify the process.'},
  {p:'Worry that damage is hidden behind walls.',s:'We use moisture meters to find and dry hidden water before it becomes mold.'},
  {p:'Not knowing who to trust.',s:'We are a licensed, insured, local team that keeps you informed at every step.'},
])}
${whyChooseUs('Kansas City')}

<section class="section-navy" style="padding:44px 0"><div class="container"><div class="stats">
  <div class="stat"><b>24/7</b><span>Emergency Dispatch</span></div>
  <div class="stat"><b>~45min</b><span>Local Response</span></div>
  <div class="stat"><b>4</b><span>KC Locations</span></div>
  <div class="stat"><b>50+</b><span>Zip Codes Served</span></div>
</div></div></section>

${socialShare('about', 'About '+BIZ_NAME)}
${ctaBand('Water Emergency? We Are Here to Help', 'Call our 24/7 emergency line and speak to a real person right now.')}
`;
  fs.writeFileSync(path.join(out,'about.html'), shell({
    title:`About Us | ${BIZ_NAME} | ${PHONE_DISPLAY}`,
    desc:`Local, 24/7 water damage restoration company with 4 locations across Kansas City, MO. Licensed, insured, IICRC-standard crews. Call ${PHONE_DISPLAY}.`,
    canonical:'about', body,
    ld:graph([localBusinessLD('https://'+DOMAIN+'/about')])
  }));
  console.log('wrote about.html');
})();

// ---------- SERVICE AREAS HUB ----------
(function areas(){
  const zoneCards = (zone, label) => {
    const zt = liveTowns.filter(t=>t.zone===zone);
    if(!zt.length) return '';
    return `<div><h3 style="margin-top:30px">${label}</h3><div class="grid grid-3">${zt.map(t=>`<a class="card" href="${townUrl(t)}"><span class="ico">${I.pin}</span><h3>${t.name} (${t.zip})</h3><p>24/7 ${t.demand.replace(/&amp;/g,'&').toLowerCase()} and water damage cleanup.</p><span class="more">View ${t.name} →</span></a>`).join('')}</div></div>`;
  };
  const body = `
<section class="page-hero"><div class="container">
  <div class="crumbs"><a href="/">Home</a> / Service Areas</div>
  <h1>Service Areas — Water Damage Restoration Across Kansas City, MO</h1>
  <p class="lead">We provide 24/7 emergency water damage restoration across 50+ Kansas City zip codes from 4 metro locations. Choose your area for local details.</p>
  <div style="margin-top:22px">${callBtn()}</div>
</div></section>

<section><div class="container">
  <div class="section-head left"><div class="eyebrow">Where We Work</div><h2>Communities We Serve</h2><p class="muted">Fast local response — usually within about 45 minutes. Every area below has its own page with local water damage, <a href="/flooded-basement-cleanup">basement flooding</a>, and <a href="/mold-remediation">mold</a> details.</p></div>
  ${zoneCards('central','Central Kansas City')}
  ${zoneCards('north','North Kansas City / Northland')}
  ${zoneCards('south','South Kansas City')}
  ${zoneCards('east','East Kansas City')}
</div></section>

${whyChooseUs('Kansas City')}

<section class="section-soft"><div class="container">
  <div class="section-head"><div class="eyebrow">Our Locations</div><h2>4 Locations Across the Metro</h2></div>
  <div class="loc-cards">${LOCATIONS.map(l=>`<div class="loc-card">
    <iframe src="${l.mapEmbed}" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" title="${l.name} service area map"></iframe>
    <div class="loc-card-body"><h3>${l.name}</h3><p>${l.addr}</p><p>${l.zips.length} zip codes covered</p></div>
  </div>`).join('')}</div>
</div></section>

${socialShare('service-areas', 'Water Damage Service Areas — Kansas City MO')}
${ctaBand('Need Emergency Service in Your Area?', 'Call now — we dispatch 24/7 across the entire Kansas City metro.')}
`;
  fs.writeFileSync(path.join(out,'service-areas.html'), shell({
    title:`Service Areas | Water Damage Restoration Across Kansas City, MO | ${PHONE_DISPLAY}`,
    desc:`Water damage restoration service areas across Kansas City, MO — 50+ zip codes, 4 locations. 24/7 response — call ${PHONE_DISPLAY}.`,
    canonical:'service-areas', body,
    ld:graph([localBusinessLD('https://'+DOMAIN+'/service-areas')])
  }));
  console.log('wrote service-areas.html');
})();

// ---------- LOCATIONS PAGE (4 physical) ----------
(function locationsPage(){
  const body = `
<section class="page-hero"><div class="container">
  <div class="crumbs"><a href="/">Home</a> / Our Locations</div>
  <h1>Our 4 Kansas City Locations</h1>
  <p class="lead">Strategically positioned across the metro for fast emergency response to any neighborhood in Kansas City.</p>
  <div style="margin-top:22px">${callBtn()}</div>
</div></section>

<section><div class="container">
${LOCATIONS.map(l=>{
  const zt = liveTowns.filter(t=>t.zone===l.id);
  const areaLinks = zt.map(t=>`<a href="${townUrl(t)}">${t.name} (${t.zip})</a>`).join('');
  return `
  <div style="margin-bottom:60px">
    <h2>${l.name}</h2>
    <p><strong>Address:</strong> ${l.addr}<br><strong>Phone:</strong> <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a><br><strong>Hours:</strong> Open 24/7 — Emergency Service<br><strong>Zip codes served:</strong> ${l.zips.join(', ')}</p>
    <iframe class="map-frame" src="${l.mapEmbed}" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" title="${l.name} location map" style="margin:20px 0"></iframe>
    ${zt.length ? `<div class="area-grid" style="margin-top:16px">${areaLinks}</div>` : ''}
    <p style="margin-top:16px"><a href="${l.gbp}" rel="nofollow noopener" target="_blank">View on Google Maps →</a></p>
  </div>`;
}).join('')}
</div></section>

${whyChooseUs('Kansas City')}
${socialShare('locations', 'Our Kansas City Locations')}
${ctaBand('Water Emergency? Call Our Nearest Location', 'All 4 locations are staffed 24/7 with crews ready to dispatch across the Kansas City metro.')}
`;
  fs.writeFileSync(path.join(out,'locations.html'), shell({
    title:`Our 4 Locations | ${BIZ_NAME} | ${PHONE_DISPLAY}`,
    desc:`${BIZ_NAME} operates from 4 locations across Kansas City, MO — central, north, south, and east KC — for fast 24/7 emergency response. Call ${PHONE_DISPLAY}.`,
    canonical:'locations', body,
    ld:graph([...LOCATIONS.map(l=>localBusinessLD('https://'+DOMAIN+'/locations', l))])
  }));
  console.log('wrote locations.html');
})();

// ---------- CONTACT ----------
(function contact(){
  const body = `
<section class="page-hero"><div class="container">
  <div class="crumbs"><a href="/">Home</a> / Contact</div>
  <h1>Contact ${BIZ_NAME}</h1>
  <p class="lead">Water emergency? The fastest way to reach us is by phone — we answer 24/7.</p>
</div></section>

<section><div class="container"><div class="contact-grid">
  <div>
    <h2>Get in Touch</h2>
    <div class="info-row"><span class="ico">${I.phone}</span><div><b>Call Us (24/7)</b><a href="tel:${PHONE_TEL}" style="font-weight:700">${PHONE_DISPLAY}</a></div></div>
    <div class="info-row"><span class="ico">${I.pin}</span><div><b>Locations</b><a href="/locations">4 locations across Kansas City, MO</a></div></div>
    <div class="info-row"><span class="ico">${I.clock}</span><div><b>Hours</b>Open 24 hours — 7 days a week<br>Emergency service always available</div></div>
    <div class="info-row"><span class="ico">${I.shield}</span><div><b>Coverage</b><a href="/service-areas">50+ Kansas City zip codes</a></div></div>
    <p style="margin-top:26px">${callBtn()}</p>
    <p class="muted" style="margin-top:14px"><a href="${GBP}" rel="nofollow noopener" target="_blank">View our Google Business Profile →</a> · <a href="/">Back to homepage</a></p>
  </div>
  <div><iframe class="map-frame" style="height:100%;min-height:420px" src="${MAP}" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" title="${BIZ_NAME} location map"></iframe></div>
</div></div></section>

${socialShare('contact', 'Contact '+BIZ_NAME)}
${ctaBand('Do Not Wait — Water Damage Gets Worse by the Hour', 'Call our 24/7 emergency line now and we will dispatch a crew right away.')}
`;
  fs.writeFileSync(path.join(out,'contact.html'), shell({
    title:`Contact Us | ${BIZ_NAME} | ${PHONE_DISPLAY}`,
    desc:`Contact ${BIZ_NAME} for 24/7 emergency service. Call ${PHONE_DISPLAY}. 4 locations across Kansas City, MO. Serving 50+ zip codes.`,
    canonical:'contact', body,
    ld:graph([localBusinessLD('https://'+DOMAIN+'/contact')])
  }));
  console.log('wrote contact.html');
})();

// ---------- SITEMAP + ROBOTS ----------
(function sitemap(){
  const urls = ['','services','water-damage-restoration','mold-remediation','flooded-basement-cleanup','storm-damage-restoration','sewage-cleanup','fire-smoke-damage','service-areas','locations','about','contact']
    .concat(liveTowns.map(t=>'water-damage-restoration-'+t.slug));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+
    urls.map(u=>`  <url><loc>https://${DOMAIN}/${u}</loc><changefreq>${u===''?'weekly':'monthly'}</changefreq><priority>${u===''?'1.0':(u.startsWith('water-damage-restoration-')?'0.7':'0.8')}</priority></url>`).join('\n')+
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(out,'sitemap.xml'), body);
  fs.writeFileSync(path.join(out,'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: https://${DOMAIN}/sitemap.xml\n`);
  console.log('wrote sitemap.xml ('+urls.length+' urls) + robots.txt');
})();

const scheduled = towns.length - liveTowns.length;
console.log(`\nDrip status (TODAY=${TODAY}, LAUNCH=${LAUNCH}): ${liveTowns.length}/${towns.length} location pages LIVE, ${scheduled} scheduled.`);
if(scheduled>0){
  const next = towns.filter(t=>!t.live).sort((a,b)=>a.pub<b.pub?-1:1).slice(0,3);
  console.log('Next up: '+next.map(t=>`${t.name} (${t.pub})`).join(', '));
}
console.log('All pages done → dist/');
