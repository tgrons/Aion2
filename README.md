# Aion 2 – Poradniki

Statyczna strona z poradnikami do **Aion 2** (edycja Steam), po polsku. Nie ma etapu budowania: GitHub Pages serwuje pliki tak, jak leżą w repozytorium.

Publikacja: **Deploy from a branch**, gałąź `main`, katalog `/ (root)`.
Adres: <https://tgrons.github.io/Aion2/>

Dopóki tablica w `poradniki.json` jest pusta, strona główna pokazuje stan „Poradniki wkrótce”.

## Struktura

```
.
├── index.html              strona główna: wstęp i spis
├── poradniki.json          jedyna lista poradników
├── js/lista.js             wczytuje JSON i rysuje spis
├── css/style.css           wspólny wygląd
├── favicon.svg             ikona karty przeglądarki
├── .nojekyll               wyłącza Jekylla na Pages
└── poradniki/
    └── _szablon.html       wzorzec nowej strony — nie dodawaj go do spisu
```

Spis na stronie głównej powstaje wyłącznie z `poradniki.json`. Treść poradnika jest zwykłym plikiem HTML w katalogu `poradniki/` i nie generuje się z JSON-a.

Plik `.nojekyll` musi zostać. Bez niego Pages uruchamia Jekylla, a Jekyll pomija pliki zaczynające się od `_`, więc szablon zniknąłby z publikacji.

## Jak dodać poradnik

1. Skopiuj `poradniki/_szablon.html` pod nową nazwę, na przykład `poradniki/pierwsze-kroki.html`.
   Nazwa pliku: litery, cyfry i myślniki, końcówka `.html`. Najlepiej same małe litery. Bez spacji, polskich znaków, kropek w środku nazwy i bez podkatalogu.
2. W kopii ustaw `<title>`, `<meta name="description">`, datę w `<time datetime="RRRR-MM-DD">` (widoczny tekst daty też) oraz `<h1>`.
3. Wpisz treść. Usuń akapit z klasą `szablon-info` i całą sekcję „Wzorce składni”. Zdejmij też `<meta name="robots" content="noindex, nofollow">`, żeby tekst mógł trafić do wyszukiwarki.
4. Obrazy trzymaj obok poradnika, na przykład w `poradniki/obrazy/nazwa.png`. W HTML podaj ścieżkę względem pliku poradnika: `obrazy/nazwa.png`.
5. Dopisz jeden obiekt na końcu tablicy `poradniki` w pliku `poradniki.json` (ten w katalogu głównym, nie w `poradniki/`):

```json
{
  "tytul": "Tytuł widoczny na liście",
  "opis": "Jedno zdanie streszczenia.",
  "data": "2026-11-10",
  "plik": "pierwsze-kroki.html"
}
```

6. Zrób commit i wypchnij na `main`. Pages odświeży stronę samo. Na górze spisu ląduje najnowsza data, a przy tej samej dacie decyduje tytuł (po polsku).

Data w JSON i data w nagłówku artykułu to dwa osobne miejsca. Ustaw obie tak samo: spis czyta tylko JSON, a nagłówek artykułu tylko HTML.

Pola:

| Pole | Znaczenie |
| --- | --- |
| `tytul` | Wymagany. Tekst karty na stronie głównej. |
| `opis` | Krótki opis pod tytułem. Może być pusty. |
| `data` | `RRRR-MM-DD`. Zła data nie wyświetli się przy karcie; wpis i tak może być na liście. |
| `plik` | Sama nazwa pliku z kroku 1, bez katalogu. |

Pola są zwykłym tekstem. Znaczniki HTML wpisane w JSON pokażą się dosłownie, nie jako formatowanie.

Nie wpisuj `_szablon.html`. Wpis ze złą nazwą pliku albo z pustym tytułem jest pomijany. Gdy żaden wpis nie nadaje się do pokazania, strona napisze o tym wprost zamiast udawać pusty spis.

## Znaczniki w treści

Arkusz obejmuje zwykły artykuł: nagłówki, listy, cytat, `strong`, `code`, blok `pre`, obraz w `figure`.

Skrót klawiszowy:

```html
<kbd>Ctrl</kbd> + <kbd>C</kbd>
```

Tabela. Owijka daje przewijanie w bok na wąskim ekranie:

```html
<div class="tabela">
  <table>
    <caption>Podpis pod tabelą.</caption>
    <thead>
      <tr>
        <th scope="col">Kolumna</th>
        <th scope="col">Kolumna</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Wartość</td>
        <td>Wartość</td>
      </tr>
    </tbody>
  </table>
</div>
```

Ramki:

```html
<aside class="ramka ramka-wskazowka">
  <p class="ramka-etykieta">Wskazówka</p>
  <p>Treść.</p>
</aside>

<aside class="ramka ramka-ostrzezenie">
  <p class="ramka-etykieta">Ostrzeżenie</p>
  <p>Treść.</p>
</aside>

<aside class="ramka ramka-uwaga">
  <p class="ramka-etykieta">Uwaga</p>
  <p>Treść.</p>
</aside>
```

Ilustracja:

```html
<figure>
  <img src="obrazy/nazwa.png" alt="Opis tego, co widać">
  <figcaption>Podpis.</figcaption>
</figure>
```

## Linki względne

Strona stoi pod ścieżką `/Aion2/`, nie w korzeniu domeny. Adres w `href` i `src` zaczynaj od nazwy pliku albo od `../`. Nie zaczynaj od `/`.

- Ze strony głównej: `css/style.css`, `poradniki/pierwsze-kroki.html`
- Z pliku w `poradniki/`: `../css/style.css`, `../index.html`, `obrazy/zrzut.png`

`<a href="/index.html">` otworzyłby `https://tgrons.github.io/index.html` i pominął katalog repozytorium.

## Podgląd lokalny

Otwarcie `index.html` wprost z dysku (`file://`) nie wczyta `poradniki.json`. W katalogu repozytorium uruchom serwer:

```bash
python3 -m http.server 8080
```

Potem wejdź na <http://localhost:8080/>.

Żeby zobaczyć stronę tak jak na Pages, pod podścieżką `/Aion2/`:

```bash
mkdir -p /tmp/podglad
ln -sfn "$PWD" /tmp/podglad/Aion2
python3 -m http.server 8080 --directory /tmp/podglad
```

Potem <http://localhost:8080/Aion2/>. Na końcu adresu katalogu zostaw ukośnik.

## Publikacja

W ustawieniach repozytorium: Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: `main`, folder: `/ (root)`.
