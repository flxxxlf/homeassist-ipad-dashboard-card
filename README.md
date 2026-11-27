# iPad Dashboard Card

Eine Lovelace-Karte für Home Assistant, die **Uhrzeit**, **Wetter**, eine **Bring!-Einkaufsliste** (mit Hinzufügen von Artikeln) und die **nächsten U-Bahn-Abfahrten** in einem ruhigen, dunklen Layout zeigt. Gebaut für ein **iPad Pro 10,5" im Querformat** (1112 × 834 pt).

```
┌──────────────┬──────────────┬──────────────┐
│ 22:38        │ Einkaufsliste│ U-Bahn       │
│ Freitag, …   │ [ + Artikel ]│ U2  Messe… 1 │
├──────────────┤ Milch  Brot  │ U8  Neupe… 3 │
│ Wetter  6 °C │ Äpfel  …     │ U2  Feldm… 6 │
│ Mo Di Mi …   │ Zuletzt: …   │ …            │
└──────────────┴──────────────┴──────────────┘
```

- Keine Entity-IDs im Code: alles wird in der Kartenkonfiguration angegeben.
- Alle Daten kommen über das `hass`-Objekt bzw. dessen WebSocket-Verbindung. Es wird **kein Token** benötigt.
- Keine Abhängigkeiten und kein Build-Schritt: eine einzige JS-Datei.
- Visueller Editor im Dashboard-Editor für die wichtigsten Optionen.

## Voraussetzungen

