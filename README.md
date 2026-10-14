# Rätselmix

Zufälliger Mix aus Allgemeinwissen, Weltkarte, Matrizen, Flaggen-Zuordnung und Sudoku.
Allgemeinwissen, Medizin, Anatomie, Karte und Logik-Matrizen laufen mit Spaced Repetition (Leitner: falsch → nach ~2 Min. wieder, richtig → 1, 3, 7, 21, 60 Tage).
Flaggen und Sudokus sind immer zufällig.

## Auf GitHub Pages stellen
1. Neues Repo anlegen, alle Dateien (index.html, style.css, data.js, logic.js, app.js) hochladen.
2. Settings → Pages → Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
3. Nach 1–2 Minuten unter `https://<user>.github.io/<repo>/` erreichbar.

## Anpassen
- `data.js`: Titel, Länderliste, Fragen (eigene einfach ergänzen).
- `data-med.js`: Medizinfragen. Mit `img: "img/bild.jpg"` erscheint ein Bild über der Frage (Ordner `img/` im Repo anlegen).
- `figures.js`: Anatomie-Abbildungen (Herz, Gehirn, Neuron, Nephron, Skelett). Jede Struktur mit `data-p` wird einzeln abgefragt.
- `app.js` → `TASKS`: Gewichtung, wie oft welcher Aufgabentyp kommt.
- `logic.js` → `INTERVALS`: Wiederholungsabstände.
- `logic.js` → `genLogicMatrix`: Logik-Matrizen (Formen/Anzahl/Füllung/Grösse, Linien-Überlagerung, Bewegung). Jede Aufgabe entsteht aus einer Zufallszahl (Seed); falsch gelöste kommen exakt gleich wieder.

## Einschränkungen
- Fortschritt liegt im `localStorage` des Browsers: pro Gerät/Browser getrennt, weg beim Löschen der Websitedaten.
- Karte, Flaggenbilder und d3 kommen von CDNs (jsdelivr, cdnjs, flagcdn) – braucht Internet.
- Ländernamen kommen aus dem Browser (`Intl.DisplayNames`), Schreibweise kann je nach Browser leicht variieren.
