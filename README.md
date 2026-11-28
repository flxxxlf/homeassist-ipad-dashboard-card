# iPad Dashboard Card

Eine Lovelace-Karte für Home Assistant für ein **iPad Pro 10,5" im Querformat** (1112 × 834 pt). Sie ist ein ruhiges, dunkles Wand-Dashboard mit Tabs:

| Tab | Inhalt |
|---|---|
| **Übersicht** | Kompakte Kacheln für Uhr, Wetter, Abfahrten, Einkaufsliste und Grundriss. Ein Tipp auf eine Kachel öffnet den passenden Tab. |
| **Wetter** | iOS-Stil mit 24-Stunden-Verlauf und Temperaturkurve, bis zu 15 Tagen und Detailkacheln (Wind, UV, Luftdruck, Sonne …) |
| **Verkehr** | Abfahrtstafel (optional Berliner Zugzielanzeiger), Filter je Richtung, Anfahrt und Loslauf-Hinweis |
| **Einkaufen** | Bring!-Liste: hinzufügen mit Vorschlägen, abhaken mit „Rückgängig“, Menge/Notiz bearbeiten, Favoriten, mehrere Listen |
| **Zuhause** | Großer Grundriss mit Räumen und Geräten |
| **Uhr** | Wecker, Timer und Stoppuhr. Öffnet sich über die Uhrzeit oben rechts oder die Uhr-Kachel. |

Keine Entity-IDs, Bilder oder persönlichen Daten im Code. Alles wird in der Kartenkonfiguration angegeben. Alle Daten kommen über das `hass`-Objekt, ein Token ist nicht nötig. Die Karte ist eine einzige JS-Datei ohne Abhängigkeiten.

## Installation

### Über HACS

1. HACS → Menü oben rechts → **Benutzerdefinierte Repositories**.
2. `https://github.com/flxxxlf/homeassist-ipad-dashboard-card`, Typ **Dashboard**.
3. „iPad Dashboard Card“ herunterladen und Browser bzw. Companion-App neu laden.

Jede Änderung erscheint als eigene Version. HACS zeigt neue Versionen als Update an. Welche Version läuft, steht unten im visuellen Editor der Karte.

### Manuell

`dist/ipad-dashboard-card.js` nach `config/www/` kopieren und unter **Einstellungen → Dashboards → ⋮ → Ressourcen** als JavaScript-Modul `/local/ipad-dashboard-card.js` hinzufügen.

## Schnellstart

Eine eigene Ansicht vom Typ **Panel (einzelne Karte)** anlegen:

```yaml
views:
  - title: iPad
    path: ipad
    type: panel
    cards:
      - type: custom:ipad-dashboard-card
        weather_entity: weather.forecast_home
        weather_location: Berlin
        todo_entity: todo.bring_zuhause
        departure_entities:
          - sensor.meine_station_u5_richtung_a
          - sensor.meine_station_u5_richtung_b
        departure_style: berlin
        station_name: Meine Station
        walk_minutes: 4
        floorplan:
          image: /local/meinemedien/grundriss.png
```

Die Höhe ist standardmäßig `100vh` minus Kopfzeile. Wer die Kopfzeile ausblendet (z. B. mit Kiosk-Mode), setzt `height: 100vh`.

## Tabs und Navigation

| Option | Standard | Beschreibung |
|---|---|---|
| `tabs` | `[overview, weather, transit, shopping, home]` | Sichtbare Tabs und ihre Reihenfolge |
| `default_tab` | `overview` | Tab beim Öffnen (auch `clock`) |
| `return_to_overview` | `0` | Nach so vielen Sekunden ohne Berührung zurück zum ersten Tab (0 = nie) |
| `layout` | siehe unten | Kachel-Raster der Übersicht |

Das Raster der Übersicht hat die Bereiche `clock`, `weather`, `dep`, `todo` und `plan`. Ein Bereich, der nicht vorkommt, wird ausgeblendet.

```yaml
layout:
  areas:
    - clock weather dep
    - plan  todo    dep
  columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.05fr)
  rows: minmax(0, 0.82fr) minmax(0, 1fr)
```

## Uhr: Wecker, Timer, Stoppuhr

