// Reine Logik ohne DOM (auch in Node testbar)
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- Spaced Repetition (Leitner) ----------
const MIN = 60e3, DAY = 864e5;
// Box 0 = falsch -> kommt nach ~2 Min. wieder; danach 1, 3, 7, 21, 60 Tage
const INTERVALS = [2 * MIN, DAY, 3 * DAY, 7 * DAY, 21 * DAY, 60 * DAY];

function srGrade(items, id, ok, now = Date.now(), data) {
  const it = items[id] || (items[id] = { box: 0, due: 0, right: 0, wrong: 0 });
  if (data !== undefined) it.data = data;
  if (ok) { it.box = Math.min(it.box + 1, INTERVALS.length - 1); it.right++; }
  else { it.box = 0; it.wrong++; }
  it.due = now + INTERVALS[it.box];
  return it;
}

// allIds = feste Menge (Fragen, Länder) oder null (generierte Aufgaben -> null heisst "neu generieren")
// freshIds (optional): nur daraus werden NEUE Elemente gezogen (= freigeschaltete Schwierigkeit)
function srPick(items, prefix, allIds, recent = [], now = Date.now(), freshIds = allIds) {
  const valid = allIds ? new Set(allIds) : null;
  const known = Object.keys(items).filter(id => id.startsWith(prefix) && !recent.includes(id) && (!valid || valid.has(id)));
  const due = known.filter(id => items[id].due <= now).sort((a, b) => items[a].due - items[b].due);
  if (due.length) return due[0];
  if (!allIds) return null;
  const fresh = freshIds.filter(id => !items[id] && !recent.includes(id));
  if (fresh.length) return pick(fresh);
  const pool = freshIds.filter(id => !recent.includes(id)).sort((a, b) => (items[a]?.due || 0) - (items[b]?.due || 0));
  return pool[rnd(Math.min(5, pool.length))] || pick(freshIds);
}

// ---------- Sudoku ----------
function peers(i) {
  const r = Math.floor(i / 9), c = i % 9, br = r - r % 3, bc = c - c % 3, out = [];
  for (let k = 0; k < 9; k++) out.push(r * 9 + k, k * 9 + c, (br + Math.floor(k / 3)) * 9 + bc + k % 3);
  return out.filter(j => j !== i);
}
const PEERS = Array.from({ length: 81 }, (_, i) => peers(i));

function candidates(g, i) {
  const used = new Set(PEERS[i].map(j => g[j]));
  const out = [];
  for (let n = 1; n <= 9; n++) if (!used.has(n)) out.push(n);
  return out;
}

function fillGrid(g) {
  const i = g.indexOf(0);
  if (i < 0) return true;
  for (const v of shuffle(candidates(g, i))) { g[i] = v; if (fillGrid(g)) return true; }
  g[i] = 0;
  return false;
}

function countSolutions(g, limit = 2) {
  let best = -1, bestC = null;
  for (let i = 0; i < 81; i++) if (!g[i]) {
    const c = candidates(g, i);
    if (!c.length) return 0;
    if (!bestC || c.length < bestC.length) { best = i; bestC = c; if (c.length === 1) break; }
  }
  if (best < 0) return 1;
  let n = 0;
  for (const v of bestC) { g[best] = v; n += countSolutions(g, limit - n); if (n >= limit) break; }
  g[best] = 0;
  return n;
}

function generateSudoku(holes = 44) {
  const solution = Array(81).fill(0);
  fillGrid(solution);
  const puzzle = [...solution];
  let removed = 0;
  for (const i of shuffle([...Array(81).keys()])) {
    if (removed >= holes) break;
    const b = puzzle[i]; puzzle[i] = 0;
    if (countSolutions([...puzzle]) !== 1) puzzle[i] = b; else removed++;
  }
  return { puzzle, solution };
}

const hasConflict = (g, i) => !!g[i] && PEERS[i].some(j => g[j] === g[i]);

