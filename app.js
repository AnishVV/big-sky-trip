/* ===== helpers ===== */
const $ = (s, r=document) => r.querySelector(s);
const ico = (n, c='') => `<svg class="${c}"><use href="#i-${n}"/></svg>`;
const esc = s => String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const link = (t, h) => `<a class="ext" href="${h}" target="_blank" rel="noopener">${esc(t)} ${ico('ext')}</a>`;
const flagTag = t => `<span class="tag warn">${esc(t || 'Unconfirmed')}</span>`;
const store = {
  get(k, d){ try { return JSON.parse(localStorage.getItem('eo.'+k)) ?? d; } catch { return d; } },
  set(k, v){ try { localStorage.setItem('eo.'+k, JSON.stringify(v)); } catch {} }
};

/* ===== scale to window ===== */
const stage = $('#stage');
function fit(){ stage.style.zoom = window.innerWidth / 1672; }
addEventListener('resize', fit); fit();

/* ===== state ===== */
const doneSet = new Set(store.get('done', TASKS.filter(t=>t.done).map(t=>t.id)));
const saveDone = () => store.set('done', [...doneSet]);
const crew = store.get('crew', [{name:'You', note:'Organizer'}]).filter(c => !/vishal/i.test(c.name));
const daysTo = () => Math.max(0, Math.ceil((new Date(EVENT.start+'T00:00:00') - new Date()) / 864e5));
const money = n => '$' + n.toLocaleString('en-US');

/* avatars: first letters of crew (placeholder look) */
function renderAvatars(){
  const imgs = [1,2,3,4].map(i => `<img src="img/avatar${i}.jpg" alt="">`).join('');
  $('#avatars').innerHTML = imgs + `<span class="more" title="Crew size TBD">+?</span>`;
  $('#avatars').onclick = () => location.hash = '#/tasks';
}
renderAvatars();
const pending = () => TASKS.filter(t => !doneSet.has(t.id)).length;
$('#bellDot').textContent = pending();
$('#bell').onclick = () => location.hash = '#/tasks';

