// Schematische Anatomie-Abbildungen. Jede Struktur mit data-p kann im Spiel rot markiert werden.
// Klassen: f = Fläche, l = Linie (Knochen/Gefäss), o = Umriss einer Linie, t = unsichtbare Fläche, k = dunkle Linie, d = Deko
const _v = (d, w) => `<path class="o" stroke-width="${w + 3}" d="${d}"/><path class="l" stroke-width="${w}" d="${d}"/>`;
const _p = (key, inner) => `<g data-p="${key}">${inner}</g>`;
const _mirror = (inner, W) => inner + `<g transform="translate(${W} 0) scale(-1 1)">${inner}</g>`;

const FIGURES = [
  {
    id: "herz", title: "Herz (Frontalschnitt, schematisch)", viewBox: "0 0 400 420",
    parts: {
      ra: "Atrium dextrum", rv: "Ventriculus dexter", la: "Atrium sinistrum", lv: "Ventriculus sinister",
      septum: "Septum interventriculare", aorta: "Aorta", truncus: "Truncus pulmonalis",
      vcs: "V. cava superior", vci: "V. cava inferior", vvpp: "Vv. pulmonales",
      trikuspidal: "Valva tricuspidalis", mitral: "Valva mitralis", aortenklappe: "Valva aortae", pulmonalklappe: "Valva trunci pulmonalis",
    },
    svg: [
      _p("vci", `<rect class="f" x="40" y="225" width="32" height="185" rx="6"/>`),
      _p("vcs", `<rect class="f" x="92" y="20" width="34" height="140" rx="6"/>`),
      _p("aorta", _v("M213 262 L213 75 C213 28 312 25 318 78 L322 135", 26)),
      _p("vvpp", _v("M330 172 L374 165", 12) + _v("M330 226 L374 233", 12)),
      _p("ra", `<rect class="f" x="70" y="150" width="118" height="98" rx="10"/>`),
      _p("la", `<rect class="f" x="230" y="150" width="100" height="98" rx="10"/>`),
      _p("truncus", _v("M178 270 C188 220 228 185 240 128", 20) + _v("M240 128 L345 112", 13) + _v("M240 128 L150 108", 13)),
      _p("rv", `<path class="f" d="M70 256 L190 256 L190 388 C170 396 140 390 110 370 C85 350 70 320 70 290 Z"/>`),
      _p("lv", `<path class="f" d="M202 256 L330 256 L330 300 C330 350 290 395 225 405 C210 405 202 398 202 388 Z"/>`),
      _p("septum", `<rect class="f" x="190" y="256" width="12" height="134"/>`),
      _p("trikuspidal", `<ellipse class="f v" cx="129" cy="252" rx="40" ry="5"/>`),
      _p("mitral", `<ellipse class="f v" cx="280" cy="252" rx="34" ry="5"/>`),
      _p("aortenklappe", `<ellipse class="f v" cx="213" cy="250" rx="13" ry="5"/>`),
      _p("pulmonalklappe", `<ellipse class="f v" cx="181" cy="257" rx="11" ry="4" transform="rotate(-12 181 257)"/>`),
    ].join(""),
  },
  {
    id: "gehirn", title: "Gehirn (linke Hemisphäre, lateral)", viewBox: "0 0 400 310",
    parts: {
      frontal: "Lobus frontalis", parietal: "Lobus parietalis", occipital: "Lobus occipitalis", temporal: "Lobus temporalis",
      cerebellum: "Cerebellum", hirnstamm: "Truncus encephali", scentralis: "Sulcus centralis", slateralis: "Sulcus lateralis",
      prec: "Gyrus precentralis", postc: "Gyrus postcentralis",
    },
    svg: (() => {
      const B = "M60 170 C40 110 90 40 190 35 C290 30 360 80 355 150 C352 190 330 212 300 215 L235 212 C200 228 150 233 110 222 C80 212 64 196 60 170 Z";
      return [
        `<defs><clipPath id="brainclip"><path d="${B}"/></clipPath></defs>`,
        _p("hirnstamm", `<path class="f" d="M208 200 L242 200 C246 235 247 262 243 300 L216 300 C215 262 212 235 208 200 Z"/>`),
        `<path class="f" d="${B}"/>`,
        `<g clip-path="url(#brainclip)">`,
        _p("frontal", `<path class="f" d="M0 0 L218 0 L218 36 C208 80 198 115 190 148 L185 158 C160 164 135 172 110 182 L0 200 Z"/>`),
        _p("parietal", `<path class="f" d="M218 0 L302 0 L302 45 C306 100 304 135 300 162 L258 140 C235 145 210 152 185 158 L190 148 C198 115 208 80 218 36 Z"/>`),
        _p("occipital", `<path class="f" d="M302 0 L400 0 L400 300 L296 300 L300 162 C304 135 306 100 302 45 Z"/>`),
        _p("temporal", `<path class="f" d="M0 200 L110 182 C135 172 160 164 185 158 C210 152 235 145 258 140 L300 162 L296 300 L0 300 Z"/>`),
        _p("prec", `<path class="t" d="M196 30 L218 30 C208 80 198 115 190 148 L168 152 C176 116 186 80 196 30 Z"/>`),
        _p("postc", `<path class="t" d="M218 30 L240 30 C230 80 220 112 210 146 L190 148 C198 115 208 80 218 30 Z"/>`),
        `</g>`,
        _p("scentralis", `<path class="k" stroke-width="3.5" d="M218 36 C208 80 198 115 190 148"/>`),
        _p("slateralis", `<path class="k" stroke-width="3.5" d="M110 182 C135 172 160 164 185 158 C210 152 235 145 258 140"/>`),
        `<path class="d" stroke-width="2" d="${B}"/>`,
        _p("cerebellum", `<path class="f" d="M246 214 C262 198 332 196 352 216 C362 242 322 268 282 262 C257 258 241 238 246 214 Z"/>`),
        `<path class="d" d="M256 225 C285 215 320 214 345 222 M258 240 C285 232 320 232 342 238 M268 253 C290 248 315 248 330 252"/>`,
      ].join("");
    })(),
  },
  {
    id: "neuron", title: "Nervenzelle (schematisch)", viewBox: "0 0 420 200",
    parts: {
      dendriten: "Dendriten", soma: "Soma (Perikaryon)", kern: "Zellkern", huegel: "Axonhügel",
      axon: "Axon", myelin: "Myelinscheide", ranvier: "Ranvier-Schnürring", terminal: "Synaptische Endknöpfchen",
    },
    svg: [
      _p("dendriten", _v("M55 80 L25 50 L10 40 M38 63 L18 70 M25 50 L28 24", 5) + _v("M50 112 L18 132 L8 152 M30 124 L10 116", 5)
        + _v("M76 68 L70 30 L84 12 M71 46 L54 26", 5) + _v("M86 132 L80 170 L94 190 M81 156 L62 178", 5)),
      _p("soma", `<circle class="f" cx="80" cy="100" r="32"/>`),
      _p("kern", `<circle class="f v" cx="76" cy="97" r="11"/>`),
      _p("huegel", `<path class="f" d="M108 86 L145 97 L145 103 L108 114 Z"/>`),
      _p("myelin", [152, 214, 276].map(x => `<rect class="f" x="${x}" y="90" width="52" height="20" rx="9"/>`).join("")),
      _p("ranvier", [204, 266].map(x => `<rect class="t" x="${x}" y="86" width="10" height="28"/>`).join("")),
      _p("axon", _v("M140 100 L372 100", 5)),
      _p("terminal", _v("M372 100 L398 74 M372 100 L403 100 M372 100 L398 126", 4)
        + [[400, 72], [406, 100], [400, 128]].map(([x, y]) => `<circle class="f" cx="${x}" cy="${y}" r="7"/>`).join("")),
    ].join(""),
  },
  {
    id: "nephron", title: "Nephron (schematisch)", viewBox: "0 0 360 420",
    parts: {
      afferens: "Vas afferens", efferens: "Vas efferens", glomerulus: "Glomerulus", bowman: "Bowman-Kapsel",
      proximal: "Proximaler Tubulus", henleab: "Absteigender Schenkel der Henle-Schleife",
      henleauf: "Aufsteigender Schenkel der Henle-Schleife", distal: "Distaler Tubulus", sammelrohr: "Sammelrohr",
    },
    svg: [
      _p("afferens", _v("M10 30 L58 68", 8)),
      _p("efferens", _v("M58 92 L10 130", 7)),
      _p("bowman", `<circle class="o" cx="82" cy="80" r="34" stroke-width="9"/><circle class="l" cx="82" cy="80" r="34" stroke-width="6"/>`),
      _p("glomerulus", [[72, 72], [86, 69], [95, 82], [85, 93], [70, 89], [81, 81]].map(([x, y]) => `<circle class="f v" cx="${x}" cy="${y}" r="7"/>`).join("")),
      _p("proximal", _v("M114 84 C140 52 165 116 190 82 C212 52 248 72 232 112 C222 136 200 140 196 165", 7)),
      _p("henleab", _v("M196 165 L196 360 C196 396 236 396 236 360", 7)),
      _p("henleauf", _v("M236 360 L236 195", 9)),
      _p("distal", _v("M236 195 C236 170 262 175 268 150 C274 126 250 112 270 95 C288 80 300 92 310 84", 7)),
      _p("sammelrohr", _v("M310 20 L310 410", 12)),
    ].join(""),
  },
  {
    id: "skelett", title: "Skelett (ventral, schematisch)", viewBox: "0 0 300 612",
    parts: {
      cranium: "Cranium", mandibula: "Mandibula", wirbel: "Columna vertebralis", costae: "Costae", sternum: "Sternum",
      clavicula: "Clavicula", humerus: "Humerus", radius: "Radius", ulna: "Ulna", carpus: "Ossa carpi",
      metacarpus: "Ossa metacarpi", phalangen: "Phalanges (Hand)", coxae: "Os coxae", sacrum: "Os sacrum",
      femur: "Femur", patella: "Patella", tibia: "Tibia", fibula: "Fibula", tarsus: "Ossa tarsi", metatarsus: "Ossa metatarsi",
    },
    svg: (() => {
      const M = s => _mirror(s, 300);
      const ribs = [...Array(7).keys()].map(i => { const y = 132 + i * 13, w = 34 + i * 4; return _v(`M146 ${y} C126 ${y - 6} ${150 - w} ${y - 2} ${148 - w} ${y + 20 + i * 2}`, 4); }).join("");
      return [
        _p("wirbel", [...Array(20).keys()].map(k => `<rect class="f" x="143" y="${100 + k * 12}" width="14" height="9" rx="2"/>`).join("")),
        _p("costae", M(ribs)),
        _p("sternum", `<path class="f" d="M143 122 L157 122 L158 205 L150 214 L142 205 Z"/>`),
        _p("clavicula", M(_v("M146 120 C130 112 110 118 94 113", 6))),
        _p("cranium", `<ellipse class="f" cx="150" cy="50" rx="36" ry="42"/>`),
        `<path class="d" d="M131 50 a7 6 0 1 0 14 0 a7 6 0 1 0 -14 0 M155 50 a7 6 0 1 0 14 0 a7 6 0 1 0 -14 0 M150 60 L146 70 L154 70 Z"/>`,
        _p("mandibula", `<path class="f" d="M122 76 C122 108 138 118 150 118 C162 118 178 108 178 76 C172 92 162 100 150 100 C138 100 128 92 122 76 Z"/>`),
        _p("humerus", M(_v("M92 124 L80 238", 10))),
        _p("radius", M(_v("M74 246 L60 330", 6))),
        _p("ulna", M(_v("M87 246 L73 330", 6))),
        _p("carpus", M([[58, 340], [66, 338], [74, 340], [59, 348], [67, 347], [75, 348]].map(([x, y]) => `<circle class="f" cx="${x}" cy="${y}" r="4"/>`).join(""))),
        _p("metacarpus", M(_v("M56 354 L44 372", 3) + [0, 1, 2, 3].map(j => _v(`M${61 + j * 5} 355 L${56 + j * 7} 382`, 3)).join(""))),
        _p("phalangen", M(_v("M42 376 L36 392", 2.5) + [0, 1, 2, 3].map(j => _v(`M${55 + j * 7} 387 L${53 + j * 8} 410`, 2.5)).join(""))),
        _p("coxae", M(`<path class="f" d="M146 332 C130 318 110 312 100 322 C92 338 98 360 112 372 C118 378 126 382 136 384 C140 376 144 362 146 352 Z"/>`)),
        `<path class="d" d="M114 364 a8 10 0 1 0 16 0 a8 10 0 1 0 -16 0 M170 364 a8 10 0 1 0 16 0 a8 10 0 1 0 -16 0"/>`,
        _p("sacrum", `<path class="f" d="M139 330 L161 330 L157 366 L150 374 L143 366 Z"/>`),
        _p("femur", M(_v("M114 372 L127 468", 11))),
        _p("patella", M(`<ellipse class="f" cx="128" cy="474" rx="7" ry="8"/>`)),
        _p("tibia", M(_v("M131 487 L133 562", 9))),
        _p("fibula", M(_v("M115 491 L117 558", 5))),
        _p("tarsus", M([[121, 572], [131, 574], [141, 572], [126, 582], [137, 582]].map(([x, y]) => `<circle class="f" cx="${x}" cy="${y}" r="5"/>`).join(""))),
        _p("metatarsus", M([0, 1, 2, 3, 4].map(j => _v(`M${117 + j * 6} 590 L${113 + j * 7} 606`, 3)).join(""))),
      ].join("");
    })(),
  },
];

if (typeof module !== "undefined") module.exports = { FIGURES };
