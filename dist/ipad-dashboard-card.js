/*
 * iPad Dashboard Card
 * Custom Lovelace card for Home Assistant: clock, weather (iOS style), Bring!
 * shopping list (add / edit / complete), floor plan and public transport
 * departures (optional Berlin board style) in one calm, dark layout.
 * Optimised for an iPad Pro 10.5" in landscape (1112 × 834 CSS px).
 *
 * All data comes from the `hass` object / its websocket connection.
 * No entity IDs, images or personal data are part of this file – everything
 * is set in the card configuration.
 */

const CARD_VERSION = "1.1.0";
const CARD_TAG = "ipad-dashboard-card";
const EDITOR_TAG = "ipad-dashboard-card-editor";

/* ------------------------------------------------------------------ i18n */

const STRINGS = {
  de: {
    weather: "Wetter",
    shopping: "Einkaufsliste",
    departures: "Abfahrten",
    floorplan: "Zuhause",
    floorplan_hint: "Grundriss-Bild unter floorplan → image angeben, z. B. /local/grundriss.png",
    add_placeholder: "Artikel hinzufügen …",
    add: "Hinzufügen",
    empty_list: "Alles erledigt – die Liste ist leer.",
    recent: "Zuletzt gekauft",
    no_departures: "Keine Abfahrten verfügbar.",
    not_found: "Entität nicht gefunden",
    not_configured: "Nicht konfiguriert",
    now: "jetzt",
    now_hour: "Jetzt",
    min: "min",
    today: "Heute",
    high: "H",
    low: "T",
    hourly: "Stündliche Vorhersage",
    daily: (n) => `${n}-Tage-Vorhersage`,
    cancelled: "fällt aus",
    on_time: "pünktlich",
    platform: "Gl.",
    items: (n) => (n === 1 ? "1 Artikel" : `${n} Artikel`),
    unavailable: "nicht verfügbar",
    edit_item: "Artikel bearbeiten",
    item_name: "Artikel",
    item_spec: "Menge / Notiz",
    item_spec_placeholder: "z. B. 2 Liter, Bio …",
    save: "Speichern",
    delete: "Löschen",
    done: "Erledigt",
    cancel: "Abbrechen",
    approach: "Anfahrt",
    leave_in: (m) => `Loslaufen in ${m} min`,
    leave_now: "Jetzt loslaufen",
    too_late: "Nicht mehr erreichbar",
    realtime: "Echtzeit",
    line: "Linie",
    destination: "Ziel",
    departure: "Abfahrt",
  },
  en: {
    weather: "Weather",
    shopping: "Shopping list",
    departures: "Departures",
    floorplan: "Home",
    floorplan_hint: "Set a floor plan image under floorplan → image, e.g. /local/floorplan.png",
    add_placeholder: "Add item …",
    add: "Add",
    empty_list: "All done – the list is empty.",
    recent: "Recently bought",
    no_departures: "No departures available.",
    not_found: "Entity not found",
    not_configured: "Not configured",
    now: "now",
    now_hour: "Now",
    min: "min",
    today: "Today",
    high: "H",
    low: "L",
    hourly: "Hourly forecast",
    daily: (n) => `${n}-day forecast`,
    cancelled: "cancelled",
    on_time: "on time",
    platform: "Pl.",
    items: (n) => (n === 1 ? "1 item" : `${n} items`),
    unavailable: "unavailable",
    edit_item: "Edit item",
    item_name: "Item",
    item_spec: "Amount / note",
    item_spec_placeholder: "e.g. 2 litres, organic …",
    save: "Save",
    delete: "Delete",
    done: "Done",
    cancel: "Cancel",
    approach: "Approaching",
    leave_in: (m) => `Leave in ${m} min`,
    leave_now: "Leave now",
    too_late: "Not reachable anymore",
    realtime: "Real time",
    line: "Line",
    destination: "Destination",
    departure: "Departs",
  },
};

const CONDITIONS = {
  de: {
    "clear-night": "Klar",
    cloudy: "Bewölkt",
    exceptional: "Unwetter",
    fog: "Nebel",
    hail: "Hagel",
    lightning: "Gewitter",
    "lightning-rainy": "Gewitter mit Regen",
    partlycloudy: "Teilweise bewölkt",
    pouring: "Starkregen",
    rainy: "Regen",
    snowy: "Schnee",
    "snowy-rainy": "Schneeregen",
    sunny: "Sonnig",
    windy: "Windig",
    "windy-variant": "Windig und bewölkt",
  },
  en: {
    "clear-night": "Clear",
    cloudy: "Cloudy",
    exceptional: "Exceptional",
    fog: "Fog",
    hail: "Hail",
    lightning: "Lightning",
    "lightning-rainy": "Thunderstorms",
    partlycloudy: "Partly cloudy",
    pouring: "Heavy rain",
    rainy: "Rain",
    snowy: "Snow",
    "snowy-rainy": "Sleet",
    sunny: "Sunny",
    windy: "Windy",
    "windy-variant": "Windy, cloudy",
  },
};

/* Line colours of the Berlin U-Bahn / S-Bahn network (public line colours),
 * plus generic colours per transport type. Override with `line_colors`. */
const BERLIN_COLORS = {
  U1: "#7DAD4C", U2: "#DA421E", U3: "#16683D", U4: "#F0D722", U5: "#7E5330",
  U6: "#8C6DAB", U7: "#528DBA", U8: "#224F86", U9: "#F3791D",
  S1: "#DE4DA4", S2: "#005F27", S25: "#005F27", S26: "#005F27", S3: "#0A4C99",
  S41: "#AD5937", S42: "#CB6418", S45: "#CD9C53", S46: "#CD9C53", S47: "#CD9C53",
  S5: "#EB7405", S7: "#816DA6", S75: "#816DA6", S8: "#66AA22", S85: "#66AA22", S9: "#992746",
};
const TRANSPORT_COLORS = { BUS: "#95276E", TRAM: "#BE1414", SUBWAY: "#115D91", METRO: "#115D91", SUBURBAN: "#007734", FERRY: "#528DBA" };

/* Candidate keys used to read departure data from very different integrations
 * (ha-departures, MVG, HAFAS, DB, RMV, VBB, …). Override with `departure_fields`. */
const DEPARTURE_LIST_KEYS = ["times", "departures", "next_departures", "connections", "journeys", "trips", "data"];
const FIELD_CANDIDATES = {
  line: ["line", "line_name", "label", "lineName", "name", "number", "transport_line", "route", "servingLine"],
  destination: ["destination", "head_sign", "headsign", "direction", "to", "final_stop", "dest", "end_station"],
  time: [
    "estimated",
    "realtime_departure",
    "realtimeDepartureTime",
    "departure_realtime",
    "expected",
    "when",
    "departure",
    "departure_time",
    "time",
    "planned",
    "plannedDepartureTime",
    "scheduled",
    "plannedWhen",
  ],
  minutes: ["minutes", "departure_in", "in", "time_to_departure", "countdown", "min", "in_min"],
  delay: ["delay", "delay_minutes", "delayInMinutes", "delay_departure"],
  platform: ["track", "platform", "scheduled_track", "gleis", "stop_point"],
  cancelled: ["cancelled", "canceled", "is_cancelled", "cancel"],
  color: ["color", "line_color", "background_color", "lineBackgroundColor"],
  transport: ["transport", "transport_type", "product", "mode", "type"],
  alerts: ["alerts", "alert", "info", "messages"],
};

const LINE_PALETTE = ["#5b8bb5", "#6f9e8a", "#b0865b", "#8a7bb0", "#b56b6b", "#5f9ea8", "#a39a5b", "#7f8fa8"];

const DEFAULT_LAYOUT = {
  areas: ["clock plan dep", "weather plan dep", "weather todo dep"],
  columns: "minmax(0, 0.9fr) minmax(0, 1.25fr) minmax(0, 1fr)",
  rows: "auto minmax(0, 1fr) minmax(0, 1.05fr)",
};

const DEFAULTS = {
  max_departures: 8,
  hide_below_minutes: 0,
  walk_minutes: 0,
  add_delay: false,
  group_departures: false,
  departure_style: "calm",
  show_approach: true,
  approach_window: 15,
  approach_count: 2,
  forecast_hours: 6,
  forecast_days: 7,
  weather_gradient: true,
  show_completed: 8,
  spec_separator: ":",
  spec_suggestions: ["2×", "3×", "500 g", "1 kg", "Bio", "groß"],
  show_seconds: false,
  height: "calc(100vh - var(--header-height, 56px) - 16px)",
};

/* --------------------------------------------------------------- helpers */

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const getPath = (obj, path) => {
  if (obj == null || path == null) return undefined;
  return String(path)
    .split(".")
    .reduce((o, k) => (o == null ? undefined : o[k]), obj);
};

