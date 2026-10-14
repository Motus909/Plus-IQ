// Medizin-Fragen (Vorklinik). a = richtig, w = drei falsche.
// Optional: img: "img/datei.jpg" (oder URL) zeigt ein Bild über der Frage, z.B. aus Vorlesungsfolien.
const MED_QUESTIONS = [
  // Neuroanatomie / Hirnnerven
  {q:"Welcher Hirnnerv innerviert M. trapezius und M. sternocleidomastoideus?", a:"N. accessorius (XI)", w:["N. hypoglossus (XII)","N. vagus (X)","N. glossopharyngeus (IX)"]},
  {q:"Motorische Innervation der Zungenmuskulatur?", a:"N. hypoglossus", w:["N. lingualis","N. glossopharyngeus","N. facialis"]},
  {q:"Geschmack der vorderen zwei Drittel der Zunge läuft über …", a:"N. facialis (Chorda tympani)", w:["N. trigeminus","N. glossopharyngeus","N. hypoglossus"]},
  {q:"Wo wird der Liquor cerebrospinalis hauptsächlich gebildet?", a:"Plexus choroideus", w:["Arachnoidalzotten","Ependym des Zentralkanals","Hypophyse"]},
  {q:"Typisches Ruhemembranpotential eines Neurons?", a:"ca. −70 mV", w:["ca. −20 mV","ca. +30 mV","ca. −120 mV"]},
  {q:"Welches Ion trägt die schnelle Depolarisation des neuronalen Aktionspotentials?", a:"Na⁺", w:["K⁺","Cl⁻","Mg²⁺"]},
  {q:"Die Na⁺/K⁺-ATPase transportiert pro ATP …", a:"3 Na⁺ hinaus, 2 K⁺ hinein", w:["2 Na⁺ hinaus, 3 K⁺ hinein","3 Na⁺ hinein, 2 K⁺ hinaus","1 Na⁺ hinaus, 1 K⁺ hinein"]},
  {q:"Welcher Teil des Innenohrs enthält das Corti-Organ?", a:"Cochlea", w:["Vestibulum","Bogengänge","Paukenhöhle"]},
  {q:"Welches Gehörknöchelchen ist mit dem Trommelfell verbunden?", a:"Malleus", w:["Incus","Stapes","Os hyoideum"]},
  // Periphere Nerven / Bewegungsapparat
  {q:"Welcher Nerv innerviert das Zwerchfell?", a:"N. phrenicus", w:["N. vagus","Nn. intercostales","N. accessorius"]},
  {q:"Aus welchen Segmenten stammt der N. phrenicus?", a:"C3–C5", w:["C1–C3","C5–C7","Th1–Th3"]},
  {q:"Fallhand – welcher Nerv ist geschädigt?", a:"N. radialis", w:["N. ulnaris","N. medianus","N. axillaris"]},
  {q:"Krallenhand – welcher Nerv ist geschädigt?", a:"N. ulnaris", w:["N. radialis","N. medianus","N. musculocutaneus"]},
  {q:"Schwurhand – welcher Nerv ist (proximal) geschädigt?", a:"N. medianus", w:["N. ulnaris","N. radialis","N. axillaris"]},
  {q:"Welcher Muskel leitet die Abduktion im Schultergelenk ein?", a:"M. supraspinatus", w:["M. deltoideus","M. infraspinatus","M. teres minor"]},
  {q:"Welcher Muskel gehört NICHT zur Rotatorenmanschette?", a:"M. teres major", w:["M. supraspinatus","M. infraspinatus","M. subscapularis"]},
  {q:"Welcher Knochen gehört NICHT zu den Handwurzelknochen?", a:"Os cuboideum", w:["Os scaphoideum","Os lunatum","Os pisiforme"]},
  {q:"Wie viele Halswirbel hat der Mensch?", a:"7", w:["5","8","12"]},
  {q:"Wie heisst der zweite Halswirbel?", a:"Axis", w:["Atlas","Vertebra prominens","Dens"]},
  {q:"Welches Gelenk ist ein Sattelgelenk?", a:"Daumensattelgelenk", w:["Schultergelenk","Humeroulnargelenk","Hüftgelenk"]},
  {q:"Stärkster Inspirationsmuskel?", a:"Zwerchfell", w:["Mm. intercostales externi","M. sternocleidomastoideus","Mm. scaleni"]},
  // Herz-Kreislauf
  {q:"Wo liegt der Sinusknoten?", a:"Rechter Vorhof", w:["Linker Vorhof","Septum interventriculare","Rechter Ventrikel"]},
  {q:"Eigenfrequenz des AV-Knotens?", a:"40–60/min", w:["60–80/min","20–40/min","80–100/min"]},
  {q:"Klappe zwischen linkem Vorhof und linkem Ventrikel?", a:"Mitralklappe", w:["Trikuspidalklappe","Aortenklappe","Pulmonalklappe"]},
  {q:"Erster Abgang aus dem Aortenbogen?", a:"Truncus brachiocephalicus", w:["A. carotis communis sinistra","A. subclavia sinistra","A. vertebralis"]},
  {q:"Herzzeitvolumen eines Erwachsenen in Ruhe, ungefähr?", a:"5 l/min", w:["1 l/min","12 l/min","20 l/min"]},
  {q:"Alle Herzklappen geschlossen, Ventrikeldruck steigt: welche Phase?", a:"Anspannungsphase", w:["Austreibungsphase","Entspannungsphase","Füllungsphase"]},
  // Atmung / Blut
  {q:"Wie viele Lappen hat die rechte Lunge?", a:"3", w:["2","4","5"]},
  {q:"Wie viele O₂-Moleküle bindet ein Hämoglobinmolekül maximal?", a:"4", w:["1","2","8"]},
  {q:"Durchschnittliche Lebensdauer eines Erythrozyten?", a:"ca. 120 Tage", w:["ca. 10 Tage","ca. 30 Tage","ca. 1 Jahr"]},
  {q:"Universalspender für Erythrozytenkonzentrate?", a:"0 Rh negativ", w:["AB Rh positiv","A Rh negativ","0 Rh positiv"]},
  {q:"In welchem Organ reifen T-Lymphozyten?", a:"Thymus", w:["Milz","Lymphknoten","Knochenmark"]},
  // Verdauung / Endokrinium
  {q:"Wo wird Galle gebildet?", a:"Leber", w:["Gallenblase","Pankreas","Duodenum"]},
  {q:"Wo wird Vitamin B12 resorbiert?", a:"Terminales Ileum", w:["Duodenum","Jejunum","Magen"]},
  {q:"Welche Zellen bilden den Intrinsic Factor?", a:"Belegzellen des Magens", w:["Hauptzellen des Magens","Nebenzellen des Magens","G-Zellen"]},
  {q:"Welche Zellen bilden Pepsinogen?", a:"Hauptzellen", w:["Belegzellen","Nebenzellen","G-Zellen"]},
  {q:"Insulin wird gebildet in den …", a:"B-Zellen der Langerhans-Inseln", w:["A-Zellen der Langerhans-Inseln","D-Zellen der Langerhans-Inseln","Azinuszellen des Pankreas"]},
  {q:"Welches Hormon stammt aus dem Nebennierenmark?", a:"Adrenalin", w:["Cortisol","Aldosteron","ACTH"]},
  {q:"In welcher Zone der Nebennierenrinde entsteht Aldosteron?", a:"Zona glomerulosa", w:["Zona fasciculata","Zona reticularis","Nebennierenmark"]},
  {q:"Welches Hormon wird aus der Neurohypophyse freigesetzt?", a:"ADH", w:["TSH","Prolaktin","ACTH"]},
  // Niere
  {q:"Welcher Nephronabschnitt ist praktisch wasserundurchlässig?", a:"Dicker aufsteigender Teil der Henle-Schleife", w:["Absteigender Teil der Henle-Schleife","Proximaler Tubulus","Sammelrohr unter ADH"]},
  {q:"Wo wirkt ADH in der Niere hauptsächlich?", a:"Sammelrohr", w:["Proximaler Tubulus","Glomerulus","Absteigende Henle-Schleife"]},
  {q:"Normale GFR eines gesunden Erwachsenen, ungefähr?", a:"120 ml/min", w:["12 ml/min","40 ml/min","1200 ml/min"]},
  // Zellbiologie / Biochemie
  {q:"Chromosomenzahl einer menschlichen Körperzelle?", a:"46", w:["23","44","48"]},
  {q:"Welche Base ersetzt in der RNA das Thymin?", a:"Uracil", w:["Cytosin","Adenin","Guanin"]},
  {q:"Wo findet die Translation statt?", a:"Ribosomen", w:["Zellkern","Golgi-Apparat","Lysosomen"]},
  {q:"Wo läuft die oxidative Phosphorylierung ab?", a:"Innere Mitochondrienmembran", w:["Mitochondriale Matrix","Äussere Mitochondrienmembran","Zytosol"]},
  {q:"Wie viele Zähne hat das bleibende Gebiss?", a:"32", w:["20","28","36"]},
];