/* ===== page chrome ===== */
function banner(title, sub){
  return `<header class="page-banner"><img src="img/hero.jpg" alt=""><div class="pb-shade"></div>
    <div class="pb-text"><div class="pb-kicker">— EXPERTS ONLY · BIG SKY —</div><h1>${title}</h1><p>${sub}</p></div></header>`;
}
const card = (title, inner, cls='') => `<section class="card panel ${cls}">${title?`<h3>${title}</h3>`:''}${inner}</section>`;
const table = (head, rows) => `<table class="tbl"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const dl = rows => `<dl class="facts">${rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

/* ===== HOME ===== */
function upcoming(n=3){
  const flat = [];
  ITINERARY.forEach(d => d.items.forEach(i => flat.push({...i, d: d.short})));
  const pick = [flat[0], flat[1], flat.find(i => i.icon==='music')];
  return pick.slice(0, n);
}
function taskPreview(){
  const done = TASKS.filter(t => doneSet.has(t.id)).slice(0,2);
  const todo = TASKS.filter(t => !doneSet.has(t.id)).slice(0, 4 - done.length);
  return [...done, ...todo];
}
function viewHome(){
  const total = TASKS.length, n = doneSet.size;
  const b = BUDGET;
  const other = b.perPerson - 420 - 636 - 500;
  return `
  <section class="hero">
    <img class="hero-img" src="img/hero.jpg" alt=""><div class="hero-shade"></div>
    <div class="hero-copy">
      <div class="hero-kicker"><span>—</span> BIG SKY <span>—</span></div>
      <h1>EXPERTS ONLY</h1>
      <div class="hero-tag">EAT SKI RAVE REPEAT</div>
      <div class="hero-date"><i></i>MARCH 13–14, 2027<b>•</b>BIG SKY, MONTANA<i></i></div>
    </div>
  </section>
  <div class="home">
  <section class="stats">
    <div class="card stat countdown">
      <div class="stat-icon">${ico('cal')}</div>
      <div><div class="eyebrow">COUNTDOWN TO THE TRIP</div><div class="count"><span>${daysTo()}</span><small>DAYS</small></div></div>
      <svg class="spark" viewBox="0 0 160 50" preserveAspectRatio="none"><path d="M0 50 18 36 30 42 52 22 66 30 88 14 104 26 124 8 144 24 160 18V50z" fill="rgba(255,255,255,.07)"/><path d="M0 50 18 36 30 42 52 22 66 30 88 14 104 26 124 8 144 24 160 18" fill="none" stroke="rgba(255,255,255,.35)"/></svg>
    </div>
    <a class="card stat link" href="#/itinerary">${ico('logo','stat-glyph')}<div><div class="eyebrow">EVENT DATES</div><div class="stat-val">MAR 13–14, 2027</div></div></a>
    <a class="card stat link" href="#/explore">${ico('pin','stat-glyph pin')}<div><div class="eyebrow">LOCATION</div><div class="stat-val sm">Big Sky, Montana</div></div></a>
    <a class="card stat link" href="#/festival">${ico('music','stat-glyph music')}<div><div class="eyebrow">FESTIVAL</div><div class="stat-val sm">Experts Only</div></div>${ico('arrow','stat-arrow')}</a>
  </section>

  <section class="row2">
    <div class="card upnext">
      <img class="bg" src="img/upnext.jpg" alt=""><div class="bg-shade"></div>
      <div class="card-head">${ico('logo','logo-sm')}<h2>UP NEXT</h2></div>
      <ol class="timeline">${upcoming().map(i=>`<li>${ico(i.icon)}<div><em>${i.d}</em><strong>${esc(i.t)}</strong><span>${esc(i.sub)}</span></div></li>`).join('')}</ol>
      <a class="btn outline" href="#/itinerary">View Full Itinerary ${ico('arrow')}</a>
    </div>
    <div class="card explore">
      <img class="bg" src="img/map.jpg" alt="">
      <div class="card-head">${ico('pin','pin-sm')}<h2>EXPLORE BIG SKY</h2></div>
      <a class="btn outline mapbtn" href="#/explore">View Map ${ico('arrow')}</a>
      <a class="pill" href="#/explore/ski" style="left:191px;top:83px">${ico('mtn')}Ski Resort</a>
      <a class="pill" href="#/explore/food" style="left:515px;top:119px">${ico('fork')}Restaurants</a>
      <a class="pill" href="#/explore/fest" style="left:327px;top:158px">${ico('music')}Festival</a>
      <a class="pill" href="#/explore/stay" style="left:573px;top:191px">${ico('bed')}Lodging</a>
      <span class="cdot" style="left:383px;top:204px"></span>
      <div class="zoom"><button>+</button><button>−</button></div>
    </div>
  </section>

  <section class="row3">
    <div class="card tasks">
      <div class="card-head">${ico('check','ico-check')}<h2>YOUR TASKS</h2><span class="muted">${n} / ${total} complete</span></div>
      <div class="bar"><i style="width:${n/total*100}%"></i></div>
      <ul class="tasklist" id="homeTasks">${taskPreview().map(t=>`<li data-id="${t.id}" class="${doneSet.has(t.id)?'done':''}"><span class="cb"></span>${esc(t.t.length>30? t.t.slice(0,29)+'…':t.t)}</li>`).join('')}</ul>
      <a class="link-sm" href="#/tasks">View All Tasks ${ico('arrow')}</a>
    </div>
    <div class="card weather" title="Typical March climate for Big Sky; no forecast exists this far out">
      <div class="card-head"><svg class="ico-sun"><use href="#i-snow"/></svg><h2>TRIP WEATHER</h2></div>
      <div class="w-main"><span class="w-temp">~28°F</span><span class="w-cond">avg</span></div>
      <div class="w-side"><div>H: ~40°&nbsp;&nbsp;&nbsp;L: ~15°</div><div>No forecast yet</div></div>
      <div class="w-days">
        <div><span>Sat</span><svg><use href="#i-snow"/></svg><b>~40° / 15°</b></div>
        <div><span>Sun</span><svg><use href="#i-snow"/></svg><b>~40° / 15°</b></div>
        <div><span>Mon</span><svg><use href="#i-snow"/></svg><b>~40° / 15°</b></div>
      </div>
    </div>
    <div class="card budget">
      <div class="card-head">${ico('wallet','ico-wallet')}<h2>TRIP BUDGET</h2></div>
      <div class="b-total">${money(b.perPerson)}</div>
      <div class="b-per">per person (est., ${b.people} people)</div>
      <div class="bar thick" title="$420 festival ticket paid"><i style="width:${b.paid/b.perPerson*100}%"></i></div>
      <div class="b-paid">$420 paid</div>
      <dl class="b-lines">
        <div><dt>Flights</dt><dd>$500</dd></div><div><dt>Accommodation</dt><dd>$636</dd></div>
        <div><dt>Festival</dt><dd>$420</dd></div><div><dt>Other</dt><dd>${money(other)}</dd></div>
      </dl>
      <a class="btn outline" href="#/budget">View Budget ${ico('arrow')}</a>
    </div>
  </section>
  </div>`;
}
function bindHome(){
  document.querySelectorAll('#homeTasks li').forEach(li => li.onclick = () => {
    const id = +li.dataset.id; doneSet.has(id) ? doneSet.delete(id) : doneSet.add(id); saveDone(); render();
  });
}

/* ===== ITINERARY ===== */
function viewItinerary(){
  return banner('Itinerary','Fri Mar 12 – Tue Mar 16, 2027 · Big Sky, Montana') + `<div class="page">
    <div class="note warn">Gate and set times are not published. The 5–11 pm window is from the Town Center listing. Lineup beyond John Summit is TBA (past editions announced 1–7 weeks out).</div>
    ${ITINERARY.map(d => `<section class="card panel day"><div class="day-h"><h3>${d.date}</h3></div>
      <ol class="tl">${d.items.map(i => `<li>${ico(i.icon)}<div><strong>${esc(i.t)}</strong> ${i.flag?flagTag(i.flagText):''}<div class="sub">${esc(i.sub)}</div><p>${esc(i.note||'')}</p></div></li>`).join('')}</ol></section>`).join('')}
  </div>`;
}

/* ===== EXPLORE ===== */
const gmapsSearch = e => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.q || (e.name + ' Big Sky MT'));
const gmapsDir = e => 'https://www.google.com/maps/dir/?api=1&destination=' + (e.ll ? e.ll.join(',') : encodeURIComponent(e.q || e.name));
let exploreMap = null;
function viewExplore(cat='all'){
  if (!CATS[cat]) cat = 'all';
  const list = EXPLORE.filter(e => cat==='all' || e.cat===cat);
  const chips = [['all','All'],...Object.entries(CATS)].map(([k,v])=>`<a class="chip ${k===cat?'on':''}" href="#/explore/${k}">${k!=='all'?`<i class="cdot" style="background:${CAT_COLOR[k]}"></i>`:''}${v}</a>`).join('');
  const items = list.map((e,i) => `<div class="place" data-i="${EXPLORE.indexOf(e)}" ${e.ll?'':'data-nopin="1"'}>
      <div class="cat"><i class="cdot" style="background:${CAT_COLOR[e.cat]}"></i>${CATS[e.cat]}${e.ll?'':' · not pinned'}</div>
      <h3>${esc(e.name)} ${e.flag?flagTag(e.flagText||'Speculative'):''}${e.approx?flagTag('Approx. pin'):''}</h3>
      <div class="sub">${esc(e.sub)}</div>${e.r?`<div class="rating">★ ${esc(e.r)}</div>`:(['food','night','act'].includes(e.cat)?'<div class="rating none">No rating found</div>':'')}<p>${esc(e.note)}</p>
      <div class="plinks">${link('Open in Google Maps', gmapsSearch(e))} ${e.ll?link('Directions', gmapsDir(e)):''}</div></div>`).join('');
  return banner('Explore Big Sky','Resort, festival, food and lodging in one place') + `<div class="page">
    <div class="chips">${chips}</div>
    <div class="mapwrap">
      <div class="mapbox card"><div id="map"></div></div>
      <div class="placelist">${items}</div>
    </div>
    <div class="note">Pins come from OpenStreetMap. Town Center / Meadow Village (arena, rentals, food) is about 9 miles from Mountain Village (resort), and the house is further south on Beaver Creek Rd. "Approx. pin" means street-level only. Opening hours and prices are in the linked notes, so re-check before going.</div>
  </div>`;
}
function bindExplore(){
  if (exploreMap){ exploreMap.remove(); exploreMap = null; }
  const [, , arg='all'] = location.hash.split('/');
  const cat = CATS[arg] ? arg : 'all';
  const pins = EXPLORE.filter(e => e.ll && (cat==='all' || e.cat===cat));
  const map = exploreMap = L.map('map', {zoomControl:true, scrollWheelZoom:false});
  const dark = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, className:'tiles-dark', attribution:'&copy; OpenStreetMap contributors'});
  const street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, className:'', attribution:'&copy; OpenStreetMap contributors'});
  const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {maxZoom:17, attribution:'&copy; OpenStreetMap contributors, SRTM | OpenTopoMap'});
  dark.addTo(map);
  L.control.layers({'Dark':dark,'Street':street,'Terrain':topo}, null, {position:'topright'}).addTo(map);
  const markers = {};
  pins.forEach(e => {
    const icon = L.divIcon({className:'', html:`<span class="mk" style="background:${CAT_COLOR[e.cat]}"></span>`, iconSize:[22,22], iconAnchor:[11,11], popupAnchor:[0,-12]});
    const m = L.marker(e.ll, {icon, title:e.name}).addTo(map).bindPopup(
      `<b>${esc(e.name)}</b><br><span class="pc">${CATS[e.cat]}</span><br>${esc(e.sub)}${e.r?`<br>★ ${esc(e.r)}`:''}<br><a href="${gmapsDir(e)}" target="_blank" rel="noopener">Directions in Google Maps</a>`);
    markers[EXPLORE.indexOf(e)] = m;
  });
  // fit to the Big Sky area; the airport is ~40 miles away so it only counts when it's the sole result
  const fitPts = pins.filter(e => (e.cat!=='go' && !e.far) || pins.length===1).map(e => e.ll);
  if (fitPts.length > 1) map.fitBounds(fitPts, {padding:[40,40]}); else map.setView(fitPts[0] || [45.27,-111.35], 13);
  document.querySelectorAll('.place').forEach(el => el.addEventListener('click', ev => {
    if (ev.target.closest('a')) return;
    const m = markers[el.dataset.i]; if (!m) return;
    map.flyTo(m.getLatLng(), Math.max(map.getZoom(), 15), {duration:.6}); m.openPopup();
    document.querySelectorAll('.place').forEach(p => p.classList.toggle('sel', p===el));
  }));
  map.on('click', () => map.scrollWheelZoom.enable());
  setTimeout(() => map.invalidateSize(), 50);
}

