# Changelog

## v1.3.0

- Neuer Tab **Musik**: Übersicht aller Räume (`music_rooms`) mit Cover, Titel, Künstler und App. Räume ohne Wiedergabe erscheinen dezent als „Pausiert“ oder „Aus“.
- Große Ansicht mit Cover, Titel, Künstler, Album, Fortschritt (antippen zum Spulen) und Steuerung: Play/Pause, Zurück, Weiter, Lautstärke, Stumm, Zufall, Wiederholen, Ein/Aus. Es erscheinen nur Knöpfe, die der Player laut `supported_features` unterstützt.
- Music-Assistant-Räume: Playlists aus der Music-Assistant-Bibliothek (z. B. Spotify) über `music_assistant.get_library`, abspielen per `music_assistant.play_media`. Bei anderen Playern ausgeblendet.
- Sendspin: Das iPad kann selbst als Music-Assistant-Player arbeiten (`sendspin_server`, `player_name`). Basis ist die offizielle Bibliothek `@sendspin/sendspin-js` 6.0.0, mit Hinweis „Tippen, um Ton zu aktivieren“, automatischem Neuverbinden und Statusanzeige.
- Der Quellcode liegt jetzt in `src/`, `dist/` wird mit esbuild gebaut (`npm run build`).

## v1.2.0

- Tabs oben: Übersicht, Wetter, Verkehr, Einkaufen, Zuhause. Die Uhrzeit rechts öffnet die Uhr. Kacheln in der Übersicht führen zum passenden Tab.
- Uhr: Wecker (mit Wiederholung, Bezeichnung, Schlummern), Timer (Schnellwahl und eigene Minuten) und Stoppuhr mit Runden. Wecker werden im Home-Assistant-Benutzerprofil gespeichert. Optional startet `alarm_script` ein Skript beim Klingeln.
- Wetter-Tab: 24-Stunden-Verlauf mit Temperaturkurve, bis zu 15 Tage, Detailkacheln (Gefühlt, Luftfeuchtigkeit, Wind mit Richtung, UV-Index, Luftdruck, Sichtweite, Bewölkung, Niederschlag, Sonnenauf- und -untergang).
- Verkehr-Tab: große Tafel mit Plan- und Echtzeit, Verspätung, Gleis und Störungstext, Filter je Richtung, Richtungskarten mit den nächsten Fahrten, Anfahrt und Loslauf-Hinweis.
- Einkaufen-Tab: Vorschläge beim Tippen, „Rückgängig“ nach dem Abhaken, Sortierung (Liste / A–Z), mehrere Bring!-Listen (`todo_entities`), Favoriten (`quick_items`), „Zuletzt gekauft“.
- Zuhause-Tab: großer Grundriss und Geräteliste (`home_entities`, Räume aus `floorplan.rooms`).
- Optional automatisch zurück zur Übersicht (`return_to_overview`).

## v1.1.0

- Wetter im iOS-Stil: kompakter Kopf mit Ort, Temperatur sowie H/T, stündliche Vorhersage und Tagesliste mit Temperaturbalken, farbige Icons und Farbverlauf je nach Wetter und Tageszeit.
- Bring!-Artikel bearbeiten: Stift-Symbol oder langes Drücken öffnet einen Dialog für Name und Menge/Notiz (Bring!-Spezifikation), Erledigt oder Löschen.
- Abfahrten: direkte Unterstützung für ha-departures (`times`, `line_name`, `head_sign`, `track`, Echtzeit, Ausfälle, Störungen), Hilfssensoren werden ignoriert.
- Neuer Stil `departure_style: berlin`: Zugzielanzeiger mit Liniennummern in den Berliner U-/S-Bahn-Farben.
- Anfahrt-Anzeige: nächster Zug je Richtung auf einer Strecke, optional mit Fußweg (`walk_minutes`) und Hinweis „Loslaufen in X min“.
- Grundriss-Bereich (`floorplan`) mit optionalen Räumen, die Lichter schalten (Bild liegt in Home Assistant, nicht im Repository).
- Frei konfigurierbares Layout (`layout.areas`, `layout.columns`, `layout.rows`).
- Versionsnummer im visuellen Editor; automatische GitHub-Releases für HACS.

## v1.0.0

- Erste Version: Uhrzeit, Wetter, Bring!-Liste und Abfahrten.