- **Wecker:** Uhrzeit, Wochentage (keine = einmalig) und Bezeichnung. Ein Schalter aktiviert oder deaktiviert den Wecker, ein Tipp auf die Zeile bearbeitet ihn. Beim Klingeln gibt es „Schlummern“ und „Stopp“.
- **Timer:** Schnellwahl (1, 3, 5, 10, 15, 30 min) oder eigene Minuten. Mehrere Timer können gleichzeitig laufen, je mit „+1 min“.
- **Stoppuhr:** Start/Stopp, Runden, Zurücksetzen.

Wecker werden in deinem Home-Assistant-Benutzerprofil gespeichert und gehen bei einem Neustart nicht verloren. Timer und Stoppuhr gelten nur für das jeweilige Gerät.

**Wichtig:** Der Ton kommt vom iPad und erklingt nur, **solange das Dashboard geöffnet und der Bildschirm an ist**. iPadOS erlaubt Töne erst nach der ersten Berührung. Tippe nach dem Öffnen also einmal irgendwo auf das Dashboard. Soll beim Wecken auch etwas in Home Assistant passieren (z. B. Licht an), gib ein Skript an. Es bekommt die Variablen `type` (`alarm`/`timer`), `label` und `time`.

| Option | Standard | Beschreibung |
|---|---|---|
| `alarm_script` | – | Skript, das beim Klingeln gestartet wird |
| `snooze_minutes` | `9` | Schlummerzeit |
| `alarm_ring_minutes` | `5` | Nach so vielen Minuten hört das Klingeln von selbst auf |
| `timer_presets` | `[1, 3, 5, 10, 15, 30]` | Timer-Schnellwahl in Minuten |
| `show_seconds` | `false` | Sekunden in der Übersicht |

## Wetter

Funktioniert mit jeder `weather.*`-Entität. Die Vorhersage kommt live über `weather/subscribe_forecast`. Fehlt die Tagesvorhersage, berechnet die Karte die Tage aus der stündlichen Vorhersage. Detailkacheln erscheinen nur für Werte, die deine Wetter-Integration liefert.

| Option | Standard | Beschreibung |
|---|---|---|
| `weather_entity` | – | `weather.*`-Entität |
| `weather_location` | Name der Entität | Ortsname |
| `forecast_hours` | `5` | Stunden in der Übersichts-Kachel (0 = aus) |
| `forecast_days` | `10` | Tage im Wetter-Tab |
| `weather_gradient` | `true` | Hintergrund-Verlauf je nach Wetter und Tageszeit |

## Einkaufen (Bring!)

Die offizielle Bring!-Integration legt pro Liste eine `todo.*`-Entität an.

- **Antippen:** Artikel als erledigt markieren, danach erscheint kurz „Rückgängig“.
- **Stift-Symbol oder lange drücken:** Name und **Menge/Notiz** (Bring!-Spezifikation) bearbeiten, abhaken oder löschen.
- **Eingabefeld:** Beim Tippen erscheinen passende, bereits gekaufte Artikel als Vorschlag. `Milch: 2 Liter` legt „Milch“ mit der Spezifikation „2 Liter“ an.
- **Schnell hinzufügen:** Favoriten (`quick_items`) und „Zuletzt gekauft“ mit einem Tipp zurück auf die Liste.
- **Sortierung:** Reihenfolge der Liste oder A–Z.
- **Mehrere Listen:** Mit `todo_entities` lässt sich zwischen Listen umschalten.

| Option | Standard | Beschreibung |
|---|---|---|
| `todo_entity` | – | Haupt-Liste (auch in der Übersicht) |
| `todo_entities` | – | Weitere Listen zum Umschalten |
| `title_todo` | „Einkaufsliste“ | Überschrift |
| `quick_items` | – | Favoriten, z. B. `[Milch, Eier, Brot]` |
| `show_completed` | `30` | Anzahl „Zuletzt gekauft“ |
| `spec_separator` | `:` | Trenner für Menge/Notiz im Eingabefeld |
| `spec_suggestions` | `[2×, 3×, 500 g, 1 kg, Bio, groß]` | Schnellauswahl im Bearbeiten-Dialog |

## Verkehr

### Mit ha-departures

