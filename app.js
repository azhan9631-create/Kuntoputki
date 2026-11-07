const XE = {
  all:"All", mine:"Mine", volume:"kg lifted this week", prs:"personal records",
  restTitle:"Rest timer", restStop:"Stop", restDone:"Rest's over, go! 💥",
  milestone:"🏅 {n} weeks in a row, amazing!", addOwnPh:"New exercise name",
  quotes:["Small steps every week add up to big results. 💪","Showing up is most of the battle.","Your only competition is who you were yesterday.","Progress, not perfection.","Rest is part of training too. 😴","Every rep counts, even the slow ones.","The best workout is the one you actually do.","Strong is the new normal."],
  guide1:"Pick a body part, then tap an exercise.",
  guide4:"Use − and + for weight and reps. Aa makes text bigger, FI/EN switches language, ? shows this guide again."
};
const XF = {
  all:"Kaikki", mine:"Omat", volume:"kg nostettu tällä viikolla", prs:"ennätystä",
  restTitle:"Lepoajastin", restStop:"Pysäytä", restDone:"Lepo ohi, menoksi! 💥",
  milestone:"🏅 {n} viikkoa putkeen, upeaa!", addOwnPh:"Uuden liikkeen nimi",
  quotes:["Pienet askeleet joka viikko kasvavat suuriksi tuloksiksi. 💪","Paikalle meneminen on jo puoli voittoa.","Ainoa kilpailija on eilinen sinä.","Edistys, ei täydellisyys.","Lepo kuuluu treeniin myös. 😴","Jokainen toisto lasketaan, myös hitaat.","Paras treeni on se, jonka oikeasti teet.","Vahva on uusi normaali."],
  guide1:"Valitse lihasryhmä ja napauta liikettä.",
  guide4:"Käytä − ja + painoon ja toistoihin. Aa suurentaa tekstiä, FI/EN vaihtaa kielen, ? näyttää ohjeen uudelleen."
};
Object.assign(T.en, XE);
Object.assign(T.fi, XF);

const $ = id => document.getElementById(id);
const fmt = d => d.toLocaleDateString("en-CA");
const parse = s => new Date(s + "T00:00:00");
const today = fmt(new Date());
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } };
const pick = a => a[Math.floor(Math.random() * a.length)];

let logs = load("gymLogs", []);
let custom = load("gymCustom", []);
let settings = Object.assign({ goal: 3, big: false, lang: "en", lastEx: null }, load("gymSettings", {}));
let lang = settings.lang === "fi" ? "fi" : "en";
let group = "all";
let cur = settings.lastEx || LIB.chest[0];

const GROUPS = {
  chest: ["💪", "Chest", "Rinta"],
  back: ["🧗", "Back", "Selkä"],
  legs: ["🦵", "Legs", "Jalat"],
  shoulders: ["🏔️", "Shoulders", "Olkapäät"],
  arms: ["💥", "Arms", "Kädet"],
  core: ["🎯", "Core", "Keskivartalo"],
  cardio: ["🏃", "Cardio", "Kestävyys"],
  easy: ["🌿", "Easy & Balance", "Helppo & tasapaino"]
};

const t = (k, v = {}) => {
  let s = (T[lang][k] ?? T.en[k] ?? k);
  if (typeof s === "string") Object.entries(v).forEach(([a, b]) => s = s.replace("{" + a + "}", b));
  return s;
};
const exName = n => (lang === "fi" && FI[n]) ? FI[n] : n;
const groupName = g => lang === "fi" ? GROUPS[g][2] : GROUPS[g][1];

const save = () => {
  settings.lang = lang;
  localStorage.setItem("gymLogs", JSON.stringify(logs));
  localStorage.setItem("gymCustom", JSON.stringify(custom));
  localStorage.setItem("gymSettings", JSON.stringify(settings));
};
const builtIn = Object.values(LIB).flat();
const allNames = () => [...custom, ...builtIn];

const oldList = load("gymExercises", null);
if (Array.isArray(oldList)) {
  oldList.forEach(n => { if (!allNames().includes(n)) custom.push(n); });
  localStorage.removeItem("gymExercises");
  save();
}

const setTxt = s => (s.weight > 0 ? s.weight + " " + t("kg") : t("bodyweight")) + " × " + s.reps;

function monday(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - (x.getDay() + 6) % 7);
  return x;
}

