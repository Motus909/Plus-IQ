// ===== Hier anpassen =====
const CONFIG = {
  title: "Rätselmix",
};

// [ISO-Alpha-2, ISO-Numerisch]. Ländernamen kommen automatisch auf Deutsch aus dem Browser.
const COUNTRIES = [
  ["CH","756"],["DE","276"],["AT","040"],["FR","250"],["IT","380"],["ES","724"],["PT","620"],
  ["GB","826"],["IE","372"],["NL","528"],["BE","056"],["LU","442"],["DK","208"],["NO","578"],
  ["SE","752"],["FI","246"],["IS","352"],["PL","616"],["CZ","203"],["SK","703"],["HU","348"],
  ["SI","705"],["HR","191"],["BA","070"],["RS","688"],["ME","499"],["AL","008"],["MK","807"],
  ["GR","300"],["BG","100"],["RO","642"],["MD","498"],["UA","804"],["BY","112"],["LT","440"],
  ["LV","428"],["EE","233"],["RU","643"],["TR","792"],["CY","196"],["GE","268"],["AM","051"],
  ["AZ","031"],["KZ","398"],["UZ","860"],["TM","795"],["KG","417"],["TJ","762"],["AF","004"],
  ["PK","586"],["IN","356"],["NP","524"],["BD","050"],["LK","144"],["MM","104"],["TH","764"],
  ["LA","418"],["KH","116"],["VN","704"],["MY","458"],["ID","360"],["PH","608"],["CN","156"],
  ["MN","496"],["KP","408"],["KR","410"],["JP","392"],["TW","158"],["IR","364"],["IQ","368"],
  ["SY","760"],["JO","400"],["IL","376"],["LB","422"],["SA","682"],["YE","887"],["OM","512"],
  ["AE","784"],["QA","634"],["KW","414"],["EG","818"],["LY","434"],["TN","788"],["DZ","012"],
  ["MA","504"],["MR","478"],["ML","466"],["NE","562"],["TD","148"],["SD","729"],["SS","728"],
  ["ET","231"],["ER","232"],["SO","706"],["KE","404"],["UG","800"],["TZ","834"],["RW","646"],
  ["CD","180"],["CG","178"],["CF","140"],["CM","120"],["NG","566"],["GH","288"],["CI","384"],
  ["SN","686"],["GN","324"],["SL","694"],["LR","430"],["BF","854"],["BJ","204"],["TG","768"],
  ["GA","266"],["AO","024"],["ZM","894"],["ZW","716"],["MZ","508"],["MW","454"],["MG","450"],
  ["BW","072"],["NA","516"],["ZA","710"],["US","840"],["CA","124"],["MX","484"],["GT","320"],
  ["HN","340"],["NI","558"],["CR","188"],["PA","591"],["CU","192"],["CO","170"],["VE","862"],
  ["EC","218"],["PE","604"],["BO","068"],["BR","076"],["PY","600"],["UY","858"],["AR","032"],
  ["CL","152"],["AU","036"],["NZ","554"],["PG","598"],
];

// Schwierigkeit der Länder (Karte + Flaggen): 1 bekannt, 3 schwer, alle anderen 2
const COUNTRY_D1 = "CH DE AT FR IT ES PT GB IE NL BE DK NO SE FI IS PL GR TR RU US CA MX BR AR CL PE CO AU NZ CN JP KR IN TH EG ZA SA MA UA MN".split(" ");
const COUNTRY_D3 = "LU SI BA ME AL MK MD AM AZ GE KG TJ TM UZ LA KH QA KW LB JO ER SS RW BJ TG GN SL LR BF GA CG CF MW GT HN NI CR PA PG CY EE LV LT MR NE TD SN CI".split(" ");
const countryDiff = a2 => COUNTRY_D1.includes(a2) ? 1 : COUNTRY_D3.includes(a2) ? 3 : 2;
// Ähnlich aussehende Flaggen (für die höchsten Flaggen-Stufen)
const FLAG_LOOKALIKES = [
  ["TD","RO","MD"], ["ID","PL"], ["IE","CI","IT","MX"], ["NL","LU","RU","HR","SI","SK","RS"], ["SN","ML","GN","CM"],
  ["NO","IS","DK","SE","FI"], ["CO","EC","VE"], ["AU","NZ"], ["BE","DE"], ["HN","NI","AR"], ["GH","BO","ET","LT"],
  ["JO","SD","KW","AE"], ["YE","EG","IQ","SY"], ["NE","IN","CI"], ["AT","LV","LB"],
];

