/* EcoAI – globális navigáció + nyelvválasztó (HU/EN)
 * Minden oldalra beágyazva; a láncolt oldalakról vissza a főoldalra.
 * BASE: a nav.js helye → aloldalakról (social-graphic/, one-pager/) is működik.
 */
(function () {
  var BASE = new URL(".", (document.currentScript && document.currentScript.src) || location.href);
  var path = decodeURIComponent(location.pathname);
  var seg = path.split("/").filter(Boolean);
  var key = "index.html";
  if (/\/social-graphic\//.test(path)) key = "social-graphic";
  else if (/\/one-pager\//.test(path)) key = "one-pager";
  else if (seg.length && !/\/$/.test(path)) key = seg[seg.length - 1];

  /* [EN változat, HU változat] — null = nincs fordítás (még) */
  var MAP = {
    "index.html": ["index.html", "index.html"],
    "index-en.html": ["index-en.html", "hu.html"],
    "hu.html": ["index-en.html", "hu.html"],
    "mobile-app.html": ["mobile-app.html", "mobile-app-hu.html"],
    "mobile-app-hu.html": ["mobile-app.html", "mobile-app-hu.html"],
    "models.html": ["models.html", "models.html"],
    "story.html": ["story.html", "story.html"],
    "start.html": ["start.html", "start.html"],
    "eco-feedback.html": ["eco-feedback.html", "eco-feedback-hu.html"],
    "eco-feedback-hu.html": ["eco-feedback.html", "eco-feedback-hu.html"],
    "petition.html": ["petition.html", "petition-hu.html"],
    "petition-hu.html": ["petition.html", "petition-hu.html"],
    "the-weight-of-a-click.html": ["the-weight-of-a-click.html", null],
    "powering-intelligence.html": ["powering-intelligence.html", null],
    "social-graphic": ["social-graphic", null],
    "one-pager": ["one-pager", null]
  };
  var M = MAP[key] || [key, null];

  var lang;
  try { lang = localStorage.getItem("ecoai-lang"); } catch (e) {}
  if (lang !== "hu" && lang !== "en")
    lang = (navigator.language || "").toLowerCase().indexOf("hu") === 0 ? "hu" : "en";

  function u(f) { return new URL(f, BASE).href; }

  function setLang(l) {
    try { localStorage.setItem("ecoai-lang", l); } catch (e) {}
    document.documentElement.setAttribute("data-lang", l);
    document.documentElement.lang = l;
    var target = l === "hu" ? M[1] : M[0];
    if (target && target !== key) { location.href = u(target); return; }
    render(l);
    try { window.dispatchEvent(new CustomEvent("ecoai:lang", { detail: l })); } catch (e) {}
  }

  function render(l) {
    var other = l === "hu" ? "en" : "hu";
    var noHu = !M[1];
    var items = [
      ["home", l === "hu" ? "Főoldal" : "Home", "index.html"],
      ["desktop", "🖥️ " + (l === "hu" ? "Asztali" : "Desktop"), l === "hu" ? "hu.html" : "index-en.html"],
      ["mobile", "📱 " + (l === "hu" ? "Mobil app" : "Mobile app"), l === "hu" ? "mobile-app-hu.html" : "mobile-app.html"],
      ["eco", "✨ " + (l === "hu" ? "Eco-feedback" : "Eco-feedback"), l === "hu" ? "eco-feedback-hu.html" : "eco-feedback.html"],
      ["models", "🧠 " + (l === "hu" ? "Modellek" : "Models"), "models.html"],
      ["petition", "✍️ " + (l === "hu" ? "Petíció" : "Petition"), l === "hu" ? "petition-hu.html" : "petition.html"]
    ];
    var more = [
      ["🚀 " + (l === "hu" ? "Hogyan kezdj bele" : "How to get started"), "start.html", "HU/EN"],
      ["📖 " + (l === "hu" ? "A projekt története" : "The story"), "story.html", "HU/EN"],
      ["🖱️ The Weight of a Click", "the-weight-of-a-click.html"],
      ["⚡ Powering Intelligence", "powering-intelligence.html"],
      ["📊 Social Graphic", "social-graphic/Social.dc.html"],
      ["📄 One-Pager", "one-pager/Main.dc.html"]
    ];
    var cur = M[l === "hu" ? 1 : 0] || key;

    var html =
      '<a class="eh" href="' + u("index.html") + '"><span class="elogo">🌿</span> EcoAI</a>' +
      '<nav class="enav">' +
      items.map(function (it) {
        var active = it[2] === cur || (it[0] === "home" && key === "index.html");
        return '<a class="' + (active ? "on" : "") + '" href="' + u(it[2]) + '">' + it[1] + "</a>";
      }).join("") + "</nav>" +
      '<span class="emore"><button type="button" class="ecaret">' +
      (l === "hu" ? "Továbbiak ▾" : "More ▾") + '</button><span class="edrop">' +
      more.map(function (m) {
        return '<a href="' + u(m[1]) + '">' + m[0] + ' <i>' + (m[2] || "EN") + '</i></a>';
      }).join("") + "</span></span>" +
      '<span class="elang"><button type="button" data-l="hu" class="' + (l === "hu" ? "on" : "") + '">HU</button>' +
      '<button type="button" data-l="en" class="' + (l === "en" ? "on" : "") + '"' +
      (noHu && l === "en" ? ' title="Ez az oldal még csak angolul elérhető"' : "") + ">EN</button></span>";

    var bar = document.getElementById("ecoai-nav");
    bar.innerHTML = html;
    bar.querySelectorAll(".elang button").forEach(function (b) {
      b.onclick = function () { setLang(b.dataset.l); };
    });
    var caret = bar.querySelector(".ecaret");
    if (caret) caret.onclick = function () { bar.querySelector(".emore").classList.toggle("open"); };
  }

  function init() {
    if (document.getElementById("ecoai-nav")) return;
    var st = document.createElement("style");
    st.textContent =
      "#ecoai-nav{position:fixed;top:0;left:0;right:0;height:50px;z-index:9999;display:flex;" +
      "align-items:center;gap:14px;padding:0 14px;background:rgba(255,255,255,.94);" +
      "backdrop-filter:blur(8px);border-bottom:1px solid #e3e6ea;font:14px/1 ui-sans-serif,system-ui,'Segoe UI',Helvetica,Arial;" +
      "box-shadow:0 1px 8px rgba(15,23,42,.06)}" +
      "#ecoai-nav a{color:#334155;text-decoration:none;white-space:nowrap}" +
      "#ecoai-nav .eh{font-weight:800;color:#1a1d21;display:flex;align-items:center;gap:6px;font-size:15px}" +
      "#ecoai-nav .elogo{width:24px;height:24px;border-radius:7px;background:#16a34a;display:inline-flex;" +
      "align-items:center;justify-content:center;font-size:13px;color:#fff}" +
      "#ecoai-nav .enav{display:flex;align-items:center;gap:4px;overflow-x:auto;flex:1;scrollbar-width:none}" +
      "#ecoai-nav .enav::-webkit-scrollbar{display:none}" +
      "#ecoai-nav .enav a{padding:7px 10px;border-radius:9px;font-size:13.5px}" +
      "#ecoai-nav .enav a:hover{background:#f1f4f8}" +
      "#ecoai-nav .enav a.on{background:#eef4ff;color:#2563eb;font-weight:700}" +
      "#ecoai-nav .emore{position:relative;flex:0 0 auto}" +
      "#ecoai-nav .ecaret{border:1px solid #e3e6ea;background:#fff;border-radius:9px;padding:7px 10px;" +
      "font:inherit;font-size:13.5px;color:#334155;cursor:pointer;white-space:nowrap}" +
      "#ecoai-nav .edrop{display:none;position:absolute;top:calc(100% + 8px);right:0;background:#fff;" +
      "border:1px solid #e3e6ea;border-radius:12px;box-shadow:0 12px 30px rgba(15,23,42,.16);padding:6px;min-width:230px}" +
      "#ecoai-nav .emore.open .edrop{display:block}" +
      "#ecoai-nav .edrop a{display:block;padding:9px 11px;border-radius:8px;font-size:13.5px}" +
      "#ecoai-nav .edrop a:hover{background:#f1f4f8}" +
      "#ecoai-nav .edrop i{font-style:normal;font-size:10px;background:#eef1f5;color:#6b7280;" +
      "border-radius:5px;padding:1px 5px;margin-left:5px}" +
      "#ecoai-nav .elang{display:flex;background:#eef1f5;border-radius:10px;padding:3px;flex:0 0 auto}" +
      "#ecoai-nav .elang button{border:0;background:transparent;font:inherit;font-size:12.5px;font-weight:700;" +
      "color:#6b7280;padding:5px 9px;border-radius:8px;cursor:pointer}" +
      "#ecoai-nav .elang button.on{background:#fff;color:#1a1d21;box-shadow:0 1px 2px rgba(0,0,0,.12)}" +
      "body{padding-top:50px !important}";
    document.head.appendChild(st);

    var bar = document.createElement("div");
    bar.id = "ecoai-nav";
    bar.setAttribute("role", "navigation");
    document.body.appendChild(bar);
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang;
    render(lang);

    document.addEventListener("click", function (e) {
      var m = document.querySelector("#ecoai-nav .emore");
      if (m && !e.target.closest(".emore")) m.classList.remove("open");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.ECOAI = { setLang: setLang, getLang: function () { return lang; }, base: BASE };
})();
