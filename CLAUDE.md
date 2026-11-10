# CLAUDE.md – ai-awareness-wireframe

Statikus wireframe-oldalak (EcoAI / AI-tudatosság), build lépés nélkül,
GitHub Pages-en: `https://madcsaba.github.io/ai-awareness-wireframe/`.
Megnézéshez: `python3 -m http.server`, majd böngésző.

## Új oldal felvétele – ellenőrzőlista

1. **Kétnyelvű (HU/EN).** Párban készül: `nev.html` (EN) + `nev-hu.html` (HU).
   (Történeti kivétel: `index-en.html` ↔ `hu.html`; a `models.html` egy fájlban kétnyelvű.)
2. **`nav.js` → `MAP`:** mindkét fájlt fel kell venni:
   `"nev.html": ["nev.html", "nev-hu.html"]` és `"nev-hu.html": ["nev.html", "nev-hu.html"]`.
   `null` = nincs fordítás. Ha a menüben is látszania kell: `items` (fő menü) vagy `more` (Továbbiak).
3. **`index.html`:** link a főoldalról is.
4. **Fejléc:** `<script src="nav.js" defer></script>` a `<head>`-ben, plusz `<title>`,
   `description`, és `og:*` meta (`og:url` a teljes Pages-URL, `og:image` → `og.png`).
   Mintának a `petition.html` / `petition-hu.html` a legrövidebb.

## Stílus

- **Nincs külső betűtípus, CDN, tracking.** Rendszerfontok:
  `ui-sans-serif,system-ui,"Segoe UI",Helvetica,Arial`, címekhez `Georgia` serif.
  Az `app/` saját Inter fontot használ az `app/fonts/` mappából (helyben tárolva, OFL).
- Minden CSS/JS inline az oldalban; színek `:root` változókban
  (`--bg #f6f7f9`, `--ink #1a1d21`, `--line #e3e6ea`, `--acc #2563eb`, `--green #16a34a`).
- A `nav.js` fix 50 px-es sávot tesz fölülre, és `body{padding-top:50px}`-et ad – ne ütközz vele.
- Nyelvváltás: a `nav.js` állítja a `<html data-lang>` és `lang` attribútumot,
  és `ecoai:lang` eseményt küld; egyfájlos kétnyelvű oldal erre reagáljon.

## Kivételek – ne „javítsd” kérés nélkül

- `the-weight-of-a-click.html`, `powering-intelligence.html`: átvett oldalak,
  Google Fonts / Tailwind CDN-nel; csak angolul vannak.
- `one-pager/`, `social-graphic/`: dizájn-export (`*.dc.html` + vendor React), csak referencia.
- `app/`: külön PWA (`sw.js`). Ha a shell fájljai változnak, emeld a `CACHE` verziót (`ecoai-vN`).

## Commit

Rövid magyar commit üzenet. A HU és EN változat mindig egy commitban változik.
