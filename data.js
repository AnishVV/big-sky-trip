// All content below is pulled from the vault notes in Travel Planning/Experts Only - Big Sky/.
// flag:true = unconfirmed / needs re-check (shown with an amber tag).
const EVENT = { start:'2027-03-13', end:'2027-03-14', today:()=>new Date() };

const TASKS = [
  {id:1, t:'Buy festival tickets (2-day)', done:true, g:'Done', note:'$420 each, Flicket, final sale'},
  {id:2, t:'Book lodging: The House that Jack Built', done:true, g:'Done', note:'Booked. $8,904 for 4 nights'},
  {id:3, t:'Research lift tickets, Ikon pass & rentals', done:true, g:'Done', note:'See Budget + Bookings'},
  {id:4, t:'Confirm final headcount', g:'Group', note:'Sets lodging: $1,113 at 8, $636 at 14, $557 at 16'},
  {id:5, t:'Collect each person\'s house share from whoever paid', g:'Group'},
  {id:7, t:'Check the bunk beds are adult-sized (house sleeps 16)', g:'Lodging'},
  {id:8, t:'Book flights into BZN (in Fri Mar 12, out Tue Mar 16)', g:'Travel', note:'~$500 cash or ~40k points'},
  {id:9, t:'Reserve rental cars (AWD / winter tires, ~3 cars)', g:'Travel', note:'Est. $452.84 per car'},
  {id:10, t:'Price Ikon Session 2-day + Lone Peak Tram fee', g:'Skiing'},
  {id:11, t:'Buy lift tickets / passes for Mar 13–14', g:'Skiing'},
  {id:12, t:'Reserve ski/snowboard rentals (online 24h+ ahead = 20% off)', g:'Skiing'},
  {id:13, t:'Check Experts Only package + EO Express shuttle price', g:'Festival'},
  {id:14, t:'Make dinner reservations (check vegetarian options)', g:'Food'},
  {id:15, t:'Set a "do not exceed" per-person number', g:'Money'},
  {id:16, t:'Watch for lineup & gate times (expected Jan–Feb 2027)', g:'Festival'}
];

const ITINERARY = [
  {date:'Fri Mar 12', short:'Mar 12', items:[
    {icon:'plane', t:'Arrive in Bozeman (BZN)', sub:'Flight + rental car', note:'Big Sky is ~51 mi / 1h15 south. Winter tires or AWD recommended.', flag:true, flagText:'Flights not booked'},
    {icon:'home', t:'Check into Airbnb', sub:'Big Sky, MT', note:'The House that Jack Built, 397 Beaver Creek Rd. Check-in 3:00 PM.'},
    {icon:'cart', t:'Stock the kitchens', sub:'Roxy\'s Market, Town Center', note:'Open 8 am–9 pm daily. Two full kitchens in the house.'}
  ]},
  {date:'Sat Mar 13', short:'Mar 13', items:[
    {icon:'ski', t:'Ski day 1 (optional)', sub:'Big Sky Resort', note:'Pick up rentals; Ikon Session or day ticket. Lone Peak Tram not on Ikon Session.'},
    {icon:'music', t:'Experts Only – Show 1', sub:'Big Sky Events Arena', note:'Listing shows 5–11 pm; gate times still TBA. Outdoor, 21+, ID required. No re-entry.', flag:true, flagText:'Times provisional'}
  ]},
  {date:'Sun Mar 14', short:'Mar 14', items:[
    {icon:'ski', t:'Lighter morning, ski day 2', sub:'Big Sky Resort', note:'Past attendees were wiped the day after; plan accordingly.'},
    {icon:'music', t:'Experts Only – Show 2', sub:'Big Sky Events Arena', note:'2-day pass holders scan in each day.', flag:true, flagText:'Times provisional'}
  ]},
  {date:'Mon Mar 15', short:'Mar 15', items:[
    {icon:'ski', t:'Optional 3rd ski day / rest day', sub:'Big Sky Resort', note:'Ikon Session has 3 and 4 day tiers (prices not found).'},
    {icon:'pin', t:'Bozeman Hot Springs', sub:'Bozeman, MT', note:'Weekday entry ~$20–22 pp (guide prices, unverified for 2027). Open year-round. Good recovery after the festival.', flag:true, flagText:'Price unverified'}
  ]},
  {date:'Tue Mar 16', short:'Mar 16', items:[
    {icon:'home', t:'Check out of Airbnb', sub:'10:00 AM', note:'Return rental cars.'},
    {icon:'plane', t:'Fly home from BZN', sub:'Allow ~1h15 drive + Gallatin Canyon winter conditions', note:'Check Montana 511 before driving.'}
  ]}
];