const firstDefined = (obj, keys) => {
  for (const k of keys) {
    const v = getPath(obj, k);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

const hashString = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/** Parses delay values like 3, "3", "+3", "0:03:00", "PT3M" into minutes. */
const parseDelay = (v) => {
  if (v == null || v === "") return null;
  if (typeof v === "number") return v;
  const s = String(v).trim();
  if (/^[+-]?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  const hms = s.match(/^(-)?(\d+):(\d{2})(?::(\d{2}))?$/);
  if (hms) {
    const m = +hms[2] * 60 + +hms[3] + (hms[4] ? +hms[4] / 60 : 0);
    return hms[1] ? -m : m;
  }
  const iso = s.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i);
  if (iso) return (+iso[1] || 0) * 60 + (+iso[2] || 0) + (+iso[3] || 0) / 60;
  return null;
};

/** Converts timestamps, ISO strings, "HH:MM" or minute counts to epoch ms. */
const parseTime = (v, now) => {
  if (v == null || v === "") return null;
  if (typeof v === "number") {
    if (v > 1e12) return v;
    if (v > 1e9) return v * 1000;
    return now + v * 60000;
  }
  const s = String(v).trim();
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseTime(parseFloat(s), now);
  const hm = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (hm) {
    const d = new Date(now);
    d.setHours(+hm[1], +hm[2], +(hm[3] || 0), 0);
    let ts = d.getTime();
    if (ts < now - 6 * 3600000) ts += 86400000; // after midnight
    return ts;
  }
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : t;
};

const hexToRgb = (hex) => {
  const m = String(hex).trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

/** Dark text on bright badges (e.g. yellow U4), white text otherwise. */
const badgeTextColor = (bg) => {
  const rgb = hexToRgb(bg);
  if (!rgb) return "#fff";
  const [r, g, b] = rgb.map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? "#1a1a1a" : "#fff";
};

/** iOS-like temperature colour scale. */
const TEMP_STOPS = [
  [-10, [94, 140, 255]],
  [0, [90, 200, 250]],
  [10, [120, 210, 160]],
  [18, [247, 209, 84]],
  [25, [245, 158, 66]],
  [32, [242, 97, 75]],
];
const tempColor = (t) => {
  if (t <= TEMP_STOPS[0][0]) return `rgb(${TEMP_STOPS[0][1]})`;
  for (let i = 1; i < TEMP_STOPS.length; i++) {
    const [t1, c1] = TEMP_STOPS[i];
    const [t0, c0] = TEMP_STOPS[i - 1];
    if (t <= t1) {
      const f = (t - t0) / (t1 - t0);
      return `rgb(${c0.map((c, k) => Math.round(c + (c1[k] - c) * f))})`;
    }
  }
  return `rgb(${TEMP_STOPS[TEMP_STOPS.length - 1][1]})`;
};

/* ---------------------------------------------------- weather icons (SVG) */

const C_SUN = "#FFC93C";
const C_CLOUD = "#EEF2F6";
const C_CLOUD_DARK = "#AEB7C2";
const C_RAIN = "#58B4F5";
const C_MOON = "#E4E9F2";

const svgCloud = (dx = 0, dy = 0, s = 1, fill = C_CLOUD) =>
  `<g transform="translate(${dx} ${dy}) translate(32 40) scale(${s}) translate(-32 -40)" fill="${fill}">
     <circle cx="21" cy="38" r="10"/><circle cx="34" cy="30" r="14"/><circle cx="46" cy="38" r="10"/>
     <rect x="21" y="34" width="25" height="14"/></g>`;
const svgSun = (cx = 32, cy = 32, r = 11) => {
  const rays = [...Array(8)]
    .map((_, i) => {
      const a = (i * Math.PI) / 4;
      const r1 = r + 4;
      const r2 = r + 9;
      return `<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}"/>`;
    })
    .join("");
  return `<g stroke="${C_SUN}" stroke-width="3.4" stroke-linecap="round">${rays}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="${C_SUN}"/>`;
};
const svgMoon = (cx = 32, cy = 32, r = 15) =>
  `<path fill="${C_MOON}" d="M${cx + r * 0.25} ${cy - r} a${r} ${r} 0 1 0 ${r * 0.75} ${r * 1.72} a${r * 0.95} ${r * 0.95} 0 0 1 -${r * 0.75} -${r * 1.72}z"/>`;
const svgDrops = (xs, color = C_RAIN) =>
  `<g stroke="${color}" stroke-width="3.2" stroke-linecap="round">${xs
    .map((x) => `<line x1="${x}" y1="46" x2="${x - 3}" y2="55"/>`)
    .join("")}</g>`;
const svgFlakes = (xs) => `<g fill="#fff">${xs.map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 55 : 49}" r="2.6"/>`).join("")}</g>`;
const svgBolt = () => `<path fill="#FFD43B" d="M33 40 L25 53 H31 L28 62 L39 47 H33 L36 40 Z"/>`;

const weatherSvg = (cond, night = false) => {
  let body;
  const up = (s = 1, fill) => svgCloud(0, -8, s, fill);
  switch (cond) {
    case "sunny":
      body = night ? svgMoon() : svgSun();
      break;
    case "clear-night":
      body = svgMoon();
      break;
    case "partlycloudy":
      body = (night ? svgMoon(40, 22, 11) : svgSun(40, 22, 8)) + svgCloud(-4, 6, 0.9);
      break;
    case "cloudy":
      body = svgCloud(8, -8, 0.72, C_CLOUD_DARK) + svgCloud(-3, 4, 0.92);
      break;
    case "rainy":
      body = up() + svgDrops([24, 33, 42]);
      break;
    case "pouring":
      body = up(1, "#C8D0DA") + svgDrops([20, 27, 34, 41, 48]);
      break;
    case "snowy":
      body = up() + svgFlakes([22, 32, 42]);
      break;
    case "snowy-rainy":
      body = up() + svgDrops([24, 40]) + svgFlakes([32]);
      break;
    case "hail":
      body = up() + `<g fill="#DCE6F2"><circle cx="24" cy="51" r="3.2"/><circle cx="34" cy="56" r="3.2"/><circle cx="43" cy="50" r="3.2"/></g>`;
      break;
    case "lightning":
      body = up(1, "#C8D0DA") + svgBolt();
      break;
    case "lightning-rainy":
      body = up(1, "#C8D0DA") + svgBolt() + svgDrops([20, 46]);
      break;
    case "fog":
      body =
        up(1, C_CLOUD_DARK) +
        `<g stroke="${C_CLOUD}" stroke-width="3.2" stroke-linecap="round"><line x1="14" y1="47" x2="50" y2="47"/><line x1="20" y1="54" x2="46" y2="54"/></g>`;
      break;
    case "windy":
    case "windy-variant":
      body =
        (cond === "windy-variant" ? svgCloud(4, -12, 0.75) : "") +
        `<g fill="none" stroke="${C_CLOUD}" stroke-width="3.4" stroke-linecap="round">
           <path d="M8 36 H40 a6 6 0 1 0 -6 -6"/><path d="M8 44 H48 a6 6 0 1 1 -6 6"/><path d="M14 28 H26"/></g>`;
      break;
    case "exceptional":
      body = `<path fill="#F5A524" d="M32 8 L58 54 H6 Z"/><rect x="29.5" y="24" width="5" height="16" rx="2.5" fill="#1b1b1b"/><circle cx="32" cy="46" r="3" fill="#1b1b1b"/>`;
      break;
    default:
      body = svgCloud();
  }
  return `<svg viewBox="0 0 64 64" aria-hidden="true">${body}</svg>`;
};

const WEATHER_GRADIENTS = {
  day_clear: ["#2c5f8f", "#1b3a5c"],
  day_cloudy: ["#3a4654", "#242c36"],
  day_rain: ["#2e3d4f", "#1b2430"],
  day_snow: ["#46525f", "#2a323c"],
  night_clear: ["#16213a", "#0c1222"],
  night_cloudy: ["#1f2632", "#11161e"],
};
const gradientFor = (cond, night) => {
  const group = ["sunny", "clear-night", "partlycloudy", "windy"].includes(cond)
    ? "clear"
    : ["rainy", "pouring", "lightning", "lightning-rainy", "hail", "exceptional"].includes(cond)
      ? "rain"
      : ["snowy", "snowy-rainy"].includes(cond)
        ? "snow"
        : "cloudy";
  const key = night ? (group === "clear" ? "night_clear" : "night_cloudy") : `day_${group}`;
  return WEATHER_GRADIENTS[key];
};

/* ----------------------------------------------------------------- style */

const STYLE = `
  :host {
    --idc-bg: #0e1115;
    --idc-panel: #151a20;
    --idc-panel-2: #1c2229;
    --idc-border: rgba(255, 255, 255, 0.055);
    --idc-text: #e4e7eb;
    --idc-muted: #8a939e;
    --idc-faint: #5a626c;
    --idc-accent: #7fa6c9;
    --idc-warn: #d6ad74;
    --idc-bad: #d27c74;
    --idc-good: #84b49b;
    --idc-radius: 20px;
    --idc-amber: #f2a93b;
    display: block;
  }
  ha-card {
    display: block;
    position: relative;
    height: var(--idc-height);
    min-height: 600px;
    box-sizing: border-box;
    background: var(--idc-bg);
    color: var(--idc-text);
    border: none;
    border-radius: var(--idc-radius);
    padding: 16px;
    overflow: hidden;
    font-family: var(--idc-font, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif);
    container-type: inline-size;
    -webkit-font-smoothing: antialiased;
  }
  .grid {
    height: 100%;
    display: grid;
    grid-template-columns: var(--idc-columns);
    grid-template-rows: var(--idc-rows);
    grid-template-areas: var(--idc-areas);
    gap: 14px;
  }
  .panel {
    background: var(--idc-panel);
    border: 1px solid var(--idc-border);
    border-radius: calc(var(--idc-radius) - 4px);
    padding: 18px 20px;
    box-sizing: border-box;
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .panel[hidden] { display: none; }
  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
    color: var(--idc-muted);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    flex: none;
  }
  .panel-head ha-icon { --mdc-icon-size: 18px; color: var(--idc-faint); }
  .panel-head .title { display: flex; align-items: center; gap: 8px; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .panel-head .meta { font-weight: 500; letter-spacing: 0.02em; text-transform: none; color: var(--idc-faint); white-space: nowrap; }
  .msg { color: var(--idc-faint); font-size: 15px; padding: 8px 0; }
  .msg.error { color: var(--idc-bad); }
  .scroll { overflow-y: auto; min-height: 0; flex: 1; margin: 0 -6px; padding: 0 6px; scrollbar-width: none; }
  .scroll::-webkit-scrollbar { display: none; }

  /* ---------- clock */
  .clock { grid-area: clock; justify-content: center; padding: 16px 22px 18px; }
  .time { font-size: 86px; line-height: 0.95; font-weight: 200; letter-spacing: -0.035em; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .time .sec { font-size: 30px; color: var(--idc-faint); margin-left: 6px; letter-spacing: 0; }
  .date { margin-top: 8px; font-size: 18px; color: var(--idc-muted); }

  /* ---------- weather (iOS style) */
  .weather { grid-area: weather; padding: 16px 16px 14px; color: #fff; border-color: rgba(255,255,255,0.07); }
  .weather.grad { background: linear-gradient(180deg, var(--w-a), var(--w-b)); }
  .w-top { display: flex; justify-content: space-between; align-items: flex-start; padding: 0 4px; }
  .w-loc { font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .w-temp { font-size: 54px; font-weight: 250; line-height: 1.02; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .w-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; font-size: 14px; font-weight: 500; min-width: 0; }
  .w-right svg { width: 34px; height: 34px; margin-bottom: 2px; }
  .w-right .c { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  .w-mod { background: rgba(255,255,255,0.075); border-radius: 14px; padding: 9px 12px 10px; margin-top: 10px; }
  .w-mod-h { font-size: 11.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255,255,255,0.55); padding-bottom: 7px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 6px; }
  .w-hours { display: grid; grid-template-columns: repeat(var(--n, 6), minmax(0, 1fr)); text-align: center; }
  .w-hour { display: flex; flex-direction: column; align-items: center; gap: 1px; font-size: 13px; font-weight: 500; }
  .w-hour .h { color: rgba(255,255,255,0.75); font-size: 12.5px; }
  .w-hour svg { width: 30px; height: 30px; margin: 2px 0; }
  .w-hour .p, .w-day .p { color: #7cc4ff; font-size: 10.5px; font-weight: 600; line-height: 1; min-height: 10px; }
  .w-hour .t { font-variant-numeric: tabular-nums; }
  .w-days { display: flex; flex-direction: column; }
  .w-day { display: grid; grid-template-columns: 38px 30px 30px minmax(0, 1fr) 30px; align-items: center; gap: 6px; height: 34px; font-size: 14.5px; font-weight: 500; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .w-day:last-child { border-bottom: none; }
  .w-day .ic { display: flex; flex-direction: column; align-items: center; }
  .w-day svg { width: 24px; height: 24px; }
  .w-day .lo { color: rgba(255,255,255,0.55); text-align: right; font-variant-numeric: tabular-nums; }
  .w-day .hi { text-align: right; font-variant-numeric: tabular-nums; }
  .bar { position: relative; height: 4px; border-radius: 2px; background: rgba(0,0,0,0.25); }
  .bar i { position: absolute; top: 0; bottom: 0; border-radius: 2px; }
  .bar b { position: absolute; top: -2px; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 1.5px rgba(0,0,0,0.35); }

  /* ---------- floor plan */
  .plan { grid-area: plan; }
  .plan-body { flex: 1; min-height: 0; position: relative; display: flex; align-items: center; justify-content: center; }
  .plan-wrap { position: relative; }
  .plan-wrap img { width: 100%; height: 100%; display: block; user-select: none; -webkit-user-drag: none; }
  .plan-wrap img.invert { filter: invert(0.92) hue-rotate(180deg) brightness(0.9) contrast(0.9); }
  .room { position: absolute; border-radius: 10px; cursor: pointer; -webkit-tap-highlight-color: transparent; transition: background 0.4s, box-shadow 0.4s; }
  .room.on { background: radial-gradient(ellipse at center, rgba(255, 199, 120, 0.30), rgba(255, 199, 120, 0.08) 70%); box-shadow: inset 0 0 0 1px rgba(255, 199, 120, 0.25); }
  .room .rl { position: absolute; left: 8px; bottom: 6px; font-size: 12px; color: var(--idc-muted); display: flex; align-items: center; gap: 4px; }
  .room.on .rl { color: #ffcf8a; }
  .room ha-icon { --mdc-icon-size: 16px; }
  .plan-ph { border: 1.5px dashed rgba(255,255,255,0.1); border-radius: 14px; width: 100%; height: 100%; display: grid; place-items: center; text-align: center; color: var(--idc-faint); font-size: 14px; padding: 20px; box-sizing: border-box; }
  .plan-ph ha-icon { --mdc-icon-size: 40px; display: block; margin: 0 auto 10px; opacity: 0.6; }

  /* ---------- shopping list */
  .todo { grid-area: todo; }
  .add { display: flex; gap: 8px; margin-bottom: 12px; flex: none; }
  .add input, .sheet input {
    flex: 1; min-width: 0; height: 46px; padding: 0 15px; border-radius: 13px;
    border: 1px solid var(--idc-border); background: var(--idc-panel-2); color: var(--idc-text);
    font: inherit; font-size: 17px; outline: none; -webkit-appearance: none; box-sizing: border-box;
  }
  .add input::placeholder, .sheet input::placeholder { color: var(--idc-faint); }
  .add input:focus, .sheet input:focus { border-color: rgba(127, 166, 201, 0.5); }
  .add button {
    width: 46px; height: 46px; flex: none; border: none; border-radius: 13px;
    background: rgba(127, 166, 201, 0.16); color: var(--idc-accent); display: grid; place-items: center; cursor: pointer;
  }
  .add button:active { background: rgba(127, 166, 201, 0.28); }
  .add button ha-icon { --mdc-icon-size: 24px; }
  .items { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 8px; }
  .item {
    position: relative; background: var(--idc-panel-2); border: 1px solid var(--idc-border); border-radius: 13px;
    padding: 10px 30px 10px 12px; min-height: 54px; box-sizing: border-box; display: flex; flex-direction: column;
    justify-content: center; cursor: pointer; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent; transition: opacity 0.2s, transform 0.1s;
  }
  .item:active { transform: scale(0.97); }
  .item.pending { opacity: 0.35; }
  .item .n { font-size: 15.5px; line-height: 1.25; overflow-wrap: anywhere; }
  .item .s { font-size: 12.5px; color: var(--idc-accent); margin-top: 3px; overflow-wrap: anywhere; }
  .item .e {
    position: absolute; top: 0; right: 0; width: 34px; height: 34px; display: grid; place-items: center;
    color: var(--idc-faint); border-radius: 0 13px 0 13px;
  }
  .item .e ha-icon { --mdc-icon-size: 16px; }
  .recent-h { margin: 16px 0 8px; font-size: 11.5px; color: var(--idc-faint); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    border: 1px solid var(--idc-border); background: transparent; color: var(--idc-muted); border-radius: 999px;
    padding: 7px 12px; font: inherit; font-size: 14px; cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .chip:active, .chip.sel { background: var(--idc-panel-2); color: var(--idc-text); }

  /* ---------- edit sheet */
  .overlay {
    position: absolute; inset: 0; background: rgba(5, 7, 10, 0.6); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    display: grid; place-items: start center; padding-top: 48px; z-index: 10; border-radius: var(--idc-radius);
  }
  .overlay[hidden] { display: none; }
  .sheet {
    width: min(440px, calc(100% - 32px)); background: #1a2027; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 22px; box-sizing: border-box; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .sheet h3 { margin: 0 0 16px; font-size: 18px; font-weight: 600; }
  .sheet label { display: block; font-size: 12px; color: var(--idc-muted); letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600; margin: 12px 0 6px; }
  .sheet input { width: 100%; }
  .sheet .chips { margin-top: 10px; }
  .sheet .btns { display: flex; gap: 8px; margin-top: 22px; }
  .sheet .btns .sp { flex: 1; }
  .btn {
    height: 44px; padding: 0 16px; border-radius: 12px; border: none; font: inherit; font-size: 15px; font-weight: 600;
    cursor: pointer; background: var(--idc-panel-2); color: var(--idc-text);
  }
  .btn.primary { background: var(--idc-accent); color: #0e1115; }
  .btn.good { background: rgba(132, 180, 155, 0.18); color: var(--idc-good); }
  .btn.danger { background: rgba(210, 124, 116, 0.14); color: var(--idc-bad); }

  /* ---------- departures */
  .dep { grid-area: dep; }
  .rows { display: flex; flex-direction: column; }
  .group-h { font-size: 11.5px; color: var(--idc-faint); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; margin: 12px 0 2px; }
  .group-h:first-child { margin-top: 0; }
  .row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--idc-border); }
  .row:last-child { border-bottom: none; }
  .badge {
    min-width: 40px; height: 28px; padding: 0 7px; box-sizing: border-box; border-radius: 7px;
    display: grid; place-items: center; font-weight: 700; font-size: 15px; letter-spacing: 0.01em; flex: none;
  }
  .dest { font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12.5px; color: var(--idc-faint); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub .late { color: var(--idc-warn); }
  .sub .ontime { color: var(--idc-good); }
  .sub .rt { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--idc-good); margin-right: 5px; vertical-align: 1px; }
  .sub .al { color: var(--idc-warn); }
  .when { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .when .m { font-size: 23px; font-weight: 300; }
  .when .m small { font-size: 13px; color: var(--idc-muted); margin-left: 2px; }
  .when .m.soon { color: var(--idc-accent); }
  .row.cancelled .dest, .row.cancelled .when .m { text-decoration: line-through; color: var(--idc-faint); }
  .row.cancelled .sub .x { color: var(--idc-bad); }

  /* approach strip */
  .appr { flex: none; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--idc-border); display: flex; flex-direction: column; gap: 12px; }
  .appr-h { font-size: 11.5px; color: var(--idc-faint); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
  .ap-top { display: flex; align-items: center; gap: 8px; font-size: 13.5px; margin-bottom: 8px; }
  .ap-top .badge { min-width: 32px; height: 22px; font-size: 12.5px; border-radius: 5px; }
  .ap-top .d { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--idc-muted); }
  .ap-top .w { font-size: 12.5px; white-space: nowrap; }
  .ap-top .w.go { color: var(--idc-good); }
  .ap-top .w.late { color: var(--idc-bad); }
  .ap-top .w.wait { color: var(--idc-faint); }
  .track { position: relative; height: 18px; margin: 0 9px 0 4px; }
  .track .rail { position: absolute; left: 0; right: 0; top: 8px; height: 2px; background: rgba(255,255,255,0.12); border-radius: 1px; }
  .track .tick { position: absolute; top: 5px; width: 1px; height: 8px; background: rgba(255,255,255,0.14); }
  .track .walk { position: absolute; top: 1px; width: 2px; height: 16px; margin-left: -1px; border-radius: 1px; background: var(--idc-good); opacity: 0.7; }
  .track .st { position: absolute; right: -9px; top: 0; width: 18px; height: 18px; border-radius: 4px; background: #115D91; color: #fff; font-size: 12px; font-weight: 800; display: grid; place-items: center; }
  .track .tr { position: absolute; top: 3px; height: 12px; width: 26px; margin-left: -26px; border-radius: 6px 3px 3px 6px; transition: left 1s linear; box-shadow: 0 0 10px rgba(0,0,0,0.4); }
  .track .tr.arr { animation: idc-pulse 1.6s ease-in-out infinite; }
  @keyframes idc-pulse { 50% { opacity: 0.45; } }

  /* Berlin board style */
  .dep.berlin {
    background-color: #0a0b0c;
    background-image: radial-gradient(rgba(255,255,255,0.028) 1px, transparent 1.3px);
    background-size: 4px 4px;
    font-family: "DIN Alternate", "DIN Condensed", "Roboto Condensed", "Arial Narrow", var(--idc-font, sans-serif);
  }
  .berlin .panel-head { color: #fff; font-size: 15px; letter-spacing: 0.02em; text-transform: none; font-weight: 700; }
  .berlin .panel-head .meta { color: var(--idc-amber); font-size: 18px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .berlin .u-sign { width: 24px; height: 24px; border-radius: 4px; background: #115D91; color: #fff; font-weight: 800; font-size: 17px; display: grid; place-items: center; flex: none; font-family: Arial, sans-serif; }
  .berlin .cols { display: grid; grid-template-columns: 52px minmax(0, 1fr) auto; gap: 12px; font-size: 11px; color: rgba(242,169,59,0.5); letter-spacing: 0.08em; text-transform: uppercase; padding-bottom: 6px; border-bottom: 1px solid rgba(242,169,59,0.18); flex: none; }
  .berlin .row { border-bottom-color: rgba(242,169,59,0.1); grid-template-columns: 52px minmax(0, 1fr) auto; }
  .berlin .badge { border-radius: 4px; font-family: Arial, sans-serif; font-size: 15px; min-width: 44px; justify-self: start; }
  .berlin .dest { color: var(--idc-amber); font-size: 19px; font-weight: 600; letter-spacing: 0.01em; text-shadow: 0 0 8px rgba(242,169,59,0.25); }
  .berlin .sub { color: rgba(242,169,59,0.5); font-size: 13px; }
  .berlin .sub .late { color: #ff7a59; }
  .berlin .when .m { color: var(--idc-amber); font-weight: 600; font-size: 25px; text-shadow: 0 0 8px rgba(242,169,59,0.25); }
  .berlin .when .m small { color: rgba(242,169,59,0.6); }
  .berlin .when .m.soon { color: #ffd27a; }
  .berlin .row.cancelled .dest, .berlin .row.cancelled .when .m { color: rgba(242,169,59,0.35); text-shadow: none; }
  .berlin .appr { border-top-color: rgba(242,169,59,0.18); }
  .berlin .appr-h { color: rgba(242,169,59,0.5); }
  .berlin .ap-top .d { color: rgba(242,169,59,0.8); }
  .berlin .track .rail { background: rgba(242,169,59,0.2); }
  .berlin .track .tick { background: rgba(242,169,59,0.22); }

  /* ---------- narrow layouts (portrait / phone) */
  @container (max-width: 860px) {
    .grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto minmax(320px, 1fr) minmax(320px, 1fr);
      grid-template-areas: "clock weather" "plan weather" "plan dep" "todo dep";
    }
  }
  @container (max-width: 560px) {
    .grid { grid-template-columns: 1fr; grid-template-rows: none; grid-auto-rows: auto; grid-template-areas: "clock" "weather" "dep" "todo" "plan"; height: auto; }
    .time { font-size: 64px; }
  }
`;

/* ------------------------------------------------------------------ card */

class IpadDashboardCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._subs = {};
    this._subKeys = {};
    this._items = null;
    this._forecast = {};
    this._pending = new Set();
    this._last = {};
  }

  static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {});
    const todo = ids.filter((e) => e.startsWith("todo."));
    return {
      weather_entity: ids.find((e) => e.startsWith("weather.")) || "",
      todo_entity: todo.find((e) => e.includes("bring")) || todo[0] || "",
      departure_entities: [],
    };
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    const deps = config.departure_entities ?? (config.departure_entity ? [config.departure_entity] : []);
    if (!Array.isArray(deps)) throw new Error("departure_entities must be a list");
    this._config = { ...DEFAULTS, ...config };
    this._depConf = deps.map((d) => (typeof d === "string" ? { entity: d } : d)).filter((d) => d && d.entity);
    this._last = {};
    this._built = false;
    if (this._hass) this._update(true);
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    this._update(first);
  }

  get hass() {
    return this._hass;
  }

  getCardSize() {
    return 14;
  }

  getGridOptions() {
    return { columns: "full", rows: "auto", min_columns: 12 };
  }

  connectedCallback() {
    this._timer = setInterval(() => this._tick(), 1000);
    if (this._hass && this._config) this._update(true);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    this._resizeObs?.disconnect();
    for (const k of Object.keys(this._subs)) this._unsubscribe(k);
  }

  /* ---------- language / formatting */

  get _lang() {
    const l = (this._hass?.locale?.language || this._hass?.language || navigator.language || "de").toLowerCase();
    return l.split("-")[0];
  }
  _t(key, ...args) {
    const s = (STRINGS[this._lang] || STRINGS.en)[key] ?? STRINGS.en[key] ?? key;
    return typeof s === "function" ? s(...args) : s;
  }
  get _timeZone() {
    const loc = this._hass?.locale;
    if (loc?.time_zone === "server" && this._hass?.config?.time_zone) return this._hass.config.time_zone;
    return undefined;
  }
  get _hour12() {
    const tf = this._hass?.locale?.time_format;
    if (tf === "12") return true;
    if (tf === "24") return false;
    return undefined;
  }
  _fmt(ts, opts) {
    try {
      return new Intl.DateTimeFormat(this._hass?.locale?.language || this._lang, { timeZone: this._timeZone, ...opts }).format(new Date(ts));
    } catch (e) {
      return new Date(ts).toLocaleString();
    }
  }
  _fmtTime(ts) {
    return this._fmt(ts, { hour: "2-digit", minute: "2-digit", hour12: this._hour12 });
  }
  _dayKey(ts) {
    return this._fmt(ts, { year: "numeric", month: "2-digit", day: "2-digit" });
  }

  /* ---------- skeleton */

  _layout() {
    const l = { ...DEFAULT_LAYOUT, ...(this._config.layout || {}) };
    const areas = Array.isArray(l.areas) ? l.areas : String(l.areas).split("\n");
    return {
      areas: areas.map((a) => `"${String(a).replace(/"/g, "").trim()}"`).join(" "),
      names: new Set(areas.join(" ").split(/\s+/).filter(Boolean)),
      columns: l.columns,
      rows: l.rows,
    };
  }

  _build() {
    const c = this._config;
    const berlin = c.departure_style === "berlin";
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card>
        <div class="grid">
          <section class="panel clock" data-area="clock"><div class="time" id="time"></div><div class="date" id="date"></div></section>
          <section class="panel weather" data-area="weather" id="weather"></section>
          <section class="panel plan" data-area="plan">
            <div class="panel-head"><span class="title"><ha-icon icon="mdi:floor-plan"></ha-icon><span id="plan-title"></span></span><span class="meta" id="plan-meta"></span></div>
            <div class="plan-body" id="plan-body"></div>
          </section>
          <section class="panel todo" data-area="todo">
            <div class="panel-head">
              <span class="title"><ha-icon icon="mdi:cart-outline"></ha-icon><span id="todo-title"></span></span>
              <span class="meta" id="todo-count"></span>
            </div>
            <form class="add" id="add-form" autocomplete="off">
              <input id="add-input" type="text" enterkeyhint="done" autocapitalize="sentences" autocorrect="on" />
              <button type="submit" id="add-btn"><ha-icon icon="mdi:plus"></ha-icon></button>
            </form>
            <div class="scroll" id="todo-body"></div>
          </section>
          <section class="panel dep${berlin ? " berlin" : ""}" data-area="dep">
            <div class="panel-head">
              <span class="title">${
                berlin ? `<span class="u-sign">U</span>` : `<ha-icon icon="${esc(c.departures_icon || "mdi:subway-variant")}"></ha-icon>`
              }<span id="dep-title"></span></span>
              <span class="meta" id="dep-meta"></span>
            </div>
            ${berlin ? `<div class="cols"><span id="col-line"></span><span id="col-dest"></span><span id="col-dep"></span></div>` : ""}
            <div class="scroll" id="dep-body"></div>
            <div class="appr" id="dep-appr" hidden></div>
          </section>
        </div>
        <div class="overlay" id="overlay" hidden>
          <form class="sheet" id="sheet" autocomplete="off">
            <h3 id="sh-title"></h3>
            <label for="sh-name" id="sh-name-l"></label>
            <input id="sh-name" type="text" autocapitalize="sentences" />
            <div id="sh-spec-wrap">
              <label for="sh-spec" id="sh-spec-l"></label>
              <input id="sh-spec" type="text" />
              <div class="chips" id="sh-chips"></div>
            </div>
            <div class="btns">
              <button type="button" class="btn danger" id="sh-del"></button>
              <span class="sp"></span>
              <button type="button" class="btn good" id="sh-done"></button>
              <button type="submit" class="btn primary" id="sh-save"></button>
            </div>
          </form>
        </div>
      </ha-card>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._el = {
      card: this.shadowRoot.querySelector("ha-card"),
      time: $("time"),
      date: $("date"),
      weather: $("weather"),
      planTitle: $("plan-title"),
      planMeta: $("plan-meta"),
      planBody: $("plan-body"),
      todoTitle: $("todo-title"),
      todoCount: $("todo-count"),
      todoBody: $("todo-body"),
      form: $("add-form"),
      input: $("add-input"),
      addBtn: $("add-btn"),
      depTitle: $("dep-title"),
      depMeta: $("dep-meta"),
      depBody: $("dep-body"),
      depAppr: $("dep-appr"),
      overlay: $("overlay"),
      sheet: $("sheet"),
    };

    const card = this._el.card;
    const layout = this._layout();
    card.style.setProperty("--idc-height", c.height);
    card.style.setProperty("--idc-areas", layout.areas);
    card.style.setProperty("--idc-columns", layout.columns);
    card.style.setProperty("--idc-rows", layout.rows);
    if (c.background) card.style.setProperty("--idc-bg", c.background);
    for (const sec of this.shadowRoot.querySelectorAll("[data-area]")) sec.hidden = !layout.names.has(sec.dataset.area);

    if (berlin) {
      $("col-line").textContent = this._t("line");
      $("col-dest").textContent = this._t("destination");
      $("col-dep").textContent = this._t("departure");
    }

    this._el.form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      this._addItem();
    });
    // keep HA's global keyboard shortcuts (e, c, a, m …) from firing while typing
    for (const input of this.shadowRoot.querySelectorAll("input")) {
      for (const type of ["keydown", "keyup", "keypress"]) input.addEventListener(type, (ev) => ev.stopPropagation());
    }
    this._bindPress(this._el.todoBody, "[data-uid],[data-reopen]", (el, hold, ev) => this._onTodoPress(el, hold, ev));
    this._bindPress(this._el.planBody, "[data-room]", (el, hold) => this._onRoomPress(el, hold));
    this._bindSheet();

    this._resizeObs?.disconnect();
    this._resizeObs = new ResizeObserver(() => this._fitPlan());
    this._resizeObs.observe(this._el.planBody);
    this._built = true;
  }

  /** Tap / long-press handling that also works on touch devices. */
  _bindPress(container, selector, handler) {
    let timer = null;
    let start = null;
    let held = false;
    const clear = () => {
      clearTimeout(timer);
      timer = null;
    };
    container.addEventListener("pointerdown", (ev) => {
      const el = ev.target.closest(selector);
      if (!el) return;
      held = false;
      start = { x: ev.clientX, y: ev.clientY, el };
      clear();
      timer = setTimeout(() => {
        held = true;
        timer = null;
        handler(el, true, ev);
      }, 520);
    });
    container.addEventListener("pointermove", (ev) => {
      if (start && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 12) clear();
    });
    container.addEventListener("pointercancel", clear);
    container.addEventListener("pointerleave", clear);
    container.addEventListener("contextmenu", (ev) => {
      if (ev.target.closest(selector)) ev.preventDefault();
    });
    container.addEventListener("click", (ev) => {
      const el = ev.target.closest(selector);
      clear();
      if (!el) return;
      if (held) {
        held = false;
        return;
      }
      handler(el, false, ev);
    });
  }

  _update(force) {
    if (!this._config || !this._hass) return;
    if (!this._built) {
      this._build();
      force = true;
    }
    this._ensureSubscriptions();

    const st = (id) => (id ? this._hass.states[id] : undefined);
    const w = st(this._config.weather_entity);
    const sun = st("sun.sun");
    if (force || w !== this._last.weather || sun !== this._last.sun) {
      this._last.weather = w;
      this._last.sun = sun;
      this._renderWeather();
    }
    const t = st(this._config.todo_entity);
    if (force || t !== this._last.todo) {
      this._last.todo = t;
      this._renderTodo();
    }
    const depStates = this._depConf.map((d) => st(d.entity));
    if (force || !this._last.deps || depStates.some((s, i) => s !== this._last.deps[i])) {
      this._last.deps = depStates;
      this._renderDepartures();
    }
    const rooms = this._config.floorplan?.rooms || [];
    const roomStates = rooms.map((r) => st(r.entity));
    if (force || !this._last.rooms || roomStates.some((s, i) => s !== this._last.rooms[i])) {
      this._last.rooms = roomStates;
      this._renderPlan(force);
    }
    if (force) this._tick(true);
  }

  /* ---------- subscriptions */

  _ensureSubscriptions() {
    const conn = this._hass?.connection;
    if (!conn || !this.isConnected) return;

    const wId = this._config.weather_entity;
    const wState = wId && this._hass.states[wId];
    const sf = wState?.attributes.supported_features || 0;
    const has = { daily: !!(sf & 1), hourly: !!(sf & 2), twice_daily: !!(sf & 4) };
    const wantHourly = has.hourly && +this._config.forecast_hours > 0;
    const dailyType = has.daily ? "daily" : has.twice_daily ? "twice_daily" : null;
    const wantDaily = dailyType && +this._config.forecast_days > 0;

    for (const [key, type, want] of [
      ["hourly", "hourly", wantHourly],
      ["daily", dailyType, wantDaily],
    ]) {
      this._syncSub(
        `fc_${key}`,
        want ? `${wId}|${type}` : null,
        { type: "weather/subscribe_forecast", forecast_type: type, entity_id: wId },
        (msg) => {
          this._forecast[key] = { type, list: msg.forecast || [] };
          this._renderWeather();
        },
        () => delete this._forecast[key]
      );
    }

    const tId = this._config.todo_entity;
    const tExists = tId && this._hass.states[tId];
    this._syncSub(
      "todo",
      tExists ? tId : null,
      { type: "todo/item/subscribe", entity_id: tId },
      (msg) => {
        this._items = msg.items || [];
        this._pending.clear();
        this._renderTodo();
      },
      () => (this._items = null)
    );
  }

  _syncSub(key, desired, message, cb, reset) {
    if (this._subKeys[key] === desired && (desired === null || this._subs[key])) return;
    this._unsubscribe(key);
    reset();
    this._subKeys[key] = desired;
    if (!desired) return;
    this._subs[key] = this._hass.connection.subscribeMessage(cb, message).catch((err) => {
      console.warn(`[${CARD_TAG}] subscription ${key} failed`, err);
      return null;
    });
  }

  _unsubscribe(key) {
    const p = this._subs[key];
    delete this._subs[key];
    delete this._subKeys[key];
    if (p) p.then((unsub) => unsub && unsub()).catch(() => {});
  }

  /* ---------- clock */

  _tick(force) {
    if (!this._built || !this._hass) return;
    const now = Date.now();
    const time = this._fmtTime(now);
    const sec = this._config.show_seconds ? this._fmt(now, { second: "2-digit" }).padStart(2, "0") : "";
    const key = time + sec;
    if (force || key !== this._last.clock) {
      const minuteChanged = time !== this._last.clockMin;
      this._last.clock = key;
      this._last.clockMin = time;
      this._el.time.innerHTML = `${esc(time)}${sec ? `<span class="sec">${esc(sec)}</span>` : ""}`;
      this._el.date.textContent = this._fmt(now, { weekday: "long", day: "numeric", month: "long" });
      if (this._config.departure_style === "berlin") this._el.depMeta.textContent = time;
      if (minuteChanged && !force) this._renderWeather();
    }
    // refresh countdowns every 15 seconds
    if (!this._last.depTick || now - this._last.depTick > 15000) {
      this._last.depTick = now;
      if (!force) this._renderDepartures();
    }
  }

  /* ---------- weather */

  _condLabel(cond, stateObj) {
    const dict = CONDITIONS[this._lang];
    if (dict?.[cond]) return dict[cond];
    if (stateObj && this._hass.formatEntityState) return this._hass.formatEntityState(stateObj);
    return CONDITIONS.en[cond] || cond || "";
  }

  /** Night detection for a timestamp using sun.sun (falls back to 6–20 h). */
  _isNight(ts) {
    const sun = this._hass.states["sun.sun"];
    const tod = (t) => {
      const d = new Date(t);
      return d.getHours() * 60 + d.getMinutes();
    };
    const m = tod(ts);
    const rise = sun?.attributes.next_rising ? tod(Date.parse(sun.attributes.next_rising)) : 6 * 60;
    const set = sun?.attributes.next_setting ? tod(Date.parse(sun.attributes.next_setting)) : 20 * 60;
    return m < rise || m >= set;
  }

  _dailyList() {
    const daily = this._forecast.daily;
    if (daily?.list.length) {
      if (daily.type !== "twice_daily") return daily.list;
      // merge day + night halves
      const byDay = new Map();
      for (const f of daily.list) {
        const k = this._dayKey(Date.parse(f.datetime));
        const d = byDay.get(k) || { datetime: f.datetime, temperature: -Infinity, templow: Infinity, precipitation_probability: 0 };
        d.temperature = Math.max(d.temperature, f.temperature ?? -Infinity);
        d.templow = Math.min(d.templow, f.templow ?? f.temperature ?? Infinity);
        d.precipitation_probability = Math.max(d.precipitation_probability, f.precipitation_probability || 0);
        if (f.is_daytime !== false || !d.condition) d.condition = f.condition;
        byDay.set(k, d);
      }
      return [...byDay.values()];
    }
    // derive days from the hourly forecast
    const hourly = this._forecast.hourly?.list || [];
    const byDay = new Map();
    for (const f of hourly) {
      const ts = Date.parse(f.datetime);
      const k = this._dayKey(ts);
      const d = byDay.get(k) || { datetime: f.datetime, temperature: -Infinity, templow: Infinity, precipitation_probability: 0, _c: {} };
      d.temperature = Math.max(d.temperature, f.temperature);
      d.templow = Math.min(d.templow, f.temperature);
      d.precipitation_probability = Math.max(d.precipitation_probability, f.precipitation_probability || 0);
      if (!this._isNight(ts)) d._c[f.condition] = (d._c[f.condition] || 0) + 1;
      byDay.set(k, d);
    }
    return [...byDay.values()].map((d) => ({
      ...d,
      condition: Object.entries(d._c).sort((a, b) => b[1] - a[1])[0]?.[0] || "cloudy",
    }));
  }

  _renderWeather() {
    if (!this._built) return;
    const el = this._el.weather;
    const c = this._config;
    const id = c.weather_entity;
    el.classList.remove("grad");
    const simple = (html) => {
      el.innerHTML = `<div class="panel-head"><span class="title"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${esc(
        c.title_weather || this._t("weather")
      )}</span></div>${html}`;
    };
    if (!id) return simple(`<div class="msg">${this._t("not_configured")}</div>`);
    const s = this._hass.states[id];
    if (!s) return simple(`<div class="msg error">${this._t("not_found")}: ${esc(id)}</div>`);
    if (s.state === "unavailable" || s.state === "unknown")
      return simple(`<div class="msg">${esc(s.attributes.friendly_name || id)} ${this._t("unavailable")}</div>`);

    const a = s.attributes;
    const round = (v) => (v == null || v === "" || !Number.isFinite(+v) ? "–" : Math.round(+v));
    const now = Date.now();
    const sun = this._hass.states["sun.sun"];
    const night = s.state === "clear-night" || (sun ? sun.state === "below_horizon" : this._isNight(now));

    if (c.weather_gradient) {
      const [ga, gb] = gradientFor(s.state, night);
      el.classList.add("grad");
      el.style.setProperty("--w-a", ga);
      el.style.setProperty("--w-b", gb);
    }

    const days = this._dailyList();
    const todayKey = this._dayKey(now);
    const today = days.find((d) => this._dayKey(Date.parse(d.datetime)) === todayKey);
    const hl =
      today && Number.isFinite(today.temperature)
        ? `${this._t("high")}: ${round(today.temperature)}° ${this._t("low")}: ${round(today.templow)}°`
        : "";

    // hourly
    let hoursHtml = "";
    const hourly = (this._forecast.hourly?.list || []).filter((f) => Date.parse(f.datetime) > now - 3600000);
    const nH = Math.max(0, Math.min(+c.forecast_hours || 0, 8));
    if (nH && hourly.length) {
      const list = hourly.slice(0, nH);
      hoursHtml = `<div class="w-mod"><div class="w-mod-h">${this._t("hourly")}</div><div class="w-hours" style="--n:${list.length}">${list
        .map((f, i) => {
          const ts = Date.parse(f.datetime);
          const label = i === 0 && ts <= now ? this._t("now_hour") : this._fmt(ts, { hour: "2-digit", hour12: this._hour12 }).replace(/\s?Uhr$/, "");
          const n = f.is_daytime === false || (f.is_daytime === undefined && this._isNight(ts));
          const pp = f.precipitation_probability;
          return `<div class="w-hour"><span class="h">${esc(label)}</span>${weatherSvg(f.condition, n)}<span class="p">${
            pp >= 20 ? `${round(pp)} %` : ""
          }</span><span class="t">${round(f.temperature)}°</span></div>`;
        })
        .join("")}</div></div>`;
    }

    // daily
    let daysHtml = "";
    const nD = Math.max(0, Math.min(+c.forecast_days || 0, 10));
    const startOfToday = new Date(now).setHours(0, 0, 0, 0);
    const dl = days.filter((d) => Date.parse(d.datetime) >= startOfToday - 3600000).slice(0, nD);
    if (nD && dl.length) {
      const curT = Number.isFinite(+a.temperature) && a.temperature !== null ? +a.temperature : null;
      const lo = Math.min(...dl.map((d) => d.templow).filter(Number.isFinite), curT ?? Infinity);
      const hi = Math.max(...dl.map((d) => d.temperature).filter(Number.isFinite), curT ?? -Infinity);
      const span = Math.max(1, hi - lo);
      daysHtml = `<div class="w-mod"><div class="w-mod-h">${this._t("daily", dl.length)}</div><div class="w-days">${dl
        .map((d) => {
          const ts = Date.parse(d.datetime);
          const isToday = this._dayKey(ts) === todayKey;
          const label = isToday ? this._t("today") : this._fmt(ts, { weekday: "short" }).replace(/\.$/, "");
          const dLo = Number.isFinite(d.templow) ? d.templow : d.temperature;
          const dHi = d.temperature;
          const left = ((dLo - lo) / span) * 100;
          const width = Math.max(4, ((dHi - dLo) / span) * 100);
          const cur =
            isToday && Number.isFinite(+a.temperature) ? `<b style="left:${(((+a.temperature) - lo) / span) * 100}%"></b>` : "";
          const pp = d.precipitation_probability;
          return `<div class="w-day"><span>${esc(label)}</span><span class="ic">${weatherSvg(d.condition, false)}<span class="p">${
            pp >= 20 ? `${round(pp)} %` : ""
          }</span></span><span class="lo">${round(dLo)}°</span><span class="bar"><i style="left:${left}%;width:${width}%;background:linear-gradient(90deg,${tempColor(
            dLo
          )},${tempColor(dHi)})"></i>${cur}</span><span class="hi">${round(dHi)}°</span></div>`;
        })
        .join("")}</div></div>`;
    }

    const loc = c.weather_location || a.friendly_name || "";
    el.innerHTML = `
      <div class="w-top">
        <div style="min-width:0">
          <div class="w-loc">${esc(loc)}</div>
          <div class="w-temp">${round(a.temperature)}°</div>
        </div>
        <div class="w-right">
          ${weatherSvg(s.state, night)}
          <span class="c">${esc(this._condLabel(s.state, s))}</span>
          <span>${esc(hl)}</span>
        </div>
      </div>
      ${hoursHtml}
      ${daysHtml}`;
  }

  /* ---------- floor plan */

  _renderPlan(force) {
    if (!this._built) return;
    const fp = this._config.floorplan || {};
    this._el.planTitle.textContent = fp.title || this._t("floorplan");
    const body = this._el.planBody;
    if (!fp.image) {
      body.innerHTML = `<div class="plan-ph"><div><ha-icon icon="mdi:floor-plan"></ha-icon>${esc(this._t("floorplan_hint"))}</div></div>`;
      return;
    }
    if (force || !body.querySelector(".plan-wrap")) {
      body.innerHTML = `<div class="plan-wrap" id="plan-wrap"><img alt="" src="${esc(fp.image)}" class="${fp.invert ? "invert" : ""}"/><div id="rooms"></div></div>`;
      body.querySelector("img").addEventListener("load", () => this._fitPlan());
    }
    const rooms = fp.rooms || [];
    let onCount = 0;
    body.querySelector("#rooms").innerHTML = rooms
      .map((r, i) => {
        const s = r.entity ? this._hass.states[r.entity] : undefined;
        const on = s && ["on", "open", "playing", "home"].includes(s.state);
        if (on) onCount++;
        const label = r.label === false ? "" : r.name || "";
        return `<div class="room${on ? " on" : ""}" data-room="${i}" style="left:${+r.x || 0}%;top:${+r.y || 0}%;width:${+r.w || 10}%;height:${
          +r.h || 10
        }%">${label || r.icon ? `<span class="rl">${r.icon ? `<ha-icon icon="${esc(r.icon)}"></ha-icon>` : ""}${esc(label)}</span>` : ""}</div>`;
      })
      .join("");
    this._el.planMeta.textContent = rooms.some((r) => r.entity) ? `${onCount} an` : "";
    this._fitPlan();
  }

  _fitPlan() {
    const wrap = this._el?.planBody?.querySelector(".plan-wrap");
    const img = wrap?.querySelector("img");
    if (!wrap || !img || !img.naturalWidth) return;
    const bw = this._el.planBody.clientWidth;
    const bh = this._el.planBody.clientHeight;
    const ar = img.naturalWidth / img.naturalHeight;
    let w = bw;
    let h = w / ar;
    if (h > bh) {
      h = bh;
      w = h * ar;
    }
    wrap.style.width = `${Math.floor(w)}px`;
    wrap.style.height = `${Math.floor(h)}px`;
  }

  _onRoomPress(el, hold) {
    const r = (this._config.floorplan?.rooms || [])[+el.dataset.room];
    if (!r?.entity) return;
    if (hold || r.tap_action === "more-info") {
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: r.entity }, bubbles: true, composed: true }));
    } else {
      this._hass.callService("homeassistant", "toggle", {}, { entity_id: r.entity }).catch((e) => this._notify(e));
    }
  }

  /* ---------- shopping list (todo entity, e.g. Bring!) */

  get _todoSupportsDesc() {
    const s = this._hass.states[this._config.todo_entity];
    return ((s?.attributes.supported_features || 0) & 64) !== 0;
  }

  _renderTodo() {
    if (!this._built) return;
    const id = this._config.todo_entity;
    const s = id && this._hass.states[id];
    this._el.input.placeholder = this._t("add_placeholder");
    this._el.addBtn.title = this._t("add");
    this._el.todoTitle.textContent = this._config.title_todo || s?.attributes.friendly_name || this._t("shopping");
    const body = this._el.todoBody;
    this._el.form.style.display = s ? "" : "none";
    if (!id || !s) {
      this._el.todoCount.textContent = "";
      body.innerHTML = id
        ? `<div class="msg error">${this._t("not_found")}: ${esc(id)}</div>`
        : `<div class="msg">${this._t("not_configured")}</div>`;
      return;
    }
    if (this._items === null) return void (body.innerHTML = "");

    const open = this._items.filter((i) => i.status === "needs_action");
    const done = this._items.filter((i) => i.status === "completed");
    this._el.todoCount.textContent = this._t("items", open.length);

    const itemsHtml = open.length
      ? `<div class="items">${open
          .map(
            (i) => `<div class="item${this._pending.has(i.uid) ? " pending" : ""}" data-uid="${esc(i.uid)}" role="button">
              <span class="n">${esc(i.summary)}</span>${i.description ? `<span class="s">${esc(i.description)}</span>` : ""}
              <span class="e" data-edit="1"><ha-icon icon="mdi:pencil-outline"></ha-icon></span>
            </div>`
          )
          .join("")}</div>`
      : `<div class="msg">${this._t("empty_list")}</div>`;

    const maxRecent = Math.max(0, +this._config.show_completed || 0);
    const seen = new Set(open.map((i) => i.summary.toLowerCase()));
    const recent = done.filter((i) => !seen.has(i.summary.toLowerCase())).slice(0, maxRecent);
    const recentHtml = recent.length
      ? `<div class="recent-h">${this._t("recent")}</div><div class="chips">${recent
          .map((i) => `<button class="chip" data-reopen="${esc(i.uid)}">${esc(i.summary)}</button>`)
          .join("")}</div>`
      : "";

    const scroll = body.scrollTop;
    body.innerHTML = itemsHtml + recentHtml;
    body.scrollTop = scroll;
  }

  _onTodoPress(el, hold, ev) {
    const entity_id = this._config.todo_entity;
    if (el.dataset.reopen) {
      if (hold) return this._openSheet(el.dataset.reopen);
      el.disabled = true;
      this._hass
        .callService("todo", "update_item", { item: el.dataset.reopen, status: "needs_action" }, { entity_id })
        .catch((err) => this._serviceError(err));
      return;
    }
    const uid = el.dataset.uid;
    if (hold || ev?.target?.closest?.("[data-edit]")) return this._openSheet(uid);
    if (this._pending.has(uid)) return;
    this._pending.add(uid);
    el.classList.add("pending");
    this._hass
      .callService("todo", "update_item", { item: uid, status: "completed" }, { entity_id })
      .catch((err) => this._serviceError(err, uid));
  }

  _addItem() {
    const raw = this._el.input.value.trim();
    if (!raw || !this._items) return;
    const entity_id = this._config.todo_entity;

    let summary = raw;
    let description;
    const sep = this._config.spec_separator;
    if (sep && this._todoSupportsDesc && raw.includes(sep)) {
      const idx = raw.indexOf(sep);
      summary = raw.slice(0, idx).trim();
      description = raw.slice(idx + sep.length).trim() || undefined;
    }
    if (!summary) return;

    this._el.input.value = "";
    const lower = summary.toLowerCase();
    const existing = this._items.find((i) => i.summary.toLowerCase() === lower);
    let call;
    if (existing) {
      if (existing.status === "needs_action" && !description) return;
      const data = { item: existing.uid, status: "needs_action" };
      if (description) data.description = description;
      call = this._hass.callService("todo", "update_item", data, { entity_id });
    } else {
      const data = { item: summary };
      if (description) data.description = description;
      call = this._hass.callService("todo", "add_item", data, { entity_id });
    }
    call.catch((err) => {
      this._el.input.value = raw;
      this._serviceError(err);
    });
  }

  /* edit sheet */

  _bindSheet() {
    const $ = (id) => this.shadowRoot.getElementById(id);
    const close = () => this._closeSheet();
    this._el.overlay.addEventListener("click", (ev) => {
      if (ev.target === this._el.overlay) close();
    });
    this._el.sheet.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") close();
    });
    $("sh-chips").addEventListener("click", (ev) => {
      const chip = ev.target.closest("[data-spec]");
      if (!chip) return;
      ev.preventDefault();
      $("sh-spec").value = chip.dataset.spec;
    });
    this._el.sheet.addEventListener("submit", (ev) => {
      ev.preventDefault();
      this._saveSheet();
    });
    $("sh-done").addEventListener("click", () => this._saveSheet("completed"));
    $("sh-del").addEventListener("click", () => {
      const item = this._sheetItem;
      close();
      if (!item) return;
      this._hass
        .callService("todo", "remove_item", { item: item.uid }, { entity_id: this._config.todo_entity })
        .catch((err) => this._serviceError(err));
    });
  }

  _openSheet(uid) {
    const item = this._items?.find((i) => i.uid === uid);
    if (!item) return;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._sheetItem = item;
    $("sh-title").textContent = this._t("edit_item");
    $("sh-name-l").textContent = this._t("item_name");
    $("sh-spec-l").textContent = this._t("item_spec");
    $("sh-del").textContent = this._t("delete");
    $("sh-done").textContent = this._t("done");
    $("sh-save").textContent = this._t("save");
    $("sh-done").hidden = item.status !== "needs_action";
    $("sh-name").value = item.summary;
    $("sh-spec").value = item.description || "";
    $("sh-spec").placeholder = this._t("item_spec_placeholder");
    $("sh-spec-wrap").hidden = !this._todoSupportsDesc;
    const sugg = Array.isArray(this._config.spec_suggestions) ? this._config.spec_suggestions : [];
    $("sh-chips").innerHTML = sugg.map((s) => `<button type="button" class="chip" data-spec="${esc(s)}">${esc(s)}</button>`).join("");
    this._el.overlay.hidden = false;
    setTimeout(() => (this._todoSupportsDesc ? $("sh-spec") : $("sh-name")).focus(), 50);
  }

  _closeSheet() {
    this._el.overlay.hidden = true;
    this._sheetItem = null;
    this.shadowRoot.activeElement?.blur?.();
  }

  _saveSheet(status) {
    const item = this._sheetItem;
    if (!item) return this._closeSheet();
    const $ = (id) => this.shadowRoot.getElementById(id);
    const name = $("sh-name").value.trim();
    const spec = $("sh-spec").value.trim();
    const data = { item: item.uid };
    if (name && name !== item.summary) data.rename = name;
    if (this._todoSupportsDesc && spec !== (item.description || "")) data.description = spec;
    if (status) data.status = status;
    this._closeSheet();
    if (Object.keys(data).length === 1) return;
    this._hass
      .callService("todo", "update_item", data, { entity_id: this._config.todo_entity })
      .catch((err) => this._serviceError(err));
  }

  _serviceError(err, uid) {
    if (uid) this._pending.delete(uid);
    this._renderTodo();
    this._notify(err);
  }

  _notify(err) {
    console.error(`[${CARD_TAG}]`, err);
    this.dispatchEvent(
      new CustomEvent("hass-notification", { detail: { message: err?.message || String(err) }, bubbles: true, composed: true })
    );
  }

  /* ---------- departures */

  _readField(obj, field, conf) {
    const map = { ...(this._config.departure_fields || {}), ...(conf.fields || {}) };
    if (map[field]) return getPath(obj, map[field]);
    return firstDefined(obj, FIELD_CANDIDATES[field]);
  }

  _collectDepartures() {
    const now = Date.now();
    const out = [];
    const errors = [];
    const seen = new Set();
    this._depConf.forEach((conf, idx) => {
      const s = this._hass.states[conf.entity];
      if (!s) return void errors.push(conf.entity);
      const group = conf.name || s.attributes.friendly_name || conf.entity;
      const attrName = conf.attribute || this._config.departures_attribute;
      let list = attrName ? getPath(s.attributes, attrName) : undefined;
      if (!attrName) {
        const key = DEPARTURE_LIST_KEYS.find((k) => Array.isArray(s.attributes[k]));
        list = key
          ? s.attributes[key]
          : Object.values(s.attributes).find((v) => Array.isArray(v) && v.length && typeof v[0] === "object");
      }
      const single = !Array.isArray(list);
      const entries = single ? [{ __state: s.state }] : list;
      for (const raw of entries) {
        if (!raw || typeof raw !== "object") continue;
        const d = this._normalize(raw, s.attributes, conf, now, single);
        if (!d) continue;
        const key = `${d.line}|${d.destination}|${Math.round(d.ts / 60000)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        d.group = group;
        d.groupIdx = idx;
        out.push(d);
      }
    });

    const lineFilter = (this._config.line_filter || []).map((l) => String(l).toLowerCase());
    const destExclude = (this._config.destination_exclude || []).map((l) => String(l).toLowerCase());
    const minMin = +this._config.hide_below_minutes || 0;
    const result = out
      .filter((d) => d.ts >= now - 30000)
      .filter((d) => minMin <= 0 || (d.ts - now) / 60000 >= minMin)
      .filter((d) => !lineFilter.length || lineFilter.includes(d.line.toLowerCase()))
      .filter((d) => !destExclude.some((x) => d.destination.toLowerCase().includes(x)))
      .sort((a, b) => (this._config.group_departures ? a.groupIdx - b.groupIdx : 0) || a.ts - b.ts);
    return { list: result, errors, now };
  }

  /** Reads a field from the departure entry first, then from the sensor attributes. */
  _normalize(raw, attrs, conf, now, single) {
    const read = (f) => this._readField(raw, f, conf) ?? this._readField(attrs, f, conf);
    let line = read("line");
    if (line && typeof line === "object") line = line.name || line.label || line.number || line.symbol || "";
    const destination = read("destination");
    if (single && line == null && destination == null) return null; // e.g. pure delay / helper sensors
    const delay = parseDelay(this._readField(raw, "delay", conf) ?? (single ? attrs.delay : undefined));
    let ts = parseTime(this._readField(raw, "time", conf), now);
    if (ts == null) {
      const m = this._readField(raw, "minutes", conf);
      if (m != null && m !== "" && !Number.isNaN(+m)) ts = now + +m * 60000;
    }
    if (ts == null && raw.__state != null) ts = parseTime(raw.__state, now);
    if (ts == null) return null;
    if ((this._config.add_delay || conf.add_delay) && delay) ts += delay * 60000;
    const cancelled = this._readField(raw, "cancelled", conf);
    const alerts = this._readField(raw, "alerts", conf);
    return {
      line: String(line ?? "").trim() || "•",
      destination: String(destination ?? "").trim(),
      ts,
      delay: delay ?? 0,
      realtime: delay != null || raw.estimated != null,
      platform: this._readField(raw, "platform", conf),
      cancelled: cancelled === true || cancelled === "true" || cancelled === 1,
      alerts: Array.isArray(alerts) ? alerts.length > 0 : !!alerts,
      color: read("color"),
      transport: String(read("transport") || "").toUpperCase(),
    };
  }

  _lineColor(d) {
    const colors = this._config.line_colors || {};
    if (colors[d.line]) return colors[d.line];
    if (d.color) return String(d.color).match(/^[0-9a-f]{6}$/i) ? `#${d.color}` : d.color;
    if (this._config.departure_style === "berlin" || this._config.line_colors_preset === "berlin") {
      if (BERLIN_COLORS[d.line]) return BERLIN_COLORS[d.line];
      if (TRANSPORT_COLORS[d.transport]) return TRANSPORT_COLORS[d.transport];
    }
    return LINE_PALETTE[hashString(d.line) % LINE_PALETTE.length];
  }

  _badge(d) {
    const bg = this._lineColor(d);
    return `<div class="badge" style="background:${esc(bg)};color:${badgeTextColor(bg)}">${esc(d.line)}</div>`;
  }

  _renderDepartures() {
    if (!this._built || !this._hass) return;
    const c = this._config;
    const berlin = c.departure_style === "berlin";
    this._el.depTitle.textContent = c.station_name || c.title_departures || this._t("departures");
    const body = this._el.depBody;
    const appr = this._el.depAppr;
    if (!berlin) this._el.depMeta.textContent = c.station_name ? c.title_departures || "" : "";
    if (!this._depConf.length) {
      appr.hidden = true;
      return void (body.innerHTML = `<div class="msg">${this._t("not_configured")}</div>`);
    }
    const { list, errors, now } = this._collectDepartures();
    const max = Math.max(1, +c.max_departures || 8);
    const errHtml = errors.map((e) => `<div class="msg error">${this._t("not_found")}: ${esc(e)}</div>`).join("");

    if (!list.length) {
      appr.hidden = true;
      return void (body.innerHTML = errHtml + `<div class="msg">${this._t("no_departures")}</div>`);
    }

    let shown;
    if (c.group_departures) {
      const perGroup = {};
      shown = list.filter((d) => (perGroup[d.groupIdx] = (perGroup[d.groupIdx] || 0) + 1) <= max);
    } else shown = list.slice(0, max);

    let html = "";
    let lastGroup = null;
    for (const d of shown) {
      if (c.group_departures && d.groupIdx !== lastGroup) {
        lastGroup = d.groupIdx;
        html += `<div class="group-h">${esc(d.group)}</div>`;
      }
      const mins = Math.max(0, Math.floor((d.ts - now) / 60000));
      let when;
      if (mins < 1) when = `<div class="m soon">${this._t("now")}</div>`;
      else if (mins < 60) when = `<div class="m${mins <= 2 ? " soon" : ""}">${mins}<small>${this._t("min")}</small></div>`;
      else when = `<div class="m">${esc(this._fmtTime(d.ts))}</div>`;

      const sub = [];
      if (d.cancelled) sub.push(`<span class="x">${this._t("cancelled")}</span>`);
      else {
        sub.push(`${d.realtime && c.show_realtime !== false ? `<span class="rt" title="${this._t("realtime")}"></span>` : ""}${esc(this._fmtTime(d.ts))}`);
        if (d.delay >= 1) sub.push(`<span class="late">+${Math.round(d.delay)}</span>`);
        else if (c.show_on_time && d.realtime) sub.push(`<span class="ontime">${this._t("on_time")}</span>`);
      }
      if (d.platform != null && d.platform !== "") sub.push(`${this._t("platform")} ${esc(d.platform)}`);
      if (d.alerts) sub.push(`<span class="al">⚠</span>`);

      html += `<div class="row${d.cancelled ? " cancelled" : ""}">
        ${this._badge(d)}
        <div style="min-width:0"><div class="dest">${esc(d.destination || "—")}</div><div class="sub">${sub.join(" · ")}</div></div>
        <div class="when">${when}</div>
      </div>`;
    }
    body.innerHTML = errHtml + `<div class="rows">${html}</div>`;
    this._renderApproach(list, now);
  }

  /** "Approach" strip: next train per line + direction moving towards the station. */
  _renderApproach(list, now) {
    const c = this._config;
    const el = this._el.depAppr;
    const count = Math.max(0, +c.approach_count || 0);
    if (!c.show_approach || !count) return void (el.hidden = true);
    const window = Math.max(5, +c.approach_window || 15);
    const walk = Math.max(0, +c.walk_minutes || 0);
    const picked = [];
    const keys = new Set();
    for (const d of list) {
      if (d.cancelled) continue;
      const k = `${d.line}|${d.destination}`;
      if (keys.has(k)) continue;
      keys.add(k);
      picked.push(d);
      if (picked.length >= count) break;
    }
    if (!picked.length) return void (el.hidden = true);
    el.hidden = false;
    const ticks = [];
    for (let m = 5; m < window; m += 5) ticks.push(`<i class="tick" style="left:${(1 - m / window) * 100}%"></i>`);
    el.innerHTML =
      `<div class="appr-h">${this._t("approach")}</div>` +
      picked
        .map((d) => {
          const minsF = Math.max(0, (d.ts - now) / 60000);
          const mins = Math.floor(minsF);
          const pos = Math.max(0, Math.min(1, 1 - minsF / window)) * 100;
          let info;
          if (walk > 0) {
            const leave = Math.floor(minsF - walk);
            if (minsF < walk) info = `<span class="w late">${this._t("too_late")}</span>`;
            else if (leave <= 1) info = `<span class="w go">${this._t("leave_now")}</span>`;
            else info = `<span class="w wait">${this._t("leave_in", leave)}</span>`;
          } else info = `<span class="w">${mins < 1 ? this._t("now") : `${mins} ${this._t("min")}`}</span>`;
          const bg = this._lineColor(d);
          const walkMark = walk > 0 && walk < window ? `<i class="walk" style="left:${(1 - walk / window) * 100}%"></i>` : "";
          return `<div class="ap">
            <div class="ap-top">${this._badge(d)}<span class="d">→ ${esc(d.destination)}</span>${info}</div>
            <div class="track"><i class="rail"></i>${ticks.join("")}${walkMark}<i class="tr${minsF < 1 ? " arr" : ""}" style="left:${pos}%;background:${esc(
              bg
            )}"></i><span class="st">U</span></div>
          </div>`;
        })
        .join("");
  }
}

/* ---------------------------------------------------------------- editor */

const EDITOR_LABELS = {
  weather_entity: "Wetter-Entität",
  weather_location: "Ortsname (Wetter)",
  todo_entity: "Einkaufsliste (To-do-Entität, z. B. Bring!)",
  departure_entities: "Abfahrts-Sensoren",
  departure_style: "Stil der Abfahrtstafel",
  station_name: "Name der Station",
  title_departures: "Titel Abfahrten",
  title_todo: "Titel Einkaufsliste",
  max_departures: "Max. Abfahrten",
  walk_minutes: "Fußweg zur Station (Min.)",
  hide_below_minutes: "Abfahrten ausblenden unter (Min.)",
  forecast_hours: "Stunden in der Vorhersage",
  forecast_days: "Tage in der Vorhersage",
  show_completed: "„Zuletzt gekauft“ (Anzahl)",
  show_seconds: "Sekunden anzeigen",
  show_approach: "Anfahrt-Anzeige",
  weather_gradient: "Wetter mit Farbverlauf",
  add_delay: "Verspätung zur Abfahrtszeit addieren",
  group_departures: "Abfahrten nach Sensor gruppieren",
  height: "Kartenhöhe (CSS)",
  floorplan: "Grundriss",
  image: "Bild-URL (z. B. /local/grundriss.png)",
  title: "Titel",
  invert: "Helles Bild invertieren",
};

class IpadDashboardCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._render();
  }
  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    else this._render();
  }
  _schema() {
    const deps = this._config?.departure_entities;
    const simpleDeps = !deps || (Array.isArray(deps) && deps.every((d) => typeof d === "string"));
    return [
      { name: "weather_entity", selector: { entity: { filter: { domain: "weather" } } } },
      { name: "todo_entity", selector: { entity: { filter: { domain: "todo" } } } },
      ...(simpleDeps ? [{ name: "departure_entities", selector: { entity: { multiple: true, filter: { domain: "sensor" } } } }] : []),
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "departure_style",
            selector: { select: { mode: "dropdown", options: [{ value: "calm", label: "Ruhig" }, { value: "berlin", label: "Berlin (Zugzielanzeiger)" }] } },
          },
          { name: "station_name", selector: { text: {} } },
          { name: "walk_minutes", selector: { number: { min: 0, max: 30, mode: "box" } } },
          { name: "max_departures", selector: { number: { min: 1, max: 20, mode: "box" } } },
          { name: "weather_location", selector: { text: {} } },
          { name: "title_todo", selector: { text: {} } },
          { name: "forecast_hours", selector: { number: { min: 0, max: 8, mode: "box" } } },
          { name: "forecast_days", selector: { number: { min: 0, max: 10, mode: "box" } } },
          { name: "show_completed", selector: { number: { min: 0, max: 30, mode: "box" } } },
          { name: "height", selector: { text: {} } },
          { name: "show_approach", selector: { boolean: {} } },
          { name: "weather_gradient", selector: { boolean: {} } },
          { name: "show_seconds", selector: { boolean: {} } },
          { name: "add_delay", selector: { boolean: {} } },
        ],
      },
      {
        type: "expandable",
        name: "floorplan",
        title: "Grundriss",
        schema: [
          { name: "image", selector: { text: {} } },
          { name: "title", selector: { text: {} } },
          { name: "invert", selector: { boolean: {} } },
        ],
      },
    ];
  }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => EDITOR_LABELS[s.name] || s.name;
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const config = { ...ev.detail.value };
        for (const [k, v] of Object.entries(config)) if (v === "" || v === undefined) delete config[k];
        this._config = config;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
      const ver = document.createElement("div");
      ver.style.cssText = "margin-top:12px;font-size:12px;opacity:.6";
      ver.textContent = `iPad Dashboard Card v${CARD_VERSION} · Räume, Layout und Linienfarben im YAML-Editor`;
      this.appendChild(ver);
    }
    this._form.hass = this._hass;
    this._form.data = { departure_style: "calm", ...DEFAULTS, ...this._config };
    this._form.schema = this._schema();
  }
}

/* ---------------------------------------------------------- registration */

if (!customElements.get(CARD_TAG)) customElements.define(CARD_TAG, IpadDashboardCard);
if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, IpadDashboardCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: "iPad Dashboard Card",
    description: "Uhrzeit, Wetter, Bring!-Einkaufsliste, Grundriss und ÖPNV-Abfahrten – für das iPad im Querformat.",
    preview: false,
    documentationURL: "https://github.com/flxxxlf/homeassist-ipad-dashboard-card",
  });
}

console.info(
  `%c IPAD-DASHBOARD-CARD %c v${CARD_VERSION} `,
  "background:#7fa6c9;color:#0e1115;font-weight:700;border-radius:3px 0 0 3px",
  "background:#151a20;color:#e4e7eb;border-radius:0 3px 3px 0"
);