/* ===== TRAVEL ===== */
function viewTravel(){
  return banner('Travel & Logistics','Getting to, around and home from Big Sky') + `<div class="page">
    <div class="note">The house is on Beaver Creek Rd, 10–15 min from the resort and <b>not</b> in Town Center where the arena and rental shops are. Plan cars and a sober driver for both show nights.</div>
    <div class="grid2">
      ${card('Getting there & around', dl(TRAVEL.getting))}
      ${card('Cold, altitude & safety', dl(TRAVEL.tips))}
      ${card('Cars: cost per person', table(['People per car','Per person'], TRAVEL.carMath) + '<p class="sub">Rental est. $452.84/car + ~$80 gas & parking. At 14 people: 3 cars, $114 each.</p>')}
      ${card('Flight plan', `<p>Fly into <b>BZN</b> Fri Mar 12; return Tue Mar 16 to match the house. ~$500 cash or ~40k points (break-even ≈ 1.25¢/pt). Check award taxes and March BZN award availability.</p>`)}
    </div>
  </div>`;
}

/* ===== BOOKINGS ===== */
function viewBookings(){
  const cls = {Booked:'ok','Not booked':'bad',Shortlisted:'mid',Unknown:'mid'};
  return banner('Bookings','What is locked in and what is still open') + `<div class="page">
    ${card('', table(['Item','Status','Details','Cost'], BOOKINGS.map(b => [
      `<b>${b.item}</b>`, `<span class="tag ${cls[b.status]}">${b.status}</span>`,
      esc(b.detail) + (b.href?` ${link('Listing', b.href)}`:'') + (b.flag?` ${flagTag(b.flag)}`:''), b.cost])))}
  </div>`;
}