// ---------- Logik-Matrizen (3x3, letztes Feld fehlt) ----------
// Deterministisch aus einem Seed -> für Spaced Repetition reicht es, den Seed zu speichern.
function mulberry32(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const SHAPE_NAMES = ["Dreieck", "Quadrat", "Fünfeck", "Sechseck", "Kreis"];
const FILL_NAMES = ["weiss", "hellgrau", "dunkelgrau", "schwarz"];
const ATTR = {
  shape: { n: 5, progMax: 3, label: "Form", fmt: v => SHAPE_NAMES[v] },
  count: { n: 6, min: 1, label: "Anzahl", fmt: v => v },
  fill:  { n: 4, label: "Füllung", fmt: v => FILL_NAMES[v] },
  size:  { n: 4, label: "Grösse", fmt: v => ["klein", "mittel", "gross", "sehr gross"][v] },
};
const attrMin = a => ATTR[a].min || 0;
const attrMax = a => attrMin(a) + ATTR[a].n - 1;

function lmShapes(R, L) {
  const ri = n => Math.floor(R() * n), rpick = a => a[ri(a.length)], rshuf = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = ri(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const names = ["shape", "count", "fill", "size"];
  let active;
  const nActive = L <= 1 ? 1 : L <= 3 ? 2 : L === 4 ? (R() < 0.5 ? 2 : 3) : 3;
  do { active = rshuf(names).slice(0, nActive); } while (active.includes("count") && active.includes("size"));
  const rules = {}, grid = Array.from({ length: 9 }, () => ({ k: "shapes" }));
  const expl = [];
  for (const a of names) {
    const lo = attrMin(a), hi = a === "shape" ? ATTR.shape.progMax : attrMax(a);
    let rule;
    if (active.includes(a)) rule = L <= 1 || R() < 0.5 ? "prog" : "dist";
    else if (L >= 4 && a !== "size" && R() < 0.3 && !(a === "count" && active.includes("size"))) rule = "row";
    else rule = "const";
    if (a === "size" && (active.includes("count") || rules.count === "row")) rule = "const";
    rules[a] = rule;
    if (rule === "prog") {
      const d = R() < 0.5 ? 1 : -1;
      for (let r = 0; r < 3; r++) {
        const s = d > 0 ? lo + ri(hi - lo - 1) : lo + 2 + ri(hi - lo - 1);
        for (let c = 0; c < 3; c++) grid[r * 3 + c][a] = s + c * d;
      }
      expl.push(`${ATTR[a].label}: ${a === "shape" ? (d > 0 ? "+1 Ecke" : "−1 Ecke") : a === "count" ? (d > 0 ? "+1" : "−1") : (d > 0 ? "eine Stufe mehr" : "eine Stufe weniger")} pro Spalte`);
    } else if (rule === "dist") {
      const vals = rshuf([...Array(ATTR[a].n).keys()].map(v => v + lo)).slice(0, 3), sh = 1 + ri(2);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) grid[r * 3 + c][a] = vals[(c + r * sh) % 3];
      expl.push(`${ATTR[a].label}: jede Zeile enthält ${vals.map(ATTR[a].fmt).join(", ")} je einmal`);
    } else if (rule === "row") {
      const vals = rshuf([...Array(ATTR[a].n).keys()].map(v => v + lo)).slice(0, 3);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) grid[r * 3 + c][a] = vals[r];
      expl.push(`${ATTR[a].label}: innerhalb einer Zeile gleich`);
    } else {
      const v = a === "count" ? 1 + ri(4) : a === "size" ? 2 + ri(2) : lo + ri(ATTR[a].n);
      grid.forEach(g => g[a] = v);
    }
  }
  // Distraktoren: 3 Attribute, je ein falscher Wert -> 8 Kombinationen, jeder Wert kommt 4x vor (nicht erratbar)
  const order = [...rshuf(active), ...rshuf(names.filter(a => rules[a] === "row")), ...rshuf(names.filter(a => rules[a] === "const"))];
  const toggles = order.slice(0, 3).map(a => {
    const ans = grid[8][a];
    const seen = [...new Set(grid.slice(0, 8).map(g => g[a]))].filter(v => v !== ans);
    let alt = seen.length ? rpick(seen) : null;
    if (alt === null) { const cand = [...Array(ATTR[a].n).keys()].map(v => v + attrMin(a)).filter(v => v !== ans && Math.abs(v - ans) <= 2); alt = rpick(cand); }
    return [a, alt];
  });
  return { grid, toggles, rule: expl.join(" · ") || "Alles bleibt gleich" };
}

