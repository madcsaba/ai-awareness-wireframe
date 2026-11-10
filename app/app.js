/* EcoAI – low-energy AI assistant (PWA)
 * All data stays on the device (localStorage). Replies are simulated;
 * energy, time and cost figures are illustrative estimates.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * Models & constants
   * ------------------------------------------------------------------ */
  var WORST = 0.03;      // kWh / request of the heaviest tier (reference)
  var CO2 = 400;         // g CO₂ per kWh (grid average, illustrative)
  var PHONE_CHARGE = 0.015; // kWh for one smartphone charge
  var CIRC = 2 * Math.PI * 19;

  var MODELS = [
    { id: "gpt5mini", name: "GPT-5 mini", brand: "openai", L: "O", tier: "eco", kwh: 0.0001, cost: 0.0001, sec: 1.2,
      use: { en: "Summaries, translation, classification. Lowest energy use.", hu: "Összefoglalás, fordítás, osztályozás. A legkisebb energiaigény." } },
    { id: "haiku", name: "Claude Haiku", brand: "anthropic", L: "A", tier: "eco", kwh: 0.0001, cost: 0.0002, sec: 1.0,
      use: { en: "Quick answers, light coding, rewriting.", hu: "Gyors válaszok, egyszerű kód, átfogalmazás." } },
    { id: "flash", name: "Gemini Flash", brand: "google", L: "G", tier: "eco", kwh: 0.0002, cost: 0.0001, sec: 1.3,
      use: { en: "Long documents, multimodal at high speed.", hu: "Hosszú dokumentumok, multimodális, gyors." } },
    { id: "sonnet", name: "Claude Sonnet", brand: "anthropic", L: "A", tier: "mid", kwh: 0.001, cost: 0.003, sec: 3,
      use: { en: "Coding, analysis, long documents.", hu: "Programozás, elemzés, hosszú dokumentumok." } },
    { id: "gpt5", name: "GPT-5", brand: "openai", L: "O", tier: "mid", kwh: 0.001, cost: 0.002, sec: 3.5,
      use: { en: "Daily chat, light reasoning.", hu: "Napi beszélgetés, könnyebb érvelés." } },
    { id: "opus", name: "Claude Opus", brand: "anthropic", L: "A", tier: "big", kwh: 0.03, cost: 0.015, sec: 12,
      use: { en: "Complex research, multi-step work.", hu: "Összetett kutatás, többlépéses feladatok." } },
    { id: "local", name: "Llama / Mistral", brand: "local", L: "L", tier: "local", kwh: 0, cost: 0, sec: 2.5,
      use: { en: "Runs on your device — zero cloud energy, full privacy.", hu: "A saját eszközödön fut — nulla felhőenergia, teljes adatvédelem." } }
  ];
  var BY_ID = {};
  MODELS.forEach(function (m) { BY_ID[m.id] = m; });
  var TIERS = ["eco", "mid", "big", "local"];
  var VENDOR = { openai: "OpenAI", anthropic: "Anthropic", google: "Google", local: "on-device" };
  var ECO_OF = { openai: "gpt5mini", anthropic: "haiku", google: "flash", local: "local" };
  var BRAND_COLORS = { openai: "var(--openai)", anthropic: "var(--anthropic)", google: "var(--google)", local: "var(--local)" };
  var TIER_COLORS = { eco: "var(--green)", mid: "var(--amber)", big: "var(--deep)", local: "#0ea5e9" };
  var MILESTONES = [3, 5, 10, 20, 30, 50, 75, 100, 150, 200];

  /* ------------------------------------------------------------------ *
   * i18n
   * ------------------------------------------------------------------ */
  var T = {
    en: {
      tagline: "your low-energy assistant", ecoOn: "eco mode ON", settings: "Settings",
      emptyTitle: "Ask anything — mindfully", emptyText: "Every request shows its energy cost before you send it. Pick the lightest model that can do the job and keep your green streak going.",
      placeholder: "Message EcoAI…", send: "Send",
      tabChat: "Chat", tabFootprint: "Footprint", tabModels: "Models", tabStreak: "Streak",
      chooseModel: "Choose a model", chooseHint: "Organized by energy use — the efficient ones come first. Estimates per typical request.",
      tier_eco: "Efficient", tier_mid: "Balanced", tier_big: "Deep reasoning", tier_local: "Open · local",
      cloud0: "0 kWh cloud", recommended: "Recommended", deflt: "Default",
      language: "Language", theme: "Theme", auto: "Auto", nudges: "Pre-send nudges",
      install: "📲 Install app", loadDemo: "Load demo data (60 days)", reset: "Delete all my data",
      resetConfirm: "Delete all chats and footprint data on this device?",
      disclaimer: "Demo app: replies are simulated. Energy, time and cost are illustrative estimates per request (≈400 g CO₂/kWh). Everything is stored only on this device.",
      backToPack: "← Back to the wireframe pack",
      starters: [
        ["Summarize this 40-page study into 5 bullets.", "summary · efficient model is enough"],
        ["How much energy does one AI request use?", "about EcoAI"],
        ["Write a Python function that removes duplicates from a list.", "light coding"],
        ["Design a 3-year research plan comparing grid decarbonisation paths.", "complex · may need a bigger model"]
      ],
      shorter: "Make it shorter", eli12: "Explain like I'm 12", retryOn: "Retry on {m}",
      cacheHit: "cache hit", onDevice: "on-device", demo: "demo",
      nudgeDown: "Looks like a quick ask — <b>{m}</b> would use <b>{p}% less</b> energy.",
      nudgeUp: "This looks complex — <b>{m}</b> may give a better answer (more energy).",
      switchTo: "Switch", dismiss: "Dismiss",
      t_local: "Zero cloud energy", t_eco: "Greenest choice", t_mid: "Good balance", t_big: "Deep-reasoning model",
      b_eco: "eco", b_mid: "ok", b_big: "deep",
      m_local: "<b>{m}</b> ran on your device — nothing left it.",
      m_eco: "<b>{m}</b> uses ~{x}× less energy than Claude Opus for this kind of task.",
      m_mid: "<b>{m}</b> — solid quality at a moderate energy cost.",
      m_big: "<b>{m}</b> uses ~{x}× the energy of an efficient model — a good fit for hard, multi-step work. For quick asks, <b>{alt}</b> is enough.",
      n_just: "🧠 Complex task — a bigger model is justified here. Your streak is safe.",
      n_pass: "🎟️ Daily pass used — your streak is safe. The next bigger-model ask today ends it.",
      n_break: "Streak reset — no worries, the next efficient pick starts a new one.",
      n_mile: "🔥 {n} green picks in a row!",
      justified: "justified", passChip: "day pass",
      feedback: "Eco feedback", fbSmart: "Smart", fbAlways: "Always", fbOff: "Off",
      compareTitle: "Compare models for this message", compareHint: "Estimates for your current message ({n} characters). Tap a row to switch.",
      compareFine: "Illustrative per-request estimates; real values depend on the provider, hardware and answer length.",
      cmpModel: "Model", cmpTime: "Time", cmpCost: "Cost", cmpEnergy: "kWh", cmpCurrent: "current", compare: "Compare ›",
      passInfo: "<b>Daily pass:</b> one bigger-model request a day doesn't break your streak. Requests marked <b>justified</b> (complex tasks) never do.",
      passLeft: "Today's pass: available 🎟️", passUsed: "Today's pass: used",
      s_zero: "⚡ 0 kWh cloud · on-device · ≈ 0 g CO₂",
      s_heavy: "uses <b>{e} kWh</b> ≈ {g} CO₂",
      s_saved: "uses <b>{e} kWh</b> · saves <b>{s} kWh</b> ≈ {g} CO₂",
      // footprint
      fpTitle: "Your energy, last 30 days", vsPrev: "vs. previous 30 days", noPrev: "first month of tracking",
      byVendor: "By vendor", byTier: "By model tier", weekly: "Weekly trend", suggestions: "Suggestions", thisMonth: "Last 30 days",
      requests: "requests", greenPicks: "green picks", cacheRate: "cache hit rate", perReq: "CO₂ / request",
      savedVsOpus: "Saved vs. always using Claude Opus", phoneCharges: "≈ {n} phone charges",
      tipSmall: "<b>{a}</b> of your <b>{b}</b> requests were short asks on a bigger model → about <b>−{p}%</b> energy on the efficient tier.",
      tipOpus: "<b>{n}</b> Claude Opus calls → move routine ones to Claude Sonnet: similar quality, <b>−97%</b> energy.",
      tipLocal: "Try an on-device model for private or offline tasks: <b>0 kWh</b> cloud energy.",
      tipGood: "Nice — most of your requests already use the efficient tier. Keep it up! 🌿",
      apply: "Apply", applied: "Default set to {m}",
      fpEmpty: "No requests yet. Send a message in Chat, or load 60 days of demo data to explore the dashboard.",
      // models
      modelsTitle: "Pick your default", modelsHint: "New chats start with this model. Energy per typical request; per 100 requests on the right.",
      per100: "/100 req",
      // streak
      streakTitle: "green picks in a row 🔥", best: "Best streak: {n}", savingWeek: "You saved {s} kWh this week vs. always-Opus.",
      thisWeek: "This week", badgesTitle: "Eco badges", locked: "locked",
      bd_first: "First green pick", bd_ten: "10 green picks", bd_local: "Local model user", bd_cache: "Cache hero (5 hits)",
      bd_week: "7-day green streak", bd_month: "30-day green streak", bd_kwh: "Saved 0.1 kWh",
      days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      nowWeek: "now"
    },
    hu: {
      tagline: "alacsony energiájú asszisztensed", ecoOn: "eco mód BE", settings: "Beállítások",
      emptyTitle: "Kérdezz bármit — tudatosan", emptyText: "Minden kérés energia-költségét látod küldés előtt. Válaszd a legkönnyebb modellt, ami elvégzi a feladatot, és tartsd életben a zöld szériádat.",
      placeholder: "Üzenet az EcoAI-nak…", send: "Küldés",
      tabChat: "Chat", tabFootprint: "Lábnyom", tabModels: "Modellek", tabStreak: "Széria",
      chooseModel: "Válassz modellt", chooseHint: "Energiafogyasztás szerint rendezve — elöl a takarékosak. Becslés egy átlagos kérésre.",
      tier_eco: "Takarékos", tier_mid: "Kiegyensúlyozott", tier_big: "Mély érvelés", tier_local: "Nyílt · helyi",
      cloud0: "0 kWh felhő", recommended: "Ajánlott", deflt: "Alapértelmezett",
      language: "Nyelv", theme: "Téma", auto: "Auto", nudges: "Küldés előtti javaslatok",
      install: "📲 Alkalmazás telepítése", loadDemo: "Demó adatok betöltése (60 nap)", reset: "Minden adatom törlése",
      resetConfirm: "Törlöd az összes beszélgetést és lábnyom-adatot erről az eszközről?",
      disclaimer: "Demó alkalmazás: a válaszok szimuláltak. Az energia, idő és költség kérésenkénti szemléltető becslés (≈400 g CO₂/kWh). Minden adat csak ezen az eszközön tárolódik.",
      backToPack: "← Vissza a wireframe csomaghoz",
      starters: [
        ["Foglald össze ezt a 40 oldalas tanulmányt 5 pontban.", "összefoglaló · elég a takarékos modell"],
        ["Mennyi energiát használ egy AI-kérés?", "az EcoAI-ról"],
        ["Írj egy Python függvényt, ami kiszűri a duplikátumokat egy listából.", "egyszerű kód"],
        ["Tervezz 3 éves kutatási tervet a villamosenergia-rendszer dekarbonizációs útjainak összehasonlítására.", "összetett · nagyobb modell kellhet"]
      ],
      shorter: "Legyen rövidebb", eli12: "Magyarázd el 12 évesnek", retryOn: "Újra: {m}",
      cacheHit: "gyorsítótár", onDevice: "eszközön", demo: "demó",
      nudgeDown: "Gyors kérdésnek tűnik — a <b>{m}</b> <b>{p}%-kal kevesebb</b> energiát használna.",
      nudgeUp: "Ez összetettnek tűnik — a <b>{m}</b> jobb választ adhat (több energiával).",
      switchTo: "Váltás", dismiss: "Elvetés",
      t_local: "Nulla felhőenergia", t_eco: "A legzöldebb választás", t_mid: "Jó egyensúly", t_big: "Mély érvelésű modell",
      b_eco: "eco", b_mid: "ok", b_big: "mély",
      m_local: "A <b>{m}</b> a saját eszközödön futott — semmi nem hagyta el.",
      m_eco: "A <b>{m}</b> ~{x}× kevesebb energiát használ, mint a Claude Opus az ilyen feladatra.",
      m_mid: "<b>{m}</b> — jó minőség mérsékelt energiaköltséggel.",
      m_big: "A <b>{m}</b> ~{x}× annyi energiát használ, mint egy takarékos modell — nehéz, többlépéses feladatra jó választás. Gyors kérdéshez elég a <b>{alt}</b>.",
      n_just: "🧠 Összetett feladat — itt indokolt a nagyobb modell. A széria megmarad.",
      n_pass: "🎟️ Napi szabadjegy felhasználva — a széria megmaradt. A ma következő nagyobb-modelles kérés már megszakítja.",
      n_break: "A széria újraindul — semmi gond, a következő takarékos választással új kezdődik.",
      n_mile: "🔥 {n} zöld választás egymás után!",
      justified: "indokolt", passChip: "szabadjegy",
      feedback: "Eco visszajelzés", fbSmart: "Okos", fbAlways: "Mindig", fbOff: "Ki",
      compareTitle: "Modellek összevetése erre az üzenetre", compareHint: "Becslés a jelenlegi üzenetedre ({n} karakter). Koppints egy sorra a váltáshoz.",
      compareFine: "Szemléltető, kérésenkénti becslés; a valós érték a szolgáltatótól, a hardvertől és a válasz hosszától függ.",
      cmpModel: "Modell", cmpTime: "Idő", cmpCost: "Költség", cmpEnergy: "kWh", cmpCurrent: "jelenlegi", compare: "Összevetés ›",
      passInfo: "<b>Napi szabadjegy:</b> naponta egy nagyobb-modelles kérés nem szakítja meg a szériát. Az <b>indokolt</b>-ként jelölt (összetett) kérések soha.",
      passLeft: "Mai szabadjegy: elérhető 🎟️", passUsed: "Mai szabadjegy: felhasználva",
      s_zero: "⚡ 0 kWh felhő · eszközön · ≈ 0 g CO₂",
      s_heavy: "<b>{e} kWh</b> ≈ {g} CO₂",
      s_saved: "<b>{e} kWh</b> · megtakarítás <b>{s} kWh</b> ≈ {g} CO₂",
      fpTitle: "Energiafogyasztásod, utolsó 30 nap", vsPrev: "az előző 30 naphoz képest", noPrev: "a követés első hónapja",
      byVendor: "Szolgáltató szerint", byTier: "Modellszint szerint", weekly: "Heti trend", suggestions: "Javaslatok", thisMonth: "Utolsó 30 nap",
      requests: "kérés", greenPicks: "zöld választás", cacheRate: "gyorsítótár-találat", perReq: "CO₂ / kérés",
      savedVsOpus: "Megtakarítás ahhoz képest, ha mindig Claude Opust használnál", phoneCharges: "≈ {n} telefontöltés",
      tipSmall: "<b>{b}</b> kérésedből <b>{a}</b> rövid kérdés volt nagyobb modellen → a takarékos szinten kb. <b>−{p}%</b> energia.",
      tipOpus: "<b>{n}</b> Claude Opus hívás → a rutinfeladatokat vidd át Claude Sonnetre: hasonló minőség, <b>−97%</b> energia.",
      tipLocal: "Privát vagy offline feladatokra próbálj egy eszközön futó modellt: <b>0 kWh</b> felhőenergia.",
      tipGood: "Szép — a kéréseid többsége már a takarékos szinten fut. Csak így tovább! 🌿",
      apply: "Alkalmaz", applied: "Alapértelmezett: {m}",
      fpEmpty: "Még nincs kérés. Küldj egy üzenetet a Chatben, vagy tölts be 60 napnyi demó adatot a dashboard kipróbálásához.",
      modelsTitle: "Alapértelmezett modell", modelsHint: "Az új beszélgetések ezzel a modellel indulnak. Energia egy átlagos kérésre; jobbra 100 kérésre.",
      per100: "/100 kérés",
      streakTitle: "zöld választás egymás után 🔥", best: "Legjobb széria: {n}", savingWeek: "Ezen a héten {s} kWh-t spóroltál a mindig-Opushoz képest.",
      thisWeek: "Ez a hét", badgesTitle: "Eco jelvények", locked: "zárolva",
      bd_first: "Első zöld választás", bd_ten: "10 zöld választás", bd_local: "Helyi modell használó", bd_cache: "Gyorsítótár-hős (5 találat)",
      bd_week: "7 napos zöld széria", bd_month: "30 napos zöld széria", bd_kwh: "0,1 kWh megtakarítás",
      days: ["H", "K", "Sze", "Cs", "P", "Szo", "V"],
      nowWeek: "most"
    }
  };

  /* ------------------------------------------------------------------ *
   * State
   * ------------------------------------------------------------------ */
  var KEY = "ecoai-app-v1";
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  function fresh() { return { defaultModel: "gpt5mini", model: "gpt5mini", nudges: true, feedback: "smart", messages: [], requests: [] }; }
  var S;
  try { S = JSON.parse(store.get(KEY)) || fresh(); } catch (e) { S = fresh(); }
  if (!BY_ID[S.model]) S.model = "gpt5mini";
  if (!BY_ID[S.defaultModel]) S.defaultModel = "gpt5mini";
  if (["smart", "always", "off"].indexOf(S.feedback) < 0) S.feedback = "smart";
  function save() {
    if (S.messages.length > 200) S.messages = S.messages.slice(-200);
    if (S.requests.length > 5000) S.requests = S.requests.slice(-5000);
    store.set(KEY, JSON.stringify(S));
  }

  var lang = document.documentElement.lang === "hu" ? "hu" : "en";
  function t(k, vars) {
    var s = (T[lang][k] !== undefined ? T[lang][k] : T.en[k]);
    if (typeof s === "string" && vars) s = s.replace(/\{(\w+)\}/g, function (_, v) { return vars[v] !== undefined ? vars[v] : ""; });
    return s;
  }

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function nf(v, d) { return new Intl.NumberFormat(lang === "hu" ? "hu-HU" : "en-US", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v); }
  function kwhStr(v) { if (v === 0) return "0"; if (v < 0.001) return nf(v, 4); if (v < 1) return nf(v, 3); return nf(v, 2); }
  function gStr(kwh) { var g = kwh * CO2; if (g === 0) return "0 g"; if (g < 0.1) return nf(g, 2) + " g"; if (g < 10) return nf(g, 1) + " g"; if (g < 1000) return nf(Math.round(g), 0) + " g"; return nf(g / 1000, 2) + " kg"; }
  function costStr(v) { if (v === 0) return "$0"; if (v < 0.001) return "$" + nf(v, 4); return "$" + nf(v, 3); }
  function secStr(v) { return "~" + nf(v, v < 10 ? 1 : 0) + " s"; }
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * Estimation & classification
   * ------------------------------------------------------------------ */
  function factor(len) { return Math.min(3, Math.max(0.6, 0.6 + len / 300)); }
  function estimate(m, text, cache) {
    var f = factor((text || "").length);
    if (cache) return { kwh: m.kwh * f * 0.1, cost: m.cost * f * 0.1, sec: 0.3 };
    return { kwh: m.kwh * f, cost: m.cost * f, sec: m.sec * Math.sqrt(f) };
  }
  var HARD = /(research|analy[sz]|prove|proof|architect|strategy|step by step|multi-step|compare|plan|design|optimi[sz]|debug|refactor|kutat|elemez|elemzés|bizonyít|stratég|lépésről|összehasonlít|tervez|terv|optimaliz|hibakeres)/i;
  function complexity(text) {
    var s = (text || "").trim();
    if (s.length > 400 || (HARD.test(s) && s.length > 40)) return "hard";
    if (s.length < 160) return "easy";
    return "normal";
  }
  function norm(s) { return (s || "").trim().toLowerCase().replace(/\s+/g, " "); }
  function isCached(text, m) {
    var n = norm(text);
    if (m.tier === "local") return false;
    for (var i = S.messages.length - 1; i >= 0; i--) {
      var msg = S.messages[i];
      if (msg.role === "me" && norm(msg.text) === n) return true;
    }
    return false;
  }

  /* ------------------------------------------------------------------ *
   * Simulated replies
   * ------------------------------------------------------------------ */
  function topicOf(text) {
    var s = text.replace(/[?.!]+$/, "").trim();
    return s.length > 60 ? s.slice(0, 57) + "…" : s;
  }
  function reply(text, m) {
    var s = text.toLowerCase(), H = lang === "hu", topic = esc(topicOf(text));
    if (/(energ|kwh|co2|co₂|carbon|szén|áram)/.test(s)) {
      var rows = MODELS.map(function (x) { return "<li><b>" + x.name + "</b>: ≈ " + kwhStr(x.kwh) + " kWh" + (x.tier === "local" ? (H ? " (felhő)" : " (cloud)") : "") + "</li>"; }).join("");
      return H
        ? "<p>Egy átlagos kérés energiaigénye nagyon függ a modell méretétől. Az EcoAI szemléltető becslései:</p><ul>" + rows + "</ul><p>A legnagyobb modell egy kérésre akár <b>300×</b> annyi energiát használhat, mint egy takarékos. Ha a feladathoz elég a kis modell, ott a legnagyobb a megtakarítás.</p>"
        : "<p>The energy of a typical request depends heavily on model size. EcoAI's illustrative estimates:</p><ul>" + rows + "</ul><p>The largest model can use up to <b>300×</b> the energy of an efficient one per request. When the small model is good enough, that's where the biggest savings are.</p>";
    }
    if (/(shorter|make it short|rövidebb|rövidítsd)/.test(s)) {
      return H ? "<p>Rövidebben: a lényeg három mondatban — mi a kérdés, mi a fő eredmény, és mit érdemes tenni ezzel.</p>"
               : "<p>Shorter: the gist in three sentences — what the question is, what the main finding is, and what to do with it.</p>";
    }
    if (/(12|child|kid|gyerek|éves)/.test(s)) {
      return H ? "<p>Képzeld el, hogy minden kérdés egy kis zseblámpát kapcsol fel egy nagy számítógépteremben. A kis modell egy elemlámpa, a nagy modell egy reflektor. Egyszerű kérdéshez elég az elemlámpa! 🔦</p>"
               : "<p>Imagine every question switches on a light in a huge computer room. A small model is a pocket torch, a big model is a stadium floodlight. For a simple question the torch is plenty! 🔦</p>";
    }
    if (/(summar|összefoglal|bullet|pont|tl;dr)/.test(s)) {
      return (H ? "<p>Íme az öt fő megállapítás:</p>" : "<p>Here are the five key findings:</p>") +
        "<ol><li>" + (H ? "A kutatási kérdés és a módszer röviden." : "The research question and method in brief.") + "</li><li>" +
        (H ? "A legfontosabb eredmény számokkal." : "The headline result, with numbers.") + "</li><li>" +
        (H ? "Egy meglepő vagy ellentmondó adat." : "One surprising or contradicting data point.") + "</li><li>" +
        (H ? "A korlátok, amelyeket a szerzők megneveznek." : "Limitations the authors name.") + "</li><li>" +
        (H ? "Gyakorlati következtetés és javaslat." : "Practical takeaway and recommendation.") + "</li></ol>";
    }
    if (/(code|function|python|javascript|script|kód|függvény|program)/.test(s)) {
      return (H ? "<p>Egy egyszerű, sorrendet megtartó megoldás:</p>" : "<p>A simple, order-preserving solution:</p>") +
        "<pre>def dedupe(items):\n    seen = set()\n    return [x for x in items\n            if not (x in seen or seen.add(x))]</pre>" +
        (H ? "<p>Ilyen rövid kódhoz bőven elég a takarékos modell.</p>" : "<p>For short code like this the efficient model is plenty.</p>");
    }
    if (/(translat|fordít)/.test(s)) {
      return H ? "<p>A fordítás itt jelenne meg. Fordításra a takarékos modellek kiválóak — nincs szükség nagy modellre.</p>"
               : "<p>The translation would appear here. Efficient models are excellent at translation — no need for a big one.</p>";
    }
    if (complexity(text) === "hard") {
      return (H ? "<p>Összetett feladat — így bontanám lépésekre: <i>" + topic + "</i></p>" : "<p>A complex task — here's how I'd break it down: <i>" + topic + "</i></p>") +
        "<ol><li>" + (H ? "A cél és a sikerkritériumok rögzítése." : "Pin down the goal and success criteria.") + "</li><li>" +
        (H ? "Szakirodalom és adatforrások feltérképezése." : "Map literature and data sources.") + "</li><li>" +
        (H ? "Módszertan és összehasonlítási keret." : "Methodology and comparison framework.") + "</li><li>" +
        (H ? "Mérföldkövek és kockázatok." : "Milestones and risks.") + "</li></ol>" +
        (m.tier === "eco" ? (H ? "<p>Tipp: ennél a feladatnál egy kiegyensúlyozott modell alaposabb választ adhat.</p>" : "<p>Tip: for this task a balanced model may give a more thorough answer.</p>") : "");
    }
    return H ? "<p>Válasz erre: <i>" + topic + "</i>. Ez egy demó válasz — az EcoAI a válaszokat szimulálja, az energia-, idő- és költségadatok becslések.</p>"
             : "<p>Answer to: <i>" + topic + "</i>. This is a demo reply — EcoAI simulates answers; energy, time and cost figures are estimates.</p>";
  }

  /* ------------------------------------------------------------------ *
   * Static texts
   * ------------------------------------------------------------------ */
  function applyTexts() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i")); });
    document.querySelectorAll("[data-i-ph]").forEach(function (el) { el.placeholder = t(el.getAttribute("data-i-ph")); });
    document.querySelectorAll("[data-i-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i-aria"))); });
    $("starters").innerHTML = t("starters").map(function (s, i) {
      return '<button type="button" data-starter="' + i + '">' + esc(s[0]) + "<small>" + esc(s[1]) + "</small></button>";
    }).join("");
    document.querySelectorAll("#langSeg button").forEach(function (b) { b.classList.toggle("on", b.dataset.l === lang); });
  }

  /* ------------------------------------------------------------------ *
   * Composer: model chip, estimate, nudge
   * ------------------------------------------------------------------ */
  var nudgeDismissed = "";
  function cur() { return BY_ID[S.model]; }
  function renderComposer() {
    var m = cur(), text = $("inp").value;
    var lg = $("mpLogo"); lg.className = "logo " + m.brand; lg.textContent = m.L;
    $("mpName").textContent = m.name;
    $("mpDot").className = "dot " + m.tier;
    var e = estimate(m, text, text && isCached(text, m));
    $("est").innerHTML = "<span>⏱ " + secStr(e.sec) + "</span><span>💰 " + (m.tier === "local" ? "$0" : costStr(e.cost)) + "</span>" +
      '<span>⚡ <b class="' + m.tier + '">' + (m.tier === "local" ? t("cloud0") : kwhStr(e.kwh) + " kWh") + '</b></span><span class="cmp">' + t("compare") + "</span>";
    $("ecoPill").hidden = !(m.tier === "eco" || m.tier === "local");

    var n = $("nudge");
    var c = complexity(text);
    n.hidden = true;
    if (!S.nudges || !text.trim() || nudgeDismissed === text) return;
    if ((m.tier === "big" || m.tier === "mid") && c === "easy") {
      var alt = BY_ID[ECO_OF[m.brand]];
      var p = Math.min(99, Math.round((1 - alt.kwh / m.kwh) * 100));
      n.className = "nudge";
      n.innerHTML = "<span>💡</span><span>" + t("nudgeDown", { m: alt.name, p: p }) + '</span><button type="button" data-switch="' + alt.id + '">' + t("switchTo") + '</button><button type="button" class="x" data-dismiss aria-label="' + t("dismiss") + '">✕</button>';
      n.hidden = false;
    } else if (m.tier === "eco" && c === "hard") {
      var up = m.brand === "openai" ? BY_ID.gpt5 : BY_ID.sonnet;
      n.className = "nudge green";
      n.innerHTML = "<span>🧠</span><span>" + t("nudgeUp", { m: up.name }) + '</span><button type="button" data-switch="' + up.id + '">' + t("switchTo") + '</button><button type="button" class="x" data-dismiss aria-label="' + t("dismiss") + '">✕</button>';
      n.hidden = false;
    }
  }
  $("inp").addEventListener("input", renderComposer);
  $("nudge").addEventListener("click", function (e) {
    var sw = e.target.closest("[data-switch]");
    if (sw) { S.model = sw.getAttribute("data-switch"); save(); renderComposer(); $("inp").focus(); return; }
    if (e.target.closest("[data-dismiss]")) { nudgeDismissed = $("inp").value; renderComposer(); }
  });

  /* ------------------------------------------------------------------ *
   * Chat
   * ------------------------------------------------------------------ */
  function metaHTML(r) {
    var m = BY_ID[r.model] || cur();
    return '<div class="meta"><span class="logo ' + m.brand + '">' + m.L + "</span> " + esc(m.name) + " · " + nf(r.sec, 1) + " s" +
      ' <b class="' + m.tier + '">⚡ ' + (m.tier === "local" ? t("cloud0") : kwhStr(r.kwh) + " kWh") + "</b>" +
      (m.tier === "local" ? '<span class="chip green">' + t("onDevice") + "</span>" : "<span>≈ " + gStr(r.kwh) + " CO₂</span>") +
      (r.cache ? '<span class="chip green">' + t("cacheHit") + "</span>" : "") +
      (r.kind === "just" ? '<span class="chip deep">' + t("justified") + "</span>" : "") +
      (r.kind === "pass" ? '<span class="chip deep">🎟️ ' + t("passChip") + "</span>" : "") +
      '<span class="chip">' + t("demo") + "</span></div>";
  }
  function renderChat() {
    var box = $("msgs");
    $("chatEmpty").hidden = S.messages.length > 0;
    box.innerHTML = S.messages.map(function (msg) {
      if (msg.role === "me") return '<div class="msg me">' + esc(msg.text) + "</div>";
      return '<div class="msg ai">' + msg.html + metaHTML(msg) + "</div>";
    }).join("");
    var last = S.messages[S.messages.length - 1];
    if (last && last.role === "ai") box.insertAdjacentHTML("beforeend", suggHTML(last));
    scrollChat();
  }
  function suggHTML(last) {
    var m = BY_ID[last.model] || cur();
    var alt = (m.tier === "eco" || m.tier === "local") ? (m.brand === "openai" ? BY_ID.gpt5 : BY_ID.sonnet) : BY_ID[ECO_OF[m.brand]];
    return '<div class="sugg"><button type="button" data-ask="' + esc(t("shorter")) + '">' + esc(t("shorter")) + '</button>' +
      '<button type="button" data-ask="' + esc(t("eli12")) + '">' + esc(t("eli12")) + "</button>" +
      '<button type="button" data-retry="' + alt.id + '">' + esc(t("retryOn", { m: alt.name })) + "</button></div>";
  }
  function scrollChat() { var v = $("v-chat"); v.scrollTop = v.scrollHeight; }

  var busy = false;
  function send(text, modelId) {
    text = (text || "").trim();
    if (!text || busy) return;
    if (modelId) S.model = modelId;
    var m = cur();
    var cache = isCached(text, m);
    var e = estimate(m, text, cache);
    busy = true;
    S.messages.push({ role: "me", text: text, ts: Date.now() });
    $("inp").value = ""; nudgeDismissed = "";
    renderChat(); renderComposer();
    $("msgs").insertAdjacentHTML("beforeend", '<div class="msg ai" id="typing"><span class="typing"><i></i><i></i><i></i></span></div>');
    scrollChat();
    var delay = reduced ? 150 : Math.min(1400, 350 + e.sec * 120);
    setTimeout(function () {
      var prevReq = S.requests[S.requests.length - 1];
      var streakBefore = greenStreak();
      var just = (m.tier === "mid" || m.tier === "big") && complexity(text) === "hard";
      var req = { ts: Date.now(), model: m.id, kwh: e.kwh, cost: e.cost, cache: cache, len: text.length, just: just };
      S.requests.push(req);
      var kind = kinds()[S.requests.length - 1];
      var r = { role: "ai", html: reply(text, m), model: m.id, kwh: e.kwh, cost: e.cost, sec: e.sec, cache: cache, ts: req.ts, kind: kind };
      S.messages.push(r);
      save();
      busy = false;
      renderChat();
      feedback(m, e.kwh, kind, prevReq, streakBefore);
    }, delay);
  }
  $("form").addEventListener("submit", function (ev) { ev.preventDefault(); send($("inp").value); });
  $("v-chat").addEventListener("click", function (e) {
    var st = e.target.closest("[data-starter]");
    if (st) { $("inp").value = t("starters")[+st.getAttribute("data-starter")][0]; renderComposer(); $("inp").focus(); return; }
    var a = e.target.closest("[data-ask]");
    if (a) { send(a.getAttribute("data-ask")); return; }
    var rt = e.target.closest("[data-retry]");
    if (rt) {
      var lastMe = null;
      for (var i = S.messages.length - 1; i >= 0; i--) if (S.messages[i].role === "me") { lastMe = S.messages[i].text; break; }
      if (lastMe) send(lastMe, rt.getAttribute("data-retry"));
    }
  });

  /* ------------------------------------------------------------------ *
   * Eco toast
   * ------------------------------------------------------------------ */
  var toastTimer;
  function isGreen(r) { var tr = (BY_ID[r.model] || {}).tier; return tr === "eco" || tr === "local"; }
  /* each request: "green" | "just" (complex task, never breaks) | "pass" (first bigger ask of the day) | "break" */
  function kinds() {
    var used = {};
    return S.requests.map(function (r) {
      if (isGreen(r)) return "green";
      if (r.just) return "just";
      var d = dayKey(r.ts);
      if (!used[d]) { used[d] = 1; return "pass"; }
      return "break";
    });
  }
  function greenStreak() {
    var k = kinds(), n = 0;
    for (var i = k.length - 1; i >= 0; i--) { if (k[i] === "green") n++; else if (k[i] === "break") break; }
    return n;
  }
  function passUsedToday() {
    var k = kinds(), today = dayKey(Date.now());
    return S.requests.some(function (r, i) { return k[i] === "pass" && dayKey(r.ts) === today; });
  }
  function feedback(m, kwh, kind, prevReq, streakBefore) {
    var sN = greenStreak();
    var note = kind === "just" ? t("n_just") : kind === "pass" ? t("n_pass")
      : (kind === "break" && streakBefore > 0) ? t("n_break")
      : (kind === "green" && MILESTONES.indexOf(sN) >= 0) ? t("n_mile", { n: sN }) : "";
    var show = S.feedback === "always" ||
      (S.feedback === "smart" && (S.requests.length <= 3 || !prevReq || prevReq.model !== m.id || note));
    if (S.feedback !== "off" && show) { fireToast(m, kwh, note); return; }
    if (S.feedback === "off") return;
    var bs = document.querySelectorAll("#msgs .msg.ai .meta b");
    var b = bs[bs.length - 1];
    if (b && !reduced) b.classList.add("pop");
  }
  function fireToast(m, kwh, note) {
    var tier = m.tier, isEco = tier === "eco" || tier === "local", isHeavy = tier === "big";
    var tEl = $("toast");
    clearTimeout(toastTimer);
    tEl.classList.remove("show", "hide", "amber", "deep"); void tEl.offsetWidth;
    if (isHeavy) tEl.classList.add("deep");
    $("badge").textContent = t("b_" + (tier === "local" ? "eco" : tier));
    $("ttlTxt").textContent = t("t_" + tier);
    var alt = BY_ID[ECO_OF[m.brand]];
    $("tnote").textContent = note || "";
    $("tnote").hidden = !note;
    $("tmsg").innerHTML = t("m_" + tier, { m: esc(m.name), x: tier === "big" ? Math.round(m.kwh / alt.kwh) : Math.round(WORST / Math.max(m.kwh, 0.0001)), alt: esc(alt.name) });
    var worstHere = kwh * (WORST / Math.max(m.kwh, 1e-9));
    var saved = tier === "local" ? 0 : Math.max(0, worstHere - kwh);
    $("tsave").innerHTML = tier === "local" ? t("s_zero")
      : isHeavy ? t("s_heavy", { e: kwhStr(kwh), g: gStr(kwh) })
      : t("s_saved", { e: kwhStr(kwh), s: kwhStr(saved), g: gStr(saved) });
    var pct = tier === "local" ? 0 : Math.max(1, Math.round(m.kwh / WORST * 100));
    var ring = $("ringFg");
    ring.style.transition = "none"; ring.style.strokeDashoffset = CIRC; void ring.getBoundingClientRect();
    ring.style.transition = "";
    $("ringPct").textContent = pct + "%";
    var sN = greenStreak();
    var dots = "";
    for (var i = 0; i < 7; i++) dots += '<i class="' + (i < Math.min(sN, 7) ? "on" : "") + '"></i>';
    $("tstreak").innerHTML = dots;
    tEl.classList.add("show");
    if (!reduced && isEco) {
      var g = $("glow"); g.classList.remove("show"); void g.offsetWidth; g.classList.add("show");
      leaves();
    }
    setTimeout(function () { ring.style.strokeDashoffset = CIRC * (1 - pct / 100); }, reduced ? 0 : 350);
    toastTimer = setTimeout(closeToast, 6000);
  }
  function leaves() {
    var b = $("burst"); b.innerHTML = "";
    var em = ["🌿", "🍃", "🌱", "💚"];
    for (var i = 0; i < 12; i++) {
      var s = document.createElement("span"), spark = i > 7;
      s.className = "leaf"; s.textContent = spark ? "·" : em[i % 4];
      s.style.setProperty("--dx", ((Math.random() - 0.5) * 240).toFixed(0) + "px");
      s.style.setProperty("--dy", (-70 - Math.random() * 120).toFixed(0) + "px");
      s.style.setProperty("--rot", ((Math.random() - 0.5) * 360).toFixed(0) + "deg");
      s.style.left = ((Math.random() - 0.5) * 100).toFixed(0) + "px";
      s.style.animationDelay = (Math.random() * 0.35).toFixed(2) + "s";
      if (spark) { s.style.fontSize = (10 + Math.random() * 9) + "px"; s.style.color = "var(--green)"; }
      b.appendChild(s);
    }
  }
  function closeToast() {
    var tEl = $("toast"); if (!tEl.classList.contains("show")) return;
    tEl.classList.remove("show"); tEl.classList.add("hide");
  }
  $("toast").addEventListener("click", closeToast);

  /* ------------------------------------------------------------------ *
   * Sheets
   * ------------------------------------------------------------------ */
  function openSheet(id) { closeToast(); var s = $(id); s.classList.add("on"); s.setAttribute("aria-hidden", "false"); }
  function closeSheet(id) { var s = $(id); s.classList.remove("on"); s.setAttribute("aria-hidden", "true"); }
  ["sheet", "settings", "compare"].forEach(function (id) {
    $(id).addEventListener("click", function (e) { if (e.target.id === id) closeSheet(id); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeSheet("sheet"); closeSheet("settings"); closeSheet("compare"); } });

  function modelListHTML(selId, mode) {
    return TIERS.map(function (tr) {
      var ms = MODELS.filter(function (m) { return m.tier === tr; });
      var head = '<div class="tier"><span>' + t("tier_" + tr) + '</span><span class="eco ' + tr + '">' +
        (tr === "local" ? t("cloud0") : "≈ " + kwhStr(ms[0].kwh) + " kWh") + "</span></div>";
      return head + ms.map(function (m) {
        var tags = (m.id === "gpt5mini" ? '<span class="tag best">' + t("recommended") + "</span>" : "") +
          (m.id === S.defaultModel ? '<span class="tag def">' + t("deflt") + "</span>" : "");
        var right = mode === "models"
          ? (m.tier === "local" ? "0" : "≈ " + kwhStr(m.kwh)) + "<small>" + (m.tier === "local" ? "0" : kwhStr(m.kwh * 100)) + " kWh " + t("per100") + "</small>"
          : (m.tier === "local" ? "0 cloud" : "≈ " + kwhStr(m.kwh));
        return '<button type="button" class="mrow' + (m.id === selId ? " sel" : "") + '" data-model="' + m.id + '">' +
          '<span class="logo lg ' + m.brand + '">' + m.L + '</span><span class="mtxt"><b>' + esc(m.name) + "</b>" + tags +
          ' <span class="vend">' + VENDOR[m.brand] + "</span><p>" + esc(m.use[lang]) + "</p></span>" +
          '<span class="kwh ' + m.tier + '">' + right + "</span></button>";
      }).join("");
    }).join("");
  }
  function renderSheet() { $("sheetList").innerHTML = modelListHTML(S.model, "sheet"); }
  $("mpick").addEventListener("click", function () { renderSheet(); openSheet("sheet"); });
  $("sheetList").addEventListener("click", function (e) {
    var r = e.target.closest("[data-model]"); if (!r) return;
    S.model = r.getAttribute("data-model"); save();
    renderComposer(); closeSheet("sheet");
  });

  function relStr(x, base) {
    if (x === base) return ["same", "="];
    if (base === 0) return ["more", "+" + kwhStr(x)];
    if (x === 0) return ["less", "−100%"];
    if (x < base) return ["less", "−" + Math.min(99, Math.round((1 - x / base) * 100)) + "%"];
    var r = x / base;
    return ["more", r < 10 ? "×" + nf(r, 1) : "×" + nf(Math.round(r), 0)];
  }
  function renderCompare() {
    var text = $("inp").value, me = cur();
    var mine = estimate(me, text, false).kwh;
    $("cmpHint").textContent = t("compareHint", { n: text.trim().length });
    var rows = MODELS.slice().sort(function (a, b) { return a.kwh - b.kwh || a.sec - b.sec; }).map(function (m) {
      var e = estimate(m, text, false), rel = m.id === me.id ? ["same", t("cmpCurrent")] : relStr(e.kwh, mine);
      return '<tr data-model="' + m.id + '" class="' + (m.id === me.id ? "sel" : "") + '"><td><span class="nm"><span class="logo ' + m.brand + '">' + m.L + "</span>" + esc(m.name) + "</span></td>" +
        "<td>" + secStr(e.sec) + "</td><td>" + (m.tier === "local" ? "$0" : costStr(e.cost)) + '</td><td class="' + m.tier + '">' + (m.tier === "local" ? "0" : kwhStr(e.kwh)) +
        '<span class="rel ' + rel[0] + '">' + rel[1] + "</span></td></tr>";
    }).join("");
    $("cmpList").innerHTML = '<table class="cmp-table"><thead><tr><th>' + t("cmpModel") + "</th><th>" + t("cmpTime") + "</th><th>" + t("cmpCost") + "</th><th>" + t("cmpEnergy") + "</th></tr></thead><tbody>" + rows + "</tbody></table>";
  }
  $("est").addEventListener("click", function () { renderCompare(); openSheet("compare"); });
  $("cmpList").addEventListener("click", function (e) {
    var r = e.target.closest("[data-model]"); if (!r) return;
    S.model = r.getAttribute("data-model"); save();
    renderComposer(); closeSheet("compare"); $("inp").focus();
  });

  /* ------------------------------------------------------------------ *
   * Footprint
   * ------------------------------------------------------------------ */
  var DAY = 864e5;
  function within(fromDaysAgo, toDaysAgo) {
    var now = Date.now();
    return S.requests.filter(function (r) { return r.ts > now - fromDaysAgo * DAY && r.ts <= now - toDaysAgo * DAY; });
  }
  function sum(arr, k) { return arr.reduce(function (a, r) { return a + (r[k] || 0); }, 0); }
  function opusEquiv(arr) {
    return arr.reduce(function (a, r) {
      var m = BY_ID[r.model] || BY_ID.gpt5mini;
      var f = factor(r.len || 100);
      return a + (r.cache ? WORST * f * 0.1 : WORST * f);
    }, 0);
  }
  function splitHTML(arr, keyFn, colors, labelFn) {
    var tot = sum(arr, "kwh");
    var acc = {};
    arr.forEach(function (r) { var k = keyFn(r); acc[k] = (acc[k] || 0) + r.kwh; });
    var keys = Object.keys(colors).filter(function (k) { return acc[k] !== undefined; });
    if (!tot) {
      return '<div class="split"></div><div class="legend">' + keys.map(function (k) { return '<span><i style="background:' + colors[k] + '"></i>' + labelFn(k) + " 0%</span>"; }).join("") + "</div>";
    }
    return '<div class="split">' + keys.map(function (k) { return '<i style="width:' + (acc[k] / tot * 100) + "%;background:" + colors[k] + '"></i>'; }).join("") +
      '</div><div class="legend">' + keys.map(function (k) { return '<span><i style="background:' + colors[k] + '"></i>' + labelFn(k) + " " + Math.round(acc[k] / tot * 100) + "%</span>"; }).join("") + "</div>";
  }
  function renderFootprint() {
    var v = $("v-footprint");
    if (!S.requests.length) {
      v.innerHTML = '<div class="card empty-card"><div style="font-size:34px">🌱</div><p>' + t("fpEmpty") + '</p><button class="btn primary" type="button" data-demo>' + t("loadDemo") + "</button></div>";
      return;
    }
    var last = within(30, 0), prev = within(60, 30);
    var k = sum(last, "kwh"), kp = sum(prev, "kwh");
    var delta = kp ? Math.round((k - kp) / kp * 100) : null;
    var deltaHTML = delta === null ? t("noPrev")
      : '<b class="' + (delta <= 0 ? "good" : "bad") + '">' + (delta > 0 ? "+" : "−") + Math.abs(delta) + "%</b> " + t("vsPrev");

    // weekly bars
    var weeks = [], maxW = 0;
    for (var w = 6; w >= 0; w--) { var val = sum(within((w + 1) * 7, w * 7), "kwh"); weeks.push(val); maxW = Math.max(maxW, val); }
    var bars = weeks.map(function (val, i) {
      var h = maxW ? Math.max(3, val / maxW * 100) : 3;
      return '<div class="b"><em>' + (val ? kwhStr(val) : "") + '</em><i class="' + (i === 6 ? "cur" : "") + '" style="height:' + h + '%"></i><span>' + (i === 6 ? t("nowWeek") : "−" + (6 - i)) + "</span></div>";
    }).join("");

    // tips
    var tips = [];
    var bigShort = last.filter(function (r) { var m = BY_ID[r.model]; return m && (m.tier === "mid" || m.tier === "big") && (r.len || 0) < 160; });
    if (bigShort.length) {
      var cur30 = sum(last, "kwh");
      var after = cur30 - sum(bigShort, "kwh") + bigShort.length * 0.0001 * 0.9;
      var p = cur30 ? Math.round((1 - after / cur30) * 100) : 0;
      tips.push(["🌿", t("tipSmall", { a: bigShort.length, b: last.length, p: p }), "gpt5mini"]);
    }
    var opusN = last.filter(function (r) { return r.model === "opus"; }).length;
    if (opusN) tips.push(["⚡", t("tipOpus", { n: opusN }), "sonnet"]);
    if (!last.some(function (r) { return r.model === "local"; })) tips.push(["🔒", t("tipLocal"), "local"]);
    if (!bigShort.length && !opusN) tips.unshift(["🏅", t("tipGood"), null]);

    var green = last.filter(function (r) { var tr = (BY_ID[r.model] || {}).tier; return tr === "eco" || tr === "local"; }).length;
    var cacheN = last.filter(function (r) { return r.cache; }).length;
    var saved = Math.max(0, opusEquiv(last) - k);

    v.innerHTML =
      '<div class="card"><h3>' + t("fpTitle") + '</h3><div class="hero-num">' + kwhStr(k) + " <small>kWh</small></div>" +
      '<div class="delta">≈ ' + gStr(k) + " CO₂ · " + deltaHTML + "</div>" +
      '<h2 class="sec" style="margin-top:14px">' + t("byVendor") + "</h2>" +
      splitHTML(last, function (r) { return (BY_ID[r.model] || {}).brand; }, BRAND_COLORS, function (b) { return VENDOR[b]; }) +
      '<h2 class="sec">' + t("byTier") + "</h2>" +
      splitHTML(last, function (r) { return (BY_ID[r.model] || {}).tier; }, TIER_COLORS, function (tr) { return t("tier_" + tr); }) +
      "</div>" +
      '<div class="card"><h3>' + t("weekly") + '</h3><div class="bars">' + bars + "</div></div>" +
      '<h2 class="sec">' + t("suggestions") + "</h2>" +
      tips.map(function (x) {
        return '<div class="tip"><span class="ti">' + x[0] + "</span><span>" + x[1] + "</span>" +
          (x[2] ? '<button type="button" data-apply="' + x[2] + '">' + t("apply") + "</button>" : "") + "</div>";
      }).join("") +
      '<h2 class="sec">' + t("thisMonth") + "</h2>" +
      '<div class="stats">' +
      '<div class="stat"><b>' + last.length + "</b><span>" + t("requests") + "</span></div>" +
      '<div class="stat"><b>' + green + " 🔥</b><span>" + t("greenPicks") + "</span></div>" +
      '<div class="stat"><b>' + (last.length ? Math.round(cacheN / last.length * 100) : 0) + "%</b><span>" + t("cacheRate") + "</span></div>" +
      '<div class="stat"><b>' + (last.length ? gStr(k / last.length) : "0 g") + "</b><span>" + t("perReq") + "</span></div>" +
      "</div>" +
      '<div class="card" style="margin-top:12px"><h3>' + t("savedVsOpus") + '</h3><div class="hero-num" style="color:var(--green-d)">' + kwhStr(saved) + " <small>kWh</small></div>" +
      '<div class="delta">≈ ' + gStr(saved) + " CO₂ · " + t("phoneCharges", { n: nf(saved / PHONE_CHARGE, 0) }) + "</div></div>";
  }
  $("v-footprint").addEventListener("click", function (e) {
    if (e.target.closest("[data-demo]")) { loadDemo(); return; }
    var a = e.target.closest("[data-apply]"); if (!a) return;
    S.defaultModel = S.model = a.getAttribute("data-apply"); save();
    renderComposer();
    a.textContent = "✓"; a.disabled = true;
    flash(t("applied", { m: BY_ID[S.model].name }));
  });

  /* ------------------------------------------------------------------ *
   * Models
   * ------------------------------------------------------------------ */
  function renderModels() {
    $("v-models").innerHTML = '<h2 class="sec" style="margin-top:2px">' + t("modelsTitle") + '</h2><p class="muted" style="color:var(--dim);font-size:12.5px;margin:0 2px 6px">' + t("modelsHint") + "</p>" + modelListHTML(S.defaultModel, "models");
  }
  $("v-models").addEventListener("click", function (e) {
    var r = e.target.closest("[data-model]"); if (!r) return;
    S.defaultModel = S.model = r.getAttribute("data-model"); save();
    renderModels(); renderComposer();
    fireToast(cur(), estimate(cur(), "", false).kwh);
  });

  /* ------------------------------------------------------------------ *
   * Streak & badges
   * ------------------------------------------------------------------ */
  function dayKey(ts) { var d = new Date(ts); return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate(); }
  function greenDays() {
    var set = {};
    S.requests.forEach(function (r) { var tr = (BY_ID[r.model] || {}).tier; if (tr === "eco" || tr === "local") set[dayKey(r.ts)] = 1; });
    return set;
  }
  function dayStreak(set) {
    var n = 0, d = new Date(); d.setHours(12, 0, 0, 0);
    if (!set[dayKey(d.getTime())]) d = new Date(d.getTime() - DAY); // today not yet counted
    while (set[dayKey(d.getTime())]) { n++; d = new Date(d.getTime() - DAY); }
    return n;
  }
  function bestStreak() {
    var best = 0, n = 0;
    kinds().forEach(function (k) { if (k === "green") { n++; best = Math.max(best, n); } else if (k === "break") n = 0; });
    return best;
  }
  function renderStreak() {
    var sN = greenStreak(), set = greenDays(), ds = dayStreak(set);
    var now = new Date(); var dow = (now.getDay() + 6) % 7; // Monday = 0
    var monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow, 12);
    var days = t("days").map(function (lbl, i) {
      var d = new Date(monday.getTime() + i * DAY);
      var on = !!set[dayKey(d.getTime())];
      return '<div class="' + (on ? "on" : "") + (i === dow ? " today" : "") + '"><i>' + (on ? "✓" : "") + "</i>" + lbl + "</div>";
    }).join("");
    var weekReq = S.requests.filter(function (r) { return r.ts >= monday.getTime() - 12 * 36e5; });
    var weekSaved = Math.max(0, opusEquiv(weekReq) - sum(weekReq, "kwh"));
    var totalGreen = S.requests.filter(function (r) { var tr = (BY_ID[r.model] || {}).tier; return tr === "eco" || tr === "local"; }).length;
    var localN = S.requests.filter(function (r) { return r.model === "local"; }).length;
    var cacheN = S.requests.filter(function (r) { return r.cache; }).length;
    var totalSaved = Math.max(0, opusEquiv(S.requests) - sum(S.requests, "kwh"));
    var B = [
      ["🌱", "bd_first", totalGreen, 1], ["⚡", "bd_ten", totalGreen, 10], ["🔒", "bd_local", localN, 1],
      ["♻️", "bd_cache", cacheN, 5], ["📅", "bd_week", ds, 7], ["🏆", "bd_month", ds, 30], ["🌍", "bd_kwh", totalSaved, 0.1]
    ];
    $("v-streak").innerHTML =
      '<div class="card streak-hero"><div class="n">' + sN + "</div><div><b>" + t("streakTitle") + '</b></div><div class="muted" style="margin-top:6px">' +
      t("best", { n: bestStreak() }) + " · " + t("savingWeek", { s: kwhStr(weekSaved) }) + "</div></div>" +
      '<div class="card"><h3>' + t("thisWeek") + '</h3><div class="days">' + days + "</div></div>" +
      '<div class="card passbox"><span class="pi">🎟️</span><span><b>' + (passUsedToday() ? t("passUsed") : t("passLeft")) + "</b><br>" + t("passInfo") + "</span></div>" +
      '<h2 class="sec">' + t("badgesTitle") + '</h2><div class="badges">' +
      B.map(function (b) {
        var got = b[2] >= b[3];
        var pr = Math.min(100, b[2] / b[3] * 100);
        return '<div class="bdg' + (got ? "" : " locked") + '"><div class="e">' + b[0] + "</div><b>" + t(b[1]) + "</b>" +
          (got ? "" : "<span>" + t("locked") + '</span><div class="prog"><i style="width:' + pr + '%"></i></div>') + "</div>";
      }).join("") + "</div>";
  }

  /* ------------------------------------------------------------------ *
   * Tabs
   * ------------------------------------------------------------------ */
  var curTab = "chat";
  function showTab(v) {
    curTab = v;
    document.querySelectorAll(".tabs button").forEach(function (b) {
      var on = b.dataset.v === v; b.classList.toggle("on", on); b.setAttribute("aria-selected", on ? "true" : "false");
    });
    document.querySelectorAll(".view").forEach(function (x) { x.classList.toggle("on", x.id === "v-" + v); });
    $("composer").hidden = v !== "chat";
    if (v === "footprint") renderFootprint();
    if (v === "models") renderModels();
    if (v === "streak") renderStreak();
    if (v === "chat") scrollChat();
    closeToast();
    try { history.replaceState(null, "", "#" + v); } catch (e) {}
  }
  document.querySelectorAll(".tabs button").forEach(function (b) { b.addEventListener("click", function () { showTab(b.dataset.v); }); });

  /* ------------------------------------------------------------------ *
   * Settings
   * ------------------------------------------------------------------ */
  function renderSettings() {
    var th = store.get("ecoai-theme") || "auto";
    document.querySelectorAll("#themeSeg button").forEach(function (b) { b.classList.toggle("on", b.dataset.t === th); });
    document.querySelectorAll("#langSeg button").forEach(function (b) { b.classList.toggle("on", b.dataset.l === lang); });
    $("nudgeSw").checked = !!S.nudges;
    document.querySelectorAll("#fbSeg button").forEach(function (b) { b.classList.toggle("on", b.dataset.f === S.feedback); });
  }
  $("fbSeg").addEventListener("click", function (e) {
    var b = e.target.closest("[data-f]"); if (!b) return;
    S.feedback = b.dataset.f; save(); renderSettings();
  });
  $("settingsBtn").addEventListener("click", function () { renderSettings(); openSheet("settings"); });
  $("langSeg").addEventListener("click", function (e) {
    var b = e.target.closest("[data-l]"); if (!b) return;
    lang = b.dataset.l; store.set("ecoai-lang", lang);
    applyTexts(); renderAll(); renderSettings();
  });
  $("themeSeg").addEventListener("click", function (e) {
    var b = e.target.closest("[data-t]"); if (!b) return;
    var th = b.dataset.t;
    if (th === "auto") { store.del("ecoai-theme"); document.documentElement.removeAttribute("data-theme"); }
    else { store.set("ecoai-theme", th); document.documentElement.setAttribute("data-theme", th); }
    renderSettings();
  });
  $("nudgeSw").addEventListener("change", function () { S.nudges = this.checked; save(); renderComposer(); });
  $("resetBtn").addEventListener("click", function () {
    if (!confirm(t("resetConfirm"))) return;
    S = fresh(); save(); closeSheet("settings"); renderAll();
  });
  $("demoBtn").addEventListener("click", function () { loadDemo(); closeSheet("settings"); showTab("footprint"); });

  function loadDemo() {
    var now = Date.now(), reqs = [];
    var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    for (var d = 59; d >= 0; d--) {
      var n = 1 + Math.floor(rnd() * 6);
      var progress = 1 - d / 60; // users get greener over time
      for (var i = 0; i < n; i++) {
        var x = rnd(), id;
        if (x < 0.22 - progress * 0.17) id = "opus";
        else if (x < 0.55 - progress * 0.3) id = rnd() < 0.5 ? "sonnet" : "gpt5";
        else if (x < 0.93) id = ["gpt5mini", "haiku", "flash"][Math.floor(rnd() * 3)];
        else id = "local";
        var len = 30 + Math.floor(rnd() * 500);
        var cache = id !== "local" && rnd() < 0.18;
        var e = estimate(BY_ID[id], new Array(len + 1).join("x"), cache);
        var just = BY_ID[id].tier !== "eco" && BY_ID[id].tier !== "local" && len > 400;
        reqs.push({ ts: now - d * DAY - Math.floor(rnd() * 10) * 36e5, model: id, kwh: e.kwh, cost: e.cost, cache: cache, len: len, just: just });
      }
    }
    // keep today's real requests, replace the rest
    reqs.sort(function (a, b) { return a.ts - b.ts; });
    S.requests = reqs.concat(S.requests.filter(function (r) { return r.ts > now - 60 * 1000; }));
    // finish with a green run so the streak screen has something to show
    for (var j = 0; j < 5; j++) { var e2 = estimate(BY_ID.gpt5mini, "", false); S.requests.push({ ts: now - (5 - j) * 6e4, model: "gpt5mini", kwh: e2.kwh, cost: e2.cost, cache: false, len: 80 }); }
    save();
    renderAll();
  }

  var flashTimer;
  function flash(msg) {
    var tEl = $("toast");
    clearTimeout(toastTimer);
    tEl.classList.remove("show", "hide", "amber", "deep"); void tEl.offsetWidth;
    $("ttlTxt").textContent = msg; $("badge").textContent = "✓";
    $("tmsg").textContent = ""; $("tsave").textContent = ""; $("tstreak").innerHTML = ""; $("tnote").hidden = true;
    $("ringPct").textContent = "🌿"; $("ringFg").style.strokeDashoffset = 0;
    tEl.classList.add("show");
    toastTimer = setTimeout(closeToast, 2500);
  }

  /* ------------------------------------------------------------------ *
   * Install & offline
   * ------------------------------------------------------------------ */
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferredPrompt = e; $("installBtn").hidden = false; });
  $("installBtn").addEventListener("click", function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () { deferredPrompt = null; $("installBtn").hidden = true; });
  });
  window.addEventListener("appinstalled", function () { $("installBtn").hidden = true; });
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  function renderAll() {
    renderChat(); renderComposer();
    if (curTab === "footprint") renderFootprint();
    if (curTab === "models") renderModels();
    if (curTab === "streak") renderStreak();
  }
  if (!S.messages.length) S.model = S.defaultModel;
  applyTexts();
  renderAll();
  var h = (location.hash || "").slice(1);
  if (["footprint", "models", "streak"].indexOf(h) >= 0) showTab(h);
})();