const BUDGET = {
  perPerson:2453, people:14, lodgingTotal:8904, paid:420,
  lines:[ // base scenario, per person
    ['Festival ticket (2-day)',420,'Already bought'],
    ['Lodging (4 nights, $8,904 / 14)',636,'The House that Jack Built'],
    ['Flight',500,'or ~40k points'],
    ['Lift tickets (Ikon Session, 2-day)',370,'"from" price; Tram not included'],
    ['Gear rental (2 days)',100,'$50/day'],
    ['Car / ground (3 cars, split)',114,'$452.84 rental + $80 gas/parking each'],
    ['Groceries (Fri–Sun)',63,'~$21/day × 3; house has 2 full kitchens'],
    ['Meals & drinks out (Fri–Sun)',150,'~$50/day; lunches, a few dinners, show-night drinks'],
    ['Extras',100,'Drinks, merch, warmers, tips']
  ],
  scenarios:{
    cols:['A. Lean','B. Base','C. Splurge','D. Show only'],
    rows:[
      ['Headcount','16','14','8','14'],['Festival ticket','$420','$420','$420','$420'],
      ['Lodging','$557','$636','$1,113','$636'],['Flight','$0 (40k pts)','$500','$600','$500'],
      ['Lift tickets','$180','$370','$400','$0'],['Rentals','$50','$100','$130','$0'],
      ['Car / ground','$133','$114','$177','$114'],['Groceries','$42','$63','$84','$63'],['Meals & drinks out','$120','$150','$240','$150'],
      ['Extras','$50','$100','$200','$100'],['Total','$1,552','$2,453','$3,364','$1,983']
    ]
  },
  split:{shared:['The house ($8,904)','Rental vehicles + gas','Groceries'], individual:['Festival ticket','Flight','Lift pass','Gear rental','Meals & drinks out','Personal drinks & merch']},
  rentals:[
    ['East Slope Outdoors','44 Town Center Ave','$35 ski / $40 board / $60 demo'],
    ['Christy Sports (Town Center)','11 Lone Peak Dr','$47.96 sport / $63.96 demo (online)'],
    ['Big Sky Sports (resort)','Mountain Village + Madison Base','Prices only in booking flow'],
    ['Gallatin Alpine Sports','169 Snowy Mountain Cir','Prices only in booking flow']
  ]
};

const BOOKINGS = [
  {item:'Festival tickets', status:'Booked', detail:'2-day pass via Flicket, $420 each. Final sale.', cost:'$420 pp'},
  {item:'Lodging', status:'Booked', detail:'The House that Jack Built, 397 Beaver Creek Rd. Fri Mar 12 3 PM → Tue Mar 16 10 AM. 4.96★ (77 reviews). 6 BR, sleeps 16 (4 kings + 2 bunk rooms of 4). Two kitchens.', cost:'$8,904 total', href:'https://www.airbnb.com/rooms/41831383'},
  {item:'Flights', status:'Not booked', detail:'Into Bozeman (BZN) Fri Mar 12, out Tue Mar 16. Cash ~$500 or ~40k points (≈1.25¢/pt break-even).', cost:'~$500 pp'},
  {item:'Rental cars', status:'Not booked', detail:'~3 cars for 14 (about 5 each). Estimate $452.84/car + ~$80 gas & parking. AWD / winter tires.', cost:'$114 pp'},
  {item:'Lift tickets', status:'Not booked', detail:'Ikon Session 2-day from $369 (tram not included) vs ~$200/day weekend window. No official Mar 13–14 price found.', cost:'$300–400 pp', flag:'Check shop.bigskyresort.com'},
  {item:'Gear rental', status:'Not booked', detail:'Book online 24h+ ahead (Christy 20% off). House is not near the shops; Big Sky Sports delivery is $49/skier.', cost:'~$100 pp'},
  {item:'EO Express shuttle', status:'Unknown', detail:'Bozeman → arena, both days. Ticket add-on only as far as found.', cost:'Price unknown', flag:'Unverified'},
  {item:'Dinner reservations', status:'Not booked', detail:'Vegetarian options: Blue Buddha Sushi Lounge, Thai Basil, Niseko Ramen, By Word of Mouth, Blindside Burger (call about stock/fish sauce).', cost:'—'}
];

