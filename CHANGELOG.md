# Changelog

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
