# CLAUDE.md – ai-awareness-wireframe

Statikus HTML-oldalak (EcoAI / AI-tudatosság), **build lépés és csomagkezelő nélkül**,
GitHub Pages-en: `https://madcsaba.github.io/ai-awareness-wireframe/`.
Megnézéshez: `python3 -m http.server`, majd böngésző.

## Új oldal felvétele – ellenőrzőlista

1. **Kétnyelvű (HU/EN), egy fájlban.** Minta: `story.html`, `start.html`.
   A szövegek `<span class="hu">` / `<span class="en">` párokban; CSS:
   `html[data-lang="hu"] .en{display:none}` és fordítva. A `<head>`-ben a kis inline szkript
   a `localStorage["ecoai-lang"]` (vagy a böngésző nyelve) alapján már betöltéskor beállítja a
   `data-lang`-ot; a dinamikus tartalom az `ecoai:lang` eseményre rajzolódjon újra.
   (Régebbi oldalak párban vannak: `nev.html` + `nev-hu.html`, ill. `index-en.html` ↔ `hu.html`.)
2. **`nav.js` → `MAP`:** az oldal (párnál mindkét fájl) bekerül:
   egyfájlos oldalnál `"nev.html": ["nev.html", "nev.html"]`; párnál mindkét fájl `["nev.html", "nev-hu.html"]`.
   `null` = nincs fordítás. Ha a menüben is látszania kell: `items` (fő menü) vagy `more` (Továbbiak).
3. **`index.html`:** kártya a főoldalon (`<a class="card wide">`, HU/EN szöveggel).
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
- `powering-intelligence.html` a `nav.js` egy inline másolatát tartalmazza: ha a `MAP` vagy a menü változik, ott is frissítsd.
- `app/`: külön PWA (`sw.js`). Ha a shell fájljai változnak, emeld a `CACHE` verziót (`ecoai-vN`).

## Skill

- `.claude/skills/projekt-indito/` – új projekt indítása (indító kérdések, BRIEF.md, lépésterv, 5 sablon).
  A sablonok közérthető, kitölthető változata: `start.html`. Ha a sablonok változnak, a `start.html` is.

## Munkastílus

Magyarul, röviden. Ne olvass be fölösleges fájlt (a nagy, átvett oldalakat főleg ne);
meglévő szöveget fájlból illessz be, ne gépeld újra; ellenőrzés szöveges teszttel,
legfeljebb egy összesítő képernyőkép a végén.

## Commit

Rövid magyar commit üzenet. A HU és EN változat mindig egy commitban változik.