const FESTIVAL = {
  facts:[
    ['What','John Summit presents Experts Only Big Sky: a two-night outdoor dance-music show plus skiing.'],
    ['When','Sat Mar 13 & Sun Mar 14, 2027. Listing shows 5–11 pm; official gate times TBA.'],
    ['Where','Big Sky Events Arena, 450 Aspen Leaf Drive, Town Center. Outdoor, up to 5,000.'],
    ['Who','John Summit (first time in Montana). Support acts not announced.'],
    ['Age','21+ with valid photo ID. Whistler required two IDs; bring a second to be safe.'],
    ['Re-entry','None. 2-day pass holders scan in each day.']
  ],
  rules:{
    wear:'Layers, warm jacket, hat, gloves, traction boots, hand & toe warmers.',
    allowed:'Empty reusable bottle, stadium seats, blankets, small purses/handheld bags.',
    banned:'Glass, cans, outside food/drink, coolers, chairs, umbrellas, drones, lasers, pro cameras, weapons, fireworks, pets.',
    vendors:'Food trucks, nonalcoholic drinks, full bar (ID). Cash and cards. Merch on site.'
  },
  past:[
    ['Vail 2025','Ford Park shows; après at Avanti, afterparties, Sunday mountaintop pop-up.'],
    ['Whistler 2026','Gates 3 pm, show 4 pm (official); Friday pop-up needed lift ticket; sold out.'],
    ['Vail 2026','Après at Avanti from noon; main event ended ~9 pm.']
  ],
  alerts:[
    ['Experts Only / John Summit Instagram','@expertsonly, @johnsummit'],
    ['Explore Big Sky Town Crier','explorebigsky.com/town-crier-sign-up'],
    ['Big Sky Resort email/text','bigskyresort.com/preferences/sms'],
    ['Flicket account emails','Add-ons & upgrades']
  ],
  playlists:[
    ['John Summit x Experts Only Mix','https://open.spotify.com/playlist/0xWPhgsVxXFlnMnyORfz7T'],
    ['Experts Only Radio 054 (fan)','https://open.spotify.com/playlist/7qg9VLvjFEpsrcJ2toZESL'],
    ['John Summit ⛰️ Experts Only (fan)','https://open.spotify.com/playlist/7xYk2BS9dUFF5wBuzMSQUF']
  ],
  songs:'Where You Are (feat. Hayla), Shiver, Go Back, Deep End. Style: tech house / melodic house.'
};

const TRAVEL = {
  getting:[
    ['Fly','Bozeman Yellowstone Intl (BZN), ~51 mi / 1h15 to Big Sky.'],
    ['Drive','US-191 through Gallatin Canyon, then MT-64. Check Montana 511 / mdt.mt.gov/travinfo. Closures have happened after crashes.'],
    ['Airport shuttles','Big Sky Shuttle (book 7 days ahead, 866-661-6836), Rocks2Rocks, Natural Retreats. Private transfer listed $179–$300 (no 2027 prices).'],
    ['EO Express','Event shuttle Bozeman → arena. Ticket add-on; details later.'],
    ['Skyline Transit','Local bus, reportedly free. 2026–27 evening schedule not found; Skyline Connect on-demand in Town Center / Meadow / Mountain Village.'],
    ['Rideshare','"Very limited". Plan a confirmed ride home both nights.']
  ],
  tips:[
    ['Altitude','Town Center ~6,200 ft, Mountain Village ~7,500 ft. CDC: avoid alcohol first 48 h; drink water. Consider arriving early.'],
    ['Cold','March highs mid-30s–mid-40s °F, lows ~12–17 °F. Below freezing after dark; standing outside for hours.'],
    ['Stay in Big Sky','Many Vail attendees drove home the same night. Don\'t do that through Gallatin Canyon.'],
    ['Avalanche','Resort terrain is patrolled; backcountry: mtavalanche.com.']
  ],
  carMath:[['5 per car','$107 pp'],['4 per car','$133 pp'],['3 per car','$178 pp']]
};

/* ll = [lat, lng] from OpenStreetMap geocoding (Nominatim). approx:true = street-level or road-level guess, not the exact building.
   No ll = not pinned yet (opens a Google Maps search instead). */