function calcStreak() {
  const days = new Set(logs.map(l => l.date));
  const counts = {};
  days.forEach(s => { const k = fmt(monday(parse(s))); counts[k] = (counts[k] || 0) + 1; });
  const w = monday(new Date());
  const thisWeek = counts[fmt(w)] || 0;
  let streak = thisWeek >= settings.goal ? 1 : 0;
  w.setDate(w.getDate() - 7);
  while ((counts[fmt(w)] || 0) >= settings.goal) { streak++; w.setDate(w.getDate() - 7); }
  return { days, streak, thisWeek };
}

function countPRs() {
  const best = {};
  let n = 0;
  [...logs].sort((a, b) => a.id - b.id).forEach(l => {
    const b = best[l.exercise] || 0;
    if (l.weight > 0 && l.weight > b) {
      if (b > 0) n++;
      best[l.exercise] = l.weight;
    }
  });
  return n;
}

function renderHero() {
  const { days, streak, thisWeek } = calcStreak();
  const g = settings.goal;
  $("streakNum").textContent = streak;
  $("flame").className = "flame" + (streak > 0 ? " on" : "");
  $("ringFg").style.strokeDashoffset = 100 - Math.min(100, thisWeek / g * 100);
  $("ringTxt").textContent = `${Math.min(thisWeek, g)}/${g}`;
  const mon = monday(new Date());
  $("week").innerHTML = T[lang].days.map((n, i) => {
    const d = new Date(mon); d.setDate(mon.getDate() + i);
    const k = fmt(d), done = days.has(k);
    return `<div class="day ${done ? "done" : ""} ${k === today ? "now" : ""}"><span>${done ? "✓" : ""}</span><small>${n}</small></div>`;
  }).join("");
  $("goalText").textContent = t("goalText", { g, n: Math.min(thisWeek, g) });
  let msg = thisWeek >= g ? t("goalDone") : thisWeek === 0 ? t("startHello") : t("leftHello", { n: g - thisWeek });
  if (streak > 0 && streak % 4 === 0) msg = t("milestone", { n: streak }) + " " + msg;
  $("hello").textContent = msg;
  const qs = T[lang].quotes;
  $("quote").textContent = "“" + qs[Math.floor(Date.now() / 864e5) % qs.length] + "”";
}

function renderStats() {
  const { days } = calcStreak();
  $("totalDays").textContent = days.size;
  const from = fmt(monday(new Date()));
  const vol = logs.filter(l => l.date >= from && l.weight > 0).reduce((a, l) => a + l.weight * l.reps, 0);
  $("volWeek").textContent = Math.round(vol).toLocaleString(lang === "fi" ? "fi-FI" : "en-US");
  $("prCount").textContent = countPRs();
}

function renderChips() {
  const list = ["all", ...(custom.length ? ["mine"] : []), ...Object.keys(LIB)];
  $("chips").innerHTML = list.map(g => {
    const label = g === "all" ? t("all") : g === "mine" ? "⭐ " + t("mine") : GROUPS[g][0] + " " + groupName(g);
    return `<button class="chip ${g === group ? "on" : ""}" data-g="${g}">${label}</button>`;
  }).join("");
}

function renderTiles() {
  const listFor = g => g === "all" ? allNames() : g === "mine" ? custom : LIB[g];
  const emo = ex => {
    if (custom.includes(ex)) return "⭐";
    const g = Object.keys(LIB).find(k => LIB[k].includes(ex));
    return g ? GROUPS[g][0] : "⭐";
  };
  $("tiles").innerHTML = listFor(group).map(ex =>
    `<button class="tile ${ex === cur ? "on" : ""}" data-ex="${esc(ex)}"><span class="te">${emo(ex)}</span><span class="tn">${esc(exName(ex))}</span></button>`
  ).join("");
}

function lastSession(ex) {
  const past = logs.filter(l => l.exercise === ex && l.date !== today);
  if (!past.length) return null;
  const date = past.map(l => l.date).sort().pop();
  return { date, sets: past.filter(l => l.date === date) };
}

