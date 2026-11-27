/*
 * iPad Dashboard Card
 * Custom Lovelace card for Home Assistant: clock, weather, Bring! shopping list
 * (incl. adding items) and next subway departures in one calm, dark layout
 * optimised for an iPad Pro 10.5" in landscape (1112 × 834 CSS px).
 *
 * All data comes from the `hass` object / its websocket connection.
 * No entity IDs are hard-coded – everything is set in the card configuration.
 */

const CARD_VERSION = "1.0.0";
const CARD_TAG = "ipad-dashboard-card";
const EDITOR_TAG = "ipad-dashboard-card-editor";

/* ------------------------------------------------------------------ i18n */

const STRINGS = {
  de: {
    weather: "Wetter",
    shopping: "Einkaufsliste",
    departures: "Abfahrten",
    add_placeholder: "Artikel hinzufügen …",
    add: "Hinzufügen",
    empty_list: "Alles erledigt – die Liste ist leer.",
    recent: "Zuletzt gekauft",
    no_departures: "Keine Abfahrten verfügbar.",
    not_found: "Entität nicht gefunden",
    not_configured: "Nicht konfiguriert",
    now: "jetzt",
    min: "min",
    feels_like: "Gefühlt",
    humidity: "Feuchte",
    wind: "Wind",
    today: "Heute",
    cancelled: "fällt aus",
    on_time: "pünktlich",
    platform: "Gl.",
    items: (n) => (n === 1 ? "1 Artikel" : `${n} Artikel`),
    unavailable: "nicht verfügbar",
  },
  en: {
    weather: "Weather",
    shopping: "Shopping list",
    departures: "Departures",
    add_placeholder: "Add item …",
    add: "Add",
    empty_list: "All done – the list is empty.",
    recent: "Recently bought",
    no_departures: "No departures available.",
    not_found: "Entity not found",
    not_configured: "Not configured",
    now: "now",
    min: "min",
    feels_like: "Feels like",
    humidity: "Humidity",
    wind: "Wind",
    today: "Today",
    cancelled: "cancelled",
    on_time: "on time",
    platform: "Pl.",
    items: (n) => (n === 1 ? "1 item" : `${n} items`),
    unavailable: "unavailable",
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
    "lightning-rainy": "Lightning, rainy",
    partlycloudy: "Partly cloudy",
    pouring: "Pouring",
    rainy: "Rainy",
    snowy: "Snowy",
    "snowy-rainy": "Snowy, rainy",
    sunny: "Sunny",
    windy: "Windy",
    "windy-variant": "Windy, cloudy",
  },
};

const WEATHER_ICONS = {
  "clear-night": "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  exceptional: "mdi:alert-circle-outline",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant",
};

/* Candidate keys used to read departure data from very different integrations
 * (MVG, HAFAS, DB, RMV, VBB, KVV, …). Can be overridden via `departure_fields`. */