| Bereich | Integration |
|---|---|
| Wetter | Eine beliebige `weather.*`-Entität (z. B. Met.no, DWD, OpenWeatherMap) |
| Einkaufsliste | Die offizielle **Bring!**-Integration (stellt `todo.*`-Entitäten bereit). Jede andere To-do-Liste funktioniert ebenfalls. |
| Abfahrten | Ein oder mehrere Sensoren einer ÖPNV-Integration, z. B. MVG, HAFAS, Deutsche Bahn, RMV, VBB, KVV. Siehe [Abfahrten](#abfahrten). |

Getestet für Home Assistant 2026.11; Mindestversion 2024.8.

## Installation

### Über HACS (empfohlen)

1. HACS öffnen → Menü oben rechts → **Benutzerdefinierte Repositories**.
2. URL `https://github.com/flxxxlf/homeassist-ipad-dashboard-card` eintragen, Typ **Dashboard** wählen.
3. „iPad Dashboard Card“ suchen und herunterladen.
4. HACS legt die Ressource `/hacsfiles/homeassist-ipad-dashboard-card/ipad-dashboard-card.js` automatisch an. Browser bzw. Companion-App neu laden.

### Manuell

1. `dist/ipad-dashboard-card.js` nach `config/www/` kopieren.
2. **Einstellungen → Dashboards → ⋮ → Ressourcen → Ressource hinzufügen**:
   URL `/local/ipad-dashboard-card.js`, Typ **JavaScript-Modul**.

## Einrichtung auf dem iPad

Die Karte füllt eine ganze Seite. Am besten eine eigene Ansicht vom Typ **Panel (einzelne Karte)** anlegen:

```yaml
views:
  - title: iPad
    path: ipad
    type: panel
    cards:
      - type: custom:ipad-dashboard-card
        weather_entity: weather.forecast_home
        todo_entity: todo.bring_zuhause
        departure_entities:
          - sensor.mvg_hohenzollernplatz
        title_departures: U-Bahn
```

Die Höhe ist standardmäßig `100vh` minus Kopfzeile. Wer die Kopfzeile ausblendet (z. B. mit Kiosk-Mode), setzt `height: 100vh`.

## Konfiguration

| Option | Typ | Standard | Beschreibung |
|---|---|---|---|
| `weather_entity` | string | – | `weather.*`-Entität |
| `todo_entity` | string | – | `todo.*`-Entität (Bring!-Liste) |
| `departure_entities` | Liste | `[]` | Abfahrts-Sensoren, als ID oder Objekt (siehe unten) |
| `title_weather` | string | „Wetter“ | Überschrift Wetter |
| `title_todo` | string | Name der Liste | Überschrift Einkaufsliste |
| `title_departures` | string | „Abfahrten“ | Überschrift Abfahrten |
| `station_name` | string | Name des Sensors | Text rechts neben der Überschrift Abfahrten |
| `departures_icon` | string | `mdi:subway-variant` | Icon Abfahrten |
| `forecast_type` | `auto` \| `daily` \| `twice_daily` \| `hourly` | `auto` | Art der Vorhersage |
| `forecast_days` | Zahl | `5` | Anzahl Vorhersage-Spalten (1–8) |
| `show_seconds` | bool | `false` | Sekunden neben der Uhrzeit |
| `show_completed` | Zahl | `8` | Anzahl „Zuletzt gekauft“-Chips (0 = aus) |
| `spec_separator` | string | `:` | Trenner für die Bring!-Spezifikation, z. B. `Milch: 2 Liter` |
| `max_departures` | Zahl | `7` | Maximale Anzahl Abfahrten (bei Gruppierung je Gruppe) |
| `hide_below_minutes` | Zahl | `0` | Abfahrten ausblenden, die früher sind (z. B. Fußweg zur Station) |
| `line_filter` | Liste | – | Nur diese Linien anzeigen, z. B. `[U2, U8]` |
| `destination_exclude` | Liste | – | Ziele ausblenden, die diesen Text enthalten |
| `line_colors` | Map | – | Farben je Linie, z. B. `{U2: "#c4505a"}` |
| `group_departures` | bool | `false` | Nach Sensor gruppieren statt eine gemeinsame, sortierte Liste |
| `add_delay` | bool | `false` | Verspätung zur Zeit addieren (wenn die Integration nur die Planzeit liefert, z. B. HAFAS) |
| `show_on_time` | bool | `false` | „pünktlich“ anzeigen, wenn keine Verspätung vorliegt |
| `departures_attribute` | string | automatisch | Attribut, das die Abfahrtsliste enthält |
| `departure_fields` | Map | automatisch | Feldnamen der Abfahrten, siehe unten |
| `height` | CSS | `calc(100vh - var(--header-height, 56px) - 16px)` | Kartenhöhe |
| `background` | CSS-Farbe | `#0e1115` | Hintergrund der Karte |

### Einkaufsliste

- **Artikel antippen** → als erledigt markieren (bei Bring!: „gekauft“).
- **Eingabefeld + Enter / Plus** → Artikel hinzufügen. Mit `Milch: 2 Liter` wird „2 Liter“ als Bring!-Spezifikation gespeichert.
- Steht ein Artikel schon in „Zuletzt gekauft“, wird er wieder aktiviert statt doppelt angelegt.
- **„Zuletzt gekauft“-Chip antippen** → Artikel wieder auf die Liste setzen.

Die Liste aktualisiert sich live über `todo/item/subscribe`. Gespeichert wird über die Dienste `todo.add_item` und `todo.update_item`.

### Abfahrten

ÖPNV-Integrationen liefern ihre Daten sehr unterschiedlich. Die Karte erkennt die gängigen Formate automatisch:

1. **Sensor mit Liste im Attribut** (z. B. `departures`, `next_departures`, `connections`, `journeys`). Je Eintrag werden diese Felder gesucht:
   - Linie: `line`, `label`, `line_name`, `name`, …
   - Ziel: `destination`, `direction`, `to`, …
   - Zeit: `departure`, `departure_time`, `time`, `planned`, `when`, … (ISO-Zeitstempel, Unix-Zeit oder `HH:MM`)
   - *oder* Minuten: `minutes`, `departure_in`, `in`, …
   - Verspätung: `delay` (Minuten, `+3` oder `0:03:00`), Gleis: `platform`/`track`, Ausfall: `cancelled`
2. **Ein Sensor je Abfahrt**: Der Zustand ist der Zeitstempel bzw. die Minuten, Linie und Ziel stehen in den Attributen.

Erkennt die Karte deine Daten nicht, lassen sich die Felder zuordnen. Am Attribut des Sensors in **Entwicklerwerkzeuge → Zustände** sieht man, welche Felder es gibt:

```yaml
departures_attribute: departures
departure_fields:
  line: product.line     # Pfade mit Punkt sind erlaubt
  destination: direction
  time: departure_time
  delay: delay
```

Einstellungen pro Sensor gehen über die Objektschreibweise:

```yaml
departure_entities:
  - entity: sensor.ubahn_richtung_zentrum
    name: Richtung Zentrum
  - entity: sensor.hafas_station
    name: Richtung Flughafen
    attribute: connections
    add_delay: true
    fields:
      line: line
group_departures: true
```

> Hinweis: Den visuellen Editor gibt es nur für Sensoren als einfache Liste von IDs. Für die Objektschreibweise den YAML-Editor verwenden; der visuelle Editor lässt diese Einträge dann unverändert.

### Vollständiges Beispiel

```yaml
type: custom:ipad-dashboard-card
weather_entity: weather.forecast_home
todo_entity: todo.bring_zuhause
departure_entities:
  - sensor.mvg_hohenzollernplatz
title_departures: U-Bahn
station_name: Hohenzollernplatz
max_departures: 8
hide_below_minutes: 3
line_filter: [U2, U8]
line_colors:
  U2: "#c4505a"
  U8: "#d4824a"
forecast_days: 5
show_completed: 10
```

## Hinweise

- Uhrzeit und Datum richten sich nach Sprache, 12/24-h-Format und Zeitzone aus deinem HA-Profil.
- Die Sprache der Oberfläche ist Deutsch oder Englisch, je nach Profilsprache.
- Bei schmalen Ansichten (z. B. iPad hochkant, Smartphone) ordnet sich das Layout automatisch in zwei Spalten bzw. eine Spalte.

## Lizenz

MIT
