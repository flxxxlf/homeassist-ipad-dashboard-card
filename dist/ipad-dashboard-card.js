/*
 * iPad Dashboard Card
 * Custom Lovelace card for Home Assistant – a tabbed wall dashboard for an
 * iPad Pro 10.5" in landscape (1112 × 834 CSS px):
 *   Übersicht · Wetter · Verkehr · Einkaufen · Zuhause  (+ Uhr: Wecker, Timer, Stoppuhr)
 *
 * All data comes from the `hass` object / its websocket connection.
 * No entity IDs, images or personal data are part of this file – everything
 * is set in the card configuration.
 */

const CARD_VERSION = "1.2.0";
const CARD_TAG = "ipad-dashboard-card";
const EDITOR_TAG = "ipad-dashboard-card-editor";
const USER_DATA_KEY = "ipad_dashboard_card";

/* ------------------------------------------------------------------ i18n */

const STRINGS = {
  de: {
    tab_overview: "Übersicht",
    tab_weather: "Wetter",
    tab_transit: "Verkehr",
    tab_shopping: "Einkaufen",
    tab_home: "Zuhause",
    tab_clock: "Uhr",
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
    tomorrow: "Morgen",
    high: "H",
    low: "T",
    hourly: "Stündliche Vorhersage",
    hours24: "Nächste 24 Stunden",
    daily: (n) => `${n}-Tage-Vorhersage`,
    cancelled: "fällt aus",
    on_time: "pünktlich",
    platform: "Gl.",
    items: (n) => (n === 1 ? "1 Artikel" : `${n} Artikel`),
    more: (n) => `+ ${n} weitere`,
    unavailable: "nicht verfügbar",
    edit_item: "Artikel bearbeiten",
    item_name: "Artikel",
    item_spec: "Menge / Notiz",
    item_spec_placeholder: "z. B. 2 Liter, Bio …",
    save: "Speichern",
    delete: "Löschen",
    done: "Erledigt",
    cancel: "Abbrechen",
    undo: "Rückgängig",
    completed_toast: (n) => `„${n}“ erledigt`,
    added_toast: (n) => `„${n}“ hinzugefügt`,
    approach: "Anfahrt",
    leave_in: (m) => `Loslaufen in ${m} min`,
    leave_now: "Jetzt loslaufen",
    too_late: "Nicht mehr erreichbar",
    realtime: "Echtzeit",
    line: "Linie",
    destination: "Ziel",
    departure: "Abfahrt",
    all: "Alle",
    planned: "Plan",
    disruption: "Störung",
    updated: (t) => `Stand ${t}`,
    next_trains: "Nächste Fahrten",
    feels_like: "Gefühlt",
    humidity: "Luftfeuchtigkeit",
    dew_point: (v) => `Taupunkt ${v}`,
    wind: "Wind",
    gusts: (v) => `Böen ${v}`,
    pressure: "Luftdruck",
    visibility: "Sichtweite",
    uv: "UV-Index",
    uv_levels: ["Niedrig", "Mäßig", "Hoch", "Sehr hoch", "Extrem"],
    clouds: "Bewölkung",
    sun: "Sonne",
    sunrise: "Aufgang",
    sunset: "Untergang",
    precipitation: "Niederschlag",
    today_total: "heute",
    compass: ["N", "NO", "O", "SO", "S", "SW", "W", "NW"],
    sort_az: "A–Z",
    sort_list: "Liste",
    shop_hint: "Antippen = erledigt · Lange drücken oder ✎ = bearbeiten",
    suggestions: "Vorschläge",
    favorites: "Favoriten",
    quick_add: "Schnell hinzufügen",
    lights_on: (n) => (n === 1 ? "1 an" : `${n} an`),
    devices: "Geräte",
    no_devices: "Noch keine Geräte eingerichtet. Lichter später unter floorplan → rooms oder home_entities eintragen.",
    alarms: "Wecker",
    timers: "Timer",
    stopwatch: "Stoppuhr",
    add_alarm: "Wecker hinzufügen",
    edit_alarm: "Wecker",
    no_alarms: "Keine Wecker gestellt.",
    alarm_label: "Bezeichnung",
    alarm_label_placeholder: "z. B. Aufstehen",
    time: "Uhrzeit",
    repeat: "Wiederholen",
    once: "Einmalig",
    daily_rep: "Täglich",
    weekdays: "Werktags",
    weekend: "Wochenende",
    days_short: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    next_alarm: "Nächster Wecker",
    in_time: (h, m) => (h ? `in ${h} Std. ${m} Min.` : `in ${m} Min.`),
    snooze: (m) => `Schlummern (${m} min)`,
    stop: "Stopp",
    start: "Start",
    lap: "Runde",
    reset: "Zurücksetzen",
    resume: "Weiter",
    timer_done: "Timer abgelaufen",
    alarm_ringing: "Wecker",
    custom_min: "Minuten",
    no_timers: "Kein Timer aktiv.",
    alarm_note: "Klingelt, solange dieses Dashboard geöffnet und der Bildschirm an ist.",
  },
  en: {
    tab_overview: "Overview",
    tab_weather: "Weather",
    tab_transit: "Transit",
    tab_shopping: "Shopping",
    tab_home: "Home",
    tab_clock: "Clock",
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
    tomorrow: "Tomorrow",
    high: "H",
    low: "L",
    hourly: "Hourly forecast",
    hours24: "Next 24 hours",
    daily: (n) => `${n}-day forecast`,
    cancelled: "cancelled",
    on_time: "on time",
    platform: "Pl.",
    items: (n) => (n === 1 ? "1 item" : `${n} items`),
    more: (n) => `+ ${n} more`,
    unavailable: "unavailable",
    edit_item: "Edit item",
    item_name: "Item",
    item_spec: "Amount / note",
    item_spec_placeholder: "e.g. 2 litres, organic …",
    save: "Save",
    delete: "Delete",
    done: "Done",
    cancel: "Cancel",
    undo: "Undo",
    completed_toast: (n) => `“${n}” done`,
    added_toast: (n) => `“${n}” added`,
    approach: "Approaching",
    leave_in: (m) => `Leave in ${m} min`,
    leave_now: "Leave now",
    too_late: "Not reachable anymore",
    realtime: "Real time",
    line: "Line",
    destination: "Destination",
    departure: "Departs",
    all: "All",
    planned: "Sched.",
    disruption: "Disruption",
    updated: (t) => `Updated ${t}`,
    next_trains: "Next trips",
    feels_like: "Feels like",
    humidity: "Humidity",
    dew_point: (v) => `Dew point ${v}`,
    wind: "Wind",
    gusts: (v) => `Gusts ${v}`,
    pressure: "Pressure",
    visibility: "Visibility",
    uv: "UV index",
    uv_levels: ["Low", "Moderate", "High", "Very high", "Extreme"],
    clouds: "Cloud cover",
    sun: "Sun",
    sunrise: "Sunrise",
    sunset: "Sunset",
    precipitation: "Precipitation",
    today_total: "today",
    compass: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
    sort_az: "A–Z",
    sort_list: "List",
    shop_hint: "Tap = done · Long press or ✎ = edit",
    suggestions: "Suggestions",
    favorites: "Favourites",
    quick_add: "Quick add",
    lights_on: (n) => `${n} on`,
    devices: "Devices",
    no_devices: "No devices yet. Add lights later under floorplan → rooms or home_entities.",
    alarms: "Alarms",
    timers: "Timers",
    stopwatch: "Stopwatch",
    add_alarm: "Add alarm",
    edit_alarm: "Alarm",
    no_alarms: "No alarms set.",
    alarm_label: "Label",
    alarm_label_placeholder: "e.g. Wake up",
    time: "Time",
    repeat: "Repeat",
    once: "Once",
    daily_rep: "Every day",
    weekdays: "Weekdays",
    weekend: "Weekends",
    days_short: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    next_alarm: "Next alarm",
    in_time: (h, m) => (h ? `in ${h} h ${m} min` : `in ${m} min`),
    snooze: (m) => `Snooze (${m} min)`,
    stop: "Stop",
    start: "Start",
    lap: "Lap",
    reset: "Reset",
    resume: "Resume",
    timer_done: "Timer finished",
    alarm_ringing: "Alarm",
    custom_min: "Minutes",
    no_timers: "No timer running.",
    alarm_note: "Rings while this dashboard is open and the screen is on.",
  },
};

const TABS = [
  { id: "overview", icon: "mdi:view-dashboard-outline" },
  { id: "weather", icon: "mdi:weather-partly-cloudy" },
  { id: "transit", icon: "mdi:subway-variant" },
  { id: "shopping", icon: "mdi:cart-outline" },
  { id: "home", icon: "mdi:home-outline" },
];

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
  planned: ["planned", "plannedDepartureTime", "scheduled", "plannedWhen", "departure_time_planned"],
  minutes: ["minutes", "departure_in", "in", "time_to_departure", "countdown", "min", "in_min"],
  delay: ["delay", "delay_minutes", "delayInMinutes", "delay_departure"],
  platform: ["track", "platform", "scheduled_track", "gleis", "stop_point"],
  cancelled: ["cancelled", "canceled", "is_cancelled", "cancel"],
  color: ["color", "line_color", "background_color", "lineBackgroundColor"],
  transport: ["transport", "transport_type", "product", "mode", "type"],
  alerts: ["alerts", "alert", "info", "messages"],
};


const LINE_PALETTE = ["#5b8bb5", "#6f9e8a", "#b0865b", "#8a7bb0", "#b56b6b", "#5f9ea8", "#a39a5b", "#7f8fa8"];

/* Overview tile layout (areas: clock, weather, dep, todo, plan) */
const DEFAULT_LAYOUT = {
  areas: ["clock weather dep", "plan todo dep"],
  columns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.05fr)",
  rows: "minmax(0, 0.82fr) minmax(0, 1fr)",
};

