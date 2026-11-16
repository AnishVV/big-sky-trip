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
    {icon:'music', t:'Experts Only – Show 1', sub:'Big Sky Events Arena', note:'Listing shows 5–11 pm; gate times still TBA. Outdoor, 21+, ID required. No re-entry.', flag:true, flagText:'Times provisional'},
    {icon:'car', t:'Confirmed ride home', sub:'Designated driver / shuttle', note:'House is 10–15 min from the resort, not in Town Center. Rideshare is "very limited".'}
  ]},
  {date:'Sun Mar 14', short:'Mar 14', items:[
    {icon:'ski', t:'Lighter morning, ski day 2', sub:'Big Sky Resort', note:'Past attendees were wiped the day after; plan accordingly.'},
    {icon:'music', t:'Experts Only – Show 2', sub:'Big Sky Events Arena', note:'2-day pass holders scan in each day.', flag:true, flagText:'Times provisional'}
  ]},
  {date:'Mon Mar 15', short:'Mar 15', items:[
    {icon:'ski', t:'Optional 3rd ski day / rest day', sub:'Big Sky Resort', note:'Ikon Session has 3 and 4 day tiers (prices not found).'}
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
  {cat:'fest', name:'Big Sky Events Arena', sub:'450 Aspen Leaf Dr, Town Center', note:'Experts Only, Mar 13–14. Will Call / lost & found on Aspen Leaf Dr.', ll:[45.2585,-111.3079], approx:true, q:'Big Sky Events Arena, 450 Aspen Leaf Dr, Big Sky, MT'},
  {cat:'ski', name:'Big Sky Resort (Mountain Village)', sub:'~7,500 ft base', note:'Open Nov 25, 2026 – Apr 11, 2027. Lone Peak Tram in regular lift ticket, not Ikon Session. Ikon holders: no reservations.', ll:[45.2840,-111.4011], q:'Big Sky Resort, Mountain Village, MT'},
  {cat:'ski', name:'Lone Peak Tram', sub:'Summit, 11,166 ft', note:'Not included in the Ikon Session Pass. Check tram fee.', ll:[45.2782,-111.4414], q:'Lone Peak Tram, Big Sky, MT'},
  {cat:'rent', name:'Christy Sports', sub:'11 Lone Peak Dr', note:'Sport $47.96 / Demo $63.96 per day online.', ll:[45.2600,-111.3104], approx:true, q:'Christy Sports, 11 Lone Peak Dr, Big Sky, MT'},
  {cat:'rent', name:'East Slope Outdoors', sub:'44 Town Center Ave · 406-995-4369', note:'Cheapest verified: ski $35, board $40, demo $60.', ll:[45.2601,-111.3078], q:'East Slope Outdoors, 44 Town Center Ave, Big Sky, MT'},
  {cat:'night', name:'Tips Up', sub:'76 Town Center Ave', note:'Likely afterparty spot (speculative): stage + live music most winter nights.', ll:[45.2599,-111.3069], flag:true, q:'Tips Up, Town Center Ave, Big Sky, MT'},
  {cat:'night', name:'Blue Buddha Sushi / Drunken Monk', sub:'99 Town Center Ave', note:'Late DJ night on Thursdays, so only works for a one-off. Speculative.', ll:[45.2602,-111.3067], flag:true, q:'Blue Buddha Sushi Lounge, Town Center Ave, Big Sky, MT'},
  {cat:'food', name:'Roxy\'s Market', sub:'20 Huntley Dr', note:'Groceries, beer & wine, 8 am–9 pm.', ll:[45.2607,-111.3026], q:'Roxy\'s Market, Big Sky, MT'},
  {cat:'food', name:'Blue Buddha Sushi Lounge', sub:'Town Center', note:'Vegetarian options on HappyCow.', ll:[45.2602,-111.3067], q:'Blue Buddha Sushi Lounge, Big Sky, MT'},
  {cat:'food', name:'Beehive Basin Brewery', sub:'245 Town Center Ave', note:'Walkable, noon–10 pm daily.', ll:[45.2602,-111.3026], q:'Beehive Basin Brewery, Big Sky, MT'},
  {cat:'food', name:'By Word of Mouth', sub:'Aspen Leaf Dr', note:'Vegetarian-friendly; ask about hidden stock.', ll:[45.2592,-111.3137], q:'By Word of Mouth, Big Sky, MT'},
  {cat:'food', name:'Thai Basil', sub:'Big Sky', note:'Vegetarian-friendly; ask about fish sauce. Not pinned yet.', q:'Thai Basil, Big Sky, MT'},
  {cat:'food', name:'Niseko Ramen', sub:'Big Sky', note:'Ask about hidden stock. Not pinned yet.', q:'Niseko Ramen, Big Sky, MT'},
  {cat:'food', name:'Blindside Burger', sub:'Big Sky', note:'Check veggie options. Not pinned yet.', q:'Blindside Burger, Big Sky, MT'},
  {cat:'food', name:'The Rocks Tasting Room & Liquor Store', sub:'33 Lone Peak Dr #102', note:'Liquor store.', ll:[45.2603,-111.3101], approx:true, q:'The Rocks Tasting Room & Liquor Store, 33 Lone Peak Dr, Big Sky, MT'},
  {cat:'stay', name:'The House that Jack Built', sub:'397 Beaver Creek Rd', note:'Booked. 10–15 min to the resort; not in Town Center. Pin is on Beaver Creek Rd, not the exact lot.', ll:[45.2091,-111.2947], approx:true, q:'397 Beaver Creek Rd, Big Sky, MT'},
  {cat:'go', name:'Bozeman Yellowstone Intl Airport (BZN)', sub:'Belgrade, MT · ~1 hr drive from Big Sky', note:'Arrival airport. Rental cars and shuttles here.', ll:[45.7835,-111.1570], q:'Bozeman Yellowstone International Airport'},
];
const CATS = {fest:'Festival', ski:'Ski Resort', rent:'Rentals', food:'Food & Drink', night:'Nightlife', stay:'Lodging', go:'Getting There'};
const CAT_COLOR = {fest:'#e4572e', ski:'#5b84e8', rent:'#3fb6c9', food:'#e9b44c', night:'#b66bd6', stay:'#6fcf97', go:'#a8a29b'};

const OPEN_Q = [
  'Final headcount and who is skiing',
  'Real Mar 13–14 lift price and 2-day Ikon price; tram fee',
  'Vehicle plan and EO Express price',
  'Gate/set times and lineup (watch Jan–Feb)',
  'Points or cash for flights'
];
