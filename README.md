# iPad Dashboard Card

Eine Lovelace-Karte für Home Assistant für ein **iPad Pro 10,5" im Querformat** (1112 × 834 pt). Ruhiges, dunkles Design mit:

- **Uhrzeit und Datum**
- **Wetter im iOS-Stil:** Ort, Temperatur, H/T, stündliche Vorhersage und Tagesliste mit Temperaturbalken
- **Bring!-Einkaufsliste:** Artikel hinzufügen, abhaken, Menge/Notiz bearbeiten, löschen
- **Grundriss** deiner Wohnung, optional mit Räumen, die Lichter schalten
- **ÖPNV-Abfahrten**, optional als Berliner Zugzielanzeiger, mit Anfahrt-Anzeige und Fußweg

```
┌───────────┬──────────────────┬──────────────┐
│ 23:50     │ Grundriss        │ U Station    │
│ Freitag … │                  │ U5 Hönow   2 │
├───────────┤                  │ U5 Hbf     9 │
│ Berlin 6° │                  │ …            │
│ stündlich ├──────────────────┤              │
│ 7 Tage    │ Einkaufsliste    │ Anfahrt ━━●U │
└───────────┴──────────────────┴──────────────┘
```

Keine Entity-IDs, Bilder oder persönlichen Daten im Code. Alles wird in der Kartenkonfiguration angegeben. Alle Daten kommen über das `hass`-Objekt, ein Token ist nicht nötig. Die Karte ist eine einzige JS-Datei ohne Abhängigkeiten.

## Installation

### Über HACS

1. HACS → Menü oben rechts → **Benutzerdefinierte Repositories**.
2. `https://github.com/flxxxlf/homeassist-ipad-dashboard-card`, Typ **Dashboard**.
3. „iPad Dashboard Card“ herunterladen und Browser bzw. Companion-App neu laden.

Jede Änderung erscheint als eigene Version (v1.1.0, v1.1.1, …). HACS zeigt neue Versionen als Update an. Welche Version läuft, steht unten im visuellen Editor der Karte und in der Browser-Konsole.

### Manuell

`dist/ipad-dashboard-card.js` nach `config/www/` kopieren und unter **Einstellungen → Dashboards → ⋮ → Ressourcen** als JavaScript-Modul `/local/ipad-dashboard-card.js` hinzufügen.

## Schnellstart

Am besten eine eigene Ansicht vom Typ **Panel (einzelne Karte)** anlegen:

```yaml
views:
  - title: iPad
    path: ipad
    type: panel
    cards:
      - type: custom:ipad-dashboard-card
        weather_entity: weather.forecast_home
        weather_location: Berlin
        todo_entity: todo.bring_einkaufsliste
        departure_entities:
          - sensor.meine_station_u5_richtung_a
          - sensor.meine_station_u5_richtung_b
        departure_style: berlin
        station_name: Meine Station
        walk_minutes: 4
        floorplan:
          image: /local/grundriss.png
```

Die Höhe ist standardmäßig `100vh` minus Kopfzeile. Wer die Kopfzeile ausblendet (z. B. mit Kiosk-Mode), setzt `height: 100vh`.

## Wetter

Funktioniert mit jeder `weather.*`-Entität. Stündliche und tägliche Vorhersage kommen live über `weather/subscribe_forecast`. Liefert die Integration keine Tagesvorhersage, berechnet die Karte die Tage aus der stündlichen Vorhersage. Tag und Nacht werden über `sun.sun` erkannt.

| Option | Standard | Beschreibung |
|---|---|---|
| `weather_entity` | – | `weather.*`-Entität |
| `weather_location` | Name der Entität | Ortsname oben links |
| `forecast_hours` | `6` | Stunden in der Vorhersage (0 = aus) |
| `forecast_days` | `7` | Tage in der Vorhersage (0 = aus) |
| `weather_gradient` | `true` | Hintergrund-Verlauf je nach Wetter und Tageszeit |

## Einkaufsliste (Bring!)

Die offizielle Bring!-Integration legt pro Liste eine `todo.*`-Entität an. Diese trägst du als `todo_entity` ein. Jede andere To-do-Liste funktioniert ebenfalls.

- **Antippen:** Artikel als erledigt markieren.
- **Stift-Symbol oder lange drücken:** Bearbeiten-Dialog öffnen. Dort lassen sich Name und **Menge/Notiz** (die Bring!-„Spezifikation“) ändern, der Artikel abhaken oder löschen.
- **Eingabefeld:** `Milch: 2 Liter` legt „Milch“ mit der Spezifikation „2 Liter“ an. Steht der Artikel unter „Zuletzt gekauft“, wird er wieder aktiviert statt doppelt angelegt.
- **„Zuletzt gekauft“-Chip antippen:** Artikel zurück auf die Liste setzen.

| Option | Standard | Beschreibung |
|---|---|---|
| `todo_entity` | – | `todo.*`-Entität |
| `title_todo` | Name der Liste | Überschrift |
| `show_completed` | `8` | Anzahl „Zuletzt gekauft“-Chips (0 = aus) |
| `spec_separator` | `:` | Trenner für Menge/Notiz im Eingabefeld |
| `spec_suggestions` | `[2×, 3×, 500 g, 1 kg, Bio, groß]` | Schnellauswahl im Bearbeiten-Dialog |

## Abfahrten

### Mit ha-departures