const SEG_COUNT = 12;
const popcount = m => { let n = 0; while (m) { n += m & 1; m >>= 1; } return n; };
function lmLines(R, L) {
  const ri = n => Math.floor(R() * n);
  const ops = [
    ["or", (a, b) => a | b, "Überlagern (alle Linien zusammen)"],
    ["xor", (a, b) => a ^ b, "Überlagern, doppelte Linien fallen weg"],
    ["diff", (a, b) => a & ~b, "Erstes minus zweites (gemeinsame Linien fallen weg)"],
    ["and", (a, b) => a & b, "Nur Linien, die in beiden vorkommen"],
  ];
  const nOps = L <= 1 ? 1 : L === 2 ? 2 : L === 3 ? 3 : 4;
  const [, op, txt] = ops[ri(nOps)];
  const [lo, hi] = L <= 2 ? [2, 4] : L === 3 ? [3, 5] : [3, 6];
  const rndSet = () => { let m; do { m = 0; for (let i = 0; i < SEG_COUNT; i++) if (R() < 0.3) m |= 1 << i; } while (popcount(m) < lo || popcount(m) > hi); return m; };
  const rows = [];
  for (let r = 0; r < 3; r++) {
    let a, b;
    do { a = rndSet(); b = rndSet(); } while (!(a & b) || !(a & ~b) || !(b & ~a) || new Set(ops.map(o => o[1](a, b))).size < 4);
    rows.push([a, b, op(a, b)]);
  }
  const transpose = L >= 3 && R() < 0.5;
  const grid = Array(9);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) grid[transpose ? c * 3 + r : r * 3 + c] = { k: "lines", m: rows[r][c] };
  const ans = grid[8].m, ab = rows[2][0] | rows[2][1];
  let segs;
  for (let tries = 0; tries < 200; tries++) {
    const pool = [...Array(SEG_COUNT).keys()].filter(i => (ab >> i) & 1 || R() < 0.2);
    segs = []; while (segs.length < 3 && pool.length) segs.push(pool.splice(ri(pool.length), 1)[0]);
    if (segs.length < 3) continue;
    let ok = true;
    for (let k = 0; k < 8; k++) { let m = ans; segs.forEach((s, j) => { if ((k >> j) & 1) m ^= 1 << s; }); if (!m) ok = false; }
    if (ok) break;
  }
  return { grid, toggles: segs.map(s => ["seg" + s, null]), rule: `${transpose ? "Spalte" : "Zeile"}: Feld 3 = ${txt}` };
}

function lmMove(R, L) {
  const ri = n => Math.floor(R() * n), rpick = a => a[ri(a.length)];
  const steps = L <= 2 ? [1, -1] : L === 3 ? [1, -1, 2] : [1, 2, 3, -1, -2];
  const kA = rpick(steps);
  const kB = L >= 3 ? rpick(steps.filter(x => x !== kA).concat(L === 3 ? [1, -1, 2, -2].filter(x => x !== kA) : [])) : 0;
  const kR = L >= 2 ? rpick(L <= 3 ? [1, -1, 2] : [1, 2, -1, -2]) : 0;
  const sA = ri(8), sB = ri(8), sR = ri(8), rA = ri(8), rB = kB ? ri(8) : 0, rR = kR ? ri(8) : 0;
  const m8 = x => ((x % 8) + 8) % 8, grid = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
    grid.push({ k: "move", a: m8(sA + r * rA + c * kA), b: m8(sB + r * rB + c * kB), r: m8(sR + r * rR + c * kR) });
  const ans = grid[8];
  const toggles = [["a", m8(ans.a + rpick([1, -1, 2, 4]))], ["b", m8(ans.b + rpick([1, -1, 2, 4]))], ["r", m8(ans.r + rpick([1, -1, 2, 4]))]];
  const dir = k => k ? `${Math.abs(k)} ${Math.abs(k) === 1 ? "Feld" : "Felder"} ${k > 0 ? "im" : "gegen den"} Uhrzeigersinn` : "bleibt stehen";
  const rot = kR ? `${Math.abs(kR) * 45}° ${kR > 0 ? "im" : "gegen den"} Uhrzeigersinn` : "bleibt gleich";
  return { grid, toggles, rule: `Pro Spalte – Schwarzer Punkt: ${dir(kA)} · Ring: ${dir(kB)} · Pfeil: ${rot}` };
}