/* ===== BUDGET ===== */
function viewBudget(){
  const n = store.get('people', BUDGET.people);
  const rest = BUDGET.perPerson - Math.round(BUDGET.lodgingTotal / BUDGET.people);
  return banner('Budget', 'Per person, USD. Draft numbers; see sources in the vault') + `<div class="page">
    <div class="grid2">
      ${card('Headcount calculator', `<div class="slider"><input id="ppl" type="range" min="8" max="16" value="${n}"><b id="pplv">${n} people</b></div>
        <div class="seg" id="ski" style="margin-top:14px">${['Not skiing','Skiing 1 day','Skiing 2 days'].map((l,i)=>`<button type="button" data-d="${i}" class="${+store.get('skiDays',2)===i?'on':''}">${l}</button>`).join('')}</div>
        <div class="big" id="pptotal"></div><div class="sub" id="pplodge"></div>
        <p class="sub">Lodging and skiing (lift ticket + rental) change. The house sleeps 16 (4 kings + 2 bunk rooms); check the bunks are adult-sized.</p>`)}
    </div>
    ${card('Base scenario (14 people) line items', table(['Item','Per person','Notes'], BUDGET.lines.map(l=>[l[0],money(l[1]),esc(l[2])]).concat([['<b>Total</b>','<b>$2,453</b>','']])))}
    ${card('Scenarios', table(['',...BUDGET.scenarios.cols], BUDGET.scenarios.rows))}
    <div class="grid2">
      ${card('Shared vs individual', `<div class="cols"><div><b>Shared (split)</b><ul>${BUDGET.split.shared.map(x=>`<li>${x}</li>`).join('')}</ul></div><div><b>Individual</b><ul>${BUDGET.split.individual.map(x=>`<li>${x}</li>`).join('')}</ul></div></div><p class="sub">Use Splitwise or a sheet; one person fronts the house; collect deposits at booking. Skippers don't pay for passes or rentals.</p>`)}
      ${card('Rental shops', table(['Shop','Where','Per day'], BUDGET.rentals))}
    </div>
  </div>`;
}
function bindBudget(){
  const el = $('#ppl'), sk = $('#ski'); if(!el) return; let d = +store.get('skiDays',2);
  const SKI = [{l:'Not skiing',c:0},{l:'Skiing 1 day',c:230},{l:'Skiing 2 days',c:470}]; /* 1 day: $180 ticket + $50 rental; 2 days: $370 Ikon Session + $100 rental */
  const upd = () => { const n=+el.value; store.set('people', n); store.set('skiDays', d);
    const lodge = Math.round(BUDGET.lodgingTotal/n); const rest = BUDGET.perPerson - Math.round(BUDGET.lodgingTotal/BUDGET.people) - SKI[2].c + SKI[d].c;
    $('#pplv').textContent = n+' people'; sk.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.d===d));
    $('#pptotal').textContent = money(lodge+rest)+' per person';
    $('#pplodge').textContent = `Lodging ${money(lodge)} (house $8,904 ÷ ${n}) + ${money(SKI[d].c)} lift + rental + ${money(rest-SKI[d].c)} everything else`; };
  el.oninput = upd; sk.onclick = e => { const b=e.target.closest('button'); if(b){ d=+b.dataset.d; upd(); } }; upd();
}

/* ===== TASKS & CREW ===== */
function viewTasks(){
  const groups = [...new Set(TASKS.map(t=>t.g))];
  return banner('Tasks & Crew', `${doneSet.size} of ${TASKS.length} complete`) + `<div class="page">
    <div class="grid-tc">
      <div>${groups.map(g => card(g, `<ul class="tasklist big">${TASKS.filter(t=>t.g===g).map(t=>`<li data-id="${t.id}" class="${doneSet.has(t.id)?'done':''}"><span class="cb"></span><div>${esc(t.t)}${t.note?`<div class="sub">${esc(t.note)}</div>`:''}</div></li>`).join('')}</ul>`)).join('')}</div>
      <div>
        ${card('Crew', `<ul class="crew">${crew.map((c,i)=>`<li><span class="av">${esc(c.name[0]||'?')}</span><div><b>${esc(c.name)}</b><div class="sub">${esc(c.note||'')}</div></div><button data-rm="${i}" aria-label="Remove">×</button></li>`).join('')}</ul>
          <form id="crewForm"><input name="n" placeholder="Add a name" required><button class="btn outline">Add</button></form>
          <p class="sub">Headcount is not final (8–16). Nothing here is shared; it saves in this browser only.</p>`)}
        ${card('Open questions', `<ul class="oq">${OPEN_Q.map(q=>`<li>${esc(q)}</li>`).join('')}</ul>`)}
      </div>
    </div></div>`;
}
function bindTasks(){
  document.querySelectorAll('.tasklist.big li').forEach(li => li.onclick = () => {
    const id=+li.dataset.id; doneSet.has(id)?doneSet.delete(id):doneSet.add(id); saveDone(); render();
  });
  const f = $('#crewForm'); if(f) f.onsubmit = e => { e.preventDefault(); crew.push({name:f.n.value.trim()}); store.set('crew', crew); render(); };
  document.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { crew.splice(+b.dataset.rm,1); store.set('crew',crew); render(); });
}

/* ===== FESTIVAL ===== */
function viewFestival(){
  const F = FESTIVAL;
  return banner('Experts Only','John Summit · Big Sky Events Arena · Mar 13–14, 2027') + `<div class="page">
    <div class="grid2">
      ${card('The basics', dl(F.facts))}
      ${card('At the venue', dl([['Wear',F.rules.wear],['Allowed',F.rules.allowed],['Banned',F.rules.banned],['Food & drink',F.rules.vendors]]) + `<p class="sub">Rain, snow or shine. Source: official Know Before You Go. ${link('Official site','https://expertsonlybigsky.com/know-before-you-go/')}</p>`)}
      ${card('What past weekends looked like', dl(F.past) + '<p class="sub">Big Sky may differ: its arena is in Town Center, not at the ski base, and only the two arena shows are announced.</p>')}
      ${card('Get alerts', dl(F.alerts))}
      ${card('Music prep', `<ul>${F.playlists.map(p=>`<li>${link(p[0],p[1])}</li>`).join('')}</ul><p class="sub">${esc(F.songs)}</p>`)}
      ${card('Still unknown', `<ul class="oq"><li>Lineup beyond John Summit</li><li>Gate and set times</li><li>Parking and venue map</li><li>EO Express price and pickup times</li><li>Day parties / afterparties / pop-ups (may need a lift ticket)</li></ul>`)}
    </div></div>`;
}

/* ===== router ===== */
const ROUTES = {home:[viewHome,bindHome], itinerary:[viewItinerary], explore:[viewExplore,bindExplore], travel:[viewTravel], bookings:[viewBookings], budget:[viewBudget,bindBudget], tasks:[viewTasks,bindTasks], festival:[viewFestival]};
function render(){
  const [, route='home', arg] = location.hash.split('/');
  const [fn, bind] = ROUTES[route] || ROUTES.home;
  $('#view').innerHTML = fn(arg);
  if (bind) bind();
  $('.main').classList.toggle('is-home', route==='home' || !ROUTES[route]);
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('active', a.dataset.route === (route==='festival'?'home':route)));
  $('#bellDot').textContent = pending();
  window.scrollTo(0,0);
}
addEventListener('hashchange', render);
render();
