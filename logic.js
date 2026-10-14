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
function srPick(items, prefix, allIds, recent = [], now = Date.now()) {
  const valid = allIds ? new Set(allIds) : null;
  const known = Object.keys(items).filter(id => id.startsWith(prefix) && !recent.includes(id) && (!valid || valid.has(id)));
  const due = known.filter(id => items[id].due <= now).sort((a, b) => items[a].due - items[b].due);
  if (due.length) return due[0];
  if (!allIds) return null;
  const fresh = allIds.filter(id => !items[id] && !recent.includes(id));
  if (fresh.length) return pick(fresh);
  const pool = allIds.filter(id => !recent.includes(id)).sort((a, b) => items[a].due - items[b].due);
  return pool[rnd(Math.min(5, pool.length))] || pick(allIds);
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

// ---------- Matrizen ----------
function genMatrix() {
  const r5 = () => rnd(11) - 5, r3 = () => rnd(7) - 3;
  const M = (n, m, f) => Array.from({ length: n }, () => Array.from({ length: m }, f));
  const t = pick(["det2", "det3", "mul2", "matvec"]);
  if (t === "det2") return { t, A: M(2, 2, r5) };
  if (t === "det3") return { t, A: M(3, 3, r3) };
  if (t === "mul2") return { t, A: M(2, 2, r5), B: M(2, 2, r5) };
  return { t, A: M(3, 3, r3), v: M(3, 1, r3) };
}
function det(A) {
  if (A.length === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
  let d = 0;
  for (let j = 0; j < A.length; j++) d += (j % 2 ? -1 : 1) * A[0][j] * det(A.slice(1).map(r => r.filter((_, k) => k !== j)));
  return d;
}
const mul = (A, B) => A.map(row => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
function solveMatrix(task) {
  if (task.t === "det2" || task.t === "det3") return [[det(task.A) || 0]];
  if (task.t === "mul2") return mul(task.A, task.B);
  return mul(task.A, task.v);
}

if (typeof module !== "undefined") module.exports = { srGrade, srPick, generateSudoku, countSolutions, hasConflict, genMatrix, det, solveMatrix, INTERVALS };