const DEPARTURE_LIST_KEYS = [
  "departures",
  "next_departures",
  "connections",
  "journeys",
  "trips",
  "data",
];
const FIELD_CANDIDATES = {
  line: ["line", "label", "line_name", "lineName", "name", "number", "transport_line", "route", "servingLine"],
  destination: ["destination", "direction", "to", "final_stop", "headsign", "dest", "end_station"],
  time: [
    "realtime_departure",
    "realtimeDepartureTime",
    "departure_realtime",
    "expected",
    "estimated",
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
  platform: ["platform", "track", "gleis", "stop_point"],
  cancelled: ["cancelled", "canceled", "is_cancelled", "cancel"],
  color: ["color", "line_color", "background_color", "lineBackgroundColor"],
};

const LINE_PALETTE = ["#5b8bb5", "#6f9e8a", "#b0865b", "#8a7bb0", "#b56b6b", "#5f9ea8", "#a39a5b", "#7f8fa8"];

const DEFAULTS = {
  title_todo: null,
  title_departures: null,
  max_departures: 7,
  hide_below_minutes: 0,
  add_delay: false,
  group_departures: false,
  forecast_type: "auto",
  forecast_days: 5,
  show_completed: 8,
  spec_separator: ":",
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
  if (v == null || v === "") return 0;
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
  return 0;
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

/* ----------------------------------------------------------------- style */

const STYLE = `
  :host {
    --idc-bg: #0e1115;
    --idc-panel: #151a20;
    --idc-panel-2: #1b2128;
    --idc-border: rgba(255, 255, 255, 0.05);
    --idc-text: #e4e7eb;
    --idc-muted: #8a939e;
    --idc-faint: #5a626c;
    --idc-accent: #7fa6c9;
    --idc-warn: #d6ad74;
    --idc-bad: #c97b7b;
    --idc-good: #84b49b;
    --idc-radius: 20px;
    display: block;
  }
  ha-card {
    display: block;
    height: var(--idc-height);
    min-height: 600px;
    box-sizing: border-box;
    background: var(--idc-bg);
    color: var(--idc-text);
    border: none;
    border-radius: var(--idc-radius);
    padding: 18px;
    overflow: hidden;
    font-family: var(--idc-font, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif);
    container-type: inline-size;
    -webkit-font-smoothing: antialiased;
  }
  .grid {
    height: 100%;
    display: grid;
    grid-template-columns: 1.08fr 1fr 1fr;
    grid-template-rows: auto minmax(0, 1fr);
    grid-template-areas:
      "clock   todo  dep"
      "weather todo  dep";
    gap: 16px;
  }
  .panel {
    background: var(--idc-panel);
    border: 1px solid var(--idc-border);
    border-radius: calc(var(--idc-radius) - 4px);
    padding: 20px 22px;
    box-sizing: border-box;
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 14px;
    color: var(--idc-muted);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .panel-head ha-icon { --mdc-icon-size: 18px; color: var(--idc-faint); }
  .panel-head .title { display: flex; align-items: center; gap: 8px; }
  .panel-head .meta { font-weight: 500; letter-spacing: 0.02em; text-transform: none; color: var(--idc-faint); }
  .msg { color: var(--idc-faint); font-size: 15px; padding: 8px 0; }
  .msg.error { color: var(--idc-bad); }

  /* clock */
  .clock { grid-area: clock; justify-content: center; padding: 22px 24px 20px; }
  .time {
    font-size: 104px;
    line-height: 0.95;
    font-weight: 200;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
  .time .sec { font-size: 34px; color: var(--idc-faint); margin-left: 6px; letter-spacing: 0; }
  .date { margin-top: 12px; font-size: 20px; color: var(--idc-muted); font-weight: 400; }

  /* weather */
  .weather { grid-area: weather; }
  .w-now { display: flex; align-items: center; gap: 18px; }
  .w-now ha-icon { --mdc-icon-size: 72px; color: var(--idc-accent); }
  .w-temp { font-size: 58px; font-weight: 250; line-height: 1; font-variant-numeric: tabular-nums; }
  .w-temp small { font-size: 24px; color: var(--idc-muted); margin-left: 2px; }
  .w-cond { font-size: 18px; color: var(--idc-text); margin-top: 6px; }
  .w-stats { display: flex; gap: 18px; margin: 16px 0 4px; color: var(--idc-muted); font-size: 14px; flex-wrap: wrap; }
  .w-stats span b { color: var(--idc-text); font-weight: 500; }
  .w-fc {
    margin-top: auto;
    display: grid;
    grid-template-columns: repeat(var(--fc-count, 5), minmax(0, 1fr));
    gap: 6px;
    padding-top: 14px;
    border-top: 1px solid var(--idc-border);
  }
  .fc { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 16px; }
  .fc .d { color: var(--idc-muted); font-size: 13px; }
  .fc ha-icon { --mdc-icon-size: 34px; color: var(--idc-text); opacity: 0.85; }
  .fc .hi { font-variant-numeric: tabular-nums; }
  .fc .lo { color: var(--idc-faint); font-variant-numeric: tabular-nums; }
  .fc .pp { color: var(--idc-accent); font-size: 12px; min-height: 14px; }

  /* todo */
  .todo { grid-area: todo; }
  .add { display: flex; gap: 8px; margin-bottom: 14px; }
  .add input {
    flex: 1;
    min-width: 0;
    height: 48px;
    padding: 0 16px;
    border-radius: 14px;
    border: 1px solid var(--idc-border);
    background: var(--idc-panel-2);
    color: var(--idc-text);
    font: inherit;
    font-size: 17px;
    outline: none;
    -webkit-appearance: none;
  }
  .add input::placeholder { color: var(--idc-faint); }
  .add input:focus { border-color: rgba(127, 166, 201, 0.5); }
  .add button {
    width: 48px;
    height: 48px;
    flex: none;
    border: none;
    border-radius: 14px;
    background: rgba(127, 166, 201, 0.16);
    color: var(--idc-accent);
    display: grid;
    place-items: center;
    cursor: pointer;
  }
  .add button:active { background: rgba(127, 166, 201, 0.28); }
  .add button ha-icon { --mdc-icon-size: 24px; }
  .scroll { overflow-y: auto; min-height: 0; flex: 1; margin: 0 -6px; padding: 0 6px; scrollbar-width: none; }
  .scroll::-webkit-scrollbar { display: none; }
  .items { display: grid; grid-template-columns: repeat(auto-fill, minmax(124px, 1fr)); gap: 8px; }
  .item {
    background: var(--idc-panel-2);
    border: 1px solid var(--idc-border);
    border-radius: 14px;
    padding: 12px 12px;
    min-height: 58px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: opacity 0.2s, transform 0.1s;
  }
  .item:active { transform: scale(0.97); }
  .item.pending { opacity: 0.35; }
  .item .n { font-size: 16px; line-height: 1.25; overflow-wrap: anywhere; }
  .item .s { font-size: 13px; color: var(--idc-muted); margin-top: 3px; overflow-wrap: anywhere; }
  .recent-h { margin: 18px 0 8px; font-size: 12px; color: var(--idc-faint); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    border: 1px solid var(--idc-border);
    background: transparent;
    color: var(--idc-muted);
    border-radius: 999px;
    padding: 7px 12px;
    font: inherit;
    font-size: 14px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .chip:active { background: var(--idc-panel-2); }

  /* departures */
  .dep { grid-area: dep; }
  .rows { display: flex; flex-direction: column; }
  .group-h { font-size: 12px; color: var(--idc-faint); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; margin: 12px 0 2px; }
  .group-h:first-child { margin-top: 0; }
  .row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 11px 0;
    border-bottom: 1px solid var(--idc-border);
  }
  .row:last-child { border-bottom: none; }
  .badge {
    min-width: 42px;
    height: 30px;
    padding: 0 8px;
    box-sizing: border-box;
    border-radius: 8px;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 15px;
    color: #fff;
    letter-spacing: 0.01em;
  }
  .dest { font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 13px; color: var(--idc-faint); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub .late { color: var(--idc-warn); }
  .sub .ontime { color: var(--idc-good); }
  .when { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .when .m { font-size: 24px; font-weight: 300; }
  .when .m small { font-size: 14px; color: var(--idc-muted); margin-left: 2px; }
  .when .m.soon { color: var(--idc-accent); }
  .row.cancelled .dest, .row.cancelled .when .m { text-decoration: line-through; color: var(--idc-faint); }
  .row.cancelled .sub .x { color: var(--idc-bad); }

  /* narrow layouts (portrait / phone) */
  @container (max-width: 860px) {
    .grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto minmax(0, 1fr);
      grid-template-areas: "clock weather" "todo dep" "todo dep";
    }
    .time { font-size: 76px; }
  }
  @container (max-width: 560px) {
    .grid { grid-template-columns: 1fr; grid-template-rows: none; grid-template-areas: "clock" "weather" "todo" "dep"; height: auto; }
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
    this._forecast = null;
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
    this._depConf = deps
      .map((d) => (typeof d === "string" ? { entity: d } : d))
      .filter((d) => d && d.entity);
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
    this._tick();
    this._timer = setInterval(() => this._tick(), 1000);
    if (this._hass) this._update(true);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
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
      return new Intl.DateTimeFormat(this._hass?.locale?.language || this._lang, {
        timeZone: this._timeZone,
        ...opts,
      }).format(new Date(ts));
    } catch (e) {
      return new Date(ts).toLocaleString();
    }
  }
  _fmtTime(ts) {
    return this._fmt(ts, { hour: "2-digit", minute: "2-digit", hour12: this._hour12 });
  }

  /* ---------- skeleton */

  _build() {
    const c = this._config;
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card>
        <div class="grid">
          <section class="panel clock"><div class="time" id="time"></div><div class="date" id="date"></div></section>
          <section class="panel weather" id="weather"></section>
          <section class="panel todo">
            <div class="panel-head">
              <span class="title"><ha-icon icon="mdi:cart-outline"></ha-icon><span id="todo-title"></span></span>
              <span class="meta" id="todo-count"></span>
            </div>
            <form class="add" id="add-form" autocomplete="off">
              <input id="add-input" type="text" enterkeyhint="done" autocapitalize="sentences" />
              <button type="submit" id="add-btn"><ha-icon icon="mdi:plus"></ha-icon></button>
            </form>
            <div class="scroll" id="todo-body"></div>
          </section>
          <section class="panel dep">
            <div class="panel-head">
              <span class="title"><ha-icon icon="${esc(c.departures_icon || "mdi:subway-variant")}"></ha-icon><span id="dep-title"></span></span>
              <span class="meta" id="dep-meta"></span>
            </div>
            <div class="scroll" id="dep-body"></div>
          </section>
        </div>
      </ha-card>`;
    const $ = (id) => this.shadowRoot.getElementById(id);
    this._el = {
      card: this.shadowRoot.querySelector("ha-card"),
      time: $("time"),
      date: $("date"),
      weather: $("weather"),
      todoTitle: $("todo-title"),
      todoCount: $("todo-count"),
      todoBody: $("todo-body"),
      form: $("add-form"),
      input: $("add-input"),
      addBtn: $("add-btn"),
      depTitle: $("dep-title"),
      depMeta: $("dep-meta"),
      depBody: $("dep-body"),
    };
    this._el.card.style.setProperty("--idc-height", c.height);
    if (c.background) this._el.card.style.setProperty("--idc-bg", c.background);

    this._el.form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      this._addItem();
    });
    // keep HA's global keyboard shortcuts (e, c, a, m …) from firing while typing
    for (const type of ["keydown", "keyup", "keypress"]) {
      this._el.input.addEventListener(type, (ev) => ev.stopPropagation());
    }
    this._el.todoBody.addEventListener("click", (ev) => this._onTodoClick(ev));
    this._built = true;
  }

  _update(force) {
    if (!this._config || !this._hass) return;
    if (!this._built) {
      this._build();
      force = true;
    }
    this._el.input.placeholder = this._t("add_placeholder");
    this._el.addBtn.title = this._t("add");
    this._ensureSubscriptions();

    const st = (id) => (id ? this._hass.states[id] : undefined);
    const w = st(this._config.weather_entity);
    if (force || w !== this._last.weather) {
      this._last.weather = w;
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
    if (force) this._tick(true);
  }

  /* ---------- subscriptions */

  _ensureSubscriptions() {
    const conn = this._hass?.connection;
    if (!conn || !this.isConnected) return;

    const wId = this._config.weather_entity;
    const wState = wId && this._hass.states[wId];
    let fType = null;
    if (wState) {
      const sf = wState.attributes.supported_features || 0;
      const wanted = this._config.forecast_type;
      const supported = { daily: !!(sf & 1), hourly: !!(sf & 2), twice_daily: !!(sf & 4) };
      fType = wanted !== "auto" && supported[wanted] ? wanted : ["daily", "twice_daily", "hourly"].find((k) => supported[k]) || null;
    }
    this._syncSub(
      "forecast",
      fType ? `${wId}|${fType}` : null,
      { type: "weather/subscribe_forecast", forecast_type: fType, entity_id: wId },
      (msg) => {
        this._forecast = { type: fType, list: msg.forecast || [] };
        this._renderWeather();
      },
      () => (this._forecast = null)
    );

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
      this._last.clock = key;
      this._el.time.innerHTML = `${esc(time)}${sec ? `<span class="sec">${esc(sec)}</span>` : ""}`;
      this._el.date.textContent = this._fmt(now, { weekday: "long", day: "numeric", month: "long" });
    }
    // refresh countdowns every 20 seconds
    if (!this._last.depTick || now - this._last.depTick > 20000) {
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

  _weatherIcon(cond, isNight) {
    if (cond === "partlycloudy" && isNight) return "mdi:weather-night-partly-cloudy";
    return WEATHER_ICONS[cond] || "mdi:weather-cloudy";
  }

  _renderWeather() {
    if (!this._built) return;
    const el = this._el.weather;
    const id = this._config.weather_entity;
    const head = `<div class="panel-head"><span class="title"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${esc(
      this._config.title_weather || this._t("weather")
    )}</span><span class="meta">${esc(this._config.weather_name || "")}</span></div>`;
    if (!id) return void (el.innerHTML = `${head}<div class="msg">${this._t("not_configured")}</div>`);
    const s = this._hass.states[id];
    if (!s) return void (el.innerHTML = `${head}<div class="msg error">${this._t("not_found")}: ${esc(id)}</div>`);
    if (s.state === "unavailable" || s.state === "unknown")
      return void (el.innerHTML = `${head}<div class="msg">${esc(s.attributes.friendly_name || id)} ${this._t("unavailable")}</div>`);

    const a = s.attributes;
    const tu = a.temperature_unit || this._hass.config?.unit_system?.temperature || "°C";
    const round = (v) => (v == null || v === "" || Number.isNaN(+v) ? "–" : Math.round(+v));
    const sunState = this._hass.states["sun.sun"];
    const isNight = s.state === "clear-night" || sunState?.state === "below_horizon";

    const stats = [];
    if (a.apparent_temperature != null) stats.push(`<span>${this._t("feels_like")} <b>${round(a.apparent_temperature)}°</b></span>`);
    if (a.humidity != null) stats.push(`<span>${this._t("humidity")} <b>${round(a.humidity)} %</b></span>`);
    if (a.wind_speed != null) stats.push(`<span>${this._t("wind")} <b>${round(a.wind_speed)} ${esc(a.wind_speed_unit || "km/h")}</b></span>`);

    let fcHtml = "";
    const fc = this._forecast?.list || [];
    if (fc.length) {
      const type = this._forecast.type;
      let list = fc;
      if (type === "twice_daily") list = fc.filter((f) => f.is_daytime !== false);
      const n = Math.max(1, Math.min(+this._config.forecast_days || 5, 8));
      list = list.slice(0, n);
      const todayKey = this._fmt(Date.now(), { year: "numeric", month: "2-digit", day: "2-digit" });
      fcHtml = `<div class="w-fc" style="--fc-count:${list.length}">${list
        .map((f) => {
          const ts = Date.parse(f.datetime);
          let label;
          if (type === "hourly") label = this._fmtTime(ts);
          else if (this._fmt(ts, { year: "numeric", month: "2-digit", day: "2-digit" }) === todayKey) label = this._t("today");
          else label = this._fmt(ts, { weekday: "short" }).replace(/\.$/, "");
          const pp = f.precipitation_probability;
          return `<div class="fc"><span class="d">${esc(label)}</span><ha-icon icon="${this._weatherIcon(f.condition, false)}"></ha-icon><span class="hi">${round(f.temperature)}°</span>${
            f.templow != null ? `<span class="lo">${round(f.templow)}°</span>` : ""
          }<span class="pp">${pp != null && pp > 0 ? `${round(pp)} %` : ""}</span></div>`;
        })
        .join("")}</div>`;
    }

    el.innerHTML = `${head}
      <div class="w-now">
        <ha-icon icon="${this._weatherIcon(s.state, isNight)}"></ha-icon>
        <div>
          <div class="w-temp">${round(a.temperature)}<small>${esc(tu)}</small></div>
          <div class="w-cond">${esc(this._condLabel(s.state, s))}</div>
        </div>
      </div>
      <div class="w-stats">${stats.join("")}</div>
      ${fcHtml}`;
  }

  /* ---------- shopping list (todo entity, e.g. Bring!) */

  _renderTodo() {
    if (!this._built) return;
    const id = this._config.todo_entity;
    const s = id && this._hass.states[id];
    this._el.todoTitle.textContent = this._config.title_todo || s?.attributes.friendly_name || this._t("shopping");
    const body = this._el.todoBody;
    this._el.form.style.display = s ? "" : "none";
    if (!id) {
      this._el.todoCount.textContent = "";
      return void (body.innerHTML = `<div class="msg">${this._t("not_configured")}</div>`);
    }
    if (!s) {
      this._el.todoCount.textContent = "";
      return void (body.innerHTML = `<div class="msg error">${this._t("not_found")}: ${esc(id)}</div>`);
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

  _onTodoClick(ev) {
    const item = ev.target.closest("[data-uid]");
    const chip = ev.target.closest("[data-reopen]");
    const entity_id = this._config.todo_entity;
    if (item) {
      const uid = item.dataset.uid;
      if (this._pending.has(uid)) return;
      this._pending.add(uid);
      item.classList.add("pending");
      this._hass
        .callService("todo", "update_item", { item: uid, status: "completed" }, { entity_id })
        .catch((err) => this._serviceError(err, uid));
    } else if (chip) {
      const uid = chip.dataset.reopen;
      chip.disabled = true;
      this._hass
        .callService("todo", "update_item", { item: uid, status: "needs_action" }, { entity_id })
        .catch((err) => this._serviceError(err));
    }
  }

  _addItem() {
    const raw = this._el.input.value.trim();
    if (!raw || !this._items) return;
    const entity_id = this._config.todo_entity;
    const s = this._hass.states[entity_id];
    const supportsDesc = ((s?.attributes.supported_features || 0) & 64) !== 0;

    let summary = raw;
    let description;
    const sep = this._config.spec_separator;
    if (sep && supportsDesc && raw.includes(sep)) {
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
      const data = { item: existing.uid, status: "needs_action" };
      if (description) data.description = description;
      if (existing.status === "needs_action" && !description) return;
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

  _serviceError(err, uid) {
    if (uid) this._pending.delete(uid);
    this._renderTodo();
    console.error(`[${CARD_TAG}]`, err);
    this.dispatchEvent(
      new CustomEvent("hass-notification", {
        detail: { message: err?.message || String(err) },
        bubbles: true,
        composed: true,
      })
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
      const entries = Array.isArray(list) ? list : [{ ...s.attributes, __state: s.state }];
      for (const raw of entries) {
        if (!raw || typeof raw !== "object") continue;
        const d = this._normalize(raw, conf, now);
        if (!d) continue;
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
      .filter((d) => (d.ts - now) / 60000 >= minMin || minMin <= 0)
      .filter((d) => !lineFilter.length || lineFilter.includes(d.line.toLowerCase()))
      .filter((d) => !destExclude.some((x) => d.destination.toLowerCase().includes(x)))
      .sort((a, b) => (this._config.group_departures ? a.groupIdx - b.groupIdx : 0) || a.ts - b.ts);
    return { list: result, errors, now };
  }

  _normalize(raw, conf, now) {
    let line = this._readField(raw, "line", conf);
    if (line && typeof line === "object") line = line.name || line.label || line.number || line.symbol || "";
    const destination = this._readField(raw, "destination", conf);
    const delay = parseDelay(this._readField(raw, "delay", conf));
    let ts = parseTime(this._readField(raw, "time", conf), now);
    if (ts == null) {
      const m = this._readField(raw, "minutes", conf);
      if (m != null && m !== "" && !Number.isNaN(+m)) ts = now + +m * 60000;
    }
    if (ts == null && raw.__state != null) ts = parseTime(raw.__state, now);
    if (ts == null) return null;
    if (this._config.add_delay || conf.add_delay) ts += delay * 60000;
    const cancelled = this._readField(raw, "cancelled", conf);
    return {
      line: String(line ?? "").trim() || "•",
      destination: String(destination ?? "").trim(),
      ts,
      delay,
      platform: this._readField(raw, "platform", conf),
      cancelled: cancelled === true || cancelled === "true" || cancelled === 1,
      color: this._readField(raw, "color", conf),
    };
  }

  _lineColor(d) {
    const colors = this._config.line_colors || {};
    if (colors[d.line]) return colors[d.line];
    if (d.color) return String(d.color).match(/^[0-9a-f]{6}$/i) ? `#${d.color}` : d.color;
    return LINE_PALETTE[hashString(d.line) % LINE_PALETTE.length];
  }

  _renderDepartures() {
    if (!this._built || !this._hass) return;
    const c = this._config;
    this._el.depTitle.textContent = c.title_departures || this._t("departures");
    const body = this._el.depBody;
    if (!this._depConf.length) {
      this._el.depMeta.textContent = "";
      return void (body.innerHTML = `<div class="msg">${this._t("not_configured")}</div>`);
    }
    const { list, errors, now } = this._collectDepartures();
    const max = Math.max(1, +c.max_departures || 7);
    const errHtml = errors.map((e) => `<div class="msg error">${this._t("not_found")}: ${esc(e)}</div>`).join("");
    this._el.depMeta.textContent = c.station_name || (this._depConf.length === 1 && !errors.length
      ? this._depConf[0].name || this._hass.states[this._depConf[0].entity]?.attributes.friendly_name || ""
      : "");

    if (!list.length) return void (body.innerHTML = errHtml + `<div class="msg">${this._t("no_departures")}</div>`);

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
        sub.push(esc(this._fmtTime(d.ts)));
        if (d.delay >= 1) sub.push(`<span class="late">+${Math.round(d.delay)}</span>`);
        else if (c.show_on_time) sub.push(`<span class="ontime">${this._t("on_time")}</span>`);
      }
      if (d.platform != null && d.platform !== "") sub.push(`${this._t("platform")} ${esc(d.platform)}`);

      html += `<div class="row${d.cancelled ? " cancelled" : ""}">
        <div class="badge" style="background:${esc(this._lineColor(d))}">${esc(d.line)}</div>
        <div style="min-width:0"><div class="dest">${esc(d.destination || "—")}</div><div class="sub">${sub.join(" · ")}</div></div>
        <div class="when">${when}</div>
      </div>`;
    }
    body.innerHTML = errHtml + `<div class="rows">${html}</div>`;
  }
}

/* ---------------------------------------------------------------- editor */

const EDITOR_LABELS = {
  weather_entity: "Wetter-Entität",
  todo_entity: "Einkaufsliste (To-do-Entität, z. B. Bring!)",
  departure_entities: "Abfahrts-Sensoren",
  title_departures: "Titel Abfahrten",
  title_todo: "Titel Einkaufsliste",
  max_departures: "Max. Abfahrten",
  hide_below_minutes: "Ausblenden unter (Min., Fußweg)",
  forecast_type: "Vorhersage-Typ",
  forecast_days: "Anzahl Vorhersage-Einträge",
  show_completed: "„Zuletzt gekauft“ (Anzahl)",
  show_seconds: "Sekunden anzeigen",
  add_delay: "Verspätung zur Abfahrtszeit addieren",
  group_departures: "Abfahrten nach Sensor gruppieren",
  height: "Kartenhöhe (CSS)",
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
          { name: "title_departures", selector: { text: {} } },
          { name: "title_todo", selector: { text: {} } },
          { name: "max_departures", selector: { number: { min: 1, max: 20, mode: "box" } } },
          { name: "hide_below_minutes", selector: { number: { min: 0, max: 30, mode: "box" } } },
          {
            name: "forecast_type",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "auto", label: "Automatisch" },
                  { value: "daily", label: "Täglich" },
                  { value: "twice_daily", label: "Zweimal täglich" },
                  { value: "hourly", label: "Stündlich" },
                ],
              },
            },
          },
          { name: "forecast_days", selector: { number: { min: 1, max: 8, mode: "box" } } },
          { name: "show_completed", selector: { number: { min: 0, max: 30, mode: "box" } } },
          { name: "height", selector: { text: {} } },
          { name: "show_seconds", selector: { boolean: {} } },
          { name: "add_delay", selector: { boolean: {} } },
          { name: "group_departures", selector: { boolean: {} } },
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
    }
    this._form.hass = this._hass;
    this._form.data = { forecast_type: "auto", ...this._config };
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
    description: "Uhrzeit, Wetter, Bring!-Einkaufsliste und nächste U-Bahn-Abfahrten – für das iPad im Querformat.",
    preview: false,
    documentationURL: "https://github.com/flxxxlf/homeassist-ipad-dashboard-card",
  });
}

console.info(
  `%c IPAD-DASHBOARD-CARD %c v${CARD_VERSION} `,
  "background:#7fa6c9;color:#0e1115;font-weight:700;border-radius:3px 0 0 3px",
  "background:#151a20;color:#e4e7eb;border-radius:0 3px 3px 0"
);