const DEFAULTS = {
  tabs: ["overview", "weather", "transit", "shopping", "home"],
  default_tab: "overview",
  return_to_overview: 0,
  max_departures: 7,
  max_departures_detail: 14,
  hide_below_minutes: 0,
  walk_minutes: 0,
  add_delay: false,
  group_departures: false,
  departure_style: "calm",
  show_approach: true,
  approach_window: 15,
  forecast_hours: 5,
  forecast_days: 10,
  weather_gradient: true,
  show_completed: 30,
  spec_separator: ":",
  spec_suggestions: ["2×", "3×", "500 g", "1 kg", "Bio", "groß"],
  show_seconds: false,
  snooze_minutes: 9,
  alarm_ring_minutes: 5,
  timer_presets: [1, 3, 5, 10, 15, 30],
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
    --idc-panel-3: #232a32;
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
  * { -webkit-tap-highlight-color: transparent; }
  ha-card {
    display: flex;
    flex-direction: column;
    position: relative;
    height: var(--idc-height);
    min-height: 600px;
    box-sizing: border-box;
    background: var(--idc-bg);
    color: var(--idc-text);
    border: none;
    border-radius: var(--idc-radius);
    padding: 12px 16px 16px;
    overflow: hidden;
    font-family: var(--idc-font, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif);
    container-type: inline-size;
    -webkit-font-smoothing: antialiased;
  }
  button { font: inherit; color: inherit; }
  [hidden] { display: none !important; }

  /* ---------- tab bar */
  .tabbar { display: flex; align-items: center; gap: 12px; height: 48px; margin-bottom: 12px; flex: none; }
  .tabs { display: flex; gap: 3px; background: var(--idc-panel); border: 1px solid var(--idc-border); border-radius: 15px; padding: 4px; min-width: 0; overflow-x: auto; scrollbar-width: none; }
  .tabs::-webkit-scrollbar { display: none; }
  .tab {
    display: flex; align-items: center; gap: 7px; height: 38px; padding: 0 15px; border-radius: 11px; border: none;
    background: transparent; color: var(--idc-muted); font-size: 15px; font-weight: 500; cursor: pointer; white-space: nowrap;
    transition: background 0.2s, color 0.2s;
  }
  .tab ha-icon { --mdc-icon-size: 19px; }
  .tab.active { background: var(--idc-panel-3); color: var(--idc-text); }
  .tb-right { margin-left: auto; display: flex; align-items: center; gap: 8px; flex: none; }
  .tb-clock {
    display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; border-radius: 13px; border: 1px solid var(--idc-border);
    background: var(--idc-panel); cursor: pointer; font-size: 19px; font-weight: 400; font-variant-numeric: tabular-nums;
  }
  .tb-clock.active { background: var(--idc-panel-3); }
  .tb-clock ha-icon { --mdc-icon-size: 18px; color: var(--idc-accent); }
  .tb-clock .ind { font-size: 13px; color: var(--idc-accent); }

  .views { flex: 1; min-height: 0; position: relative; }
  .view { position: absolute; inset: 0; display: grid; gap: 14px; animation: idc-fade 0.25s ease; }
  @keyframes idc-fade { from { opacity: 0; transform: translateY(4px); } }

  /* ---------- panels */
  .panel {
    background: var(--idc-panel); border: 1px solid var(--idc-border); border-radius: calc(var(--idc-radius) - 4px);
    padding: 18px 20px; box-sizing: border-box; min-height: 0; min-width: 0; display: flex; flex-direction: column; overflow: hidden; position: relative;
  }
  .tile { cursor: pointer; transition: transform 0.12s, border-color 0.2s; }
  .tile:active { transform: scale(0.985); }
  .panel-head {
    display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; color: var(--idc-muted);
    font-size: 12.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; flex: none; min-height: 20px;
  }
  .panel-head ha-icon { --mdc-icon-size: 18px; color: var(--idc-faint); }
  .panel-head .title { display: flex; align-items: center; gap: 8px; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .panel-head .meta { font-weight: 500; letter-spacing: 0.02em; text-transform: none; color: var(--idc-faint); white-space: nowrap; display: flex; align-items: center; gap: 4px; }
  .panel-head .go { --mdc-icon-size: 18px; color: var(--idc-faint); }
  .msg { color: var(--idc-faint); font-size: 15px; padding: 8px 0; }
  .msg.error { color: var(--idc-bad); }
  .scroll { overflow-y: auto; min-height: 0; flex: 1; margin: 0 -6px; padding: 0 6px; scrollbar-width: none; }
  .scroll::-webkit-scrollbar { display: none; }
  .sec-h { font-size: 11.5px; color: var(--idc-faint); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; margin: 16px 0 8px; }
  .sec-h:first-child { margin-top: 0; }

  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    border: 1px solid var(--idc-border); background: transparent; color: var(--idc-muted); border-radius: 999px;
    padding: 7px 13px; font-size: 14px; cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px;
  }
  .chip:active { background: var(--idc-panel-2); color: var(--idc-text); }
  .chip.sel { background: var(--idc-panel-3); color: var(--idc-text); border-color: rgba(255,255,255,0.1); }
  .chip .badge { min-width: 28px; height: 20px; font-size: 12px; border-radius: 5px; padding: 0 5px; }
  .chip.off { opacity: 0.45; }

  .btn {
    height: 44px; padding: 0 16px; border-radius: 12px; border: none; font-size: 15px; font-weight: 600; cursor: pointer;
    background: var(--idc-panel-2); color: var(--idc-text); display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  }
  .btn.primary { background: var(--idc-accent); color: #0e1115; }
  .btn.good { background: rgba(132, 180, 155, 0.18); color: var(--idc-good); }
  .btn.danger { background: rgba(210, 124, 116, 0.14); color: var(--idc-bad); }
  .btn.round { width: 44px; padding: 0; border-radius: 50%; }
  .btn ha-icon { --mdc-icon-size: 20px; }

  /* ---------- overview */
  .v-overview { grid-template-columns: var(--idc-columns); grid-template-rows: var(--idc-rows); grid-template-areas: var(--idc-areas); }
  .ov-clock { grid-area: clock; justify-content: center; padding: 18px 22px; }
  .ov-weather { grid-area: weather; }
  .ov-dep { grid-area: dep; }
  .ov-todo { grid-area: todo; }
  .ov-plan { grid-area: plan; }
  .time { font-size: 92px; line-height: 0.95; font-weight: 200; letter-spacing: -0.035em; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .time .sec { font-size: 32px; color: var(--idc-faint); margin-left: 6px; letter-spacing: 0; }
  .date { margin-top: 10px; font-size: 19px; color: var(--idc-muted); }
  .ov-info { margin-top: 16px; display: flex; flex-direction: column; gap: 6px; font-size: 14.5px; color: var(--idc-muted); }
  .ov-info span { display: flex; align-items: center; gap: 8px; }
  .ov-info ha-icon { --mdc-icon-size: 17px; color: var(--idc-accent); }
  .ov-items { display: flex; flex-wrap: wrap; gap: 6px; align-content: flex-start; }
  .ov-items span { background: var(--idc-panel-2); border: 1px solid var(--idc-border); border-radius: 10px; padding: 7px 11px; font-size: 14.5px; }
  .ov-items span small { color: var(--idc-accent); margin-left: 5px; font-size: 12px; }
  .ov-items .more { background: transparent; color: var(--idc-faint); border-style: dashed; }
  .ov-advice { flex: none; margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--idc-border); display: flex; align-items: center; gap: 8px; font-size: 14px; }

  /* ---------- weather (shared) */
  .wx { color: #fff; border-color: rgba(255,255,255,0.07); }
  .wx.grad { background: linear-gradient(180deg, var(--w-a), var(--w-b)); }
  .wx .panel-head, .wx .panel-head ha-icon, .wx .panel-head .go { color: rgba(255,255,255,0.6); }
  .w-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
  .w-loc { font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .w-temp { font-size: 58px; font-weight: 250; line-height: 1.02; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .w-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; font-size: 14px; font-weight: 500; min-width: 0; }
  .w-right svg { width: 38px; height: 38px; margin-bottom: 2px; }
  .w-right .c { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  .w-mod { background: rgba(255,255,255,0.075); border-radius: 14px; padding: 10px 12px; margin-top: 12px; min-width: 0; }
  .w-mod-h { font-size: 11.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255,255,255,0.55); padding-bottom: 7px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
  .w-mod-h ha-icon { --mdc-icon-size: 14px; }
  .w-hours { display: grid; grid-template-columns: repeat(var(--n, 6), minmax(0, 1fr)); text-align: center; }
  .w-hour { display: flex; flex-direction: column; align-items: center; gap: 1px; font-size: 13.5px; font-weight: 500; }
  .w-hour .h { color: rgba(255,255,255,0.75); font-size: 12.5px; }
  .w-hour svg { width: 30px; height: 30px; margin: 2px 0; }
  .p { color: #7cc4ff; font-size: 10.5px; font-weight: 600; line-height: 1; min-height: 10px; }
  .w-days { display: flex; flex-direction: column; }
  .w-day { display: grid; grid-template-columns: 44px 32px 34px minmax(0, 1fr) 34px; align-items: center; gap: 8px; height: 37px; font-size: 15px; font-weight: 500; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .w-day:last-child { border-bottom: none; }
  .w-day .ic { display: flex; flex-direction: column; align-items: center; }
  .w-day svg { width: 25px; height: 25px; }
  .w-day .lo { color: rgba(255,255,255,0.55); text-align: right; font-variant-numeric: tabular-nums; }
  .w-day .hi { text-align: right; font-variant-numeric: tabular-nums; }
  .bar { position: relative; height: 5px; border-radius: 3px; background: rgba(0,0,0,0.25); }
  .bar i { position: absolute; top: 0; bottom: 0; border-radius: 3px; }
  .bar b { position: absolute; top: -2px; width: 9px; height: 9px; margin-left: -4.5px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 1.5px rgba(0,0,0,0.35); }

  /* weather view */
  .v-weather { grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.45fr); }
  .wx-left { gap: 0; }
  .wx-hero { padding: 4px 4px 2px; }
  .wx-hero .w-loc { font-size: 22px; }
  .wx-hero .big { font-size: 96px; font-weight: 200; line-height: 1; letter-spacing: -0.03em; margin: 4px 0 2px; display: flex; align-items: center; gap: 12px; }
  .wx-hero .big svg { width: 64px; height: 64px; }
  .wx-hero .c { font-size: 19px; font-weight: 500; }
  .wx-hero .hl { font-size: 16px; color: rgba(255,255,255,0.75); margin-top: 2px; }
  .wx-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; overflow-y: auto; scrollbar-width: none; min-height: 0; }
  .wx-tiles::-webkit-scrollbar { display: none; }
  .wt { background: rgba(255,255,255,0.075); border-radius: 14px; padding: 11px 13px; min-height: 92px; box-sizing: border-box; display: flex; flex-direction: column; }
  .wt .k { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255,255,255,0.55); display: flex; align-items: center; gap: 5px; }
  .wt .k ha-icon { --mdc-icon-size: 14px; }
  .wt .v { font-size: 28px; font-weight: 300; margin-top: 6px; line-height: 1.1; display: flex; align-items: center; gap: 8px; }
  .wt .v small { font-size: 15px; color: rgba(255,255,255,0.7); }
  .wt .s { font-size: 12.5px; color: rgba(255,255,255,0.65); margin-top: auto; padding-top: 4px; }
  .wt .arrow { width: 22px; height: 22px; display: inline-block; }
  .wx-right { gap: 0; }
  .wx-right .w-mod:first-child { margin-top: 0; }
  .hs { overflow-x: auto; scrollbar-width: none; margin: 0 -4px; padding: 0 4px; }
  .hs::-webkit-scrollbar { display: none; }
  .hs-in { display: grid; grid-auto-flow: row; }
  .hs-row { display: grid; grid-template-columns: repeat(var(--n), var(--cw)); text-align: center; align-items: center; }
  .hs-row .h { font-size: 12.5px; color: rgba(255,255,255,0.75); font-weight: 500; }
  .hs-row svg { width: 28px; height: 28px; justify-self: center; margin: 3px 0; }
  .hs svg.chart { display: block; overflow: visible; }
  .hs svg.chart text { fill: #fff; font-size: 13px; font-weight: 500; text-anchor: middle; font-family: inherit; }
  .wx-days { flex: 1; min-height: 0; overflow-y: auto; scrollbar-width: none; }

  /* ---------- floor plan */
  .plan-body { flex: 1; min-height: 0; position: relative; display: flex; align-items: center; justify-content: center; }
  .plan-wrap { position: relative; }
  .plan-wrap img { width: 100%; height: 100%; display: block; user-select: none; -webkit-user-drag: none; pointer-events: none; }
  .plan-wrap img.invert { filter: invert(0.92) hue-rotate(180deg) brightness(0.9) contrast(0.9); }
  .room { position: absolute; border-radius: 10px; transition: background 0.4s, box-shadow 0.4s; }
  .interactive .room { cursor: pointer; }
  .room.on { background: radial-gradient(ellipse at center, rgba(255, 199, 120, 0.30), rgba(255, 199, 120, 0.08) 70%); box-shadow: inset 0 0 0 1px rgba(255, 199, 120, 0.25); }
  .room .rl { position: absolute; left: 8px; bottom: 6px; font-size: 12px; color: var(--idc-muted); display: flex; align-items: center; gap: 4px; }
  .room.on .rl { color: #ffcf8a; }
  .room ha-icon { --mdc-icon-size: 16px; }
  .plan-ph { border: 1.5px dashed rgba(255,255,255,0.1); border-radius: 14px; width: 100%; height: 100%; display: grid; place-items: center; text-align: center; color: var(--idc-faint); font-size: 14px; padding: 20px; box-sizing: border-box; }
  .plan-ph ha-icon { --mdc-icon-size: 40px; display: block; margin: 0 auto 10px; opacity: 0.6; }
  .v-home { grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); }
  .ents { display: flex; flex-direction: column; gap: 8px; }
  .ent { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 13px; background: var(--idc-panel-2); border: 1px solid var(--idc-border); cursor: pointer; user-select: none; -webkit-user-select: none; }
  .ent ha-icon { --mdc-icon-size: 22px; color: var(--idc-faint); }
  .ent.on ha-icon { color: #ffc778; }
  .ent .n { flex: 1; min-width: 0; font-size: 15.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ent .st { font-size: 13.5px; color: var(--idc-muted); }

  /* ---------- shopping */
  .v-shopping { grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr); }
  .add { display: flex; gap: 8px; flex: none; }
  .add input, .sheet input {
    flex: 1; min-width: 0; height: 48px; padding: 0 16px; border-radius: 13px;
    border: 1px solid var(--idc-border); background: var(--idc-panel-2); color: var(--idc-text);
    font: inherit; font-size: 17px; outline: none; -webkit-appearance: none; box-sizing: border-box;
  }
  .add input::placeholder, .sheet input::placeholder { color: var(--idc-faint); }
  .add input:focus, .sheet input:focus { border-color: rgba(127, 166, 201, 0.5); }
  .add .btn { width: 48px; height: 48px; padding: 0; background: rgba(127, 166, 201, 0.16); color: var(--idc-accent); }
  .sugg { margin: 10px 0 0; flex: none; }
  .sugg:empty { display: none; }
  .sugg .chip { color: var(--idc-accent); border-color: rgba(127,166,201,0.25); }
  .sh-bar { display: flex; align-items: center; gap: 8px; margin: 14px 0 10px; flex: none; }
  .sh-bar .hint { font-size: 12.5px; color: var(--idc-faint); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .seg { display: flex; background: var(--idc-panel-2); border-radius: 10px; padding: 3px; gap: 2px; flex: none; }
  .seg button { border: none; background: transparent; color: var(--idc-muted); font-size: 13px; font-weight: 600; padding: 5px 10px; border-radius: 8px; cursor: pointer; }
  .seg button.sel { background: var(--idc-panel-3); color: var(--idc-text); }
  .items { display: grid; grid-template-columns: repeat(auto-fill, minmax(var(--item-min, 118px), 1fr)); gap: 8px; }
  .item {
    position: relative; background: var(--idc-panel-2); border: 1px solid var(--idc-border); border-radius: 13px;
    padding: 10px 30px 10px 12px; min-height: 56px; box-sizing: border-box; display: flex; flex-direction: column;
    justify-content: center; cursor: pointer; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
    transition: opacity 0.2s, transform 0.1s;
  }
  .v-shopping .item { min-height: 66px; }
  .item:active { transform: scale(0.97); }
  .item.pending { opacity: 0.35; }
  .item .n { font-size: 16px; line-height: 1.25; overflow-wrap: anywhere; }
  .item .s { font-size: 13px; color: var(--idc-accent); margin-top: 3px; overflow-wrap: anywhere; }
  .item .e { position: absolute; top: 0; right: 0; width: 36px; height: 36px; display: grid; place-items: center; color: var(--idc-faint); }
  .item .e ha-icon { --mdc-icon-size: 16px; }
  .recent .chip { font-size: 14.5px; }

  /* ---------- sheets / overlays */
  .overlay {
    position: absolute; inset: 0; background: rgba(5, 7, 10, 0.6); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    display: grid; place-items: start center; padding-top: 48px; z-index: 10; border-radius: var(--idc-radius);
  }
  .sheet {
    width: min(460px, calc(100% - 32px)); background: #1a2027; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 22px; box-sizing: border-box; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .sheet h3 { margin: 0 0 16px; font-size: 18px; font-weight: 600; }
  .sheet label { display: block; font-size: 12px; color: var(--idc-muted); letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600; margin: 14px 0 6px; }
  .sheet input { width: 100%; }
  .sheet input[type="time"] { font-size: 34px; height: 64px; font-weight: 300; text-align: center; font-variant-numeric: tabular-nums; }
  .sheet .chips { margin-top: 10px; }
  .sheet .btns { display: flex; gap: 8px; margin-top: 22px; }
  .sheet .btns .sp { flex: 1; }
  .days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
  .days button { height: 40px; border-radius: 10px; border: 1px solid var(--idc-border); background: transparent; color: var(--idc-muted); font-size: 14px; font-weight: 600; cursor: pointer; }
  .days button.sel { background: rgba(127,166,201,0.2); color: var(--idc-accent); border-color: rgba(127,166,201,0.35); }
  .ring { place-items: center; padding: 0; background: rgba(5, 7, 10, 0.82); z-index: 20; }
  .ring-box { text-align: center; }
  .ring-box ha-icon { --mdc-icon-size: 56px; color: var(--idc-accent); animation: idc-pulse 1.2s ease-in-out infinite; }
  .ring-box .t { font-size: 110px; font-weight: 200; font-variant-numeric: tabular-nums; line-height: 1; margin: 10px 0 6px; }
  .ring-box .l { font-size: 22px; color: var(--idc-muted); }
  .ring-box .btns { display: flex; gap: 14px; justify-content: center; margin-top: 34px; }
  .ring-box .btn { height: 60px; padding: 0 32px; font-size: 18px; border-radius: 30px; }
  .toast {
    position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%); z-index: 15; display: flex; align-items: center; gap: 14px;
    background: #222a33; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 10px 10px 10px 18px; font-size: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.45); animation: idc-fade 0.2s ease; max-width: calc(100% - 40px);
  }
  .toast .btn { height: 36px; font-size: 14px; }

  /* ---------- departures */
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
  .sub s { opacity: 0.7; }
  .when { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .when .m { font-size: 23px; font-weight: 300; }
  .when .m small { font-size: 13px; color: var(--idc-muted); margin-left: 2px; }
  .when .m.soon { color: var(--idc-accent); }
  .row.cancelled .dest, .row.cancelled .when .m { text-decoration: line-through; color: var(--idc-faint); }
  .row.cancelled .sub .x { color: var(--idc-bad); }
  .v-transit { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); }
  .tr-filter { flex: none; margin-bottom: 10px; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
  .tr-filter::-webkit-scrollbar { display: none; }
  .dirs { display: flex; flex-direction: column; gap: 10px; }
  .dir { background: var(--idc-panel-2); border: 1px solid var(--idc-border); border-radius: 14px; padding: 13px 14px 12px; }
  .dir-h { display: flex; align-items: center; gap: 10px; font-size: 16px; }
  .dir-h .d { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dir-h .pl { font-size: 12.5px; color: var(--idc-faint); }
  .dir-next { display: flex; gap: 14px; align-items: baseline; margin: 10px 0 10px; font-variant-numeric: tabular-nums; flex-wrap: wrap; }
  .dir-next .f { font-size: 30px; font-weight: 300; }
  .dir-next .f small, .dir-next .o small { font-size: 13px; color: var(--idc-muted); margin-left: 2px; }
  .dir-next .o { font-size: 17px; color: var(--idc-muted); }
  .dir-next .o.late { color: var(--idc-warn); }
  .dir-next .x { text-decoration: line-through; color: var(--idc-faint); }
  .dir .adv { margin-top: 8px; font-size: 13px; }
  .tr-foot { flex: none; font-size: 12px; color: var(--idc-faint); margin-top: 8px; }

  /* approach strip */
  .appr { flex: none; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--idc-border); display: flex; flex-direction: column; gap: 12px; }
  .ap-top { display: flex; align-items: center; gap: 8px; font-size: 13.5px; margin-bottom: 8px; }
  .ap-top .badge, .dir-h .badge { min-width: 34px; height: 24px; font-size: 13px; border-radius: 6px; }
  .ap-top .d { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--idc-muted); }
  .w.go { color: var(--idc-good); }
  .w.late { color: var(--idc-bad); }
  .w.wait { color: var(--idc-faint); }
  .track { position: relative; height: 18px; margin: 0 9px 0 4px; }
  .track .rail { position: absolute; left: 0; right: 0; top: 8px; height: 2px; background: rgba(255,255,255,0.12); border-radius: 1px; }
  .track .tick { position: absolute; top: 5px; width: 1px; height: 8px; background: rgba(255,255,255,0.14); }
  .track .walk { position: absolute; top: 1px; width: 2px; height: 16px; margin-left: -1px; border-radius: 1px; background: var(--idc-good); opacity: 0.7; }
  .track .st { position: absolute; right: -9px; top: 0; width: 18px; height: 18px; border-radius: 4px; background: #115D91; color: #fff; font-size: 12px; font-weight: 800; display: grid; place-items: center; font-family: Arial, sans-serif; }
  .track .tr { position: absolute; top: 3px; height: 12px; width: 26px; margin-left: -26px; border-radius: 6px 3px 3px 6px; transition: left 1s linear; box-shadow: 0 0 10px rgba(0,0,0,0.4); }
  .track .tr.arr { animation: idc-pulse 1.6s ease-in-out infinite; }
  @keyframes idc-pulse { 50% { opacity: 0.45; } }

  /* Berlin board style */
  .berlin {
    background-color: #0a0b0c;
    background-image: radial-gradient(rgba(255,255,255,0.028) 1px, transparent 1.3px);
    background-size: 4px 4px;
    font-family: "DIN Alternate", "DIN Condensed", "Roboto Condensed", "Arial Narrow", var(--idc-font, sans-serif);
  }
  .berlin .panel-head { color: #fff; font-size: 15px; letter-spacing: 0.02em; text-transform: none; font-weight: 700; }
  .berlin .panel-head .meta { color: var(--idc-amber); font-size: 18px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .u-sign { width: 24px; height: 24px; border-radius: 4px; background: #115D91; color: #fff; font-weight: 800; font-size: 17px; display: grid; place-items: center; flex: none; font-family: Arial, sans-serif; }
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
  .berlin .appr, .berlin .ov-advice { border-top-color: rgba(242,169,59,0.18); }
  .berlin .ap-top .d { color: rgba(242,169,59,0.8); }
  .berlin .track .rail { background: rgba(242,169,59,0.2); }
  .berlin .track .tick { background: rgba(242,169,59,0.22); }
  .berlin .tr-foot { color: rgba(242,169,59,0.4); }
  .berlin .chip { border-color: rgba(242,169,59,0.2); color: rgba(242,169,59,0.75); }
  .berlin .chip.sel { background: rgba(242,169,59,0.12); color: var(--idc-amber); }

  /* ---------- clock view */
  .v-clock { grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: auto minmax(0, 1fr); }
  .cl-hero { grid-column: 1 / -1; flex-direction: row; align-items: center; gap: 28px; padding: 16px 26px; }
  .cl-hero .time { font-size: 112px; }
  .cl-hero .meta2 { display: flex; flex-direction: column; gap: 6px; font-size: 17px; color: var(--idc-muted); }
  .cl-hero .meta2 b { color: var(--idc-text); font-weight: 500; }
  .alarm { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--idc-border); cursor: pointer; }
  .alarm:last-child { border-bottom: none; }
  .alarm .t { font-size: 36px; font-weight: 250; font-variant-numeric: tabular-nums; line-height: 1; }
  .alarm .i { flex: 1; min-width: 0; font-size: 13px; color: var(--idc-muted); }
  .alarm .i div:first-child { color: var(--idc-text); font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .alarm.off .t, .alarm.off .i { opacity: 0.4; }
  .sw { width: 50px; height: 30px; border-radius: 15px; background: var(--idc-panel-3); position: relative; flex: none; border: none; cursor: pointer; transition: background 0.2s; }
  .sw::after { content: ""; position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: #c8ced6; transition: transform 0.2s; }
  .sw.on { background: var(--idc-good); }
  .sw.on::after { transform: translateX(20px); background: #fff; }
  .timer { padding: 12px 0; border-bottom: 1px solid var(--idc-border); }
  .timer:last-child { border-bottom: none; }
  .timer .row1 { display: flex; align-items: center; gap: 10px; }
  .timer .t { font-size: 38px; font-weight: 250; font-variant-numeric: tabular-nums; flex: 1; line-height: 1; }
  .timer .btn { height: 38px; font-size: 13.5px; padding: 0 12px; }
  .timer .btn.round { width: 38px; }
  .prog { height: 4px; border-radius: 2px; background: var(--idc-panel-3); margin-top: 10px; overflow: hidden; }
  .prog i { display: block; height: 100%; background: var(--idc-accent); border-radius: 2px; }
  .tm-custom { display: flex; gap: 8px; margin-top: 10px; }
  .tm-custom input { flex: 1; min-width: 0; height: 40px; border-radius: 11px; border: 1px solid var(--idc-border); background: var(--idc-panel-2); color: var(--idc-text); font: inherit; font-size: 16px; padding: 0 12px; outline: none; box-sizing: border-box; -webkit-appearance: none; }
  .tm-custom .btn { height: 40px; }
  .sw-time { font-size: 60px; font-weight: 200; font-variant-numeric: tabular-nums; text-align: center; margin: 8px 0 14px; letter-spacing: -0.02em; }
  .sw-time small { font-size: 30px; color: var(--idc-muted); }
  .sw-btns { display: flex; justify-content: space-between; gap: 10px; flex: none; }
  .sw-btns .btn { flex: 1; height: 50px; border-radius: 25px; }
  .laps { margin-top: 12px; }
  .lap { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--idc-border); font-size: 15px; font-variant-numeric: tabular-nums; color: var(--idc-muted); }
  .lap b { color: var(--idc-text); font-weight: 500; }

  /* ---------- narrow layouts (portrait / phone) */
  @container (max-width: 860px) {
    .v-overview { grid-template-columns: 1fr 1fr; grid-template-rows: auto auto minmax(300px, 1fr); grid-template-areas: "clock weather" "dep todo" "dep plan"; }
    .v-weather, .v-transit, .v-shopping, .v-home { grid-template-columns: 1fr; overflow-y: auto; }
    .v-clock { grid-template-columns: 1fr 1fr; }
    .tab span { display: none; }
  }
  @container (max-width: 560px) {
    .views { overflow-y: auto; }
    .view { position: static; }
    .v-overview, .v-clock { grid-template-columns: 1fr; grid-template-rows: none; grid-template-areas: none; }
    .v-overview > * { grid-area: auto !important; min-height: 240px; }
    .time { font-size: 64px; }
  }
`;

/* --------------------------------------------------------- more helpers */

const pad2 = (n) => String(n).padStart(2, "0");
const lsGet = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
};
const lsSet = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    /* storage unavailable */
  }
};
const fmtDuration = (ms, cs = false) => {
  const neg = ms < 0;
  ms = Math.abs(ms);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const c = Math.floor((ms % 1000) / 10);
  const base = h ? `${h}:${pad2(m)}:${pad2(s)}` : `${pad2(m)}:${pad2(s)}`;
  return (neg ? "−" : "") + base + (cs ? `,${pad2(c)}` : "");
};
const uid = () => Math.random().toString(36).slice(2, 10);
const isOn = (s) => !!s && ["on", "open", "playing", "home", "unlocked", "heat", "cool"].includes(s.state);

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
    this._view = null;
    this._trHidden = new Set(lsGet("idc_tr_hidden", []));
    this._shSort = lsGet("idc_sh_sort", "list");
    this._data = { alarms: [] };
    this._fired = {};
    this._snoozes = [];
    this._timers = lsGet("idc_timers", []);
    this._sw = lsGet("idc_stopwatch", { start: null, acc: 0, laps: [] });
    this._lastInteraction = Date.now();
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
    const lists = [config.todo_entity, ...(config.todo_entities || [])].filter(Boolean);
    this._lists = [...new Set(lists)];
    if (!this._lists.includes(this._list)) this._list = this._lists[0];
    const tabs = (Array.isArray(this._config.tabs) ? this._config.tabs : DEFAULTS.tabs).filter((t) => TABS.some((x) => x.id === t));
    this._tabs = tabs.length ? tabs : ["overview"];
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
    clearInterval(this._timer);
    this._timer = setInterval(() => this._tick(), 1000);
    if (this._hass && this._config) this._update(true);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    clearInterval(this._swTimer);
    this._swTimer = null;
    this._stopRing(true);
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
  _weekdayShort(ts) {
    return this._fmt(ts, { weekday: "short" }).replace(/\.$/, "");
  }
  _round(v) {
    return v == null || v === "" || !Number.isFinite(+v) ? "–" : Math.round(+v);
  }
  _$(id) {
    return this.shadowRoot.getElementById(id);
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
    const depHead = (id) => `<div class="panel-head">
        <span class="title">${berlin ? `<span class="u-sign">U</span>` : `<ha-icon icon="${esc(c.departures_icon || "mdi:subway-variant")}"></ha-icon>`}<span id="${id}-title"></span></span>
        <span class="meta" id="${id}-meta"></span>
      </div>${berlin ? `<div class="cols"><span>${this._t("line")}</span><span>${this._t("destination")}</span><span>${this._t("departure")}</span></div>` : ""}`;
    const goIcon = `<ha-icon class="go" icon="mdi:chevron-right"></ha-icon>`;

    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card>
        <nav class="tabbar">
          <div class="tabs">${this._tabs
            .map((id) => {
              const t = TABS.find((x) => x.id === id);
              return `<button class="tab" data-goto="${id}"><ha-icon icon="${t.icon}"></ha-icon><span>${this._t(`tab_${id}`)}</span></button>`;
            })
            .join("")}</div>
          <div class="tb-right"><button class="tb-clock" data-goto="clock" id="tb-clock"></button></div>
        </nav>
        <div class="views">
          <div class="view v-overview" data-view="overview" hidden>
            <section class="panel tile ov-clock" data-area="clock" data-goto="clock">
              <div class="time" id="ov-time"></div><div class="date" id="ov-date"></div><div class="ov-info" id="ov-info"></div>
            </section>
            <section class="panel tile wx ov-weather" data-area="weather" data-goto="weather" id="ov-weather"></section>
            <section class="panel tile ov-dep${berlin ? " berlin" : ""}" data-area="dep" data-goto="transit">
              ${depHead("ovd")}
              <div class="scroll" id="ov-dep"></div>
              <div class="ov-advice" id="ov-adv" hidden></div>
            </section>
            <section class="panel tile ov-todo" data-area="todo" data-goto="shopping">
              <div class="panel-head"><span class="title"><ha-icon icon="mdi:cart-outline"></ha-icon><span id="ovt-title"></span></span><span class="meta"><span id="ovt-count"></span>${goIcon}</span></div>
              <div class="scroll" id="ov-todo"></div>
            </section>
            <section class="panel tile ov-plan" data-area="plan" data-goto="home">
              <div class="panel-head"><span class="title"><ha-icon icon="mdi:floor-plan"></ha-icon><span class="plan-title"></span></span><span class="meta"><span id="ovp-meta"></span>${goIcon}</span></div>
              <div class="plan-body" id="ov-plan"></div>
            </section>
          </div>

          <div class="view v-weather" data-view="weather" hidden>
            <section class="panel wx wx-left" id="wx-left"></section>
            <section class="panel wx wx-right" id="wx-right"></section>
          </div>

          <div class="view v-transit" data-view="transit" hidden>
            <section class="panel${berlin ? " berlin" : ""}" id="tr-board-panel">
              ${depHead("trd")}
              <div class="scroll" id="tr-board"></div>
              <div class="tr-foot" id="tr-foot"></div>
            </section>
            <section class="panel${berlin ? " berlin" : ""}">
              <div class="panel-head"><span class="title"><ha-icon icon="mdi:map-marker-path"></ha-icon><span>${this._t("next_trains")}</span></span></div>
              <div class="chips tr-filter" id="tr-filter"></div>
              <div class="scroll"><div class="dirs" id="tr-dirs"></div></div>
            </section>
          </div>

          <div class="view v-shopping" data-view="shopping" hidden>
            <section class="panel">
              <div class="panel-head"><span class="title"><ha-icon icon="mdi:cart-outline"></ha-icon><span id="sh-title"></span></span><span class="meta" id="sh-count"></span></div>
              <div class="chips" id="sh-lists" style="margin-bottom:12px"></div>
              <form class="add" id="add-form" autocomplete="off">
                <input id="add-input" type="text" enterkeyhint="done" autocapitalize="sentences" autocorrect="on" />
                <button type="submit" class="btn" id="add-btn"><ha-icon icon="mdi:plus"></ha-icon></button>
              </form>
              <div class="chips sugg" id="add-sugg"></div>
              <div class="sh-bar"><span class="hint" id="sh-hint"></span>
                <div class="seg" id="sh-sort"><button data-sort="list"></button><button data-sort="az"></button></div>
              </div>
              <div class="scroll" id="sh-items" style="--item-min:150px"></div>
            </section>
            <section class="panel">
              <div class="panel-head"><span class="title"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon><span>${this._t("quick_add")}</span></span></div>
              <div class="scroll">
                <div id="sh-fav-wrap" hidden><div class="sec-h">${this._t("favorites")}</div><div class="chips" id="sh-fav"></div></div>
                <div class="sec-h">${this._t("recent")}</div>
                <div class="recent" id="sh-recent"></div>
              </div>
            </section>
          </div>

          <div class="view v-home" data-view="home" hidden>
            <section class="panel">
              <div class="panel-head"><span class="title"><ha-icon icon="mdi:floor-plan"></ha-icon><span class="plan-title"></span></span><span class="meta" id="hm-meta"></span></div>
              <div class="plan-body interactive" id="hm-plan"></div>
            </section>
            <section class="panel">
              <div class="panel-head"><span class="title"><ha-icon icon="mdi:lightbulb-group-outline"></ha-icon><span>${this._t("devices")}</span></span></div>
              <div class="scroll" id="hm-ents"></div>
            </section>
          </div>

          <div class="view v-clock" data-view="clock" hidden>
            <section class="panel cl-hero"><div class="time" id="cl-time"></div><div class="meta2" id="cl-meta"></div></section>
            <section class="panel">
              <div class="panel-head"><span class="title"><ha-icon icon="mdi:alarm"></ha-icon><span>${this._t("alarms")}</span></span>
                <button class="btn round" id="al-add" title="${this._t("add_alarm")}" style="height:34px;width:34px"><ha-icon icon="mdi:plus"></ha-icon></button></div>
              <div class="scroll" id="cl-alarms"></div>
            </section>
            <section class="panel">
              <div class="panel-head"><span class="title"><ha-icon icon="mdi:timer-sand"></ha-icon><span>${this._t("timers")}</span></span></div>
              <div class="chips" id="tm-presets"></div>
              <form class="tm-custom" id="tm-form" autocomplete="off"><input id="tm-min" type="number" inputmode="decimal" min="0" step="any" placeholder="${this._t(
                "custom_min"
              )}"/><button class="btn" type="submit"><ha-icon icon="mdi:play"></ha-icon></button></form>
              <div class="scroll" id="cl-timers" style="margin-top:6px"></div>
            </section>
            <section class="panel">
              <div class="panel-head"><span class="title"><ha-icon icon="mdi:timer-outline"></ha-icon><span>${this._t("stopwatch")}</span></span></div>
              <div class="sw-time" id="sw-time"></div>
              <div class="sw-btns"><button class="btn" id="sw-b1"></button><button class="btn" id="sw-b2"></button></div>
              <div class="scroll laps" id="sw-laps"></div>
            </section>
          </div>
        </div>

        <div class="overlay" id="ed-overlay" hidden>
          <form class="sheet" id="ed-sheet" autocomplete="off">
            <h3>${this._t("edit_item")}</h3>
            <label for="ed-name">${this._t("item_name")}</label>
            <input id="ed-name" type="text" autocapitalize="sentences" />
            <div id="ed-spec-wrap">
              <label for="ed-spec">${this._t("item_spec")}</label>
              <input id="ed-spec" type="text" placeholder="${esc(this._t("item_spec_placeholder"))}" />
              <div class="chips" id="ed-chips"></div>
            </div>
            <div class="btns">
              <button type="button" class="btn danger" id="ed-del">${this._t("delete")}</button>
              <span class="sp"></span>
              <button type="button" class="btn good" id="ed-done">${this._t("done")}</button>
              <button type="submit" class="btn primary">${this._t("save")}</button>
            </div>
          </form>
        </div>

        <div class="overlay" id="al-overlay" hidden>
          <form class="sheet" id="al-sheet" autocomplete="off">
            <h3>${this._t("edit_alarm")}</h3>
            <input id="al-time" type="time" required />
            <label>${this._t("repeat")}</label>
            <div class="days" id="al-days">${[1, 2, 3, 4, 5, 6, 7]
              .map((d) => `<button type="button" data-day="${d}">${this._t("days_short")[d - 1]}</button>`)
              .join("")}</div>
            <label for="al-label">${this._t("alarm_label")}</label>
            <input id="al-label" type="text" placeholder="${esc(this._t("alarm_label_placeholder"))}" />
            <div class="btns">
              <button type="button" class="btn danger" id="al-del">${this._t("delete")}</button>
              <span class="sp"></span>
              <button type="button" class="btn" id="al-cancel">${this._t("cancel")}</button>
              <button type="submit" class="btn primary">${this._t("save")}</button>
            </div>
          </form>
        </div>

        <div class="overlay ring" id="ring" hidden>
          <div class="ring-box">
            <ha-icon id="ring-icon" icon="mdi:alarm"></ha-icon>
            <div class="t" id="ring-time"></div>
            <div class="l" id="ring-label"></div>
            <div class="btns"><button class="btn" id="ring-snooze"></button><button class="btn primary" id="ring-stop">${this._t("stop")}</button></div>
          </div>
        </div>
        <div class="toast" id="toast" hidden></div>
      </ha-card>`;

    this._el = { card: this.shadowRoot.querySelector("ha-card") };
    const card = this._el.card;
    card.setAttribute("lang", this._hass?.locale?.language || this._lang);
    const layout = this._layout();
    card.style.setProperty("--idc-height", c.height);
    card.style.setProperty("--idc-areas", layout.areas);
    card.style.setProperty("--idc-columns", layout.columns);
    card.style.setProperty("--idc-rows", layout.rows);
    if (c.background) card.style.setProperty("--idc-bg", c.background);
    for (const sec of this.shadowRoot.querySelectorAll(".v-overview [data-area]")) sec.hidden = !layout.names.has(sec.dataset.area);

    // navigation
    card.addEventListener("click", (ev) => {
      const nav = ev.target.closest("[data-goto]");
      if (nav && !ev.target.closest("input, form, .room, [data-uid], [data-reopen]")) this._go(nav.dataset.goto);
    });
    // keep HA's global keyboard shortcuts (e, c, a, m …) from firing while typing
    for (const input of this.shadowRoot.querySelectorAll("input")) {
      for (const type of ["keydown", "keyup", "keypress"]) input.addEventListener(type, (ev) => ev.stopPropagation());
    }
    // unlock audio on first touch (iOS) + inactivity tracking
    card.addEventListener("pointerdown", () => {
      this._lastInteraction = Date.now();
      this._unlockAudio();
    });
    card.addEventListener("keydown", () => (this._lastInteraction = Date.now()));

    this._bindShopping();
    this._bindPress(this._$("hm-plan"), "[data-room]", (el, hold) => this._onEntityPress(this._roomAt(+el.dataset.room)?.entity, hold));
    this._bindPress(this._$("hm-ents"), "[data-entity]", (el, hold) => this._onEntityPress(el.dataset.entity, hold));
    this._bindTransit();
    this._bindClock();

    this._resizeObs?.disconnect();
    this._resizeObs = new ResizeObserver(() => {
      this._fitPlan(this._$("ov-plan"));
      this._fitPlan(this._$("hm-plan"));
    });
    this._resizeObs.observe(this._$("ov-plan"));
    this._resizeObs.observe(this._$("hm-plan"));
    this._built = true;
    const start = this._view && (this._tabs.includes(this._view) || this._view === "clock") ? this._view : c.default_tab;
    this._view = null;
    this._go(this._tabs.includes(start) || start === "clock" ? start : this._tabs[0]);
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
      start = { x: ev.clientX, y: ev.clientY };
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

  /* ---------- navigation */

  _go(view) {
    if (!this._built) return;
    if (view !== "clock" && !this._tabs.includes(view)) return;
    this._view = view;
    for (const v of this.shadowRoot.querySelectorAll("[data-view]")) v.hidden = v.dataset.view !== view;
    for (const b of this.shadowRoot.querySelectorAll(".tabbar [data-goto]")) b.classList.toggle("active", b.dataset.goto === view);
    this._renderView();
    this._syncStopwatchTimer();
  }

  _renderView() {
    const v = this._view;
    if (v === "overview") {
      this._ovClock();
      this._ovWeather();
      this._ovDep();
      this._ovTodo();
      this._renderPlan(this._$("ov-plan"), true);
    } else if (v === "weather") this._wxRender();
    else if (v === "transit") this._trRender();
    else if (v === "shopping") this._shRender();
    else if (v === "home") this._homeRender();
    else if (v === "clock") this._clRender();
    this._tbClock();
  }

  /** Re-renders the part of the active view that depends on `part`. */
  _refresh(part) {
    const v = this._view;
    const map = {
      weather: { overview: () => this._ovWeather(), weather: () => this._wxRender() },
      todo: { overview: () => this._ovTodo(), shopping: () => this._shRender() },
      dep: { overview: () => this._ovDep(), transit: () => this._trRender() },
      home: { overview: () => this._renderPlan(this._$("ov-plan")), home: () => this._homeRender() },
    };
    map[part]?.[v]?.();
  }

  _update(force) {
    if (!this._config || !this._hass) return;
    if (!this._built) {
      this._build();
      force = true;
    }
    this._ensureSubscriptions();

    const st = (id) => (id ? this._hass.states[id] : undefined);
    const changed = (key, vals) => {
      const prev = this._last[key];
      const diff = force || !prev || vals.length !== prev.length || vals.some((s, i) => s !== prev[i]);
      this._last[key] = vals;
      return diff;
    };
    if (changed("weather", [st(this._config.weather_entity), st("sun.sun")])) this._refresh("weather");
    if (changed("todo", [st(this._list)])) this._refresh("todo");
    if (changed("deps", this._depConf.map((d) => st(d.entity)))) this._refresh("dep");
    if (changed("home", this._homeEntityIds().map(st))) this._refresh("home");
  }

  /* ---------- subscriptions */

  _ensureSubscriptions() {
    const conn = this._hass?.connection;
    if (!conn || !this.isConnected) return;

    const wId = this._config.weather_entity;
    const wState = wId && this._hass.states[wId];
    const sf = wState?.attributes.supported_features || 0;
    const has = { daily: !!(sf & 1), hourly: !!(sf & 2), twice_daily: !!(sf & 4) };
    const dailyType = has.daily ? "daily" : has.twice_daily ? "twice_daily" : null;

    for (const [key, type, want] of [
      ["hourly", "hourly", has.hourly],
      ["daily", dailyType, !!dailyType],
    ]) {
      this._syncSub(
        `fc_${key}`,
        want ? `${wId}|${type}` : null,
        { type: "weather/subscribe_forecast", forecast_type: type, entity_id: wId },
        (msg) => {
          this._forecast[key] = { type, list: msg.forecast || [] };
          this._refresh("weather");
        },
        () => delete this._forecast[key]
      );
    }

    const tId = this._list;
    this._syncSub(
      "todo",
      tId && this._hass.states[tId] ? tId : null,
      { type: "todo/item/subscribe", entity_id: tId },
      (msg) => {
        this._items = msg.items || [];
        this._pending.clear();
        this._refresh("todo");
      },
      () => (this._items = null)
    );

    this._syncSub(
      "userdata",
      USER_DATA_KEY,
      { type: "frontend/subscribe_user_data", key: USER_DATA_KEY },
      (msg) => this._setUserData(msg.value),
      () => {},
      () => this._loadUserDataFallback()
    );
  }

  _syncSub(key, desired, message, cb, reset, onError) {
    if (this._subKeys[key] === desired && (desired === null || this._subs[key])) return;
    this._unsubscribe(key);
    reset();
    this._subKeys[key] = desired;
    if (!desired) return;
    this._subs[key] = this._hass.connection.subscribeMessage(cb, message).catch((err) => {
      console.warn(`[${CARD_TAG}] subscription ${key} failed`, err);
      onError?.(err);
      return null;
    });
  }

  _unsubscribe(key) {
    const p = this._subs[key];
    delete this._subs[key];
    delete this._subKeys[key];
    if (p) p.then((unsub) => unsub && unsub()).catch(() => {});
  }

  /* ---------- stored data (alarms) */

  _setUserData(value) {
    this._data = { alarms: [], ...(value || lsGet(USER_DATA_KEY, {}) || {}) };
    if (this._view === "clock") this._clRender();
    if (this._view === "overview") this._ovClock();
    this._tbClock();
  }

  async _loadUserDataFallback() {
    try {
      const r = await this._hass.callWS({ type: "frontend/get_user_data", key: USER_DATA_KEY });
      this._setUserData(r?.value);
    } catch (e) {
      this._setUserData(null);
    }
  }

  async _saveUserData() {
    lsSet(USER_DATA_KEY, this._data);
    try {
      await this._hass.callWS({ type: "frontend/set_user_data", key: USER_DATA_KEY, value: this._data });
    } catch (e) {
      console.warn(`[${CARD_TAG}] could not store user data, using this device only`, e);
    }
  }

  /* ---------- clock tick */

  _tick() {
    if (!this._built || !this._hass) return;
    const now = Date.now();
    const time = this._fmtTime(now);
    const sec = this._config.show_seconds ? pad2(new Date(now).getSeconds()) : "";
    const key = time + sec;
    if (key !== this._last.clock) {
      const minuteChanged = time !== this._last.clockMin;
      this._last.clock = key;
      this._last.clockMin = time;
      if (this._view === "overview") this._ovClock();
      this._tbClock();
      for (const id of ["ovd-meta", "trd-meta"]) if (this._config.departure_style === "berlin") this._$(id).textContent = time;
      if (minuteChanged) {
        this._checkAlarms(now);
        this._refresh("weather");
      }
    }
    if (this._view === "clock") this._clTick();
    this._checkTimers(now);
    if (!this._last.depTick || now - this._last.depTick > 15000) {
      this._last.depTick = now;
      this._refresh("dep");
    }
    const ret = +this._config.return_to_overview || 0;
    if (ret > 0 && this._view !== this._tabs[0] && now - this._lastInteraction > ret * 1000 && !this._ringing && !this._sheetOpen()) {
      this._go(this._tabs[0]);
    }
  }

  _sheetOpen() {
    return !this._$("ed-overlay").hidden || !this._$("al-overlay").hidden;
  }

  _tbClock() {
    const el = this._$("tb-clock");
    if (!el) return;
    el.hidden = this._view === "overview";
    const next = this._nextAlarm();
    const running = this._timers.length || this._sw.start;
    el.innerHTML = `${next ? `<ha-icon icon="mdi:alarm"></ha-icon>` : ""}${running ? `<ha-icon icon="mdi:timer-sand"></ha-icon>` : ""}${esc(
      this._fmtTime(Date.now())
    )}`;
  }

  /* ================================================================ overview */

  _ovClock() {
    const now = Date.now();
    const sec = this._config.show_seconds ? `<span class="sec">${pad2(new Date(now).getSeconds())}</span>` : "";
    this._$("ov-time").innerHTML = `${esc(this._fmtTime(now))}${sec}`;
    this._$("ov-date").textContent = this._fmt(now, { weekday: "long", day: "numeric", month: "long" });
    const info = [];
    const next = this._nextAlarm();
    if (next) info.push(`<span><ha-icon icon="mdi:alarm"></ha-icon>${esc(this._alarmWhen(next.ts))}${next.alarm.label ? ` · ${esc(next.alarm.label)}` : ""}</span>`);
    for (const t of this._timers) info.push(`<span><ha-icon icon="mdi:timer-sand"></ha-icon>${fmtDuration(t.end - now)}${t.label ? ` · ${esc(t.label)}` : ""}</span>`);
    if (this._sw.start) info.push(`<span><ha-icon icon="mdi:timer-outline"></ha-icon>${fmtDuration(this._swElapsed())}</span>`);
    this._$("ov-info").innerHTML = info.join("");
  }

  _alarmWhen(ts) {
    const today = this._dayKey(Date.now());
    const tomorrow = this._dayKey(Date.now() + 86400000);
    const k = this._dayKey(ts);
    const day = k === today ? "" : k === tomorrow ? `${this._t("tomorrow")}, ` : `${this._weekdayShort(ts)}, `;
    return `${day}${this._fmtTime(ts)}`;
  }

  /* ================================================================ weather */

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
    return [...byDay.values()].map((d) => ({ ...d, condition: Object.entries(d._c).sort((a, b) => b[1] - a[1])[0]?.[0] || "cloudy" }));
  }

  /** Common weather data or an error HTML string. */
  _wx() {
    const id = this._config.weather_entity;
    if (!id) return { error: `<div class="msg">${this._t("not_configured")}</div>` };
    const s = this._hass.states[id];
    if (!s) return { error: `<div class="msg error">${this._t("not_found")}: ${esc(id)}</div>` };
    if (s.state === "unavailable" || s.state === "unknown")
      return { error: `<div class="msg">${esc(s.attributes.friendly_name || id)} ${this._t("unavailable")}</div>` };
    const now = Date.now();
    const sun = this._hass.states["sun.sun"];
    const night = s.state === "clear-night" || (sun ? sun.state === "below_horizon" : this._isNight(now));
    const days = this._dailyList();
    const todayKey = this._dayKey(now);
    const today = days.find((d) => this._dayKey(Date.parse(d.datetime)) === todayKey);
    const a = s.attributes;
    const hl =
      today && Number.isFinite(today.temperature)
        ? `${this._t("high")}: ${this._round(today.temperature)}° ${this._t("low")}: ${this._round(today.templow)}°`
        : "";
    return { s, a, now, night, days, today, todayKey, hl, loc: this._config.weather_location || a.friendly_name || "" };
  }

  _applyGradient(el, w) {
    el.classList.toggle("grad", !!this._config.weather_gradient && !!w?.s);
    if (w?.s && this._config.weather_gradient) {
      const [ga, gb] = gradientFor(w.s.state, w.night);
      el.style.setProperty("--w-a", ga);
      el.style.setProperty("--w-b", gb);
    }
  }

  _hoursHtml(w, n) {
    const hourly = (this._forecast.hourly?.list || []).filter((f) => Date.parse(f.datetime) > w.now - 3600000).slice(0, n);
    if (!hourly.length) return "";
    return `<div class="w-hours" style="--n:${hourly.length}">${hourly
      .map((f, i) => {
        const ts = Date.parse(f.datetime);
        const label = i === 0 && ts <= w.now ? this._t("now_hour") : this._fmt(ts, { hour: "2-digit", hour12: this._hour12 }).replace(/\s?Uhr$/, "");
        const night = f.is_daytime === false || (f.is_daytime === undefined && this._isNight(ts));
        const pp = f.precipitation_probability;
        return `<div class="w-hour"><span class="h">${esc(label)}</span>${weatherSvg(f.condition, night)}<span class="p">${
          pp >= 20 ? `${this._round(pp)} %` : ""
        }</span><span>${this._round(f.temperature)}°</span></div>`;
      })
      .join("")}</div>`;
  }

  _daysHtml(w, n) {
    const startOfToday = new Date(w.now).setHours(0, 0, 0, 0);
    const dl = w.days.filter((d) => Date.parse(d.datetime) >= startOfToday - 3600000).slice(0, n);
    if (!dl.length) return "";
    const curT = w.a.temperature != null && Number.isFinite(+w.a.temperature) ? +w.a.temperature : null;
    const lo = Math.min(...dl.map((d) => d.templow).filter(Number.isFinite), curT ?? Infinity);
    const hi = Math.max(...dl.map((d) => d.temperature).filter(Number.isFinite), curT ?? -Infinity);
    const span = Math.max(1, hi - lo);
    return dl
      .map((d) => {
        const ts = Date.parse(d.datetime);
        const isToday = this._dayKey(ts) === w.todayKey;
        const label = isToday ? this._t("today") : this._weekdayShort(ts);
        const dLo = Number.isFinite(d.templow) ? d.templow : d.temperature;
        const dHi = d.temperature;
        const left = ((dLo - lo) / span) * 100;
        const width = Math.max(4, ((dHi - dLo) / span) * 100);
        const cur = isToday && curT != null ? `<b style="left:${((curT - lo) / span) * 100}%"></b>` : "";
        const pp = d.precipitation_probability;
        return `<div class="w-day"><span>${esc(label)}</span><span class="ic">${weatherSvg(d.condition, false)}<span class="p">${
          pp >= 20 ? `${this._round(pp)} %` : ""
        }</span></span><span class="lo">${this._round(dLo)}°</span><span class="bar"><i style="left:${left}%;width:${width}%;background:linear-gradient(90deg,${tempColor(
          dLo
        )},${tempColor(dHi)})"></i>${cur}</span><span class="hi">${this._round(dHi)}°</span></div>`;
      })
      .join("");
  }

  _ovWeather() {
    const el = this._$("ov-weather");
    const w = this._wx();
    this._applyGradient(el, w);
    if (w.error) {
      el.innerHTML = `<div class="panel-head"><span class="title">${this._t("weather")}</span></div>${w.error}`;
      return;
    }
    const n = Math.max(0, Math.min(+this._config.forecast_hours || 0, 8));
    const hours = n ? this._hoursHtml(w, n) : "";
    el.innerHTML = `
      <div class="w-top">
        <div style="min-width:0"><div class="w-loc">${esc(w.loc)}</div><div class="w-temp">${this._round(w.a.temperature)}°</div></div>
        <div class="w-right">${weatherSvg(w.s.state, w.night)}<span class="c">${esc(this._condLabel(w.s.state, w.s))}</span><span>${esc(w.hl)}</span></div>
      </div>
      ${hours ? `<div class="w-mod" style="margin-top:auto">${hours}</div>` : ""}`;
  }

  _wxRender() {
    const left = this._$("wx-left");
    const right = this._$("wx-right");
    const w = this._wx();
    this._applyGradient(left, w);
    this._applyGradient(right, w);
    if (w.error) {
      left.innerHTML = w.error;
      right.innerHTML = "";
      return;
    }
    const a = w.a;
    const r = (v) => this._round(v);
    const tiles = [];
    const tile = (icon, k, v, s = "") =>
      tiles.push(`<div class="wt"><div class="k"><ha-icon icon="${icon}"></ha-icon>${esc(k)}</div><div class="v">${v}</div><div class="s">${s}</div></div>`);
    if (a.apparent_temperature != null) tile("mdi:thermometer", this._t("feels_like"), `${r(a.apparent_temperature)}°`);
    if (a.humidity != null) tile("mdi:water-percent", this._t("humidity"), `${r(a.humidity)}<small>%</small>`, a.dew_point != null ? esc(this._t("dew_point", `${r(a.dew_point)}°`)) : "");
    if (a.wind_speed != null) {
      const unit = esc(a.wind_speed_unit || "km/h");
      let dir = "";
      let arrow = "";
      const b = Number.isFinite(+a.wind_bearing) ? +a.wind_bearing : null;
      if (b != null) {
        dir = this._t("compass")[Math.round(b / 45) % 8];
        arrow = `<svg class="arrow" viewBox="0 0 24 24" style="transform:rotate(${b + 180}deg)"><path fill="currentColor" d="M12 2l6 18-6-4-6 4z"/></svg>`;
      } else if (typeof a.wind_bearing === "string") dir = a.wind_bearing;
      tile("mdi:weather-windy", this._t("wind"), `${r(a.wind_speed)}<small>${unit}</small>${arrow}`, [dir, a.wind_gust_speed != null ? this._t("gusts", `${r(a.wind_gust_speed)} ${unit}`) : ""].filter(Boolean).map(esc).join(" · "));
    }
    if (a.uv_index != null) {
      const uv = +a.uv_index;
      const lvl = this._t("uv_levels")[uv < 3 ? 0 : uv < 6 ? 1 : uv < 8 ? 2 : uv < 11 ? 3 : 4];
      tile("mdi:sun-wireless-outline", this._t("uv"), r(uv), esc(lvl));
    }
    if (a.pressure != null) tile("mdi:gauge", this._t("pressure"), `${r(a.pressure)}<small>${esc(a.pressure_unit || "hPa")}</small>`);
    if (a.visibility != null) tile("mdi:eye-outline", this._t("visibility"), `${r(a.visibility)}<small>${esc(a.visibility_unit || "km")}</small>`);
    if (a.cloud_coverage != null) tile("mdi:cloud-outline", this._t("clouds"), `${r(a.cloud_coverage)}<small>%</small>`);
    const prec = w.today?.precipitation;
    if (prec != null) tile("mdi:water-outline", this._t("precipitation"), `${Math.round(prec * 10) / 10}<small>${esc(a.precipitation_unit || "mm")}</small>`, this._t("today_total"));
    const sun = this._hass.states["sun.sun"];
    if (sun?.attributes.next_rising) {
      const rise = Date.parse(sun.attributes.next_rising);
      const set = Date.parse(sun.attributes.next_setting);
      const first = Math.min(rise, set);
      tile(
        first === rise ? "mdi:weather-sunset-up" : "mdi:weather-sunset-down",
        first === rise ? this._t("sunrise") : this._t("sunset"),
        esc(this._fmtTime(first)),
        esc(`${first === rise ? this._t("sunset") : this._t("sunrise")} ${this._fmtTime(first === rise ? set : rise)}`)
      );
    }

    left.innerHTML = `
      <div class="wx-hero">
        <div class="w-loc">${esc(w.loc)}</div>
        <div class="big">${this._round(a.temperature)}°${weatherSvg(w.s.state, w.night)}</div>
        <div class="c">${esc(this._condLabel(w.s.state, w.s))}</div>
        <div class="hl">${esc(w.hl)}</div>
      </div>
      <div class="wx-tiles">${tiles.join("")}</div>`;

    const nD = Math.max(1, Math.min(+this._config.forecast_days || 10, 15));
    const days = this._daysHtml(w, nD);
    right.innerHTML = `
      ${this._hours24Html(w)}
      <div class="w-mod" style="display:flex;flex-direction:column;min-height:0;flex:1">
        <div class="w-mod-h"><ha-icon icon="mdi:calendar-blank-outline"></ha-icon>${this._t("daily", Math.min(nD, w.days.length))}</div>
        <div class="w-days wx-days">${days}</div>
      </div>`;
  }

  /** 24 h strip with a temperature curve. */
  _hours24Html(w) {
    const list = (this._forecast.hourly?.list || []).filter((f) => Date.parse(f.datetime) > w.now - 3600000).slice(0, 24);
    if (!list.length) return "";
    const cw = 54;
    const n = list.length;
    const temps = list.map((f) => +f.temperature);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const span = Math.max(1, max - min);
    const H = 64;
    const pts = temps.map((t, i) => [i * cw + cw / 2, 20 + (1 - (t - min) / span) * (H - 30)]);
    const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    const area = `${path} L${pts[n - 1][0]} ${H} L${pts[0][0]} ${H} Z`;
    const stops = temps.map((t, i) => `<stop offset="${n > 1 ? (i / (n - 1)) * 100 : 0}%" stop-color="${tempColor(t)}"/>`).join("");
    const labels = pts.map((p, i) => `<text x="${p[0]}" y="${p[1] - 8}">${this._round(temps[i])}°</text>`).join("");
    const width = n * cw;
    const row = (cells) => `<div class="hs-row">${cells.join("")}</div>`;
    return `<div class="w-mod">
      <div class="w-mod-h"><ha-icon icon="mdi:clock-outline"></ha-icon>${this._t("hours24")}</div>
      <div class="hs"><div class="hs-in" style="--n:${n};--cw:${cw}px;width:${width}px">
        ${row(
          list.map((f, i) => {
            const ts = Date.parse(f.datetime);
            return `<span class="h">${i === 0 && ts <= w.now ? this._t("now_hour") : esc(this._fmt(ts, { hour: "2-digit", hour12: this._hour12 }).replace(/\s?Uhr$/, ""))}</span>`;
          })
        )}
        ${row(list.map((f) => weatherSvg(f.condition, f.is_daytime === false || (f.is_daytime === undefined && this._isNight(Date.parse(f.datetime))))))}
        ${row(list.map((f) => `<span class="p">${f.precipitation_probability >= 10 ? `${this._round(f.precipitation_probability)} %` : ""}</span>`))}
        <svg class="chart" width="${width}" height="${H}" viewBox="0 0 ${width} ${H}">
          <defs><linearGradient id="tg" x1="0" x2="1" y1="0" y2="0">${stops}</linearGradient>
          <linearGradient id="ta" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
          <path d="${area}" fill="url(#ta)"/>
          <path d="${path}" fill="none" stroke="url(#tg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          ${labels}
        </svg>
      </div></div>
    </div>`;
  }

  /* ================================================================ floor plan / home */

  _roomAt(i) {
    return (this._config.floorplan?.rooms || [])[i];
  }

  _homeEntityIds() {
    const rooms = (this._config.floorplan?.rooms || []).map((r) => r.entity).filter(Boolean);
    const extra = (this._config.home_entities || []).map((e) => (typeof e === "string" ? e : e.entity)).filter(Boolean);
    return [...new Set([...rooms, ...extra])];
  }

  _renderPlan(body, force) {
    if (!body) return;
    const fp = this._config.floorplan || {};
    for (const t of this.shadowRoot.querySelectorAll(".plan-title")) t.textContent = fp.title || this._t("floorplan");
    if (!fp.image) {
      body.innerHTML = `<div class="plan-ph"><div><ha-icon icon="mdi:floor-plan"></ha-icon>${esc(this._t("floorplan_hint"))}</div></div>`;
      return;
    }
    if (force || !body.querySelector(".plan-wrap")) {
      body.innerHTML = `<div class="plan-wrap"><img alt="" src="${esc(fp.image)}" class="${fp.invert ? "invert" : ""}"/><div class="rooms"></div></div>`;
      body.querySelector("img").addEventListener("load", () => this._fitPlan(body));
    }
    const rooms = fp.rooms || [];
    let on = 0;
    body.querySelector(".rooms").innerHTML = rooms
      .map((r, i) => {
        const s = r.entity ? this._hass.states[r.entity] : undefined;
        const lit = isOn(s);
        if (lit) on++;
        const label = r.label === false ? "" : r.name || "";
        return `<div class="room${lit ? " on" : ""}" data-room="${i}" style="left:${+r.x || 0}%;top:${+r.y || 0}%;width:${+r.w || 10}%;height:${
          +r.h || 10
        }%">${label || r.icon ? `<span class="rl">${r.icon ? `<ha-icon icon="${esc(r.icon)}"></ha-icon>` : ""}${esc(label)}</span>` : ""}</div>`;
      })
      .join("");
    const meta = rooms.some((r) => r.entity) ? this._t("lights_on", on) : "";
    if (body.id === "ov-plan") this._$("ovp-meta").textContent = meta;
    else this._$("hm-meta").textContent = meta;
    this._fitPlan(body);
  }

  _fitPlan(body) {
    const wrap = body?.querySelector(".plan-wrap");
    const img = wrap?.querySelector("img");
    if (!wrap || !img || !img.naturalWidth || !body.clientWidth) return;
    const ar = img.naturalWidth / img.naturalHeight;
    let w = body.clientWidth;
    let h = w / ar;
    if (h > body.clientHeight) {
      h = body.clientHeight;
      w = h * ar;
    }
    wrap.style.width = `${Math.floor(w)}px`;
    wrap.style.height = `${Math.floor(h)}px`;
  }

  _homeRender() {
    this._renderPlan(this._$("hm-plan"), !this._$("hm-plan").querySelector(".plan-wrap"));
    const ids = this._homeEntityIds();
    const names = {};
    for (const r of this._config.floorplan?.rooms || []) if (r.entity && r.name) names[r.entity] = r.name;
    for (const e of this._config.home_entities || []) if (typeof e === "object" && e.entity && e.name) names[e.entity] = e.name;
    const el = this._$("hm-ents");
    if (!ids.length) {
      el.innerHTML = `<div class="msg">${esc(this._t("no_devices"))}</div>`;
      return;
    }
    el.innerHTML = `<div class="ents">${ids
      .map((id) => {
        const s = this._hass.states[id];
        const name = names[id] || s?.attributes.friendly_name || id;
        const icon = s?.attributes.icon || (id.startsWith("light.") ? "mdi:lightbulb" : id.startsWith("switch.") ? "mdi:power-socket-eu" : "mdi:circle-outline");
        const state = s ? (this._hass.formatEntityState ? this._hass.formatEntityState(s) : s.state) : this._t("not_found");
        return `<div class="ent${isOn(s) ? " on" : ""}" data-entity="${esc(id)}"><ha-icon icon="${esc(icon)}"></ha-icon><span class="n">${esc(name)}</span><span class="st">${esc(state)}</span></div>`;
      })
      .join("")}</div>`;
  }

  _onEntityPress(entity, hold) {
    if (!entity) return;
    if (hold) {
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: entity }, bubbles: true, composed: true }));
    } else {
      this._hass.callService("homeassistant", "toggle", {}, { entity_id: entity }).catch((e) => this._notify(e));
    }
  }

  /* ================================================================ shopping list */

  get _todoSupportsDesc() {
    const s = this._hass.states[this._list];
    return ((s?.attributes.supported_features || 0) & 64) !== 0;
  }

  _todoState() {
    const id = this._list;
    const s = id && this._hass.states[id];
    if (!id) return { error: `<div class="msg">${this._t("not_configured")}</div>` };
    if (!s) return { error: `<div class="msg error">${this._t("not_found")}: ${esc(id)}</div>` };
    const items = this._items || [];
    return {
      s,
      loading: this._items === null,
      open: items.filter((i) => i.status === "needs_action"),
      done: items.filter((i) => i.status === "completed"),
      title: this._config.title_todo || this._t("shopping"),
      listName: s.attributes.friendly_name || id,
    };
  }

  _ovTodo() {
    const t = this._todoState();
    this._$("ovt-title").textContent = t.title || this._t("shopping");
    this._$("ovt-count").textContent = t.open ? this._t("items", t.open.length) : "";
    const el = this._$("ov-todo");
    if (t.error) return void (el.innerHTML = t.error);
    if (t.loading) return void (el.innerHTML = "");
    if (!t.open.length) return void (el.innerHTML = `<div class="msg">${this._t("empty_list")}</div>`);
    const max = 16;
    el.innerHTML = `<div class="ov-items">${t.open
      .slice(0, max)
      .map((i) => `<span>${esc(i.summary)}${i.description ? `<small>${esc(i.description)}</small>` : ""}</span>`)
      .join("")}${t.open.length > max ? `<span class="more">${esc(this._t("more", t.open.length - max))}</span>` : ""}</div>`;
  }

  _bindShopping() {
    this._$("add-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      this._addItem();
    });
    this._$("add-input").addEventListener("input", () => this._renderSuggestions());
    this._$("add-sugg").addEventListener("click", (ev) => {
      const chip = ev.target.closest("[data-reopen]");
      if (!chip) return;
      ev.preventDefault();
      this._reopen(chip.dataset.reopen);
      this._$("add-input").value = "";
      this._renderSuggestions();
    });
    this._$("sh-lists").addEventListener("click", (ev) => {
      const chip = ev.target.closest("[data-list]");
      if (!chip || chip.dataset.list === this._list) return;
      this._list = chip.dataset.list;
      this._items = null;
      this._ensureSubscriptions();
      this._shRender();
    });
    this._$("sh-sort").addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-sort]");
      if (!b) return;
      this._shSort = b.dataset.sort;
      lsSet("idc_sh_sort", this._shSort);
      this._shRender();
    });
    const press = (el, hold, ev) => this._onTodoPress(el, hold, ev);
    this._bindPress(this._$("sh-items"), "[data-uid]", press);
    this._bindPress(this._$("sh-recent"), "[data-reopen]", press);
    this._$("sh-fav").addEventListener("click", (ev) => {
      const chip = ev.target.closest("[data-fav]");
      if (!chip) return;
      this._$("add-input").value = chip.dataset.fav;
      this._addItem();
    });

    // edit sheet
    const close = () => this._closeEdit();
    this._$("ed-overlay").addEventListener("click", (ev) => {
      if (ev.target.id === "ed-overlay") close();
    });
    this._$("ed-sheet").addEventListener("keydown", (ev) => ev.key === "Escape" && close());
    this._$("ed-chips").addEventListener("click", (ev) => {
      const chip = ev.target.closest("[data-spec]");
      if (!chip) return;
      ev.preventDefault();
      this._$("ed-spec").value = chip.dataset.spec;
    });
    this._$("ed-sheet").addEventListener("submit", (ev) => {
      ev.preventDefault();
      this._saveEdit();
    });
    this._$("ed-done").addEventListener("click", () => this._saveEdit("completed"));
    this._$("ed-del").addEventListener("click", () => {
      const item = this._editItem;
      close();
      if (item) this._callTodo("remove_item", { item: item.uid });
    });
  }

  _shRender() {
    const t = this._todoState();
    this._$("sh-title").textContent = t.title || this._t("shopping");
    this._$("sh-count").textContent = t.open ? `${this._lists.length < 2 ? `${t.listName} · ` : ""}${this._t("items", t.open.length)}` : "";
    this._$("add-input").placeholder = this._t("add_placeholder");
    this._$("sh-hint").textContent = this._t("shop_hint");
    for (const b of this._$("sh-sort").children) {
      b.textContent = this._t(b.dataset.sort === "az" ? "sort_az" : "sort_list");
      b.classList.toggle("sel", b.dataset.sort === this._shSort);
    }
    const lists = this._$("sh-lists");
    lists.hidden = this._lists.length < 2;
    lists.innerHTML = this._lists
      .map((id) => `<button class="chip${id === this._list ? " sel" : ""}" data-list="${esc(id)}">${esc(this._hass.states[id]?.attributes.friendly_name || id)}</button>`)
      .join("");
    this._$("add-form").hidden = !!t.error;
    const items = this._$("sh-items");
    const recent = this._$("sh-recent");
    if (t.error) {
      items.innerHTML = t.error;
      recent.innerHTML = "";
      return;
    }
    if (t.loading) {
      items.innerHTML = "";
      recent.innerHTML = "";
      return;
    }
    const open = this._shSort === "az" ? [...t.open].sort((a, b) => a.summary.localeCompare(b.summary, this._lang)) : t.open;
    const scroll = items.scrollTop;
    items.innerHTML = open.length
      ? `<div class="items">${open
          .map(
            (i) => `<div class="item${this._pending.has(i.uid) ? " pending" : ""}" data-uid="${esc(i.uid)}" role="button">
              <span class="n">${esc(i.summary)}</span>${i.description ? `<span class="s">${esc(i.description)}</span>` : ""}
              <span class="e" data-edit="1"><ha-icon icon="mdi:pencil-outline"></ha-icon></span>
            </div>`
          )
          .join("")}</div>`
      : `<div class="msg">${this._t("empty_list")}</div>`;
    items.scrollTop = scroll;

    const seen = new Set(t.open.map((i) => i.summary.toLowerCase()));
    const done = t.done.filter((i) => !seen.has(i.summary.toLowerCase())).slice(0, Math.max(0, +this._config.show_completed || 0));
    recent.innerHTML = done.length
      ? `<div class="chips">${done
          .map((i) => `<button class="chip" data-reopen="${esc(i.uid)}"><ha-icon icon="mdi:plus" style="--mdc-icon-size:15px"></ha-icon>${esc(i.summary)}</button>`)
          .join("")}</div>`
      : `<div class="msg">–</div>`;
    const favs = Array.isArray(this._config.quick_items) ? this._config.quick_items : [];
    this._$("sh-fav-wrap").hidden = !favs.length;
    this._$("sh-fav").innerHTML = favs
      .map((f) => {
        const onList = seen.has(String(f).toLowerCase());
        return `<button class="chip${onList ? " sel" : ""}" data-fav="${esc(f)}"${onList ? " disabled" : ""}>${esc(f)}</button>`;
      })
      .join("");
    this._renderSuggestions();
  }

  _renderSuggestions() {
    const el = this._$("add-sugg");
    const q = this._$("add-input").value.trim().toLowerCase().split(this._config.spec_separator || "\u0000")[0].trim();
    if (!q || !this._items) return void (el.innerHTML = "");
    const openNames = new Set(this._items.filter((i) => i.status === "needs_action").map((i) => i.summary.toLowerCase()));
    const matches = this._items
      .filter((i) => i.status === "completed" && !openNames.has(i.summary.toLowerCase()) && i.summary.toLowerCase().includes(q))
      .sort((a, b) => a.summary.toLowerCase().indexOf(q) - b.summary.toLowerCase().indexOf(q))
      .slice(0, 8);
    el.innerHTML = matches
      .map((i) => `<button class="chip" data-reopen="${esc(i.uid)}"><ha-icon icon="mdi:history" style="--mdc-icon-size:15px"></ha-icon>${esc(i.summary)}</button>`)
      .join("");
  }

  _onTodoPress(el, hold, ev) {
    if (el.dataset.reopen) {
      if (hold) return this._openEdit(el.dataset.reopen);
      el.disabled = true;
      return this._reopen(el.dataset.reopen);
    }
    const uid = el.dataset.uid;
    if (hold || ev?.target?.closest?.("[data-edit]")) return this._openEdit(uid);
    if (this._pending.has(uid)) return;
    const item = this._items?.find((i) => i.uid === uid);
    this._pending.add(uid);
    el.classList.add("pending");
    this._callTodo("update_item", { item: uid, status: "completed" }, uid).then((ok) => {
      if (ok && item) this._toast(this._t("completed_toast", item.summary), () => this._reopen(uid));
    });
  }

  _reopen(uid) {
    return this._callTodo("update_item", { item: uid, status: "needs_action" });
  }

  _callTodo(service, data, pendingUid) {
    return this._hass
      .callService("todo", service, data, { entity_id: this._list })
      .then(() => true)
      .catch((err) => {
        if (pendingUid) this._pending.delete(pendingUid);
        this._refresh("todo");
        this._notify(err);
        return false;
      });
  }

  _addItem() {
    const input = this._$("add-input");
    const raw = input.value.trim();
    if (!raw || !this._items) return;
    let summary = raw;
    let description;
    const sep = this._config.spec_separator;
    if (sep && this._todoSupportsDesc && raw.includes(sep)) {
      const idx = raw.indexOf(sep);
      summary = raw.slice(0, idx).trim();
      description = raw.slice(idx + sep.length).trim() || undefined;
    }
    if (!summary) return;
    input.value = "";
    this._renderSuggestions();
    const existing = this._items.find((i) => i.summary.toLowerCase() === summary.toLowerCase());
    let call;
    if (existing) {
      if (existing.status === "needs_action" && !description) return;
      const data = { item: existing.uid, status: "needs_action" };
      if (description) data.description = description;
      call = this._callTodo("update_item", data);
    } else {
      const data = { item: summary };
      if (description) data.description = description;
      call = this._callTodo("add_item", data);
    }
    call.then((ok) => {
      if (!ok) input.value = raw;
    });
  }

  _openEdit(uid) {
    const item = this._items?.find((i) => i.uid === uid);
    if (!item) return;
    this._editItem = item;
    this._$("ed-done").hidden = item.status !== "needs_action";
    this._$("ed-name").value = item.summary;
    this._$("ed-spec").value = item.description || "";
    this._$("ed-spec-wrap").hidden = !this._todoSupportsDesc;
    const sugg = Array.isArray(this._config.spec_suggestions) ? this._config.spec_suggestions : [];
    this._$("ed-chips").innerHTML = sugg.map((s) => `<button type="button" class="chip" data-spec="${esc(s)}">${esc(s)}</button>`).join("");
    this._$("ed-overlay").hidden = false;
    setTimeout(() => (this._todoSupportsDesc ? this._$("ed-spec") : this._$("ed-name")).focus(), 50);
  }

  _closeEdit() {
    this._$("ed-overlay").hidden = true;
    this._editItem = null;
    this.shadowRoot.activeElement?.blur?.();
  }

  _saveEdit(status) {
    const item = this._editItem;
    if (!item) return this._closeEdit();
    const name = this._$("ed-name").value.trim();
    const spec = this._$("ed-spec").value.trim();
    const data = { item: item.uid };
    if (name && name !== item.summary) data.rename = name;
    if (this._todoSupportsDesc && spec !== (item.description || "")) data.description = spec;
    if (status) data.status = status;
    this._closeEdit();
    if (Object.keys(data).length > 1) this._callTodo("update_item", data);
  }

  _toast(text, undo) {
    const el = this._$("toast");
    clearTimeout(this._toastTimer);
    el.innerHTML = `<span>${esc(text)}</span>${undo ? `<button class="btn">${this._t("undo")}</button>` : ""}`;
    el.hidden = false;
    el.querySelector("button")?.addEventListener("click", () => {
      el.hidden = true;
      undo();
    });
    this._toastTimer = setTimeout(() => (el.hidden = true), 5000);
  }

  _notify(err) {
    console.error(`[${CARD_TAG}]`, err);
    this.dispatchEvent(new CustomEvent("hass-notification", { detail: { message: err?.message || String(err) }, bubbles: true, composed: true }));
  }

  /* ================================================================ departures */

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
    let updated = 0;
    this._depConf.forEach((conf, idx) => {
      const s = this._hass.states[conf.entity];
      if (!s) return void errors.push(conf.entity);
      if (s.last_updated) updated = Math.max(updated, Date.parse(s.last_updated) || 0);
      const group = conf.name || s.attributes.friendly_name || conf.entity;
      const attrName = conf.attribute || this._config.departures_attribute;
      let list = attrName ? getPath(s.attributes, attrName) : undefined;
      if (!attrName) {
        const key = DEPARTURE_LIST_KEYS.find((k) => Array.isArray(s.attributes[k]));
        list = key ? s.attributes[key] : Object.values(s.attributes).find((v) => Array.isArray(v) && v.length && typeof v[0] === "object");
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
    const list = out
      .filter((d) => d.ts >= now - 30000)
      .filter((d) => minMin <= 0 || (d.ts - now) / 60000 >= minMin)
      .filter((d) => !lineFilter.length || lineFilter.includes(d.line.toLowerCase()))
      .filter((d) => !destExclude.some((x) => d.destination.toLowerCase().includes(x)))
      .sort((a, b) => (this._config.group_departures ? a.groupIdx - b.groupIdx : 0) || a.ts - b.ts);
    return { list, errors, now, updated };
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
    const planned = parseTime(this._readField(raw, "planned", conf), now);
    const cancelled = this._readField(raw, "cancelled", conf);
    const alerts = this._readField(raw, "alerts", conf);
    const line_ = String(line ?? "").trim() || "•";
    const dest_ = String(destination ?? "").trim();
    return {
      line: line_,
      destination: dest_,
      dir: `${line_}|${String(attrs.direction || dest_)}`,
      ts,
      planned,
      delay: delay ?? 0,
      realtime: delay != null || raw.estimated != null,
      platform: this._readField(raw, "platform", conf),
      cancelled: cancelled === true || cancelled === "true" || cancelled === 1,
      alerts: Array.isArray(alerts) ? alerts.length > 0 : !!alerts,
      alertText: Array.isArray(alerts) ? alerts.map((a) => (typeof a === "string" ? a : a?.header || a?.text || a?.title || "")).filter(Boolean).join(" · ") : typeof alerts === "string" ? alerts : "",
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

  _whenHtml(d, now) {
    const mins = Math.max(0, Math.floor((d.ts - now) / 60000));
    if (mins < 1) return `<div class="m soon">${this._t("now")}</div>`;
    if (mins < 60) return `<div class="m${mins <= 2 ? " soon" : ""}">${mins}<small>${this._t("min")}</small></div>`;
    return `<div class="m">${esc(this._fmtTime(d.ts))}</div>`;
  }

  _rowsHtml(list, now, detailed) {
    const c = this._config;
    let html = "";
    let lastGroup = null;
    for (const d of list) {
      if (c.group_departures && d.groupIdx !== lastGroup) {
        lastGroup = d.groupIdx;
        html += `<div class="group-h">${esc(d.group)}</div>`;
      }
      const sub = [];
      if (d.cancelled) sub.push(`<span class="x">${this._t("cancelled")}</span>`);
      else {
        const rt = d.realtime && c.show_realtime !== false ? `<span class="rt" title="${this._t("realtime")}"></span>` : "";
        if (detailed && d.planned && Math.abs(d.planned - d.ts) >= 60000) sub.push(`${rt}<s>${esc(this._fmtTime(d.planned))}</s> ${esc(this._fmtTime(d.ts))}`);
        else sub.push(`${rt}${esc(this._fmtTime(d.ts))}`);
        if (d.delay >= 1) sub.push(`<span class="late">+${Math.round(d.delay)}</span>`);
        else if (c.show_on_time && d.realtime) sub.push(`<span class="ontime">${this._t("on_time")}</span>`);
      }
      if (d.platform != null && d.platform !== "") sub.push(`${this._t("platform")} ${esc(d.platform)}`);
      if (d.alerts) sub.push(`<span class="al">⚠${detailed ? ` ${esc(d.alertText || this._t("disruption"))}` : ""}</span>`);
      html += `<div class="row${d.cancelled ? " cancelled" : ""}">
        ${this._badge(d)}
        <div style="min-width:0"><div class="dest">${esc(d.destination || "—")}</div><div class="sub">${sub.join(" · ")}</div></div>
        <div class="when">${this._whenHtml(d, now)}</div>
      </div>`;
    }
    return `<div class="rows">${html}</div>`;
  }

  /** Walking advice for a departure. */
  _advice(d, now) {
    const walk = Math.max(0, +this._config.walk_minutes || 0);
    const minsF = Math.max(0, (d.ts - now) / 60000);
    if (walk <= 0) return `<span class="w">${minsF < 1 ? this._t("now") : `${Math.floor(minsF)} ${this._t("min")}`}</span>`;
    const leave = Math.floor(minsF - walk);
    if (minsF < walk) return `<span class="w late">${this._t("too_late")}</span>`;
    if (leave <= 1) return `<span class="w go">${this._t("leave_now")}</span>`;
    return `<span class="w wait">${this._t("leave_in", leave)}</span>`;
  }

  _trackHtml(d, now) {
    const window = Math.max(5, +this._config.approach_window || 15);
    const walk = Math.max(0, +this._config.walk_minutes || 0);
    const minsF = Math.max(0, (d.ts - now) / 60000);
    const pos = Math.max(0, Math.min(1, 1 - minsF / window)) * 100;
    const ticks = [];
    for (let m = 5; m < window; m += 5) ticks.push(`<i class="tick" style="left:${(1 - m / window) * 100}%"></i>`);
    const walkMark = walk > 0 && walk < window ? `<i class="walk" style="left:${(1 - walk / window) * 100}%"></i>` : "";
    return `<div class="track"><i class="rail"></i>${ticks.join("")}${walkMark}<i class="tr${minsF < 1 ? " arr" : ""}" style="left:${pos}%;background:${esc(
      this._lineColor(d)
    )}"></i><span class="st">U</span></div>`;
  }

  _depTitle() {
    const c = this._config;
    return c.station_name || c.title_departures || this._t("departures");
  }

  _ovDep() {
    const body = this._$("ov-dep");
    this._$("ovd-title").textContent = this._depTitle();
    const adv = this._$("ov-adv");
    if (!this._depConf.length) {
      adv.hidden = true;
      return void (body.innerHTML = `<div class="msg">${this._t("not_configured")}</div>`);
    }
    const { list, errors, now } = this._collectDepartures();
    const err = errors.map((e) => `<div class="msg error">${this._t("not_found")}: ${esc(e)}</div>`).join("");
    if (!list.length) {
      adv.hidden = true;
      return void (body.innerHTML = err + `<div class="msg">${this._t("no_departures")}</div>`);
    }
    body.innerHTML = err + this._rowsHtml(list.slice(0, Math.max(1, +this._config.max_departures || 7)), now, false);
    const next = list.find((d) => !d.cancelled && (d.ts - now) / 60000 >= (+this._config.walk_minutes || 0));
    if (this._config.show_approach && next && +this._config.walk_minutes > 0) {
      adv.hidden = false;
      adv.innerHTML = `${this._badge(next)}<span style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">→ ${esc(next.destination)}</span>${this._advice(next, now)}`;
    } else adv.hidden = true;
  }

  _bindTransit() {
    this._$("tr-filter").addEventListener("click", (ev) => {
      const chip = ev.target.closest("[data-dir]");
      if (!chip) return;
      const k = chip.dataset.dir;
      if (k === "*") this._trHidden.clear();
      else if (this._trHidden.has(k)) this._trHidden.delete(k);
      else this._trHidden.add(k);
      lsSet("idc_tr_hidden", [...this._trHidden]);
      this._trRender();
    });
  }

  _trRender() {
    const c = this._config;
    const board = this._$("tr-board");
    const dirsEl = this._$("tr-dirs");
    const filter = this._$("tr-filter");
    this._$("trd-title").textContent = this._depTitle();
    if (!this._depConf.length) {
      board.innerHTML = `<div class="msg">${this._t("not_configured")}</div>`;
      dirsEl.innerHTML = filter.innerHTML = "";
      return;
    }
    const { list, errors, now, updated } = this._collectDepartures();
    const err = errors.map((e) => `<div class="msg error">${this._t("not_found")}: ${esc(e)}</div>`).join("");

    // directions (line + direction)
    const dirs = new Map();
    for (const d of list) {
      if (!dirs.has(d.dir)) dirs.set(d.dir, { key: d.dir, first: d, deps: [] });
      dirs.get(d.dir).deps.push(d);
    }
    const dirList = [...dirs.values()];
    filter.innerHTML =
      dirList.length > 1
        ? `<button class="chip${this._trHidden.size ? "" : " sel"}" data-dir="*">${this._t("all")}</button>` +
          dirList
            .map(
              (g) =>
                `<button class="chip${this._trHidden.has(g.key) ? " off" : " sel"}" data-dir="${esc(g.key)}">${this._badge(g.first)}${esc(
                  g.key.split("|")[1] || g.first.destination
                )}</button>`
            )
            .join("")
        : "";
    filter.hidden = dirList.length < 2;

    const visible = list.filter((d) => !this._trHidden.has(d.dir));
    board.innerHTML = err + (visible.length ? this._rowsHtml(visible.slice(0, Math.max(1, +c.max_departures_detail || 14)), now, true) : `<div class="msg">${this._t("no_departures")}</div>`);
    this._$("tr-foot").textContent = updated ? this._t("updated", this._fmt(updated, { hour: "2-digit", minute: "2-digit", second: "2-digit" })) : "";

    dirsEl.innerHTML = dirList
      .filter((g) => !this._trHidden.has(g.key))
      .map((g) => {
        const running = g.deps.filter((d) => !d.cancelled);
        const next = running[0] || g.first;
        const others = g.deps.slice(next === g.deps[0] ? 1 : 0, 6).filter((d) => d !== next);
        const m = (d) => Math.max(0, Math.floor((d.ts - now) / 60000));
        const nextTxt = m(next) < 1 ? this._t("now") : m(next) < 60 ? `${m(next)}<small>${this._t("min")}</small>` : esc(this._fmtTime(next.ts));
        return `<div class="dir">
          <div class="dir-h">${this._badge(next)}<span class="d">→ ${esc(g.key.split("|")[1] || next.destination)}</span>${
            next.platform != null && next.platform !== "" ? `<span class="pl">${this._t("platform")} ${esc(next.platform)}</span>` : ""
          }</div>
          <div class="dir-next"><span class="f">${nextTxt}</span>${others
            .map((d) => `<span class="o${d.cancelled ? " x" : d.delay >= 1 ? " late" : ""}">${m(d) < 60 ? `${m(d)}<small>${this._t("min")}</small>` : esc(this._fmtTime(d.ts))}</span>`)
            .join("")}</div>
          ${c.show_approach ? this._trackHtml(next, now) : ""}
          <div class="adv">${this._advice(next, now)}${next.delay >= 1 ? ` · <span style="color:var(--idc-warn)">+${Math.round(next.delay)} ${this._t("min")}</span>` : ""}</div>
        </div>`;
      })
      .join("");
  }

  /* ================================================================ clock: alarms, timers, stopwatch */

  _bindClock() {
    // alarms
    this._$("al-add").addEventListener("click", () => this._openAlarm());
    this._$("cl-alarms").addEventListener("click", (ev) => {
      const sw = ev.target.closest("[data-toggle]");
      if (sw) {
        const a = this._data.alarms.find((x) => x.id === sw.dataset.toggle);
        if (a) {
          a.enabled = !a.enabled;
          this._saveUserData();
          this._clRender();
        }
        return;
      }
      const row = ev.target.closest("[data-alarm]");
      if (row) this._openAlarm(row.dataset.alarm);
    });
    this._$("al-days").addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-day]");
      if (b) b.classList.toggle("sel");
    });
    this._$("al-overlay").addEventListener("click", (ev) => ev.target.id === "al-overlay" && this._closeAlarm());
    this._$("al-cancel").addEventListener("click", () => this._closeAlarm());
    this._$("al-sheet").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const time = this._$("al-time").value;
      if (!/^\d{2}:\d{2}/.test(time)) return;
      const days = [...this._$("al-days").querySelectorAll(".sel")].map((b) => +b.dataset.day);
      const label = this._$("al-label").value.trim();
      const alarms = this._data.alarms || (this._data.alarms = []);
      const existing = alarms.find((a) => a.id === this._editAlarm);
      if (existing) Object.assign(existing, { time: time.slice(0, 5), days, label, enabled: true });
      else alarms.push({ id: uid(), time: time.slice(0, 5), days, label, enabled: true });
      alarms.sort((a, b) => a.time.localeCompare(b.time));
      this._saveUserData();
      this._closeAlarm();
      this._clRender();
    });
    this._$("al-del").addEventListener("click", () => {
      this._data.alarms = (this._data.alarms || []).filter((a) => a.id !== this._editAlarm);
      this._saveUserData();
      this._closeAlarm();
      this._clRender();
    });

    // timers
    const presets = Array.isArray(this._config.timer_presets) ? this._config.timer_presets : DEFAULTS.timer_presets;
    this._$("tm-presets").innerHTML = presets.map((m) => `<button class="chip" data-min="${+m}">${+m} ${this._t("min")}</button>`).join("");
    this._$("tm-presets").addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-min]");
      if (b) this._startTimer(+b.dataset.min);
    });
    this._$("tm-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const v = parseFloat(String(this._$("tm-min").value).replace(",", "."));
      if (v > 0) this._startTimer(v);
      this._$("tm-min").value = "";
      this._$("tm-min").blur();
    });
    this._$("cl-timers").addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-tact]");
      if (!b) return;
      const t = this._timers.find((x) => x.id === b.dataset.tid);
      if (!t) return;
      if (b.dataset.tact === "plus") {
        t.end += 60000;
        t.duration += 60000;
      } else this._timers = this._timers.filter((x) => x !== t);
      lsSet("idc_timers", this._timers);
      this._clRender();
    });

    // stopwatch
    this._$("sw-b1").addEventListener("click", () => {
      // left: lap (running) / reset (stopped)
      if (this._sw.start) this._sw.laps.unshift(this._swElapsed());
      else this._sw = { start: null, acc: 0, laps: [] };
      this._saveSw();
    });
    this._$("sw-b2").addEventListener("click", () => {
      if (this._sw.start) {
        this._sw.acc = this._swElapsed();
        this._sw.start = null;
      } else this._sw.start = Date.now();
      this._saveSw();
    });

    // ringing
    this._$("ring-stop").addEventListener("click", () => this._stopRing());
    this._$("ring-snooze").addEventListener("click", () => {
      const r = this._ringing;
      this._stopRing();
      if (r?.type === "alarm") {
        this._snoozes.push({ until: Date.now() + (+this._config.snooze_minutes || 9) * 60000, label: r.label, time: r.time });
      }
    });
  }

  _openAlarm(id) {
    const a = (this._data.alarms || []).find((x) => x.id === id);
    this._editAlarm = a?.id || null;
    const d = new Date(Date.now() + 3600000);
    this._$("al-time").value = a?.time || `${pad2(d.getHours())}:00`;
    this._$("al-label").value = a?.label || "";
    for (const b of this._$("al-days").children) b.classList.toggle("sel", !!a?.days?.includes(+b.dataset.day));
    this._$("al-del").hidden = !a;
    this._$("al-overlay").hidden = false;
  }

  _closeAlarm() {
    this._$("al-overlay").hidden = true;
    this._editAlarm = null;
    this.shadowRoot.activeElement?.blur?.();
  }

  _repeatText(days) {
    const d = [...(days || [])].sort();
    if (!d.length) return this._t("once");
    if (d.length === 7) return this._t("daily_rep");
    if (d.join() === "1,2,3,4,5") return this._t("weekdays");
    if (d.join() === "6,7") return this._t("weekend");
    return d.map((x) => this._t("days_short")[x - 1]).join(", ");
  }

  /** Next occurrence of an alarm (local time). */
  _alarmNext(a, from = Date.now()) {
    const [h, m] = a.time.split(":").map(Number);
    for (let i = 0; i < 8; i++) {
      const d = new Date(from);
      d.setDate(d.getDate() + i);
      d.setHours(h, m, 0, 0);
      if (d.getTime() <= from) continue;
      const wd = d.getDay() || 7;
      if (!a.days?.length || a.days.includes(wd)) return d.getTime();
    }
    return null;
  }

  _nextAlarm() {
    let best = null;
    for (const a of this._data.alarms || []) {
      if (!a.enabled) continue;
      const ts = this._alarmNext(a);
      if (ts && (!best || ts < best.ts)) best = { ts, alarm: a };
    }
    for (const s of this._snoozes) if (!best || s.until < best.ts) best = { ts: s.until, alarm: { label: s.label } };
    return best;
  }

  _checkAlarms(now) {
    const d = new Date(now);
    const hm = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    const wd = d.getDay() || 7;
    const key = `${d.toDateString()} ${hm}`;
    for (const a of this._data.alarms || []) {
      if (!a.enabled || a.time !== hm || this._fired[a.id] === key) continue;
      if (a.days?.length && !a.days.includes(wd)) continue;
      this._fired[a.id] = key;
      if (!a.days?.length) {
        a.enabled = false;
        this._saveUserData();
      }
      this._ring({ type: "alarm", label: a.label || this._t("alarm_ringing"), time: a.time });
    }
    const due = this._snoozes.filter((s) => s.until <= now + 500);
    if (due.length) {
      this._snoozes = this._snoozes.filter((s) => !due.includes(s));
      this._ring({ type: "alarm", label: due[0].label || this._t("alarm_ringing"), time: due[0].time });
    }
  }

  _startTimer(minutes) {
    const ms = Math.round(minutes * 60000);
    this._timers.push({ id: uid(), end: Date.now() + ms, duration: ms, label: `${minutes.toLocaleString(this._lang)} ${this._t("min")}` });
    lsSet("idc_timers", this._timers);
    this._clRender();
  }

  _checkTimers(now) {
    const due = this._timers.filter((t) => t.end <= now);
    if (!due.length) return;
    this._timers = this._timers.filter((t) => t.end > now);
    lsSet("idc_timers", this._timers);
    // don't ring for timers that ended long ago (e.g. dashboard was closed)
    const fresh = due.filter((t) => now - t.end < 5 * 60000);
    if (fresh.length) this._ring({ type: "timer", label: fresh[0].label, time: null });
    if (this._view === "clock") this._clRender();
  }

  _swElapsed() {
    return this._sw.acc + (this._sw.start ? Date.now() - this._sw.start : 0);
  }

  _saveSw() {
    lsSet("idc_stopwatch", this._sw);
    this._clRender();
    this._syncStopwatchTimer();
  }

  _syncStopwatchTimer() {
    const want = this._view === "clock" && !!this._sw.start;
    if (want && !this._swTimer) this._swTimer = setInterval(() => this._swTick(), 50);
    if (!want && this._swTimer) {
      clearInterval(this._swTimer);
      this._swTimer = null;
    }
  }

  _swTick() {
    const el = this._$("sw-time");
    if (!el) return;
    const s = fmtDuration(this._swElapsed(), true);
    const i = s.lastIndexOf(",");
    el.innerHTML = `${s.slice(0, i)}<small>${s.slice(i)}</small>`;
  }

  _clRender() {
    if (!this._built || this._view !== "clock") return;
    const alarms = this._data.alarms || [];
    this._$("cl-alarms").innerHTML = alarms.length
      ? alarms
          .map(
            (a) => `<div class="alarm${a.enabled ? "" : " off"}" data-alarm="${esc(a.id)}">
              <span class="t">${esc(a.time)}</span>
              <div class="i"><div>${esc(a.label || this._t("alarm_ringing"))}</div><div>${esc(this._repeatText(a.days))}</div></div>
              <button class="sw${a.enabled ? " on" : ""}" data-toggle="${esc(a.id)}" aria-label="on/off"></button>
            </div>`
          )
          .join("") + `<div class="msg" style="font-size:12.5px">${esc(this._t("alarm_note"))}</div>`
      : `<div class="msg">${this._t("no_alarms")}</div><div class="msg" style="font-size:12.5px">${esc(this._t("alarm_note"))}</div>`;

    const sw = this._sw;
    this._$("sw-b1").textContent = sw.start ? this._t("lap") : this._t("reset");
    this._$("sw-b1").disabled = !sw.start && !sw.acc;
    this._$("sw-b2").textContent = sw.start ? this._t("stop") : sw.acc ? this._t("resume") : this._t("start");
    this._$("sw-b2").className = `btn ${sw.start ? "danger" : "good"}`;
    const laps = sw.laps || [];
    this._$("sw-laps").innerHTML = laps
      .map((t, i) => {
        const prev = laps[i + 1] || 0;
        return `<div class="lap"><span>${this._t("lap")} ${laps.length - i}</span><b>${fmtDuration(t - prev, true)}</b><span>${fmtDuration(t, true)}</span></div>`;
      })
      .join("");
    this._swTick();
    this._clTick(true);
  }

  _clTick() {
    const now = Date.now();
    this._$("cl-time").innerHTML = `${esc(this._fmtTime(now))}<span class="sec">${pad2(new Date(now).getSeconds())}</span>`;
    const next = this._nextAlarm();
    let meta = `<span><b>${esc(this._fmt(now, { weekday: "long", day: "numeric", month: "long" }))}</b></span>`;
    if (next) {
      const diff = Math.max(0, next.ts - now);
      meta += `<span>${this._t("next_alarm")}: <b>${esc(this._alarmWhen(next.ts))}</b> · ${esc(
        this._t("in_time", Math.floor(diff / 3600000), Math.floor((diff % 3600000) / 60000))
      )}</span>`;
    }
    this._$("cl-meta").innerHTML = meta;
    // update running timers in place so buttons stay tappable
    const tEl = this._$("cl-timers");
    const sig = this._timers.map((t) => `${t.id}:${t.duration}`).join();
    if (tEl.dataset.sig === sig && this._timers.length) {
      for (const t of this._timers) {
        const row = tEl.querySelector(`[data-timer="${t.id}"]`);
        if (!row) continue;
        const left = Math.max(0, t.end - now);
        row.querySelector(".t").textContent = fmtDuration(left);
        row.querySelector(".prog i").style.width = `${(left / t.duration) * 100}%`;
      }
      return;
    }
    tEl.dataset.sig = sig;
    tEl.innerHTML = this._timers.length
      ? this._timers
          .map((t) => {
            const left = Math.max(0, t.end - now);
            return `<div class="timer" data-timer="${t.id}"><div class="row1"><span class="t">${fmtDuration(left)}</span>
              <button class="btn" data-tact="plus" data-tid="${t.id}">+1 ${this._t("min")}</button>
              <button class="btn round danger" data-tact="del" data-tid="${t.id}"><ha-icon icon="mdi:close"></ha-icon></button></div>
              <div class="sub" style="margin-top:4px">${esc(t.label || "")}</div>
              <div class="prog"><i style="width:${(left / t.duration) * 100}%"></i></div></div>`;
          })
          .join("")
      : `<div class="msg">${this._t("no_timers")}</div>`;
  }

  /* ringing */

  _unlockAudio() {
    try {
      if (!this._audio) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this._audio = new AC();
      }
      if (this._audio?.state === "suspended") this._audio.resume();
    } catch (e) {
      /* no audio */
    }
  }

  _beep() {
    const ctx = this._audio;
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const t0 = ctx.currentTime + 0.02;
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const t = t0 + i * 0.26;
      o.type = "sine";
      o.frequency.value = i === 2 ? 1046.5 : 880;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.25);
    }
  }

  _ring(r) {
    this._stopRing(true);
    this._ringing = r;
    this._$("ring-icon").setAttribute("icon", r.type === "timer" ? "mdi:timer-sand-complete" : "mdi:alarm");
    this._$("ring-time").textContent = r.type === "timer" ? this._t("timer_done") : this._fmtTime(Date.now());
    this._$("ring-time").style.fontSize = r.type === "timer" ? "54px" : "";
    this._$("ring-label").textContent = r.label || "";
    this._$("ring-snooze").hidden = r.type !== "alarm";
    this._$("ring-snooze").textContent = this._t("snooze", +this._config.snooze_minutes || 9);
    this._$("ring").hidden = false;
    this._beep();
    this._ringTimer = setInterval(() => this._beep(), 1400);
    this._ringStop = setTimeout(() => this._stopRing(), (+this._config.alarm_ring_minutes || 5) * 60000);
    if (this._config.alarm_script) {
      this._hass
        .callService("script", "turn_on", { variables: { type: r.type, label: r.label || "", time: r.time || "" } }, { entity_id: this._config.alarm_script })
        .catch((e) => console.warn(`[${CARD_TAG}] alarm_script failed`, e));
    }
    this._tbClock();
  }

  _stopRing(silent) {
    clearInterval(this._ringTimer);
    clearTimeout(this._ringStop);
    this._ringTimer = null;
    this._ringing = null;
    const el = this._$("ring");
    if (el) el.hidden = true;
    if (!silent) {
      this._lastInteraction = Date.now();
      if (this._view === "clock") this._clRender();
    }
  }
}