const EXPLORE = [
  {cat:'fest', name:'Big Sky Events Arena', sub:'450 Aspen Leaf Dr, Town Center', note:'Experts Only, Mar 13–14. Will Call / lost & found on Aspen Leaf Dr.', ll:[45.25887,-111.31286], approx:true, q:'Big Sky Events Arena, 450 Aspen Leaf Dr, Big Sky, MT'},
  {cat:'ski', name:'Big Sky Resort (Mountain Village)', sub:'~7,500 ft base', note:'Open Nov 25, 2026 – Apr 11, 2027. Lone Peak Tram in regular lift ticket, not Ikon Session. Ikon holders: no reservations.', ll:[45.2840,-111.4011], q:'Big Sky Resort, Mountain Village, MT'},
  {cat:'ski', name:'Lone Peak Tram', sub:'Summit, 11,166 ft', note:'Not included in the Ikon Session Pass. Check tram fee.', ll:[45.2782,-111.4414], q:'Lone Peak Tram, Big Sky, MT'},
  {cat:'rent', name:'Christy Sports', sub:'11 Lone Peak Dr', note:'Sport $47.96 / Demo $63.96 per day online.', ll:[45.26039,-111.30927], approx:true, q:'Christy Sports, 11 Lone Peak Dr, Big Sky, MT'},
  {cat:'rent', name:'East Slope Outdoors', sub:'44 Town Center Ave · 406-995-4369', note:'Cheapest verified: ski $35, board $40, demo $60.', ll:[45.2601,-111.3078], q:'East Slope Outdoors, 44 Town Center Ave, Big Sky, MT'},
  {cat:'night', name:'Tips Up', sub:'76 Town Center Ave', note:'Likely afterparty spot (speculative): stage + live music most winter nights.', ll:[45.2599,-111.3069], flag:true, q:'Tips Up, Town Center Ave, Big Sky, MT'},
  {cat:'night', name:'Blue Buddha Sushi / Drunken Monk', sub:'99 Town Center Ave', note:'Late DJ night on Thursdays, so only works for a one-off. Speculative.', ll:[45.2602,-111.3067], flag:true, q:'Blue Buddha Sushi Lounge, Town Center Ave, Big Sky, MT'},
  {cat:'food', name:'Roxy\'s Market', sub:'20 Huntley Dr', note:'Groceries, beer & wine, 8 am–9 pm.', ll:[45.26072,-111.30262], q:'Roxy\'s Market, Big Sky, MT'},
  {cat:'food', name:'Blue Buddha Sushi Lounge', sub:'Town Center', note:'Vegetarian options on HappyCow.', ll:[45.2602,-111.3067], q:'Blue Buddha Sushi Lounge, Big Sky, MT'},
  {cat:'food', name:'Beehive Basin Brewery', r:'Yelp 4.6 (204, secondhand)', sub:'245 Town Center Ave', note:'Walkable, noon–10 pm daily.', ll:[45.2602,-111.3026], q:'Beehive Basin Brewery, Big Sky, MT'},
  {cat:'food', name:'By Word of Mouth', sub:'Aspen Leaf Dr', note:'Vegetarian-friendly; ask about hidden stock.', ll:[45.2592,-111.3137], q:'By Word of Mouth, Big Sky, MT'},
  {cat:'food', name:'Thai Basil', sub:'Big Sky', note:'Vegetarian-friendly; ask about fish sauce. Not pinned yet.', ll:[45.2593,-111.3085], area:true, q:'Thai Basil, Big Sky, MT'},
  {cat:'food', name:'Niseko Ramen', sub:'Big Sky', note:'Ask about hidden stock. Not pinned yet.', ll:[45.259,-111.307], area:true, q:'Niseko Ramen, Big Sky, MT'},
  {cat:'food', name:'Blindside Burger', sub:'47 Town Center Ave D1', note:'Smash burgers and shakes. Check veggie options and March hours. Pin is the building address.', ll:[45.26026,-111.30728], approx:true, q:'Blindside Burger, 47 Town Center Ave, Big Sky, MT'},
  {cat:'food', name:'The Rocks Tasting Room & Liquor Store', r:'Rated 4.7 (162)', sub:'33 Lone Peak Dr #102', note:'Liquor store, 406-995-2066. Reported to be moving into the former Cave Spirits space (OSM still shows The Cave at 45.2600,-111.3036), so confirm the address.', ll:[45.26027,-111.30998], approx:true, flag:true, flagText:'Address may change', q:'The Rocks Tasting Room & Liquor Store, 33 Lone Peak Dr, Big Sky, MT'},
  {cat:'stay', name:'The House that Jack Built', sub:'397 Beaver Creek Rd', note:'Booked. 10–15 min to the resort; not in Town Center. Pin is on Beaver Creek Rd, not the exact lot.', ll:[45.2091,-111.2947], approx:true, q:'397 Beaver Creek Rd, Big Sky, MT'},
  {cat:'go', name:'Bozeman Yellowstone Intl Airport (BZN)', sub:'Belgrade, MT · ~1 hr drive from Big Sky', note:'Arrival airport. Rental cars and shuttles here.', ll:[45.7835,-111.1570], q:'Bozeman Yellowstone International Airport'},
  // ---- Added from the POI note. ll from OSM (Overpass named node or exact address). No ll = not found in OSM, so left unpinned rather than guessed.
  // far:true = Bozeman side, excluded from the default map zoom.
  {cat:'food', name:'Ousel & Spur Pizza Co.', r:'Yelp 3.5 (222) · Tripadvisor 4.0 (269)', sub:'50 Ousel Falls Rd, Town Center', note:'Wood-fired pizza. Site says every dish has a veg option. Good for big groups. Dinner from 5 pm. Yelp 3.5 / Tripadvisor 4.0.', ll:[45.2601,-111.30868], approx:true, q:'Ousel & Spur Pizza Co, 50 Ousel Falls Rd, Big Sky, MT'},
  {cat:'food', name:'Blue Moon Bakery', r:'Tripadvisor 4.5 (482) · Google 4.3 (427)', sub:'120 Big Pine Dr, Town Center', note:'Bakery, pizza, coffee, vegan mozzarella. ~8 am–9 pm. Tripadvisor 4.5 / Google 4.3. Delivers to Meadow and Mountain Village.', ll:[45.25971,-111.31345], q:'Blue Moon Bakery, 120 Big Pine Dr, Big Sky, MT'},
  {cat:'food', name:'Olive B\'s Big Sky Bistro', r:'OpenTable 4.8 (~900) · Tripadvisor 4.5 (597)', sub:'Meadow Village', note:'Top-rated in the area (OpenTable 4.8, ~900). Elk/bison menu, so ask about vegetarian dishes. Book ahead.', ll:[45.26743,-111.3019], area:true, q:'Olive B\'s Big Sky Bistro, Big Sky, MT'},
  {cat:'food', name:'Michelangelo\'s', r:'OpenTable 4.5 (146) · Google 4.6 (205)', sub:'Meadow Village', note:'Italian, dinner Wed–Sun. Good for groups if booked. OpenTable 4.5 / Google 4.6.', ll:[45.267,-111.304], area:true, q:'Michelangelo\'s Ristorante, Big Sky, MT'},
  {cat:'food', name:'Huntley Dining Room', r:'OpenTable 4.5 (96)', sub:'Huntley Lodge, Mountain Village', note:'Resort dinner/buffet, over $50 pp. OpenTable 4.5 (96).', ll:[45.28576,-111.40102], approx:true, q:'Huntley Lodge, Big Sky Resort, MT'},
  {cat:'food', name:'M by The Alinea Group', sub:'Mountain Village', note:'Chef-driven, $$$$. Open Dec 10, 2026–Apr 3, 2027, Thu–Mon. Book on Tock, early. Not pinned: not in OSM.', ll:[45.2848,-111.4005], area:true, q:'M by The Alinea Group, Big Sky, MT'},
  {cat:'food', name:'Wild Caddis (Rainbow Ranch Lodge)', r:'OpenTable 4.4–4.8 (~520)', sub:'42950 Gallatin Rd, canyon (south of Big Sky turnoff)', note:'Upscale American on the Gallatin River, closest real dinner to the house. OpenTable 4.4–4.8. Confirm winter hours. Pin is the Rainbow Ranch Rd area, not the lodge.', ll:[45.1945,-111.2365], approx:true, flag:true, flagText:'Winter hours unconfirmed', q:'Rainbow Ranch Lodge, 42950 Gallatin Rd, Big Sky, MT'},
  {cat:'food', name:'Hero Snow Coffee', sub:'Meadow Village Center, by Country Market', note:'Coffee + breakfast sandwiches. Opened May 2025; hours vary by guide. Pin is the Country Market area.', ll:[45.26748,-111.29148], approx:true, flag:true, flagText:'Hours unconfirmed', q:'Hero Snow Coffee, Big Sky, MT'},
  {cat:'food', name:'Thorn Apple Baking Co.', sub:'48 Market Place', note:'One reviewer called it the best bakery in Big Sky. Not pinned: address did not resolve.', ll:[45.2596,-111.305], area:true, q:'Thorn Apple Baking Co, Big Sky, MT'},
  {cat:'food', name:'Country Market', r:'Yelp ~4.5 (count unreliable)', sub:'Meadow Village Center', note:'Groceries, daily 6:30 am–8 pm.', ll:[45.26748,-111.29148], q:'Country Market, Meadow Village Center, Big Sky, MT'},
  {cat:'food', name:'Hungry Moose Market & Deli', r:'Yelp ~3.5 (~96)', sub:'Aspen Leaf Dr, Town Center', note:'Deli and wine. Good selection, high prices. Second store at The Exchange in Mountain Village.', ll:[45.259,-111.31058], q:'Hungry Moose Market & Deli, Big Sky, MT'},
  {cat:'taco', name:'Taco Bell (Four Corners)', sub:'35 North Star Ln, Bozeman · on the drive in from BZN', note:'No Taco Bell in Big Sky. This is the nearest, about 25 miles north of the house. Other: 206 W Madison, Belgrade (near the airport). Vegetarian-friendly (beans, potatoes, veg swaps). No rating checked.', ll:[45.67924,-111.18657], far:true, q:'Taco Bell, 35 North Star Ln, Bozeman, MT'},
  {cat:'taco', name:'Taco Bell (Belgrade)', sub:'206 W Madison Ave, Belgrade · near BZN', note:'Closest to the airport, if you want it on arrival. No rating checked.', ll:[45.77262,-111.18444], far:true, q:'Taco Bell, 206 W Madison Ave, Belgrade, MT'},
  {cat:'food', name:'Coffee Pot Bakery & Cafe', r:'TravelPal 4.8 (~750)', sub:'Four Corners (Bozeman side, on the drive from BZN)', note:'Bakery, burritos, pie. 4.8 (~750). Good stop on the way in.', ll:[45.65574,-111.1884], far:true, q:'The Coffee Pot Bakery Cafe, Four Corners, MT'},
  {cat:'night', name:'Broken Spoke Bar & Casino', sub:'120 Big Pine Dr, Town Center', note:'Late-night, loud, to ~2 am per most listings. Pool hall upstairs.', ll:[45.25954,-111.31284], q:'Broken Spoke Bar & Casino, Big Sky, MT'},
  {cat:'night', name:'The Waypoint', r:'Yelp 4.5 (22) · other sources 4.5–4.7', sub:'Lone Peak Cinema, Ousel Falls Rd', note:'Bar in the movie theater: live music, comedy, karaoke. Wed–Sat from 4 pm. One listing says closed.', ll:[45.2601,-111.30868], approx:true, flag:true, flagText:'May be closed', q:'The Waypoint, Lone Peak Cinema, Big Sky, MT'},
  {cat:'night', name:'Moonlight Tavern', r:'OpenTable 4.1 (40)', sub:'Moonlight Lodge, Moonlight Basin', note:'Fireplace and views; slow service. OpenTable 4.1.', ll:[45.29508,-111.42176], approx:true, q:'Moonlight Tavern, Moonlight Basin, Big Sky, MT'},
  {cat:'night', name:'Montana Jack', r:'OpenTable 4.4–4.8 (<10 reviews)', sub:'52 Big Sky Resort Rd, Mountain Village', note:'Lodge-style bar and burgers. Small review sample.', ll:[45.28480,-111.40013], approx:true, q:'Montana Jack, 52 Big Sky Resort Rd, Big Sky, MT'},
  {cat:'night', name:'Alpenglow Lounge (Montage)', sub:'995 Settlement Trail, Spanish Peaks', note:'Live music, bar to ~11 pm. Not in Mountain Village: it is at Montage in Spanish Peaks.', ll:[45.25953,-111.36824], flag:true, flagText:'Hours unconfirmed', q:'Alpenglow Lounge, Montage Big Sky, MT'},
  {cat:'night', name:'Scissorbills Saloon', r:'Yelp 3.5 (124) · Tripadvisor 4.0 (122)', sub:'39 Black Eagle Rd, Mountain Village', note:'Cheap drinks, nachos, ski-in. Not pinned: not in OSM.', ll:[45.284,-111.4025], area:true, q:'Scissorbills Saloon, Big Sky, MT'},
  {cat:'act', name:'Explorer Gondola (lower)', sub:'Mountain Village', note:'Main route to the Lone Peak Tram.', ll:[45.28496,-111.41055], q:'Explorer Gondola, Big Sky Resort, MT'},
  {cat:'act', name:'Madison Base', sub:'Big Sky Resort', note:'Second base area. Free Skyline bus runs between bases and Town Center (verify).', ll:[45.31067,-111.43235], q:'Madison Base, Big Sky Resort, MT'},
  {cat:'act', name:'Lone Mountain Ranch', r:'OpenTable 4.7 (69)', sub:'750 Lone Mountain Ranch Rd', note:'Nordic skiing (~85 km), snowshoeing, sleigh-ride dinner (OpenTable 4.7). Pin is the ranch restaurant.', ll:[45.27699,-111.32465], approx:true, q:'Lone Mountain Ranch, Big Sky, MT'},
  {cat:'act', name:'Summit All Terrain Rentals', r:'Yelp 5.0 (66) · Polaris 4.8 (512)', sub:'Four Corners side', note:'Guided snowmobile rentals. Yelp 5.0 (66), best-rated option. On the Bozeman side, not near the house.', ll:[45.67173,-111.18717], far:true, q:'Summit All Terrain Rentals, Four Corners, MT'},
  {cat:'act', name:'Bozeman Hot Springs', sub:'81123 Gallatin Rd, Four Corners', note:'Recovery day. Hours conflict, so verify. 406-586-6492.', ll:[45.66042,-111.18805], far:true, flag:true, flagText:'Hours conflict', q:'Bozeman Hot Springs, 81123 Gallatin Rd, Bozeman, MT'},
  {cat:'act', name:'Museum of the Rockies', r:'4.5–4.7 (~173)', sub:'600 W Kagy Blvd, Bozeman', note:'4.5–4.7 (~173). Hours need checking.', ll:[45.65871,-111.04561], far:true, q:'Museum of the Rockies, Bozeman, MT'},
  {cat:'act', name:'Spire Climbing Center', r:'4.5–4.9', sub:'13 Enterprise Blvd, Bozeman', note:'Indoor climbing, 4.5–4.9.', ll:[45.65619,-111.07045], far:true, q:'Spire Climbing Center, Bozeman, MT'},
  {cat:'prac', name:'Big Sky Medical Center', sub:'334 Town Center Ave · 406-995-6995', note:'24/7 ER. Bozeman Health.', ll:[45.26042,-111.30053], q:'Big Sky Medical Center, Big Sky, MT'},
  {cat:'prac', name:'Gas at Big Sky Rd & US-191', sub:'Conoco / Exxon at the turnoff', note:'Fill up before heading into Town Center or the canyon. Gas at Gallatin Gateway (Casey\'s) is unconfirmed.', ll:[45.26468,-111.2552], approx:true, q:'Conoco, Big Sky Rd & US-191, Big Sky, MT'},
  {cat:'prac', name:'Bozeman Deaconess Hospital ER', sub:'915 Highland Blvd, Bozeman · 406-414-5000', note:'Nearest large hospital.', ll:[45.6696,-111.02095], far:true, q:'Bozeman Deaconess Hospital, Bozeman, MT'},
];
const CATS = {fest:'Festival', ski:'Ski Resort', rent:'Rentals', food:'Food & Drink', night:'Nightlife', act:'Activities', taco:'Taco Bell', prac:'Practical', stay:'Lodging', go:'Getting There'};
const CAT_COLOR = {fest:'#e4572e', ski:'#5b84e8', rent:'#3fb6c9', food:'#e9b44c', night:'#b66bd6', stay:'#6fcf97', go:'#a8a29b', act:'#f08a5d', taco:'#a855f7', prac:'#8ab4f8'};

