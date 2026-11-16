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
const mq = matchMedia('(max-width:1180px)');         /* same breakpoint as the fluid @media block in styles.css (below it the 1672px canvas would be shrunk past readability) */
const isMobile = () => mq.matches;
function fit(){
  document.body.classList.toggle('mobile', isMobile());
  stage.style.zoom = isMobile() ? '' : window.innerWidth / 1672;
}
let wasMobile = isMobile();
function onViewport(){ fit(); if (isMobile() !== wasMobile){ wasMobile = isMobile(); render(); } }   /* crossing the breakpoint re-renders so maps and task text rebuild */
addEventListener('resize', onViewport); mq.addEventListener('change', onViewport); fit();

/* mobile menu */
const menuBtn = $('#moreBtn'), sidebar = $('#sidebar');
function setMenu(open){
  sidebar.classList.toggle('open', open); $('#scrim').classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open); document.body.classList.toggle('menu-open', open);
}
menuBtn.onclick = () => setMenu(!sidebar.classList.contains('open'));
$('#scrim').onclick = () => setMenu(false);
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ===== state ===== */
const doneSet = new Set(store.get('done2', TASKS.filter(t=>t.done).map(t=>t.id)));
const saveDone = () => store.set('done2', [...doneSet]);
const MINE = TASKS.filter(t => t.who !== 'group'), GROUP = TASKS.filter(t => t.who === 'group');
const nDone = list => list.filter(t => doneSet.has(t.id)).length;   /* count only tasks that still exist (saved state can hold old ids) */
const daysTo = () => Math.max(0, Math.ceil((new Date(EVENT.start+'T00:00:00') - new Date()) / 864e5));
const money = n => '$' + n.toLocaleString('en-US');

const pending = () => MINE.length - nDone(MINE);
$('#bellDot').textContent = pending();
$('#bell').onclick = () => location.hash = '#/tasks';

