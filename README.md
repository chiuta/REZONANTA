# REZONANȚA

**Cum faci ca lumea să te asculte — ghid și instrumente pentru comunicare și media.**

O aplicație dintr-un singur fișier HTML, în limba română. Funcționează offline, fără cont, fără urmărire și fără nicio cerere de rețea (politica de securitate din pagină blochează orice conexiune externă).

## Ce conține

| Secțiune | Ce face |
|---|---|
| **Principii** | 12 reguli pentru ca mesajul să fie ascultat, fiecare cu un test practic |
| **Mesaj** | „Casa mesajului”: generează o prezentare de 30 de secunde, o postare, o variantă scurtă și una vorbită |
| **Canale** | Recomandă canale media după obiectiv și public, cu forțe, slăbiciuni și greșeli frecvente (scoruri orientative) |
| **Comunicat** | Generator de comunicat de presă în piramidă inversată, plus listă de verificare |
| **Interviu** | Fișă de interviu cu mesaje cheie, întrebări incomode și formula R-P-M-D |
| **Claritate** | Analizor de text: propoziții lungi, expresii greoaie, posibile pasive, scor euristic |
| **Plan** | Plan de comunicare editabil, cu export în text sau CSV |
| **Criză** | Pașii primei ore și șablon de declarație |

## Utilizare

- Deschide `index.html` în orice browser modern (telefon, tabletă sau calculator), sau folosește versiunea publicată prin GitHub Pages.
- Interfața se adaptează la trei formate: bară de secțiuni derulabilă pe telefon și tabletă, meniu lateral pe desktop.
- Tema deschisă sau întunecată urmează setarea sistemului.
- Butonul „Încarcă un exemplu” din Mesaj, Comunicat și Interviu umple câmpurile cu un caz fictiv.

## Date și confidențialitate

- Tot ce scrii rămâne în `localStorage`, în browserul tău. Nimic nu pleacă pe vreun server.
- „Exportă datele” salvează un fișier `.json`, iar „Importă datele” îl încarcă pe alt dispozitiv. Importul validează și curăță conținutul.
- „Șterge toate datele” golește complet spațiul local.
- Exportul CSV neutralizează formulele (`=`, `+`, `-`, `@`), ca să nu se execute în Excel.

## Limite cunoscute

- Analizorul de claritate este o euristică: scorul și detectarea pasivelor sunt orientative, iar lista de expresii greoaie este scurtă (se poate completa în `JARGON`, în cod).
- Scorurile din „Canale” reflectă practica obișnuită, nu măsurători.
- Textele generate sunt puncte de plecare. Verifică faptele, cifrele și numele înainte de a trimite ceva public.
- Datele se salvează pe fiecare dispozitiv și browser în parte; folosește exportul pentru a le muta.

## Tehnic

HTML, CSS și JavaScript simplu, fără dependențe, fonturi sau resurse externe. Accesibilitate: tab-uri cu navigare de la tastatură, etichete asociate câmpurilor, contrast peste 5:1 în ambele teme, ținte tactile de cel puțin 44 px pe ecrane tactile.