const OPEN_Q = [
  'Final headcount and who is skiing',
  'Real Mar 13–14 lift price and 2-day Ikon price; tram fee',
  'Vehicle plan and EO Express price',
  'Gate/set times and lineup (watch Jan–Feb)',
  'Points or cash for flights'
];

/* ===== NON-SKIING ACTIVITIES (from Non Skiing/Non-Skiing Activities.md; prices undated, none confirmed for Mar 2027) ===== */
const ACT_CATS = {top:'Top picks', snow:'Winter outdoors', resort:'Big Sky Resort', ysp:'Yellowstone & day trips', soak:'Hot springs & spas', fun:'Indoor & nightlife'};
const ACTIVITIES = [
 {cat:'top', name:'Dog sledding (drive your own team)', where:'Yellowstone Dog Sled Adventures, Gallatin Gateway', price:'~$375 pp (older listing $205–375 adult, $105–275 kids)', note:'2.5 h, Dec–Apr. Drivers 120+ lb. Book 24 h ahead. Basically next door to the house.', links:[['VisitMT','https://visitmt.com/listing/yellowstone-dog-sled-adventures']]},
 {cat:'top', name:'Bozeman Hot Springs', where:'Bozeman, year-round', price:'$20–21.50 weekday, $28 weekend', note:'Easiest group activity. Venue rental exists, price unknown.', links:[['Website','https://www.google.com/search?q=Bozeman+Hot+Springs+day+pass+prices']]},
 {cat:'top', name:'Yellowstone North Entrance self-drive', where:'Gardiner, Mammoth, Lamar Valley', price:'Park entry ~$35/vehicle', note:'Only park road open to regular cars. ~2.25 h each way. Roads can close fast.', links:[['NPS winter info','https://www.google.com/search?q=Yellowstone+winter+road+status+north+entrance']], flag:'Check road status'},
 {cat:'top', name:'Bozeman day', where:'Museum of the Rockies, Main St, breweries', price:'Mostly pay-as-you-go', note:'Museum daily 9–5, ~2–3 h. Breweries open to ~8–9 pm.', links:[['Museum of the Rockies','https://museumoftherockies.org']]},
 {cat:'snow', name:'Dinner sleigh ride', where:'Lone Mountain Ranch', price:'"Cost varies" (third-party quotes $59–110)', note:'Seatings 4:30 and 7:30 pm. Reserve via OpenTable. Phone listed two ways, confirm.', links:[['Sleigh ride page','https://lonemountainranch.com/sleigh-ride-dinner/']], flag:'Price unclear'},
 {cat:'snow', name:'Private dinner sleigh', where:'Elkhorn Ranch', price:'$1,750 per sleigh (dinner), up to 12 per sleigh', note:'Season listed Dec–Feb, so March may not run.', links:[], flag:'March unlikely'},
 {cat:'snow', name:'Guided snowmobile tour', where:'Polaris Adventures, Big Sky', price:'From $238.50 (2 h), $318 (4 h)', note:'Confirm per-sled vs per-person before budgeting.', links:[['Search listing','https://www.google.com/search?q=Polaris+Adventures+Big+Sky+snowmobile']], flag:'Unclear pricing'},
 {cat:'snow', name:'Nordic skiing / snowshoe', where:'Lone Mountain Ranch (85+ km groomed)', price:'~$20 adult trail pass (older)', note:'Season runs into early April. Ask about lessons for beginners.', links:[['Lone Mountain Ranch','https://lonemountainranch.com']]},
 {cat:'snow', name:'Guided ice climbing', where:'Montana Alpine Guides, Ousel Falls', price:'$250–300 pp/day (4:1 to 2:1)', note:'Beginner friendly, ice-dependent. Private groups up to 16.', links:[['Montana Alpine Guides','https://montanaalpineguides.com']], flag:'Ice dependent'},
 {cat:'snow', name:'Winter fly fishing', where:'Madison / Gallatin outfitters', price:'$550–750 per boat (1–2 anglers)', note:'Winter guiding unconfirmed. Not recommended for the group.', links:[], flag:'Skip likely'},
 {cat:'snow', name:'Ice skating and sledding', where:'Bozeman Pond, Peet\'s Hill', price:'Free (?)', note:'Only if ice is safe. Haynes Pavilion public skate is a backup.', links:[]},
 {cat:'resort', name:'Scenic Lone Peak Tram / Kircliff ticket', where:'Big Sky Resort', price:'Scenic ride from $49 (undated), tram scenic $10–40+', note:'Winter 2026–27 scenic pricing not posted yet. Walking guests only.', links:[['Resort tickets','https://www.bigskyresort.com/lift-tickets']], flag:'Not posted'},
 {cat:'resort', name:'Snowshoe tour', where:'Big Sky Resort', price:'Not found', note:'~2 h guided, Wed–Sat in 2025–26. Page 404.', links:[['Winter activities','https://www.google.com/search?q=Big+Sky+Resort+snowshoe+tour']], flag:'Call'},
 {cat:'ysp', name:'Guided Lamar Valley wildlife tour', where:'Yellowstone Safari Co.', price:'Private $1,595 for 1–4 + $225 per extra guest; public $350 pp', note:'6 am start, ~2.5 h each way. Reseller page.', links:[['Yellowstone Safari Co.','https://yellowstonesafari.com']]},
 {cat:'ysp', name:'Oversnow to Old Faithful', where:'Snowcoach from West Yellowstone', price:'$179.45 adult one way (Xanterra, Mammoth route)', note:'Xanterra route ends Mar 6 and the Snow Lodge closes Mar 7, so likely not available on our dates.', links:[['NPS oversnow','https://www.google.com/search?q=Yellowstone+oversnow+snowcoach+Old+Faithful+2027']], flag:'Likely unavailable'},
 {cat:'ysp', name:'Gallatin History Museum', where:'Bozeman', price:'$10 adult', note:'Tue–Sat 10–5 (official).', links:[['Website','https://www.gallatinhistorymuseum.org']]},
 {cat:'ysp', name:'Madison Buffalo Jump', where:'Three Forks, ~40 min', price:'$5/vehicle or free (conflicting)', note:'Daylight, year-round.', links:[['Montana State Parks','https://fwp.mt.gov/stateparks/madison-buffalo-jump']]},
 {cat:'ysp', name:'Hyalite / Palisade Falls', where:'Bozeman, Hyalite Canyon', price:'Fees unverified', note:'Road status conflicts. Call Bozeman Ranger District (406) 522-2520.', links:[], flag:'Check road'},
 {cat:'soak', name:'Chico Hot Springs', where:'Pray, ~1–1.5 h', price:'$14 adult, $8 kids/seniors', note:'Day guests ~7–8 am to 11 pm. Good dinner stop too.', links:[['Chico Hot Springs','https://chicohotsprings.com']]},
 {cat:'soak', name:'Solace Spa & Recovery Lounge', where:'Big Sky Resort', price:'Peak: 60-min massage $260–285, 90-min $370–385, +20% service +4% tax', note:'Age 12+. Book early, March is peak pricing. (800) 548-4486.', links:[['Solace Spa','https://www.bigskyresort.com/solace-spa']]},
 {cat:'fun', name:'Spire Climbing Center', where:'Bozeman', price:'Day pass ~$20–30 with gear', note:'Group/party space. 406-586-0706.', links:[['Website','https://www.spireclimbingcenter.com']]},
 {cat:'fun', name:'Beartooth Pub & Rec', where:'Montage Big Sky', price:'Not found', note:'Bowling, vintage arcade, darts.', links:[['Montage Big Sky','https://www.montagehotels.com/montanabigsky/']]},
 {cat:'fun', name:'Breweries', where:'Bridger, Map, Bozeman Brewing (Bozeman); Beehive Basin (Big Sky)', price:'Pay as you go', note:'Montana law: 48 oz per customer per day, service stops 8 pm.', links:[]},
 {cat:'fun', name:'Montana Ale Works private lounge', where:'Bozeman', price:'Not found', note:'Call (406) 587-7700.', links:[['Website','https://www.montanaaleworks.com']]},
 {cat:'fun', name:'Free: Main St galleries, shops', where:'Downtown Bozeman', price:'Free', note:'22+ galleries.', links:[]}
];