/* ---------------------------------------------------------------- editor */

const EDITOR_LABELS = {
  weather_entity: "Wetter-Entität",
  weather_location: "Ortsname (Wetter)",
  todo_entity: "Einkaufsliste (To-do-Entität, z. B. Bring!)",
  todo_entities: "Weitere Bring!-Listen (umschaltbar)",
  departure_entities: "Abfahrts-Sensoren",
  departure_style: "Stil der Abfahrtstafel",
  station_name: "Name der Station",
  title_todo: "Titel Einkaufsliste",
  max_departures: "Abfahrten in der Übersicht",
  max_departures_detail: "Abfahrten im Tab Verkehr",
  walk_minutes: "Fußweg zur Station (Min.)",
  forecast_hours: "Stunden in der Übersicht",
  forecast_days: "Tage im Tab Wetter",
  show_completed: "„Zuletzt gekauft“ (Anzahl)",
  default_tab: "Start-Tab",
  return_to_overview: "Zurück zur Übersicht nach (Sek., 0 = nie)",
  alarm_script: "Skript beim Wecker/Timer (optional)",
  snooze_minutes: "Schlummern (Min.)",
  show_seconds: "Sekunden anzeigen",
  show_approach: "Anfahrt-Anzeige",
  weather_gradient: "Wetter mit Farbverlauf",
  add_delay: "Verspätung zur Abfahrtszeit addieren",
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
    const tabOptions = [...TABS.map((t) => ({ value: t.id, label: STRINGS.de[`tab_${t.id}`] })), { value: "clock", label: STRINGS.de.tab_clock }];
    return [
      { name: "weather_entity", selector: { entity: { filter: { domain: "weather" } } } },
      { name: "todo_entity", selector: { entity: { filter: { domain: "todo" } } } },
      { name: "todo_entities", selector: { entity: { multiple: true, filter: { domain: "todo" } } } },
      ...(simpleDeps ? [{ name: "departure_entities", selector: { entity: { multiple: true, filter: { domain: "sensor" } } } }] : []),
      {
        type: "grid",
        name: "",
        schema: [
          { name: "default_tab", selector: { select: { mode: "dropdown", options: tabOptions } } },
          { name: "return_to_overview", selector: { number: { min: 0, max: 3600, step: 10, mode: "box" } } },
          {
            name: "departure_style",
            selector: { select: { mode: "dropdown", options: [{ value: "calm", label: "Ruhig" }, { value: "berlin", label: "Berlin (Zugzielanzeiger)" }] } },
          },
          { name: "station_name", selector: { text: {} } },
          { name: "walk_minutes", selector: { number: { min: 0, max: 30, mode: "box" } } },
          { name: "max_departures", selector: { number: { min: 1, max: 20, mode: "box" } } },
          { name: "max_departures_detail", selector: { number: { min: 1, max: 30, mode: "box" } } },
          { name: "weather_location", selector: { text: {} } },
          { name: "forecast_hours", selector: { number: { min: 0, max: 8, mode: "box" } } },
          { name: "forecast_days", selector: { number: { min: 1, max: 15, mode: "box" } } },
          { name: "title_todo", selector: { text: {} } },
          { name: "show_completed", selector: { number: { min: 0, max: 60, mode: "box" } } },
          { name: "snooze_minutes", selector: { number: { min: 1, max: 30, mode: "box" } } },
          { name: "height", selector: { text: {} } },
          { name: "show_approach", selector: { boolean: {} } },
          { name: "weather_gradient", selector: { boolean: {} } },
          { name: "show_seconds", selector: { boolean: {} } },
          { name: "add_delay", selector: { boolean: {} } },
        ],
      },
      { name: "alarm_script", selector: { entity: { filter: { domain: "script" } } } },
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
        for (const [k, v] of Object.entries(config)) {
          if (v === "" || v === undefined || (Array.isArray(v) && !v.length && k === "todo_entities")) delete config[k];
          else if (k in DEFAULTS && JSON.stringify(v) === JSON.stringify(DEFAULTS[k]) && !(k in (this._config || {}))) delete config[k];
        }
        this._config = config;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
      const ver = document.createElement("div");
      ver.style.cssText = "margin-top:12px;font-size:12px;opacity:.6";
      ver.textContent = `iPad Dashboard Card v${CARD_VERSION} · Räume, Tabs, Layout und Linienfarben im YAML-Editor`;
      this.appendChild(ver);
    }
    this._form.hass = this._hass;
    this._form.data = { ...DEFAULTS, ...this._config };
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
    description: "Tabs für Übersicht, Wetter, Verkehr, Einkaufen (Bring!), Zuhause und Uhr mit Wecker, Timer und Stoppuhr – für das iPad im Querformat.",
    preview: false,
    documentationURL: "https://github.com/flxxxlf/homeassist-ipad-dashboard-card",
  });
}

console.info(
  `%c IPAD-DASHBOARD-CARD %c v${CARD_VERSION} `,
  "background:#7fa6c9;color:#0e1115;font-weight:700;border-radius:3px 0 0 3px",
  "background:#151a20;color:#e4e7eb;border-radius:0 3px 3px 0"
);