[ha-departures](https://github.com/alex-jung/ha-departures) legt pro Linie und Richtung drei Sensoren an. Trag nur den **Hauptsensor** ein, also den ohne `-expected departure` oder `-delay` im Namen. Die Karte liest daraus automatisch:

- Linie und Ziel
- Plan- und Echtzeit, Verspätung
- Gleis
- Ausfälle und Störungen

**Übersicht:** die nächsten Abfahrten und ein Loslauf-Hinweis.

**Verkehr-Tab:**
- Große Tafel mit Plan- → Echtzeit und Störungstext
- Filter-Chips je Richtung
- Pro Richtung eine Karte mit den nächsten Fahrten, der Anfahrt-Strecke und „Loslaufen in X min“

Mit `departure_style: berlin` sieht die Tafel aus wie ein Berliner Zugzielanzeiger. Die Liniennummern haben die Farben der Berliner U- und S-Bahn.

| Option | Standard | Beschreibung |
|---|---|---|
| `departure_entities` | `[]` | Sensoren (ID oder Objekt, siehe unten) |
| `departure_style` | `calm` | `calm` oder `berlin` |
| `station_name` | – | Name der Station |
| `max_departures` | `7` | Zeilen in der Übersicht |
| `max_departures_detail` | `14` | Zeilen im Verkehr-Tab |
| `walk_minutes` | `0` | Fußweg zur Station in Minuten |
| `show_approach` | `true` | Anfahrt-Strecke und Loslauf-Hinweis |
| `approach_window` | `15` | Länge der Strecke in Minuten |
| `hide_below_minutes` | `0` | Abfahrten ausblenden, die früher sind |
| `line_filter` | – | Nur diese Linien, z. B. `[U5]` |
| `destination_exclude` | – | Ziele ausblenden, die diesen Text enthalten |
| `line_colors` | – | z. B. `{U5: "#7E5330"}` |
| `group_departures` | `false` | Nach Sensor gruppieren |
| `show_on_time` / `show_realtime` | `false` / `true` | „pünktlich“ bzw. grüner Echtzeit-Punkt |
| `add_delay` | `false` | Verspätung addieren, wenn nur Planzeiten geliefert werden (z. B. HAFAS) |

Andere Integrationen (MVG, HAFAS, DB, RMV, VBB …) werden ebenfalls erkannt. Felder lassen sich bei Bedarf zuordnen:

```yaml
departures_attribute: departures
departure_fields:
  line: product.line
  destination: direction
  time: departure_time
  delay: delay
departure_entities:
  - entity: sensor.station_a
    name: Richtung Zentrum   # pro Sensor: name, attribute, fields, add_delay
```

## Zuhause

```yaml
floorplan:
  image: /local/meinemedien/grundriss.png   # Datei in config/www/meinemedien/
  title: Zuhause
  invert: false                             # true für helle Pläne
  rooms:                                    # optional, Positionen in % des Bildes
    - name: Küche
      entity: light.kueche
      x: 65.5
      y: 22
      w: 31
      h: 19
home_entities:                              # optional, zusätzliche Geräte in der Liste
  - light.stehlampe
  - entity: switch.kaffeemaschine
    name: Kaffee
```

- **Raum oder Gerät antippen:** umschalten.
- **Lange drücken:** Detail-Dialog öffnen.
- **Eingeschaltete Räume:** leuchten warm.

**Datenschutz:** Der Grundriss gehört nicht ins öffentliche Repository. Er liegt nur in deinem Home Assistant unter `config/www/` (Adresse `/local/…`). Solche Dateien sind ohne Anmeldung abrufbar, wenn man die genaue URL kennt. Wähle deshalb einen nicht erratbaren Dateinamen.

## Weitere Optionen

`height` (CSS-Höhe), `background` (CSS-Farbe).

## Entwicklung und Releases

Bei jeder Änderung `CARD_VERSION` in `dist/ipad-dashboard-card.js` erhöhen und einen Abschnitt in `CHANGELOG.md` ergänzen. Landet die Änderung auf dem Standard-Branch, legt die GitHub Action `Release` automatisch das Release `vX.Y.Z` an. HACS bietet es dann als Update an.

## Lizenz

MIT
