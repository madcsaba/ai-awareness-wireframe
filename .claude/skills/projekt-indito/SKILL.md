---
name: projekt-indito
description: Új projekt energiatakarékos elindítása hozzá nem értőknek – egy körben felteszi az indító kérdéseket (ajánlott alapértékkel), megírja a rövid BRIEF.md projektlapot, és lépésenkénti tervet ad (melyik lépéshez elég kisebb modell, mikor kezdj új beszélgetést). Használd mindig, amikor valaki új dolgot kezd el építeni vagy íratni, akkor is, ha nem mondja ki, hogy „projekt”: „csinálj egy appot”, „kéne egy weboldal”, „tervezd át az oldalunkat”, „írj kampányszöveget”, „készíts grafikonokat ezekből az adatokból”, „build me an app”, „I need a website / landing page / prototype”. Ne használd meglévő projekt apró javításaihoz vagy egyetlen kérdés megválaszolásához.
---

# Projektindító

Cél: a felhasználó (gyakran nem fejlesztő) **kevesebb körrel, kevesebb energiával/tokennel** jusson el
egy működő első változatig. A legdrágább hibák az elején születnek: tisztázatlan cél, hiányzó hozzáférés,
egy hosszú beszélgetésben összemosott témák, és minden lépés a legnagyobb modellel. Ez a skill ezeket előzi meg.

## 1. Sablon kiválasztása

Döntsd el a kérésből, melyik sablon illik, és **csak azt** olvasd be a `sablonok/` mappából
(a többit ne – fölösleges token):

| Kérés jellege | Sablon |
|---|---|
| Van kész szöveg/anyag, ebből legyen weboldal | `sablonok/1-weboldal-szovegbol.md` |
| App, eszköz, kattintható prototípus vázlatból vagy ötletből | `sablonok/2-webapp-prototipus.md` |
| Meglévő oldal/app új külseje, átszervezése | `sablonok/3-oldal-attervezes.md` |
| Kampányszöveg, levél, dokumentum, poszt | `sablonok/4-kampanyszoveg-dokumentum.md` |
| Táblázat, adatok összesítése, grafikonok | `sablonok/5-adatok-grafikonok.md` |

Ha két sablon is illik, a fő kimenet dönt (pl. „weboldal grafikonokkal” → 1-es, a grafikon csak egy lépés).
Ha egyik sem, a 2-est használd kiindulásnak.

## 2. Indító kérdések – egyetlen körben

Egy üzenetben kérdezz rá mind a 8 pontra, **mindegyiknél ajánlott alapértékkel**, hogy a felhasználó
elég legyen annyit írnia: „az ajánlottat”, vagy csak az eltérést. A sablon tartalmazza a témára szabott
alapértékeket. A pontok:

1. **Cél és közönség** – mit érjen el, kinek szól?
2. **Kimenet formája** – milyen fájl/oldal/app, hol nézik (mobil, asztali, nyomtatás)?
3. **Mi van már meg** – szöveg, kép, logó, adat, vázlat, meglévő oldal? (Hivatkozz rájuk, ne kérd újragépelni.)
4. **Hol él, van-e hozzáférés** – repó, tárhely, fiók; tud-e az AI oda írni? (Ezt az elején rendezd: a hiányzó jog kerülőutakat és sok fölösleges kört okoz.)
5. **Mi kell az első változatba** – a legkisebb hasznos változat; a többi később.
6. **Kötöttségek** – nyelv(ek), adatvédelem (személyes adat?), szerver/build nélkül, költség, akadálymentesség.
7. **Mikor kész, hogyan ellenőrizzük** – 3–5 mérhető pont; szöveges teszt az alap, képernyőkép csak a végén egyszer.
8. **Kommunikációs stílus** – alapértelmezés: magyarul, röviden, részletek csak kérésre; döntésnél egy körben kérdez, ajánlott opcióval.

Tömören írd: számozott lista, pontonként egy sor kérdés + „Ajánlott: …”. A végén egy mondat:
„Írd, hogy *az ajánlottat*, vagy csak azt, amiben eltérsz.” Ha a kérésből valamelyik pont már egyértelmű,
írd be válaszként, ne kérdezd újra.

Ha a felhasználó már előre megadta a válaszokat (vagy azt írja, „döntsd el te”), ne kérdezz – menj tovább
az ajánlott értékekkel, és a BRIEF-ben jelöld, mi feltételezés.

## 3. BRIEF.md megírása

A válaszok után írd meg a projekt gyökerébe a `BRIEF.md`-t (ha nincs fájlrendszer, a válaszban add meg).
Legfeljebb ~40 sor – ez a projekt „emlékezete”: a későbbi, új beszélgetések ezt olvassák be a teljes
előzmény helyett, ezért legyen rövid és önálló.

```markdown
# <Projekt neve>
**Sablon:** <szám – név> · **Dátum:** <ÉÉÉÉ-HH-NN>

## Cél és közönség
## Kimenet
## Ami megvan (hivatkozások, nem másolat)
## Hol él / hozzáférés
## Első változat tartalma
## Kötöttségek
## Kész, ha… (ellenőrzőlista)
- [ ] …
## Stílus
## Lépésterv és felállás
| # | Lépés | Modell | Beszélgetés |
|---|---|---|---|
## Nyitott kérdések / feltételezések
```

## 4. Lépésterv és felállás

Javasolj lépésenkénti felállást a sablon alapján, mindig ebben a sorrendben:
**vázlat → első változat → ellenőrzés → közzététel**. Minden lépéshez add meg:

- **Modell:** *nagy* csak ott, ahol valódi döntés vagy tervezés van (vázlat, struktúra, nehéz hiba);
  *kicsi/gyors* a gépies munkához (szöveg beillesztése, formázás, fordítás, ellenőrző teszt, apró javítás).
  A modellneveket ne találd ki – „nagy / közepes / kicsi” elég, ha nem tudod, mi érhető el.
- **Beszélgetés:** mikor kezdjen **újat**. Szabály: új témánál, egy lezárt szakasz után, vagy ha a
  beszélgetés már hosszú (sok kör, nagy fájlok) – az új beszélgetés első üzenete: „Olvasd be a BRIEF.md-t,
  és folytasd a(z) N. lépéssel.” Ez a legnagyobb megtakarítás: a hosszú előzményt minden körben újraolvasná.

A terv végén egy sorban emlékeztesd a felhasználót az 5 szokásra: új téma → új beszélgetés; kis feladat →
kis modell; egyben kérdezz; rövid választ kérj; ne gépeltesd újra, ami megvan.

## Munkastílus közben

- Ne olvass be fölösleges fájlt; a meglévő szöveget fájlból illeszd be, ne gépeld újra.
- Ellenőrzéshez szöveges teszt (grep, HTML-ellenőrzés, link-ellenőrzés); legfeljebb egy összesítő kép a végén.
- Rövid válaszok; a részletek kérésre.
