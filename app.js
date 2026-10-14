"use strict";
const $ = s => document.querySelector(s);
const regionNames = new Intl.DisplayNames(["de"], { type: "region" });
const nameOf = a2 => regionNames.of(a2);
const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const PRAISE = ["Richtig! 🎉", "Super! ✨", "Genau! 💪", "Stark! 🌟", "Bravo! 🥳"];

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "class") el.className = v;
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) el.append(k.nodeType ? k : String(k));
  return el;
}

// ---------- Speicher ----------
const KEY = "raetselmix-v1";
const fresh = () => ({ items: {}, score: 0, streak: 0, best: 0, played: 0, cur: null });
function load() { try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY))); } catch { return fresh(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
let S = load();

const recent = [];
const remember = id => { recent.push(id); if (recent.length > 6) recent.shift(); };
function grade(id, ok, data) { srGrade(S.items, id, ok, Date.now(), data); save(); }

// ---------- Rahmen ----------
const main = $("#main"), skipBtn = $("#skip");
let lastType = null;

function updateHud() {
  const now = Date.now();
  const due = Object.values(S.items).filter(i => i.due <= now).length;
  $("#score").textContent = `⭐ ${S.score}`;
  $("#streak").textContent = `🔥 ${S.streak} (Rekord ${S.best})`;
  $("#due").textContent = due ? `🔁 ${due} fällig` : "";
}

// w = Gewichtung: wie oft der Typ im Mix vorkommt
const TASKS = {
  frage:    { w: 2,   run: card => runQuestion(card, QUESTIONS, "q:", "Allgemeinwissen", "t-frage") },
  medizin:  { w: 3,   run: card => runQuestion(card, MED_QUESTIONS, "mq:", "Medizin", "t-medizin") },
  anatomie: { w: 2.5, run: runAnatomy },
  karte:    { w: 2.5, run: runMap },
  matrix:  { w: 2,   run: runMatrix },
  flaggen: { w: 2,   run: runFlags },
  sudoku:  { w: 0.6, run: runSudoku },
};

function chooseType() {
  const list = Object.entries(TASKS).filter(([k]) => !(k === "sudoku" && lastType === "sudoku"));
  let r = Math.random() * list.reduce((s, [, t]) => s + t.w, 0);
  for (const [k, t] of list) if ((r -= t.w) <= 0) return k;
  return list[0][0];
}

function newCard() {
  window.onkeydown = null;
  const card = h("section", { class: "card pop" });
  main.replaceChildren(card);
  skipBtn.hidden = false;
  window.scrollTo({ top: 0 });
  return card;
}

function next() {
  S.cur = null; save();
  const type = chooseType();
  lastType = type;
  TASKS[type].run(newCard());
  updateHud();
}

function finish(card, ok, msg, pts = 10) {
  if (!card.isConnected) return;
  if (ok === true) { S.score += pts; S.streak++; S.best = Math.max(S.best, S.streak); }
  else if (ok === false) S.streak = 0;
  S.played++; save(); updateHud();
  skipBtn.hidden = true;
  const fb = h("div", { class: "feedback " + (ok ? "good" : ok === false ? "bad" : "") },
    h("span", {}, msg || (ok ? pick(PRAISE) : "Leider falsch.")),
    h("button", { class: "btn", onclick: next }, "Weiter →"));
  card.append(fb);
  fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

const tag = (txt, cls) => h("div", { class: "tag " + cls }, txt);

// ---------- Multiple Choice (SR): Allgemeinwissen + Medizin ----------
function runQuestion(card, list, prefix, label, cls) {
  const ids = list.map(q => prefix + q.q);
  const id = srPick(S.items, prefix, ids, recent);
  const q = list.find(x => prefix + x.q === id);
  remember(id);
  card.append(tag(label, cls));
  if (q.img) card.append(h("img", { class: "qimg", src: q.img, alt: "" }));
  card.append(h("h2", {}, q.q));
  const box = h("div", { class: "opts" });
  for (const o of shuffle([q.a, ...q.w])) {
    box.append(h("button", { class: "opt", onclick: e => {
      const ok = o === q.a;
      [...box.children].forEach(b => { b.disabled = true; if (b.textContent === q.a) b.classList.add("good"); });
      if (!ok) e.currentTarget.classList.add("bad");
      grade(id, ok);
      finish(card, ok, ok ? null : `Richtig wäre: ${q.a}`);
    } }, o));
  }
  card.append(box);
}

// ---------- Anatomie-Abbildungen (SR pro Struktur) ----------
function runAnatomy(card) {
  const ids = FIGURES.flatMap(f => Object.keys(f.parts).map(p => `a:${f.id}:${p}`));
  const id = srPick(S.items, "a:", ids, recent);
  remember(id);
  const [, figId, part] = id.split(":");
  const fig = FIGURES.find(f => f.id === figId), answer = fig.parts[part];
  card.append(tag("Anatomie", "t-anatomie"), h("p", { class: "hint" }, fig.title), h("h2", {}, "Welche Struktur ist rot markiert?"));
  const wrap = h("div", { class: "fig" });
  wrap.innerHTML = `<svg viewBox="${fig.viewBox}" xmlns="http://www.w3.org/2000/svg">${fig.svg}</svg>`;
  wrap.querySelector(`[data-p="${part}"]`).classList.add("hl");
  card.append(wrap);
  const others = shuffle(Object.keys(fig.parts).filter(k => k !== part)).slice(0, 3).map(k => fig.parts[k]);
  const box = h("div", { class: "opts" });
  for (const o of shuffle([answer, ...others])) {
    box.append(h("button", { class: "opt", onclick: e => {
      const ok = o === answer;
      [...box.children].forEach(b => { b.disabled = true; if (b.textContent === answer) b.classList.add("good"); });
      if (!ok) e.currentTarget.classList.add("bad");
      grade(id, ok);
      finish(card, ok, ok ? null : `Richtig wäre: ${answer}`);
    } }, o));
  }
  card.append(box);
}

// ---------- Weltkarte (SR) ----------
let worldPromise = null;
const loadWorld = () => worldPromise ||= fetch(WORLD_URL).then(r => r.json())
  .then(t => topojson.feature(t, t.objects.countries).features.filter(f => f.id !== "010"))
  .catch(e => { worldPromise = null; throw e; });

async function runMap(card) {
  const ids = COUNTRIES.map(c => "m:" + c[0]);
  const id = srPick(S.items, "m:", ids, recent);
  remember(id);
  const a2 = id.slice(2), num = COUNTRIES.find(c => c[0] === a2)[1];
  card.append(tag("Weltkarte", "t-karte"), h("h2", {}, "Wo liegt ", h("b", {}, nameOf(a2)), "?"),
    h("p", { class: "hint" }, "Land antippen. Mit zwei Fingern zoomen."));
  const wrap = h("div", { class: "map" }, "Karte lädt …");
  card.append(wrap);
  let feats;
  try { feats = await loadWorld(); } catch { wrap.textContent = "Karte konnte nicht geladen werden (Internet?)."; return finish(card, null, " "); }
  if (!card.isConnected) return;
  wrap.textContent = "";
  const W = 960, H = 500;
  const svg = d3.select(wrap).append("svg").attr("viewBox", `0 0 ${W} ${H}`);
  const proj = d3.geoNaturalEarth1().fitSize([W, H], { type: "FeatureCollection", features: feats });
  const path = d3.geoPath(proj);
  const g = svg.append("g");
  let done = false;
  g.selectAll("path").data(feats).join("path").attr("d", path).attr("class", "land")
    .on("click", (ev, f) => {
      if (done) return;
      done = true;
      const ok = f.id === num;
      d3.select(ev.currentTarget).classed(ok ? "good" : "bad", true);
      g.selectAll("path").filter(d => d.id === num).classed("good", true).raise();
      grade(id, ok);
      const hit = COUNTRIES.find(c => c[1] === f.id);
      finish(card, ok, ok ? null : `Das war ${hit ? nameOf(hit[0]) : f.properties.name}. Grün = ${nameOf(a2)}.`);
    });
  svg.call(d3.zoom().scaleExtent([1, 16]).translateExtent([[0, 0], [W, H]])
    .on("zoom", e => g.attr("transform", e.transform)));
}

// ---------- Matrizen (SR) ----------
const matEl = (A, cls = "") => h("table", { class: "mat " + cls }, A.map(r => h("tr", {}, r.map(v => h("td", {}, v)))));
const PROMPT = { det2: "Berechne det(A)", det3: "Berechne det(A)", mul2: "Berechne A · B", matvec: "Berechne A · v" };

function runMatrix(card) {
  let id = srPick(S.items, "x:", null, recent), task;
  if (id) task = S.items[id].data;
  else { task = genMatrix(); id = "x:" + JSON.stringify(task); }
  remember(id);
  const sol = solveMatrix(task);
  card.append(tag("Matrizen", "t-matrix"), h("h2", {}, PROMPT[task.t]));
  const isDet = task.t.startsWith("det");
  const expr = h("div", { class: "expr" }, h("span", {}, "A ="), matEl(task.A));
  if (task.B) expr.append(h("span", {}, "B ="), matEl(task.B));
  if (task.v) expr.append(h("span", {}, "v ="), matEl(task.v));
  card.append(expr);
  const inputs = sol.map(r => r.map(() => h("input", { type: "number", class: "num" })));
  const ans = h("div", { class: "expr" }, h("span", {}, "="),
    h("table", { class: "mat " + (isDet ? "plain" : "") }, inputs.map(r => h("tr", {}, r.map(i => h("td", {}, i))))));
  const btn = h("button", { class: "btn", onclick: () => {
    let ok = true;
    inputs.forEach((r, i) => r.forEach((inp, j) => {
      const good = inp.value.trim() !== "" && Number(inp.value) === sol[i][j];
      inp.classList.add(good ? "good" : "bad"); inp.disabled = true; ok &&= good;
    }));
    btn.remove();
    grade(id, ok, task);
    if (!ok) card.append(h("div", { class: "expr" }, h("span", {}, "Lösung:"), matEl(sol, isDet ? "plain" : "")));
    finish(card, ok, ok ? null : "Nicht ganz – kommt bald wieder.", 15);
  } }, "Prüfen");
  card.append(ans, btn);
  inputs[0][0].focus();
}

// ---------- Flaggen zuordnen (zufällig) ----------
function runFlags(card) {
  const pool = shuffle(COUNTRIES).slice(0, 4);
  card.append(tag("Flaggen", "t-flaggen"), h("h2", {}, "Erst Flagge, dann Land antippen"));
  const flags = h("div", { class: "flags" }), names = h("div", { class: "opts" });
  let sel = null, matched = 0, errors = 0;
  for (const [a2] of pool) flags.append(h("button", { class: "flag", "data-a2": a2, onclick: e => {
    const b = e.currentTarget; if (b.disabled) return;
    flags.querySelectorAll(".sel").forEach(x => x.classList.remove("sel"));
    sel = b; b.classList.add("sel");
  } }, h("img", { src: `https://flagcdn.com/w320/${a2.toLowerCase()}.png`, alt: "Flagge" })));
  for (const [a2] of shuffle(pool)) names.append(h("button", { class: "opt", "data-a2": a2, onclick: e => {
    const b = e.currentTarget; if (!sel || b.disabled) return;
    if (sel.dataset.a2 === b.dataset.a2) {
      sel.classList.replace("sel", "good"); b.classList.add("good");
      sel.disabled = b.disabled = true; sel = null;
      if (++matched === pool.length) finish(card, errors === 0, errors ? `Geschafft, mit ${errors} Fehlversuch(en).` : "Alle richtig! 🎉", 20);
    } else {
      errors++; b.classList.add("bad"); setTimeout(() => b.classList.remove("bad"), 500);
    }
  } }, nameOf(a2)));
  card.append(flags, names);
}

// ---------- Sudoku (zufällig, Fortschritt bleibt gespeichert) ----------
function runSudoku(card, resume) {
  const st = resume || (() => { const { puzzle, solution } = generateSudoku(44); return { type: "sudoku", puz: puzzle, sol: solution, cur: [...puzzle] }; })();
  S.cur = st; save();
  card.append(tag("Sudoku", "t-sudoku"));
  const grid = h("div", { class: "sudoku" });
  let sel = -1, done = false;
  const cells = st.cur.map((v, i) => {
    const given = st.puz[i] !== 0, r = Math.floor(i / 9), c = i % 9;
    const el = h("button", { class: "cell" + (given ? " given" : "") + (c % 3 === 2 && c < 8 ? " br" : "") + (r % 3 === 2 && r < 8 ? " bb" : ""),
      onclick: () => { sel = i; paint(); } }, v || "");
    grid.append(el);
    return el;
  });
  const setVal = n => {
    if (sel < 0 || done || st.puz[sel]) return;
    st.cur[sel] = n; cells[sel].textContent = n || ""; save(); paint();
    if (st.cur.every((v, i) => v === st.sol[i])) { done = true; S.cur = null; finish(card, true, "Sudoku gelöst! 🧩🎉", 50); }
  };
  function paint() {
    const sv = sel >= 0 ? st.cur[sel] : 0;
    cells.forEach((el, i) => {
      el.classList.toggle("sel", i === sel);
      el.classList.toggle("same", !!sv && i !== sel && st.cur[i] === sv);
      el.classList.toggle("conflict", hasConflict(st.cur, i));
      el.classList.remove("wrong");
    });
  }
  const pad = h("div", { class: "pad" }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => h("button", { onclick: () => setVal(n) }, n)),
    h("button", { onclick: () => setVal(0) }, "⌫"));
  const msg = h("p", { class: "hint" });
  const check = h("button", { class: "btn ghost", onclick: () => {
    let wrong = 0;
    cells.forEach((el, i) => { const w = st.cur[i] && st.cur[i] !== st.sol[i]; el.classList.toggle("wrong", !!w); wrong += !!w; });
    msg.textContent = wrong ? `${wrong} Feld(er) falsch.` : "Bisher alles richtig 👍";
  } }, "Prüfen");
  window.onkeydown = e => {
    if (/^[1-9]$/.test(e.key)) setVal(+e.key);
    else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") setVal(0);
  };
  card.append(grid, pad, check, msg);
  paint();
}

// ---------- Start ----------
document.title = $("#title").textContent = CONFIG.title;
skipBtn.onclick = next;
$("#reset").onclick = () => { if (confirm("Gesamten Fortschritt löschen?")) { S = fresh(); save(); next(); } };
updateHud();
setInterval(updateHud, 30e3);
if (S.cur && S.cur.type === "sudoku") { lastType = "sudoku"; runSudoku(newCard(), S.cur); }
else next();