function renderLast() {
  const p = lastSession(cur);
  if (!p) {
    $("last").innerHTML = `<div class="muted">${esc(exName(cur))}</div><div style="margin-top:8px">${t("firstTime")}</div>`;
    return;
  }
  const ago = Math.round((parse(today) - parse(p.date)) / 864e5);
  const best = Math.max(...logs.filter(l => l.exercise === cur && l.date !== today).map(l => l.weight));
  $("last").innerHTML =
    `<div class="muted">${esc(exName(cur))} · ${p.date} · ${ago === 1 ? t("yesterday") : t("daysAgo", { n: ago })}</div>` +
    p.sets.map((s, i) => `<div class="line"><span><span class="num">${i + 1}</span></span><b>${setTxt(s)}</b></div>`).join("") +
    (best > 0 ? `<div class="best">${t("heaviest", { w: best })}</div>` : "") +
    `<div class="beat">${t("beatIt")}</div>`;
}

function prefill() {
  const p = lastSession(cur);
  const mine = logs.filter(l => l.exercise === cur && l.date === today);
  const ref = (p && (p.sets[mine.length] || p.sets[p.sets.length - 1])) || mine[mine.length - 1];
  $("weight").value = ref ? ref.weight : "";
  $("reps").value = ref ? ref.reps : "";
}

function renderToday() {
  const sets = logs.filter(l => l.date === today);
  $("todaySets").innerHTML = sets.length
    ? sets.map(s => `<div class="line"><span>${esc(exName(s.exercise))}: <b>${setTxt(s)}</b></span><button class="del" data-id="${s.id}">✕</button></div>`).join("")
    : `<span class="muted">${t("todayEmpty")}</span>`;
}

function renderHistory() {
  const dates = [...new Set(logs.map(l => l.date))].sort().reverse().slice(0, 10);
  $("history").innerHTML = dates.map(d => {
    const byEx = {};
    logs.filter(l => l.date === d).forEach(s => (byEx[s.exercise] = byEx[s.exercise] || []).push(s));
    return `<div class="card"><b>${d}</b>` + Object.entries(byEx).map(([ex, ss]) =>
      `<div style="margin-top:6px">${esc(exName(ex))}<br><span class="muted">${ss.map(s => `${s.weight}×${s.reps}`).join(", ")}</span></div>`).join("") + `</div>`;
  }).join("") || `<div class="card muted">${t("historyEmpty")}</div>`;
}

function renderAll() { renderHero(); renderStats(); renderLast(); renderToday(); renderHistory(); }

function feedback(w, r, prev, bestBefore) {
  if (!prev) return { type: "up", text: pick(T[lang].first) };
  const top = prev.sets.reduce((a, b) => (b.weight > a.weight || (b.weight === a.weight && b.reps > a.reps)) ? b : a);
  const topTxt = t("lastLine", { s: setTxt(top) });
  if (w > bestBefore && bestBefore > 0)
    return { type: "record", text: `${t("record", { w })} ${topTxt}` };
  if (w > top.weight)
    return { type: "up", text: `${t("up", { d: +(w - top.weight).toFixed(2) })} ${topTxt}` };
  if (w === top.weight && r > top.reps)
    return { type: "up", text: `${t("reps", { d: r - top.reps })} ${topTxt}` };
  if (w === top.weight && r === top.reps)
    return { type: "same", text: `${t("matched")} ${pick(T[lang].matchedTips)} ${topTxt}` };
  return { type: "easy", text: `💚 ${pick(T[lang].easyTips)} ${topTxt}` };
}

function showMsg(m) {
  const el = $("msg");
  el.className = "msg " + m.type;
  el.style.display = "block";
  el.textContent = m.text;
}

/* Rest timer */
let restLeft = 0, restIv = null;
function drawRest() {
  const m = Math.floor(restLeft / 60), s = restLeft % 60;
  $("restTxt").textContent = `${m}:${String(s).padStart(2, "0")}`;
}
function stopRest() { clearInterval(restIv); restIv = null; restLeft = 0; drawRest(); }
function startRest(sec) {
  clearInterval(restIv);
  restLeft = sec;
  drawRest();
  restIv = setInterval(() => {
    restLeft--;
    drawRest();
    if (restLeft <= 0) {
      clearInterval(restIv); restIv = null;
      if (navigator.vibrate) navigator.vibrate([250, 120, 250]);
      $("restTxt").textContent = "✅";
      $("hello").textContent = t("restDone");
    }
  }, 1000);
}

function applyFont() {
  document.documentElement.style.setProperty("--fs", settings.big ? "20px" : "16px");
}

