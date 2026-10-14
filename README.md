# Rätselmix

Zufälliger Mix aus Allgemeinwissen, Weltkarte, Matrizen, Flaggen-Zuordnung und Sudoku.
Allgemeinwissen, Medizin, Anatomie, Karte und Logik-Matrizen laufen mit Spaced Repetition (Leitner: falsch → nach ~2 Min. wieder, richtig → 1, 3, 7, 21, 60 Tage).
Flaggen und Sudokus sind immer zufällig.

## Stufen
Jeder Aufgabentyp hat eine eigene Stufe (Sterne oben rechts). 3 richtige Antworten = eine Stufe höher, eine falsche = eine halbe Stufe zurück.
- Allgemeinwissen, Medizin, Anatomie, Karte (Stufe 1–3): neue Fragen kommen nur aus der freigeschalteten Schwierigkeit (`d: 1–3` bei den Fragen, `ANATOMY_DIFF`, `COUNTRY_D1/D3`). Fällige Wiederholungen kommen unabhängig von der Stufe.
- Matrizen (1–5): mehr gleichzeitige Regeln, schwierigere Überlagerungen, mehr bewegte Elemente.
- Flaggen (1–5): mehr Flaggen pro Runde, unbekanntere Länder, ab Stufe 4 ähnlich aussehende Flaggen (`FLAG_LOOKALIKES`).
- Sudoku (1–5): 30 bis 54 leere Felder.

## Auf GitHub Pages stellen
1. Neues Repo anlegen, alle Dateien (index.html, style.css, data.js, data-med.js, figures.js, logic.js, app.js) hochladen. Unten auf der Seite steht die Version – so siehst du, ob die neue online ist.
2. Settings → Pages → Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
3. Nach 1–2 Minuten unter `https://<user>.github.io/<repo>/` erreichbar.

## Anpassen
- `data.js`: Titel, Länderliste, Fragen (eigene einfach ergänzen, `d` = Schwierigkeit 1–3).
- `data-med.js`: Medizinfragen. Mit `img: "img/bild.jpg"` erscheint ein Bild über der Frage (Ordner `img/` im Repo anlegen).
- `figures.js`: Anatomie-Abbildungen (Herz, Gehirn, Neuron, Nephron, Skelett). Jede Struktur mit `data-p` wird einzeln abgefragt.
- `app.js` → `TASKS`: Gewichtung, wie oft welcher Aufgabentyp kommt.
- `logic.js` → `INTERVALS`: Wiederholungsabstände.
- `logic.js` → `genLogicMatrix`: Logik-Matrizen (Formen/Anzahl/Füllung/Grösse, Linien-Überlagerung, Bewegung). Jede Aufgabe entsteht aus einer Zufallszahl (Seed); falsch gelöste kommen exakt gleich wieder.

## Einschränkungen
- Fortschritt liegt im `localStorage` des Browsers: pro Gerät/Browser getrennt, weg beim Löschen der Websitedaten.
- Karte, Flaggenbilder und d3 kommen von CDNs (jsdelivr, cdnjs, flagcdn) – braucht Internet.
- Ländernamen kommen aus dem Browser (`Intl.DisplayNames`), Schreibweise kann je nach Browser leicht variieren.