/* ===== page chrome ===== */
function banner(title, sub){
  return `<header class="page-banner"><img src="img/hero.jpg" alt=""><div class="pb-shade"></div>
    <div class="pb-text"><div class="pb-kicker">— EXPERTS ONLY · BIG SKY —</div><h1>${title}</h1><p>${sub}</p></div></header>`;
}
const card = (title, inner, cls='') => `<section class="card panel ${cls}">${title?`<h3>${title}</h3>`:''}${inner}</section>`;
const table = (head, rows, stack=false) => `<div class="tbl-wrap"><table class="tbl${stack?' stack':''}"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td data-label="${esc(head[i]||'')}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const dl = rows => `<dl class="facts">${rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

/* ===== HOME ===== */
function upcoming(n=3){
  const flat = [];
  ITINERARY.forEach(d => d.items.forEach(i => flat.push({...i, d: d.short})));
  const pick = [flat[0], flat[1], flat.find(i => i.icon==='music')];
  return pick.slice(0, n);
}
function taskPreview(){
  const done = MINE.filter(t => doneSet.has(t.id)).slice(0,2);
  const todo = MINE.filter(t => !doneSet.has(t.id)).slice(0, 4 - done.length);
  return [...done, ...todo];
}
function viewHome(){
  const total = MINE.length, n = nDone(MINE);
  const b = BUDGET;
  const other = b.perPerson - 420 - 636 - 500;
  return `
  <section class="hero">
    <img class="hero-img" src="img/hero.jpg" alt=""><div class="hero-shade"></div>
    <div class="hero-copy">
      <div class="hero-kicker"><span>—</span> BIG SKY <span>—</span></div>
      <div class="hero-tag"><span>EAT SKI</span> <span>RAVE REPEAT</span></div>
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
      <div id="miniMap"></div>
      <div class="card-head">${ico('pin','pin-sm')}<h2>EXPLORE BIG SKY</h2></div>
      <a class="btn outline mapbtn" href="#/explore">View Map ${ico('arrow')}</a>
      <div class="legend">
        <a class="pill" href="#/explore/ski"><i style="background:${CAT_COLOR.ski}"></i>Ski Resort</a>
        <a class="pill" href="#/explore/fest"><i style="background:${CAT_COLOR.fest}"></i>Festival</a>
        <a class="pill" href="#/explore/food"><i style="background:${CAT_COLOR.food}"></i>Restaurants</a>
        <a class="pill" href="#/explore/stay"><i style="background:${CAT_COLOR.stay}"></i>Lodging</a>
      </div>
    </div>
  </section>

  <section class="row3">
    <div class="card tasks">
      <div class="card-head">${ico('check','ico-check')}<h2>YOUR TASKS</h2><span class="muted">${n} / ${total} complete</span></div>
      <div class="bar"><i style="width:${n/total*100}%"></i></div>
      <ul class="tasklist" id="homeTasks">${taskPreview().map(t=>`<li data-id="${t.id}" class="${doneSet.has(t.id)?'done':''}"><span class="cb"></span>${esc(!isMobile() && t.t.length>30? t.t.slice(0,29)+'…':t.t)}</li>`).join('')}</ul>
      <a class="link-sm" href="#/tasks">View All Tasks ${ico('arrow')}</a>
    </div>
    <div class="card weather" title="Typical March climate for Big Sky; no forecast exists this far out">
      <div class="card-head"><svg class="ico-sun"><use href="#i-snow"/></svg><h2>TRIP WEATHER</h2></div>
      <div class="w-main"><span class="w-temp">~28°F</span><span class="w-cond">avg</span></div>
      <div class="w-side"><div>H: ~40°&nbsp;&nbsp;&nbsp;L: ~15°</div><div>No forecast yet</div></div>
      <div class="w-note">Typical March climate for Big Sky; a real forecast does not exist this far out.</div>
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
let homeMap = null;
function bindHome(){
  const mm = document.getElementById('miniMap');
  if (mm && window.L) {
    if (homeMap){ homeMap.remove(); homeMap = null; }
    const map = homeMap = L.map(mm, {zoomControl:false, attributionControl:false, dragging:false, scrollWheelZoom:false, doubleClickZoom:false, boxZoom:false, keyboard:false, touchZoom:false});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, className:'tiles-dark'}).addTo(map);
    const pts = EXPLORE.filter(e => e.ll && !e.far && ['fest','stay','food'].includes(e.cat) || (e.ll && e.name.startsWith('Big Sky Resort')));
    pts.forEach(e => L.marker(e.ll, {interactive:false, icon:L.divIcon({className:'', html:`<span class="mk sm" style="background:${CAT_COLOR[e.cat]}"></span>`, iconSize:[14,14], iconAnchor:[7,7]})}).addTo(map));
    map.fitBounds(pts.map(e => e.ll), {paddingTopLeft:[30,60], paddingBottomRight:[30,60]});
    mm.onclick = () => { location.hash = '#/explore'; };
    setTimeout(() => map.invalidateSize(), 50);
  }
  document.querySelectorAll('#homeTasks li').forEach(li => li.onclick = () => {
    const id = +li.dataset.id; doneSet.has(id) ? doneSet.delete(id) : doneSet.add(id); saveDone(); render();
  });
}

/* ===== ITINERARY ===== */
function viewItinerary(){
  return banner('Itinerary','Fri Mar 12 – Tue Mar 16, 2027 · Big Sky, Montana') + `<div class="page">
    <div class="note warn">Gate and set times are not published. The 5–11 pm window is from the Town Center listing. Lineup beyond John Summit is TBA (past editions announced 1–7 weeks out).</div>
    <div class="daynav">${ITINERARY.map((d,i) => { const [wd,,dn] = d.date.split(' '); return `<button type="button" data-day="${i}" class="${d.items.some(x=>/Show/.test(x.t))?'show':''}">${wd} ${dn}</button>`; }).join('')}</div>
    <div class="itin-grid">${ITINERARY.map((d,di) => { const [wd,mo,dn] = d.date.split(' ');
      const show = d.items.some(i => /Show/.test(i.t));
      return `<section class="card day ${show?'show':''}" id="day-${di}">
      <div class="day-side"><div class="day-wd">${wd}</div><div class="day-n">${dn}</div><div class="day-mo">${mo}</div>${show?'<div class="day-badge">Festival</div>':''}</div>
      <ol class="tl">${d.items.map(i => `<li><span class="tl-ico">${ico(i.icon)}</span><div class="tl-body"><div class="tl-title"><strong>${esc(i.t)}</strong> ${i.flag?flagTag(i.flagText):''}</div><div class="sub">${esc(i.sub)}</div>${i.note?`<p>${esc(i.note)}</p>`:''}</div></li>`).join('')}</ol></section>`; }).join('')}</div>
  </div>`;
}

function bindItinerary(){
  const chips = [...document.querySelectorAll('.daynav button')];
  chips.forEach(b => b.onclick = () => document.getElementById('day-'+b.dataset.day).scrollIntoView({behavior:'smooth', block:'start'}));
  if (!chips.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) chips.forEach(c => c.classList.toggle('on', c.dataset.day === e.target.id.slice(4))); }), {rootMargin:'-140px 0px -60% 0px'});
  document.querySelectorAll('.itin-grid .day').forEach(d => io.observe(d));
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
      <h3>${esc(e.name)} ${e.flag?flagTag(e.flagText||'Speculative'):''}${e.area?flagTag('Area only'):e.approx?flagTag('Approx. pin'):''}</h3>
      <div class="sub">${esc(e.sub)}</div>${e.r?`<div class="rating">★ ${esc(e.r)}</div>`:(['food','night','act'].includes(e.cat)?'<div class="rating none">No rating found</div>':'')}<p>${esc(e.note)}</p>
      <div class="plinks">${link('Open in Google Maps', gmapsSearch(e))} ${e.ll?link('Directions', gmapsDir(e)):''}</div></div>`).join('');
  return banner('Explore Big Sky','Resort, festival, food and lodging in one place') + `<div class="page">
    <div class="chips">${chips}</div>
    <div class="maphint">Tap a place to jump to it on the map. Pinch or use +/− to zoom.</div>
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
  const map = exploreMap = L.map('map', {zoomControl:true, scrollWheelZoom:false, dragging:!(isMobile() && matchMedia('(pointer:coarse)').matches)});   /* touch: one finger scrolls the page past the map; pinch + buttons still zoom. Mouse always drags */
  const dark = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, className:'tiles-dark', attribution:'&copy; OpenStreetMap contributors'});
  const street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, className:'', attribution:'&copy; OpenStreetMap contributors'});
  const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {maxZoom:17, attribution:'&copy; OpenStreetMap contributors, SRTM | OpenTopoMap'});
  dark.addTo(map);
  L.control.layers({'Dark':dark,'Street':street,'Terrain':topo}, null, {position:'topright'}).addTo(map);
  const markers = {};
  pins.forEach(e => {
    const icon = L.divIcon({className:'', html:`<span class="mk" style="background:${CAT_COLOR[e.cat]}"></span>`, iconSize:[22,22], iconAnchor:[11,11], popupAnchor:[0,-12]});
    const m = L.marker(e.ll, {icon, title:e.name}).addTo(map).bindPopup(
      `<b>${esc(e.name)}</b><br><span class="pc">${CATS[e.cat]}</span><br>${esc(e.sub)}${e.area?'<br><i>Exact spot unknown: dot marks the area only</i>':''}${e.r?`<br>★ ${esc(e.r)}`:''}<br><a href="${gmapsDir(e)}" target="_blank" rel="noopener">Directions in Google Maps</a>`);
    markers[EXPLORE.indexOf(e)] = m;
  });
  // fit to the Big Sky area; the airport is ~40 miles away so it only counts when it's the sole result
  const fitPts = pins.filter(e => (e.cat!=='go' && !e.far) || pins.length===1).map(e => e.ll);
  const allPts = pins.map(e => e.ll);
  if (fitPts.length > 1) map.fitBounds(fitPts, {padding:[40,40]});
  else if (fitPts.length === 1) map.setView(fitPts[0], 13);
  else if (allPts.length > 1) map.fitBounds(allPts, {padding:[40,40]});
  else map.setView(allPts[0] || [45.27,-111.35], 13);
  if (pins.some(e => e.far)) {
    const Ctl = L.Control.extend({onAdd(){ const b = L.DomUtil.create('button','fitall'); b.type='button'; b.textContent='Show Bozeman side'; L.DomEvent.disableClickPropagation(b); b.onclick = () => map.fitBounds(allPts, {padding:[40,40]}); return b; }});
    new Ctl({position:'bottomleft'}).addTo(map);
  }
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
const secHead = (id, icon, title, sub) => `<div class="sec" id="sec-${id}"><span class="sec-ico">${ico(icon)}</span><div><h2>${title}</h2>${sub?`<p>${sub}</p>`:''}</div></div>`;
const factRows = rows => dl(rows.map(([k,v,warn]) => [k, v + (warn ? ' ' + flagTag('Unverified') : '')]));
const TRAVEL_NAV = [['quick','Quick facts'],['airport','Airport'],['show','Show nights'],['around','Around town'],['roads','Roads'],['stops','Stops'],['calls','Numbers']];
function viewTravel(){
  const T = TRAVEL;
  const mapQ = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  const places = T.quick.places.map(([n,addr,from,q,warn]) => `<li class="qp"><div class="qp-n">${n}</div><div class="qp-a"><a href="${mapQ(q)}" target="_blank" rel="noopener">${addr} ${ico('ext')}</a></div><div class="qp-d">${from}${warn?' '+flagTag('Estimate'):''}</div></li>`).join('');
  const qrides = T.quick.rides.map(([tag,cls,t,d]) => `<li><span class="tag ${cls}">${tag}</span><div><b>${t}</b><span class="d">${d}</span></div></li>`).join('');
  const airport = T.airport.map(o => `<section class="card oc ${o.pick?'pick':''}">
      <div class="oc-top"><span class="tag ${o.pick?'ok':'mid'}">${o.tag}</span></div>
      <h3>${o.t}</h3>
      <ul class="pc pro">${o.pro.map(x=>`<li>${x}</li>`).join('')}</ul>
      <ul class="pc con">${o.con.map(x=>`<li>${x}</li>`).join('')}</ul></section>`).join('');
  const rides = T.rides.map(([tag,cls,t,d]) => `<li><span class="tag ${cls}">${tag}</span><div><b>${t}</b><span class="d">${d}</span></div></li>`).join('');
  const calls = T.calls.map(([n,disp,href,w]) => `<a class="call" href="tel:${href.replace(/[^\d+]/g,'')}"><span class="call-ico">${ico('phone')}</span><span class="call-txt"><b>${n}</b><span class="num">${disp}</span><span class="w">${w}</span></span></a>`).join('');
  return banner('Travel & Logistics','Getting to, around and home from Big Sky') + `<div class="page travel">
    <div class="chips tnav" id="tnav">${TRAVEL_NAV.map(([k,l],i)=>`<button type="button" class="chip" data-jump="${k}">${l}</button>`).join('')}</div>

    ${secHead('quick','pin','Quick facts','Addresses, distances and rides on one screen. Details follow below')}
    ${card('Where things are', `<ul class="qps">${places}</ul><p class="sub">Tap an address to open it in Maps. Drive times are estimates until checked in Google Maps with a winter check.</p>`, 'qcard')}
    <div class="grid2">
      ${card('Rides and getting around', `<ul class="rides">${qrides}</ul>`)}
      ${card('Distances', factRows(T.quick.distances))}
    </div>

    <div class="more-div"><span>More detail</span></div>

    ${secHead('airport','plane','From the airport','How the group gets from BZN to 397 Beaver Creek Rd')}
    <div class="optcards">${airport}</div>

    ${secHead('show','music','Show nights','Listed 5–11 pm each night. Gate and set times are still TBA')}
    <div class="grid-tc">
      ${card('Ways home from the arena', `<ul class="rides">${rides}</ul>`)}
      <div>${card('Show-night game plan', `<ol class="plan">${T.showPlan.map(x=>`<li>${x}</li>`).join('')}</ol>`, 'planbox')}</div>
    </div>

    ${secHead('around','car','Around Big Sky','Free buses, on-demand rides and parking')}
    <div class="grid2">
      ${card('Buses & rides', factRows(T.around))}
      ${card('Parking', factRows(T.parking))}
    </div>

    ${secHead('roads','snow','Roads & weather','US-191 through Gallatin Canyon is the one road in')}
    <div class="grid2">
      ${card('Driving the canyon', factRows(T.roads))}
      ${card('Cold, altitude & safety', dl(T.tips))}
    </div>

    ${secHead('stops','cart','Groceries & liquor','Stock up before you reach the canyon')}
    ${card('', factRows(T.stops))}

    ${secHead('calls','phone','Numbers to save','Tap to call')}
    <div class="calls">${calls}</div>
    <div class="plinks bigl">${link('511 road conditions','https://www.511mt.net')} ${link('Skyline winter schedule','https://skylinebus.com/routes/winter')} ${link('BZN ground transportation','https://bozemanairport.com/ground-transportation')} ${link('Resort parking','https://bigskyresort.com/parking')} ${link('Know Before You Go','https://expertsonlybigsky.com/know-before-you-go/')}</div>

    ${card('Still unknown', `<ul class="oq">${T.unknown.map(x=>`<li>${x}</li>`).join('')}</ul><p class="sub">Notes are from 16 Nov 2026 and drafts. Re-check fares, schedules and parking in February.</p>`)}
  </div>`;
}
function bindTravel(){
  const chips = [...document.querySelectorAll('#tnav .chip')];
  chips.forEach(b => b.onclick = () => document.getElementById('sec-'+b.dataset.jump).scrollIntoView({behavior:'smooth', block:'start'}));
}

/* ===== BOOKINGS ===== */
function viewBookings(){
  const cls = {Booked:'ok','Not booked':'bad',Shortlisted:'mid',Unknown:'mid'};
  return banner('Bookings','What is locked in and what is still open') + `<div class="page">
    ${card('', table(['Item','Status','Details','Cost'], BOOKINGS.map(b => [
      `<b>${b.item}</b>`, `<span class="tag ${cls[b.status]}">${b.status}</span>`,
      esc(b.detail) + (b.href?` ${link('Listing', b.href)}`:'') + (b.flag?` ${flagTag(b.flag)}`:''), b.cost]), true))}
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
      ${card('Rental shops', table(['Shop','Where','Per day'], BUDGET.rentals) + '<p class="sub"><b>Preferred: slope side or Mountain Village.</b> Big Sky Sports (Mountain Village and Madison Base) is the slope-side option. Christy Sports – Mountain Village is the closest off-slope alternative.</p>')}
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

/* ===== TASKS ===== */
let showGroup = false;   /* the group list stays open across re-renders */
function taskRow(t){
  const chips = `<span class="tg">${esc(t.g)}</span>` + (t.cost ? `<span class="tg cost">${esc(t.cost)}</span>` : '') + (t.due ? `<span class="tg due">${esc(t.due)}</span>` : '');
  const links = t.links ? `<div class="tlinks">${t.links.map(l=>`<a class="ext" href="${esc(l[1])}" target="_blank" rel="noopener">${esc(l[0])}</a>`).join('')}</div>` : '';
  const opts = t.opts ? `<div class="opts">${t.opts.map(o=>`<div class="opt"><b>${esc(o[0])}:</b> ${esc(o[1])}</div>`).join('')}</div>` : '';
  return `<li data-id="${t.id}" class="${doneSet.has(t.id)?'done':''}" role="checkbox" aria-checked="${doneSet.has(t.id)}" tabindex="0"><span class="cb"></span><div class="tt"><div class="tn">${esc(t.t)}</div>${t.note?`<div class="sub">${esc(t.note)}</div>`:''}<div class="chips">${chips}</div>${opts}${links}</div></li>`;
}
const foldCard = (id, title, count, open, inner) => `<section class="card panel"><button class="donetoggle" id="${id}" aria-expanded="${open}"><h3>${title} <span class="cnt">${count}</span></h3><span class="chev">${open?'Hide':'Show'}</span></button>${open?inner:''}</section>`;
function viewTasks(){
  const total = MINE.length, n = nDone(MINE), pct = Math.round(n / total * 100);
  const open = MINE.filter(t => !doneSet.has(t.id)), done = MINE.filter(t => doneSet.has(t.id));
  const buckets = WHEN.map(w => {
    const items = open.filter(t => t.w === w.id);
    return items.length ? card(`${w.label} <span class="cnt">${items.length}</span>`, `<p class="sub bk">${esc(w.sub)}</p><ul class="tasklist big">${items.map(taskRow).join('')}</ul>`) : '';
  }).join('');
  const body = open.length ? buckets : card('', '<p class="allclear">All your tasks are done. Nothing left to do.</p>');
  const doneCard = done.length ? card(`Done <span class="cnt ok">${done.length}</span>`, `<ul class="tasklist big">${done.map(taskRow).join('')}</ul>`, 'donecard') : '';
  const gOpen = GROUP.filter(t => !doneSet.has(t.id)).length;
  const groupSorted = [...GROUP].sort((x,y) => (doneSet.has(x.id)) - (doneSet.has(y.id)) || WHEN.findIndex(w=>w.id===x.w) - WHEN.findIndex(w=>w.id===y.w));
  const groupCard = foldCard('groupToggle', 'Organizer & group tasks', gOpen, showGroup, `<p class="sub bk">Shared items one person handles for everyone. You don't need to do these unless you're organizing.</p><ul class="tasklist big">${groupSorted.map(taskRow).join('')}</ul>`);
  return banner('Tasks', `Your checklist · ${n} of ${total} done`) + `<div class="page">
    <div class="progress" aria-label="${pct}% complete"><div class="bar"><i style="width:${pct}%"></i></div><span>${pct}%</span></div>
    <div class="grid-tc">
      <div>${doneCard}${body}${groupCard}</div>
      <div>
        ${card('Waiting on others', `<ul class="oq">${OPEN_Q.map(q=>`<li>${esc(q)}</li>`).join('')}</ul>`)}
      </div>
    </div></div>`;
}
function bindTasks(){
  const toggle = li => { const id=+li.dataset.id; doneSet.has(id)?doneSet.delete(id):doneSet.add(id); saveDone(); render(); };
  document.querySelectorAll('.tasklist.big li').forEach(li => {
    li.onclick = e => { if (e.target.closest('a')) return; toggle(li); };   /* links open, they don't tick the box */
    li.onkeydown = e => { if (e.target === li && (e.key===' ' || e.key==='Enter')){ e.preventDefault(); toggle(li); } };
  });
  const gt = $('#groupToggle'); if (gt) gt.onclick = () => { showGroup = !showGroup; render(); };
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

/* ===== THINGS TO DO ===== */
function viewActivities(cat='all'){
  if (cat!=='all' && !ACT_CATS[cat]) cat='all';
  const chips = [['all','All'],...Object.entries(ACT_CATS)].map(([k,v])=>`<a class="chip ${k===cat?'on':''}" href="#/activities/${k}">${v}</a>`).join('');
  const list = ACTIVITIES.filter(a => cat==='all' || a.cat===cat);
  const cards = list.map(a => `<section class="card panel act">
    <h3>${esc(a.name)} ${a.flag?flagTag(a.flag):''}</h3>
    <div class="sub">${esc(a.where)}</div>
    ${dl([['Est. price per person',esc(a.price)]])}
    <p class="sub">${esc(a.note)}</p>
    <div class="plinks">${a.links.map(l=>link(l[0],l[1])).join(' ')} ${link('Google Maps','https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(a.name+' '+a.where))}</div></section>`).join('');
  return banner('Things to Do','Non-skiing options for the group · Mar 12–16, 2027') + `<div class="page">
    <div class="note warn">Prices are undated estimates from listings and resellers, <b>not confirmed for March 2027</b>. Many are per sleigh, sled or boat, so 14 people means several. Call or check the link before booking. Full notes live in the vault under Non Skiing.</div>
    <div class="chips wrap">${chips}</div>
    <div class="grid2">${cards}</div>
  </div>`;
}

/* ===== router ===== */
const ROUTES = {home:[viewHome,bindHome], itinerary:[viewItinerary,bindItinerary], explore:[viewExplore,bindExplore], activities:[viewActivities], travel:[viewTravel,bindTravel], bookings:[viewBookings], budget:[viewBudget,bindBudget], tasks:[viewTasks,bindTasks], festival:[viewFestival]};
let lastHash = null;
const PAGE_TITLE = {home:'Experts Only', festival:'Experts Only'};
function render(){
  const [, route='home', arg] = location.hash.split('/');
  const [fn, bind] = ROUTES[route] || ROUTES.home;
  $('#view').innerHTML = fn(arg);
  if (bind) bind();
  $('.main').classList.toggle('is-home', route==='home' || !ROUTES[route]);
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('active', a.dataset.route === (route==='festival'?'home':route)));
  $('#bellDot').textContent = pending();
  const tab = ROUTES[route] ? (route==='festival' ? 'home' : route) : 'home';
  document.querySelectorAll('#tabbar a').forEach(a => a.classList.toggle('active', a.dataset.tab === tab));
  menuBtn.classList.toggle('active', !document.querySelector(`#tabbar a[data-tab="${tab}"]`));
  const navLink = document.querySelector(`#nav a[data-route="${route}"]`);
  $('#tbTitle').textContent = PAGE_TITLE[route] || (navLink ? navLink.textContent.trim() : 'Experts Only');
  setMenu(false);
  if (location.hash !== lastHash) window.scrollTo(0,0);   /* task edits re-render in place without jumping */
  lastHash = location.hash;
}
addEventListener('hashchange', render);
render();