// Allgemeinfragen: d = Schwierigkeit (1–3), a = richtige Antwort, w = drei falsche.
// Eigene (z.B. persönliche) Fragen einfach ergänzen.
const QUESTIONS = [
  {d:2, q:"Was ist der höchste Berg der Schweiz?", a:"Dufourspitze", w:["Matterhorn","Eiger","Piz Bernina"]},
  {d:1, q:"Chemisches Symbol für Gold?", a:"Au", w:["Ag","Go","Gd"]},
  {d:2, q:"Wie viele Knochen hat ein erwachsener Mensch?", a:"206", w:["186","226","256"]},
  {d:1, q:"Wer malte die Mona Lisa?", a:"Leonardo da Vinci", w:["Michelangelo","Raffael","Botticelli"]},
  {d:1, q:"Welcher ist der grösste Ozean?", a:"Pazifik", w:["Atlantik","Indischer Ozean","Arktischer Ozean"]},
  {d:2, q:"Hauptstadt von Australien?", a:"Canberra", w:["Sydney","Melbourne","Perth"]},
  {d:1, q:"In welchem Jahr fiel die Berliner Mauer?", a:"1989", w:["1987","1990","1991"]},
  {d:2, q:"Lichtgeschwindigkeit im Vakuum, ungefähr?", a:"300'000 km/s", w:["30'000 km/s","150'000 km/s","3'000'000 km/s"]},
  {d:1, q:"Welcher Planet ist der Sonne am nächsten?", a:"Merkur", w:["Venus","Mars","Erde"]},
  {d:1, q:"Wie viele Kantone hat die Schweiz?", a:"26", w:["23","24","25"]},
  {d:2, q:"Längster Fluss Europas?", a:"Wolga", w:["Donau","Rhein","Dnepr"]},
  {d:1, q:"Wer schrieb «Faust»?", a:"Goethe", w:["Schiller","Lessing","Kleist"]},
  {d:2, q:"Kleinste Primzahl?", a:"2", w:["0","1","3"]},
  {d:1, q:"Welches Gas geben Pflanzen bei der Photosynthese ab?", a:"Sauerstoff", w:["Kohlendioxid","Stickstoff","Methan"]},
  {d:1, q:"Traditionelles Gründungsjahr der Eidgenossenschaft?", a:"1291", w:["1315","1515","1848"]},
  {d:2, q:"Welches Organ produziert Insulin?", a:"Bauchspeicheldrüse", w:["Leber","Niere","Milz"]},
  {d:2, q:"Hauptstadt von Kanada?", a:"Ottawa", w:["Toronto","Vancouver","Montreal"]},
  {d:1, q:"Wie viele Saiten hat eine Standardgitarre?", a:"6", w:["4","5","7"]},
  {d:1, q:"Welches Element hat die Ordnungszahl 1?", a:"Wasserstoff", w:["Helium","Lithium","Sauerstoff"]},
  {d:3, q:"Grösste Wüste der Welt (inkl. Kältewüsten)?", a:"Antarktis", w:["Sahara","Gobi","Arabische Wüste"]},
  {d:1, q:"Wer komponierte «Die Zauberflöte»?", a:"Mozart", w:["Beethoven","Haydn","Bach"]},
  {d:3, q:"Grösster See, der ganz in der Schweiz liegt?", a:"Neuenburgersee", w:["Genfersee","Bodensee","Vierwaldstättersee"]},
  {d:1, q:"Währung von Japan?", a:"Yen", w:["Won","Yuan","Baht"]},
  {d:2, q:"Wie viele Herzkammern (Ventrikel) hat das menschliche Herz?", a:"2", w:["1","3","4"]},
  {d:1, q:"In welcher Stadt steht der Schiefe Turm?", a:"Pisa", w:["Florenz","Siena","Bologna"]},
  {d:1, q:"Wer betrat als Erster den Mond?", a:"Neil Armstrong", w:["Buzz Aldrin","Juri Gagarin","Michael Collins"]},
  {d:2, q:"Wie viele Minuten hat ein Tag?", a:"1440", w:["1240","1340","1640"]},
  {d:1, q:"Blau und Gelb gemischt (Farbkasten) ergibt …?", a:"Grün", w:["Violett","Braun","Orange"]},
  {d:2, q:"Hauptstadt der Türkei?", a:"Ankara", w:["Istanbul","Izmir","Antalya"]},
  {d:3, q:"Welcher Planet hat die meisten bekannten Monde?", a:"Saturn", w:["Jupiter","Uranus","Neptun"]},
  {d:3, q:"Siedepunkt von Wasser auf Meereshöhe in °F?", a:"212", w:["100","180","200"]},
  {d:1, q:"Wer entwickelte die Relativitätstheorie?", a:"Albert Einstein", w:["Isaac Newton","Max Planck","Niels Bohr"]},
  {d:1, q:"Grösstes lebendes Tier?", a:"Blauwal", w:["Afrikanischer Elefant","Pottwal","Walhai"]},
  {d:1, q:"Wie viele Spieler hat ein Fussballteam auf dem Feld?", a:"11", w:["9","10","12"]},
  {d:2, q:"Sprache mit den meisten Muttersprachlern?", a:"Mandarin", w:["Englisch","Spanisch","Hindi"]},
  {d:2, q:"Hauptstadt von Neuseeland?", a:"Wellington", w:["Auckland","Christchurch","Queenstown"]},
  {d:3, q:"Hauptbestandteil von Glas?", a:"Siliziumdioxid", w:["Kalziumkarbonat","Ton","Graphit"]},
  {d:1, q:"Wann begann der Erste Weltkrieg?", a:"1914", w:["1912","1916","1918"]},
  {d:2, q:"Längster Fluss, der ganz in der Schweiz fliesst?", a:"Aare", w:["Rhone","Reuss","Limmat"]},
  {d:2, q:"pH-Wert von reinem Wasser bei 25 °C?", a:"7", w:["0","5","9"]},
  // schwerer
  {d:2, q:"Welches ist das kleinste Land der Welt?", a:"Vatikanstadt", w:["Monaco","San Marino","Liechtenstein"]},
  {d:2, q:"Welcher Komponist wurde im Alter fast vollständig taub?", a:"Beethoven", w:["Mozart","Bach","Chopin"]},
  {d:2, q:"Wer malte «Die Sternennacht»?", a:"Vincent van Gogh", w:["Claude Monet","Paul Gauguin","Paul Cézanne"]},
  {d:3, q:"Hauptstadt von Kasachstan?", a:"Astana", w:["Almaty","Taschkent","Bischkek"]},
  {d:3, q:"Welches Element hat das Symbol W?", a:"Wolfram", w:["Wismut","Vanadium","Xenon"]},
  {d:3, q:"Seit wann gilt das Frauenstimmrecht auf Bundesebene in der Schweiz?", a:"1971", w:["1959","1981","1990"]},
  {d:3, q:"Wer schrieb «Der Process»?", a:"Franz Kafka", w:["Thomas Mann","Hermann Hesse","Robert Musil"]},
  {d:3, q:"Wie viele Herzen hat ein Oktopus?", a:"3", w:["1","2","8"]},
  {d:3, q:"Wer formulierte die Unschärferelation?", a:"Werner Heisenberg", w:["Erwin Schrödinger","Niels Bohr","Wolfgang Pauli"]},
  {d:3, q:"Hauptstadt von Myanmar?", a:"Naypyidaw", w:["Yangon","Mandalay","Vientiane"]},
  {d:3, q:"Avogadro-Konstante, ungefähr?", a:"6,022 · 10²³ /mol", w:["6,022 · 10²⁰ /mol","3,0 · 10⁸ /mol","1,38 · 10⁻²³ /mol"]},
  {d:3, q:"Welcher Fluss fliesst durch Bagdad?", a:"Tigris", w:["Euphrat","Nil","Jordan"]},
  {d:3, q:"Längstes Gebirge der Welt (an Land)?", a:"Anden", w:["Himalaya","Rocky Mountains","Ural"]},
  {d:3, q:"Erste Bundespräsidentin der Schweiz?", a:"Ruth Dreifuss", w:["Micheline Calmy-Rey","Doris Leuthard","Elisabeth Kopp"]},
];
