# Naša drážka - ďakujeme za návrat

Statická webová stránka pripravená na GitHub Pages. Stránka poďakuje za stretnutie 7.6.2026, ukazuje orientačný ďalší termín 5.6.2027, zbiera záujem cez Google Formulár a má pripravenú galériu fotiek.

## Súbory

- `index.html` - obsah stránky
- `style.css` - retro responzívny vzhľad
- `script.js` - odpočítavanie, ručný prehľad záujmu a galéria
- `images/drazka-hero.png` - hlavný retro obrázok
- `images/gallery/` - sem sa ručne pridávajú fotky zo stretnutia
- `assets/favicon.svg` - ikona stránky

## Ďalší termín

Na stránke je uvedené:

`Ďalšie stretnutie možno 5.6.2027`

Dátum je orientačný. Odpočítavanie v `script.js` je nastavené na:

```js
const eventDate = new Date("2027-06-05T13:00:00+02:00");
```

## Google Formulár

Tlačidlá `Mám záujem o ďalšie stretnutie` a `Doplniť spomienku` otvárajú existujúci Google Formulár.

## Ručný zoznam záujmu

Sekcia `Kto má záujem o ďalšie stretnutie` sa upravuje ručne v súbore `script.js`.

Zoznam je tu:

```js
const MANUAL_ATTENDANCE = [
  { name: "Sebastián O.", status: "Prídem", people: 1, brings: "" }
];
```

Keď niekto napíše cez Messenger, doplní sa nový riadok napríklad takto:

```js
const MANUAL_ATTENDANCE = [
  { name: "Sebastián O.", status: "Prídem", people: 1, brings: "" },
  { name: "Miro M.", status: "Možno", people: 2, brings: "nealko" }
];
```

Verejne sa zobrazujú iba tieto údaje:

- meno alebo prezývka, napríklad `Sebastián O.`
- stav `Prídem`, `Možno` alebo `Neprídem`
- počet osôb
- čo človek donesie

Kontakty a súkromné údaje sa na stránke nezobrazujú.

## Ako pridávať fotky

Fotky nepridávajú návštevníci sami. Fotky pridáva admin ručne.

Postup:

1. Skopírujte fotku do priečinka `images/gallery/`.
2. Odporúčané názvy sú bez diakritiky a medzier, napríklad `spolocna-fotka-1.jpg`.
3. Otvorte `script.js`.
4. Nájdite zoznam:

```js
const GALLERY_PHOTOS = [
  // Príklad po doplnení fotky:
  // { file: "images/gallery/fotka-1.jpg", alt: "Spoločná fotka z drážky", caption: "Spoločná fotka z prvého stretnutia" }
];
```

5. Doplňte fotku napríklad takto:

```js
const GALLERY_PHOTOS = [
  { file: "images/gallery/spolocna-fotka-1.jpg", alt: "Spoločná fotka z drážky", caption: "Spoločná fotka z prvého stretnutia" }
];
```

6. Ak je fotiek viac, oddeľte ich čiarkou:

```js
const GALLERY_PHOTOS = [
  { file: "images/gallery/spolocna-fotka-1.jpg", alt: "Spoločná fotka z drážky", caption: "Spoločná fotka" },
  { file: "images/gallery/moskvic.jpg", alt: "Modrý Moskvič na dvore", caption: "Modrý Moskvič" }
];
```

## Spustenie

Otvorte `index.html` v prehliadači. Stránka je statická a nevyžaduje žiadne platené služby ani API.