[ha-departures](https://github.com/alex-jung/ha-departures) legt pro Linie und Richtung drei Sensoren an. Trag nur den **Hauptsensor** ein, also den ohne `-expected departure` oder `-delay` im Namen. Er enthält im Attribut `times` die nächsten Fahrten. Die Karte liest daraus automatisch:

- Linie (`line_name`) und Ziel (`head_sign`)
- Echtzeit-Abfahrt (`estimated`, sonst `planned`) und Verspätung
- Gleis (`track`)
- Ausfälle (`cancelled`) und Störungen (`alerts`)

Die Fahrten aller eingetragenen Sensoren werden zu einer sortierten Tafel zusammengeführt.

### Berliner Zugzielanzeiger

Mit `departure_style: berlin` erscheint die Tafel wie ein Zugzielanzeiger: schwarzer Hintergrund, bernsteinfarbene Schrift und Liniennummern in den Farben der Berliner U-Bahn (U1–U9) und S-Bahn. Busse und Trams bekommen eigene Farben. Einzelne Farben lassen sich mit `line_colors` überschreiben.

### Anfahrt-Anzeige

Unter der Tafel zeigt eine Strecke für die nächsten Züge je Richtung, wie nah der Zug ist. Die Position ergibt sich aus der Echtzeit-Abfahrt, nicht aus GPS. Mit `walk_minutes` erscheint eine Markierung für deinen Fußweg und der Hinweis „Loslaufen in X min“ / „Jetzt loslaufen“ / „Nicht mehr erreichbar“.

| Option | Standard | Beschreibung |
|---|---|---|
| `departure_entities` | `[]` | Sensoren (ID oder Objekt, siehe unten) |
| `departure_style` | `calm` | `calm` oder `berlin` |
| `station_name` | – | Name der Station in der Kopfzeile |
| `title_departures` | „Abfahrten“ | Überschrift, wenn kein `station_name` gesetzt ist |
| `max_departures` | `8` | Anzahl Zeilen |
| `walk_minutes` | `0` | Fußweg zur Station in Minuten |
| `hide_below_minutes` | `0` | Abfahrten ausblenden, die früher sind |
| `show_approach` | `true` | Anfahrt-Anzeige |
| `approach_count` | `2` | Anzahl Strecken (je Linie und Richtung) |
| `approach_window` | `15` | Länge der Strecke in Minuten |
| `line_filter` | – | Nur diese Linien, z. B. `[U5]` |
| `destination_exclude` | – | Ziele ausblenden, die diesen Text enthalten |
| `line_colors` | – | z. B. `{U5: "#7E5330"}` |
| `group_departures` | `false` | Nach Sensor gruppieren statt einer gemeinsamen Liste |
| `show_on_time` | `false` | „pünktlich“ anzeigen |
| `show_realtime` | `true` | Grüner Punkt bei Echtzeitdaten |
| `add_delay` | `false` | Verspätung addieren, wenn die Integration nur Planzeiten liefert (z. B. HAFAS) |

### Andere Integrationen

Die Karte erkennt auch andere Formate, z. B. MVG, HAFAS, DB, RMV oder VBB: Listen in `departures`, `connections` oder `journeys` sowie einen Sensor pro Abfahrt. Passen die Felder nicht, lassen sie sich zuordnen:

```yaml
departures_attribute: departures
departure_fields:
  line: product.line      # Pfade mit Punkt sind erlaubt
  destination: direction
  time: departure_time
  delay: delay
departure_entities:
  - entity: sensor.station_a
    name: Richtung Zentrum   # pro Sensor: name, attribute, fields, add_delay
```

## Grundriss

```yaml
floorplan:
  image: /local/grundriss.png   # Bild in config/www/grundriss.png
  title: Zuhause
  invert: false                 # true für helle Pläne (werden dunkel dargestellt)
  rooms:                        # optional, Positionen in % des Bildes
    - name: Küche
      entity: light.kueche
      x: 65.5
      y: 22
      w: 31
      h: 19
```

- **Raum antippen:** Entität umschalten (`homeassistant.toggle`).
- **Raum lange drücken:** Detail-Dialog öffnen.
- **Eingeschaltete Räume:** leuchten warm.
- **Ohne Bild:** Es erscheint ein Platzhalter.

**Datenschutz:** Der Grundriss gehört nicht ins öffentliche Repository. Er liegt nur in deinem Home Assistant unter `config/www/`, die Karte lädt ihn über `/local/…`. Dateien unter `/local/` sind ohne Anmeldung abrufbar, wenn man die genaue URL kennt. Wähle deshalb einen nicht erratbaren Dateinamen, z. B. `/local/plan-7f3k2.png`.

## Layout

Das Raster lässt sich frei anpassen. Bereiche: `clock`, `weather`, `plan`, `todo`, `dep`. Ein Bereich, der nicht vorkommt, wird ausgeblendet.

```yaml
layout:
  areas:
    - clock   plan dep
    - weather plan dep
    - weather todo dep
  columns: minmax(0, 0.9fr) minmax(0, 1.25fr) minmax(0, 1fr)
  rows: auto minmax(0, 1fr) minmax(0, 1.05fr)
```

Weitere Optionen: `height` (CSS), `background` (CSS-Farbe), `show_seconds`.

## Entwicklung und Releases

Bei jeder Änderung `CARD_VERSION` in `dist/ipad-dashboard-card.js` erhöhen und einen Abschnitt in `CHANGELOG.md` ergänzen. Sobald die Änderung auf dem Standard-Branch landet, legt die GitHub Action `Release` automatisch das Release `vX.Y.Z` mit der Kartendatei an. HACS bietet es dann als Update an.

Damit die HACS-Validierung durchläuft, braucht das Repository auf GitHub eine Beschreibung und Topics.

## Lizenz

MIT
