# 1 · Weboldal meglévő szövegből

Amikor van kész szöveg (Word, PDF, e-mail, régi oldal), és ebből kell egy egyszerű, szép weboldal.

## Indító kérdések – ajánlott alapértékkel
1. **Cél és közönség:** mit tegyen az olvasó a végén? — *Ajánlott: értse meg a lényeget, és egy gombbal lépjen kapcsolatba / jelentkezzen.*
2. **Kimenet:** — *Ajánlott: egyetlen statikus HTML-oldal, mobilra is, külső betűtípus és CDN nélkül.*
3. **Ami megvan:** szöveg fájlként, képek, logó, színek. — *Ajánlott: a szöveget fájlként add meg; az AI változtatás nélkül illeszti be, nem gépeli újra.*
4. **Hol él / hozzáférés:** — *Ajánlott: GitHub-repó + GitHub Pages; előbb add meg az írási jogot.*
5. **Első változat:** — *Ajánlott: egy oldal, címsor + 3–5 szakasz + kapcsolat; menü, blog, űrlap később.*
6. **Kötöttségek:** — *Ajánlott: magyar (+ angol, ha kell); nincs követőkód, nincs süti; nincs szerver.*
7. **Kész, ha:** — *Ajánlott: lásd a lenti listát.*
8. **Stílus:** — *Ajánlott: magyarul, röviden, egy körben kérdez.*

## Ajánlott felállás
| # | Lépés | Modell | Beszélgetés |
|---|---|---|---|
| 1 | Vázlat: szakaszok, sorrend, címek (a szövegből) | nagy | 1. beszélgetés + BRIEF.md |
| 2 | Első változat: sablon + szöveg beillesztése fájlból | kicsi | új beszélgetés (BRIEF.md-ből) |
| 3 | Ellenőrzés: linkek, mobilnézet szöveges teszttel | kicsi | ugyanaz |
| 4 | Közzététel (Pages), egy összesítő kép | kicsi | ugyanaz |

## Lépésterv
- **Vázlat:** szakaszlista a meglévő szöveg címsoraiból; csak döntések, nem újraírás.
- **Első változat:** egy HTML-sablon; a szöveg beillesztése fájlból (pl. szkripttel), nem gépelve.
- **Ellenőrzés:** HTML érvényes, minden link él, nincs vízszintes görgetés 375 px-en, a szöveg szó szerint egyezik a forrással.
- **Közzététel:** feltöltés, élő URL ellenőrzése, egyetlen képernyőkép a végén.

## Kész, ha…
- [ ] A forrásszöveg teljes, változatlan (vagy a jóváhagyott rövidítés szerint).
- [ ] Mobilon és asztalin is olvasható, nincs vízszintes görgetés.
- [ ] Van cím, leírás és megosztási kép (og:*).
- [ ] Minden link működik; nincs külső betűtípus/CDN/követőkód.
- [ ] Élő URL-en elérhető.
