# 2 · Webapp / prototípus vázlatból

Amikor egy ötletből vagy rajzolt/leírt vázlatból kattintható app vagy kis eszköz kell.

## Indító kérdések – ajánlott alapértékkel
1. **Cél és közönség:** milyen problémát old meg, kinek? — *Ajánlott: egy fő feladat, egy fő felhasználói kör.*
2. **Kimenet:** — *Ajánlott: kattintható prototípus egyetlen HTML-fájlban (adatok a böngészőben), mobilra optimalizálva; telepíthető PWA csak később.* Ha többen ugyanazt az adatot látják (közös lista, ranglista), jelezd: a böngészős tárolás ehhez nem elég – kell egy kis közös adattár (pl. megosztott táblázat); ezt a 4. pontban kérdezd.
3. **Ami megvan:** vázlat, képernyőfotó, hasonló app, lista a funkciókról. — *Ajánlott: fotó vagy rövid felsorolás elég.*
4. **Hol él / hozzáférés:** — *Ajánlott: GitHub-repó + Pages; írási jog az elején.*
5. **Első változat:** — *Ajánlott: a fő útvonal 3–5 képernyője, kitalált mintaadattal; bejelentkezés, fizetés, szerver nem.*
6. **Kötöttségek:** — *Ajánlott: nincs személyes adat a prototípusban; nincs szerver, nincs build; nyelv: magyar.*
7. **Kész, ha:** — *Ajánlott: lásd a lenti listát; ellenőrzés szöveges teszttel (gombok, átmenetek).*
8. **Stílus:** — *Ajánlott: magyarul, röviden, egy körben kérdez.*

## Ajánlott felállás
| # | Lépés | Modell | Beszélgetés |
|---|---|---|---|
| 1 | Vázlat: képernyőlista, fő útvonal, adatszerkezet | nagy | 1. beszélgetés + BRIEF.md |
| 2 | Első változat: képernyők, navigáció, mintaadat | közepes | új beszélgetés |
| 3 | Ellenőrzés: kattintási útvonal szöveges teszttel (pl. Playwright) | kicsi | ugyanaz vagy új |
| 4 | Javítások, közzététel, egy összesítő kép | kicsi | ugyanaz |

Ha egy hiba két próbálkozás után sem javul, arra az egy hibára válts nagy modellre, egy új, rövid beszélgetésben.

## Lépésterv
- **Vázlat:** képernyők listája + mi történik egy-egy gombnyomásra; ezt hagyja jóvá a felhasználó, mielőtt kód készül.
- **Első változat:** egy fájl, inline CSS/JS, mintaadat; minden képernyő elérhető.
- **Ellenőrzés:** szkript végigkattintja a fő útvonalat, és szövegesen jelenti, mi jelent meg; konzolhiba nincs.
- **Közzététel:** élő URL; egy összesítő kép a végén.

## Kész, ha…
- [ ] A fő útvonal elejétől végéig végigkattintható.
- [ ] Mobilon (375 px) használható, nincs kilógó elem.
- [ ] Nincs konzolhiba, nincs külső függőség, amit nem kértünk.
- [ ] A mintaadat egyértelműen kitalált (nincs valódi személyes adat).
- [ ] Élő URL-en kipróbálható; a BRIEF.md „következő lépések” része frissítve.
