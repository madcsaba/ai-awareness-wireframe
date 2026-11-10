# 🌿 EcoAI – AI tudatossági UI / AI awareness UI

**Élő oldal / Live site:** https://madcsaba.github.io/ai-awareness-wireframe/

Hogyan lehet új felülettel és UX-szel növelni a felhasználói tudatosságot a nagy AI modellek
használatával kapcsolatban: modellválasztás, energia-költség visszajelzés, szelíd terelés, mobil app és kampány.

*How new interface and UX design can raise user awareness about using large AI models:
model choice, energy-cost feedback, nudging, a mobile app and a campaign.*

## Tartalom / Contents

| Oldal / Page | Mi ez / What it is | Nyelv |
|---|---|---|
| [`index.html`](https://madcsaba.github.io/ai-awareness-wireframe/) | Főoldal, kártyákkal / Home with cards | HU/EN |
| [`beyond-the-chatbox.html`](https://madcsaba.github.io/ai-awareness-wireframe/beyond-the-chatbox.html) | **Túl a chatablakon** – kiáltvány: hatékonysági mátrix + 3 UX-elv vázlatokkal / manifesto: efficiency matrix + 3 UX principles | HU/EN |
| [`models.html`](https://madcsaba.github.io/ai-awareness-wireframe/models.html) | Melyik feladathoz melyik modell elég / Which model fits which task | HU/EN |
| `hu.html`, `index-en.html` | Asztali wireframe: modellválasztó, energia-visszajelzés / Desktop wireframe | HU, EN |
| `mobile-app-hu.html`, `mobile-app.html` | Mobil app wireframe / Mobile app wireframe | HU, EN |
| `eco-feedback-hu.html`, `eco-feedback.html` | Eco-feedback animáció, élő demó / Eco-feedback animation, live demo | HU, EN |
| [`app/`](https://madcsaba.github.io/ai-awareness-wireframe/app/) | **EcoAI app** – telepíthető, offline PWA (szimulált válaszok, minden adat a készüléken) / installable offline PWA | HU/EN |
| `start.html` | Hogyan kezdj bele – 5 kitölthető indító sablon / 5 starter templates | HU/EN |
| `story.html` | A projekt története – és mennyi energiába került / The story | HU/EN |
| `petition-hu.html`, `petition.html` | Petíció a szabványos AI energiacímkéért / Petition for an AI energy label | HU, EN |
| `the-weight-of-a-click.html`, `powering-intelligence.html` | Kampányoldalak (átvett) / Campaign pages | EN |
| `social-graphic/`, `one-pager/` | Dizájn-export, referencia / Design exports | EN |

Az energia- és megtakarítási számok szemléltető becslések. / *Energy and savings figures are illustrative estimates.*

## Futtatás / Run locally

Nincs build lépés és csomagkezelő – statikus HTML. / *No build step, no package manager – plain static HTML.*

```bash
python3 -m http.server
```

Majd / then: http://localhost:8000

## Felépítés / Structure

- **Kétnyelvűség:** az újabb oldalak egy fájlban HU/EN (`<span class="hu">` / `<span class="en">`); a régebbiek párban (`nev.html` + `nev-hu.html`).
- **`nav.js`:** közös felső sáv és nyelvváltó; a `MAP` rendeli össze a nyelvi párokat.
- **Stílus:** minden CSS/JS inline, rendszerfontok, nincs CDN és nincs követés (kivéve a két átvett kampányoldalt).
- **`app/`:** külön PWA saját service workerrel (`sw.js`) és helyben tárolt Inter fonttal.
- **`.claude/skills/projekt-indito/`:** Claude Code skill új projektek energiatakarékos indításához.

Fejlesztési szabályok: [`CLAUDE.md`](CLAUDE.md). Közzététel: GitHub Pages a `main` ágról.

*Contributing rules are in `CLAUDE.md`; the site is published by GitHub Pages from `main`.*