function applyLang() {
  document.documentElement.lang = lang;
  $("appTitle").textContent = APP_NAME;
  document.title = APP_NAME;
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll("[data-ph]").forEach(el => el.placeholder = t(el.dataset.ph));
  $("langBtn").textContent = lang === "en" ? "FI" : "EN";
  applyFont();
  renderChips();
  renderTiles();
  renderAll();
}

/* Events */
$("tiles").onclick = e => {
  const b = e.target.closest(".tile");
  if (!b) return;
  cur = b.dataset.ex;
  settings.lastEx = cur; save();
  $("msg").style.display = "none";
  renderTiles(); renderLast(); prefill();
};

$("chips").onclick = e => {
  const b = e.target.closest(".chip");
  if (!b) return;
  group = b.dataset.g;
  renderChips(); renderTiles();
};

$("addEx").onclick = () => {
  const name = $("newEx").value.trim();
  if (!name) return;
  const exists = allNames().find(n => n.toLowerCase() === name.toLowerCase());
  if (!exists) { custom.push(name); group = "mine"; }
  cur = exists || name;
  settings.lastEx = cur;
  $("newEx").value = "";
  save();
  renderChips(); renderTiles(); renderLast(); prefill();
};

document.querySelectorAll(".sbtn").forEach(b => b.onclick = () => {
  const inp = $(b.dataset.t);
  const v = (parseFloat(inp.value) || 0) + Number(b.dataset.d);
  inp.value = Math.max(0, +v.toFixed(2));
  if (navigator.vibrate) navigator.vibrate(10);
});

$("addSet").onclick = () => {
  const w = parseFloat($("weight").value) || 0;
  const r = parseInt($("reps").value);
  if (!(r > 0)) return alert(t("needReps"));
  const prev = lastSession(cur);
  const bestBefore = Math.max(0, ...logs.filter(l => l.exercise === cur).map(l => l.weight));
  const before = calcStreak();
  logs.push({ id: Date.now(), date: today, exercise: cur, weight: w, reps: r });
  save();
  const after = calcStreak();
  const m = feedback(w, r, prev, bestBefore);
  if (before.thisWeek < settings.goal && after.thisWeek >= settings.goal)
    m.text += " " + t("weekReached", { s: after.streak });
  else if (before.days.size < after.days.size)
    m.text += " " + t("dayLogged");
  showMsg(m);
  if (navigator.vibrate) navigator.vibrate(40);
  renderAll();
  prefill();
};

document.querySelectorAll("[data-rest]").forEach(b => b.onclick = () => startRest(Number(b.dataset.rest)));
$("restStop").onclick = stopRest;

$("todaySets").onclick = e => {
  const id = e.target.dataset.id;
  if (!id) return;
  logs = logs.filter(l => String(l.id) !== id);
  save(); renderAll(); prefill();
};

$("goalMinus").onclick = () => { settings.goal = Math.max(1, settings.goal - 1); save(); renderAll(); };
$("goalPlus").onclick = () => { settings.goal = Math.min(7, settings.goal + 1); save(); renderAll(); };

$("fsBtn").onclick = () => { settings.big = !settings.big; save(); applyFont(); };
$("langBtn").onclick = () => { lang = lang === "en" ? "fi" : "en"; save(); applyLang(); };

function showGuide() { $("guide").style.display = "flex"; }
function hideGuide() { $("guide").style.display = "none"; localStorage.setItem("gymSeen", "1"); }
$("helpBtn").onclick = showGuide;
$("guideOk").onclick = hideGuide;

$("exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify({ logs, custom, settings })], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gym-backup-" + today + ".json";
  a.click();
};
$("importBtn").onclick = () => $("importFile").click();
$("importFile").onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const d = JSON.parse(rd.result);
      if (!Array.isArray(d.logs)) throw 0;
      if (!confirm(t("replaceQ"))) return;
      logs = d.logs;
      custom = Array.isArray(d.custom) ? d.custom : [];
      settings = Object.assign(settings, d.settings || {});
      lang = settings.lang === "fi" ? "fi" : "en";
      save(); applyLang(); prefill();
    } catch (err) { alert(t("badFile")); }
  };
  rd.readAsText(f);
};

applyLang();
prefill();
drawRest();
if (!localStorage.getItem("gymSeen")) showGuide();
