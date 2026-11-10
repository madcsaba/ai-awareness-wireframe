# 5 · Adatok összesítése, grafikonok

Amikor táblázatból (Excel, CSV, export) kell összesítés, néhány grafikon vagy egy rövid jelentés.

## Indító kérdések – ajánlott alapértékkel
1. **Cél és közönség:** milyen kérdésre ad választ? — *Ajánlott: 1–3 konkrét kérdés (pl. „melyik hónapban nőtt a legtöbbet?”).*
2. **Kimenet:** — *Ajánlott: 1 statikus HTML-jelentés 2–4 grafikonnal + a számolt összesítő táblázat CSV-ben.*
3. **Ami megvan:** a fájl(ok), oszlopok jelentése. — *Ajánlott: a fájlt add meg; az AI szkripttel olvassa, nem másolja be a beszélgetésbe.*
4. **Hol él / hozzáférés:** — *Ajánlott: a fájl a projekt mappájában; ha online forrás, előbb a hozzáférés.*
5. **Első változat:** — *Ajánlott: a legfontosabb kérdés 1 grafikonja + összesítő tábla.*
6. **Kötöttségek:** — *Ajánlott: személyes adat nem kerül a jelentésbe (összesítve vagy anonimizálva); nincs CDN – a grafikon inline SVG.*
7. **Kész, ha:** — *Ajánlott: a számok egyeznek egy független ellenőrző számolással + lenti lista.*
8. **Stílus:** — *Ajánlott: magyarul, röviden; minden grafikon alatt egy mondatos tanulság.*

## Ajánlott felállás
| # | Lépés | Modell | Beszélgetés |
|---|---|---|---|
| 1 | Felmérés: oszlopok, hiányos sorok, kérdések pontosítása | közepes | 1. beszélgetés + BRIEF.md |
| 2 | Összesítő szkript (számolás kódból, nem fejből) | közepes | ugyanaz |
| 3 | Grafikonok + jelentés | kicsi | új beszélgetés |
| 4 | Ellenőrzés: összegek, minták, egy összesítő kép | kicsi | ugyanaz |

## Lépésterv
- **Vázlat:** melyik kérdéshez melyik grafikon (vonal: időbeli változás; oszlop: összehasonlítás).
- **Első változat:** szkript számol → CSV; a jelentés ebből készül, a számok nem kézzel kerülnek bele.
- **Ellenőrzés:** sorszám, végösszeg, 2–3 szúrópróba a nyers adatból, szövegesen kiírva.
- **Közzététel:** HTML-jelentés + CSV + a szkript (újrafuttatható).

## Kész, ha…
- [ ] Minden kérdésre van grafikon és egy mondatos válasz.
- [ ] A végösszegek egyeznek a nyers adatból számolttal.
- [ ] Tengelyek, mértékegységek, forrás feltüntetve.
- [ ] Nincs személyes adat a kimenetben.
- [ ] A számolás szkriptből újrafuttatható.
