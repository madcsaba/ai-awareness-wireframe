# 3 · Meglévő oldal áttervezése

Amikor van egy működő oldal vagy app, és új külső, jobb szerkezet vagy könnyebb használat kell – a tartalom nagyrészt marad.

## Indító kérdések – ajánlott alapértékkel
1. **Cél és közönség:** mi zavar most, mi legyen jobb? — *Ajánlott: 3 konkrét probléma (pl. „mobilon olvashatatlan”, „nem találják a jelentkezést”).*
2. **Kimenet:** — *Ajánlott: ugyanaz a technika, mint most; csak a kinézet és a szerkezet változik.*
3. **Ami megvan:** az oldal URL-je / repója, arculat, minták, amik tetszenek. — *Ajánlott: URL + 1–2 tetsző példa.*
4. **Hol él / hozzáférés:** — *Ajánlott: új ágon dolgozunk, a régi változat érintetlen marad; írási jog az elején.*
5. **Első változat:** — *Ajánlott: a főoldal + egy jellemző aloldal; ha jóváhagyod, a többire ugyanaz a minta.*
6. **Kötöttségek:** — *Ajánlott: a szöveg és az URL-ek nem változnak; akadálymentes kontraszt; nincs új külső függőség.*
7. **Kész, ha:** — *Ajánlott: a 3 probléma megoldva + lenti lista.*
8. **Stílus:** — *Ajánlott: magyarul, röviden, egy körben kérdez.*

## Ajánlott felállás
| # | Lépés | Modell | Beszélgetés |
|---|---|---|---|
| 1 | Felmérés: csak a szükséges fájlok, a 3 probléma helye | közepes | 1. beszélgetés + BRIEF.md |
| 2 | Vázlat: új szerkezet + színek/típusok (stílusváltozók) | nagy | ugyanaz |
| 3 | Első változat: 2 oldal átalakítva | közepes | új beszélgetés |
| 4 | Kiterjesztés a többi oldalra (gépies) | kicsi | új beszélgetés |
| 5 | Ellenőrzés + közzététel, egy összesítő kép | kicsi | ugyanaz |

## Lépésterv
- **Vázlat:** stílusváltozók és szerkezet egy helyen; a tartalomhoz nem nyúl.
- **Első változat:** 2 oldal; előtte–utána összevetés szövegesen (mi változott).
- **Ellenőrzés:** minden régi URL működik, a szöveg nem változott (diff), kontraszt és mobilnézet rendben.
- **Közzététel:** új ágról pull request / előnézet, jóváhagyás után élesítés.

## Kész, ha…
- [ ] A 3 megnevezett probléma megoldva.
- [ ] A tartalom és az URL-ek változatlanok (diff igazolja).
- [ ] Mobilon és asztalin is rendben; kontraszt megfelelő.
- [ ] Minden oldal ugyanazt a stílusmintát használja.
- [ ] A régi változat visszaállítható (külön ág / commit).