// SVG-Darstellung einer Zelle (100x100) als String
const LM_FILLS = ["#ffffff", "#c8c8c8", "#6e6e6e", "#111111"];
const LM_LAYOUT = {
  1: [[[50, 50]], 72], 2: [[[29, 50], [71, 50]], 38], 3: [[[50, 29], [29, 71], [71, 71]], 36],
  4: [[[29, 29], [71, 29], [29, 71], [71, 71]], 36], 5: [[[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 28],
  6: [[[24, 33], [50, 33], [76, 33], [24, 67], [50, 67], [76, 67]], 24],
};
const LM_SEGS = [[15,15,85,15],[15,85,85,85],[15,15,15,85],[85,15,85,85],[15,15,85,85],[85,15,15,85],[15,50,85,50],[50,15,50,85],[50,15,85,50],[85,50,50,85],[50,85,15,50],[15,50,50,15]];
const LM_POS = [[20,20],[50,20],[80,20],[80,50],[80,80],[50,80],[20,80],[20,50]];
function lmShapeEl(shape, x, y, d, fill) {
  const st = `fill="${fill}" stroke="#111" stroke-width="2.2" stroke-linejoin="round"`;
  if (shape === 4) return `<circle cx="${x}" cy="${y}" r="${d / 2}" ${st}/>`;
  const n = shape + 3, r = d / 2 * (n === 3 ? 1.12 : n === 4 ? 0.92 : 1), off = n === 4 ? Math.PI / 4 : 0;
  const cy = n === 3 ? y + r * 0.18 : y;
  const pts = [...Array(n).keys()].map(i => { const t = -Math.PI / 2 + off + i * 2 * Math.PI / n; return `${(x + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`; });
  return `<polygon points="${pts.join(" ")}" ${st}/>`;
}
function lmCellSVG(c) {
  let inner = "";
  if (!c) inner = `<text x="50" y="64" text-anchor="middle" font-size="44" font-weight="700" fill="#7b5cff">?</text>`;
  else if (c.k === "shapes") {
    const [slots, sz] = LM_LAYOUT[c.count];
    inner = slots.map(([x, y]) => lmShapeEl(c.shape, x, y, sz * [0.5, 0.66, 0.82, 1][c.size], LM_FILLS[c.fill])).join("");
  } else if (c.k === "lines") {
    inner = LM_SEGS.map((s, i) => (c.m >> i) & 1 ? `<line x1="${s[0]}" y1="${s[1]}" x2="${s[2]}" y2="${s[3]}"/>` : "").join("");
    inner = `<g stroke="#111" stroke-width="4.5" stroke-linecap="round">${inner}</g>`;
  } else if (c.k === "move") {
    inner = LM_POS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#bbb"/>`).join("");
    const [bx, by] = LM_POS[c.b], [ax, ay] = LM_POS[c.a];
    inner += `<circle cx="${bx}" cy="${by}" r="12" fill="none" stroke="#111" stroke-width="3"/><circle cx="${ax}" cy="${ay}" r="7" fill="#111"/>`;
    inner += `<g transform="rotate(${c.r * 45} 50 50)" stroke="#e76f51" stroke-width="4" stroke-linecap="round" fill="none"><line x1="50" y1="62" x2="50" y2="38"/><polyline points="43,45 50,38 57,45"/></g>`;
  }
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#fff"/>${inner}</svg>`;
}

const lmKey = c => JSON.stringify(c);
// L = Stufe 1 (leicht) bis 5 (schwer)
function genLogicMatrix(seed, L = 3) {
  const R = mulberry32(seed);
  const fam = [lmShapes, lmShapes, lmLines, lmMove][Math.floor(R() * 4)];
  const { grid, toggles, rule } = fam(R, L);
  const ans = grid[8], options = [];
  for (let k = 0; k < 8; k++) {
    const o = { ...ans };
    toggles.forEach(([a, alt], j) => {
      if (!((k >> j) & 1)) return;
      if (a.startsWith("seg")) o.m ^= 1 << +a.slice(3); else o[a] = alt;
    });
    options.push(o);
  }
  return { grid: grid.slice(0, 8), answer: ans, options, rule };
}
if (typeof module !== "undefined") module.exports = { srGrade, srPick, generateSudoku, countSolutions, hasConflict, genLogicMatrix, lmKey, lmCellSVG, popcount, INTERVALS };
