"use strict";

(function () {
  var MIESIACE = [
    "stycznia",
    "lutego",
    "marca",
    "kwietnia",
    "maja",
    "czerwca",
    "lipca",
    "sierpnia",
    "września",
    "października",
    "listopada",
    "grudnia"
  ];

  function formatujDate(iso) {
    var trafienie = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!trafienie) {
      return null;
    }
    var rok = Number(trafienie[1]);
    var miesiac = Number(trafienie[2]);
    var dzien = Number(trafienie[3]);
    var data = new Date(Date.UTC(rok, miesiac - 1, dzien));
    if (
      data.getUTCFullYear() !== rok ||
      data.getUTCMonth() !== miesiac - 1 ||
      data.getUTCDate() !== dzien
    ) {
      return null;
    }
    return {
      iso: trafienie[1] + "-" + trafienie[2] + "-" + trafienie[3],
      tekst: dzien + " " + MIESIACE[miesiac - 1] + " " + rok
    };
  }

  function czyBezpiecznyPlik(plik) {
    return /^(?:[a-z0-9][a-z0-9-]*\/)?[A-Za-z0-9][A-Za-z0-9-]*\.html$/.test(plik);
  }

  function posortuj(wpisy) {
    return wpisy.slice().sort(function (a, b) {
      if (a.dataIso !== b.dataIso) {
        return a.dataIso < b.dataIso ? 1 : -1;
      }
      return a.tytul.localeCompare(b.tytul, "pl");
    });
  }

  function przygotuj(dane) {
    if (!dane || !Array.isArray(dane.poradniki)) {
      return {
        blad: "Plik poradniki.json ma nieoczekiwany układ. Potrzebny jest obiekt z tablicą „poradniki”."
      };
    }

    var wpisy = [];
    var pominiete = 0;

    dane.poradniki.forEach(function (wpis) {
      if (!wpis || typeof wpis !== "object") {
        pominiete += 1;
        return;
      }
      var tytul = typeof wpis.tytul === "string" ? wpis.tytul.trim() : "";
      var plik = typeof wpis.plik === "string" ? wpis.plik.trim() : "";
      if (!tytul || !czyBezpiecznyPlik(plik)) {
        pominiete += 1;
        return;
      }
      var data = formatujDate(typeof wpis.data === "string" ? wpis.data.trim() : "");
      var opis = typeof wpis.opis === "string" ? wpis.opis.trim() : "";
      wpisy.push({
        tytul: tytul,
        opis: opis,
        plik: plik,
        dataIso: data ? data.iso : "",
        dataTekst: data ? data.tekst : ""
      });
    });

    if (pominiete > 0) {
      console.warn("Pominięto wpisy w poradniki.json: " + pominiete + ".");
    }

    if (wpisy.length === 0 && dane.poradniki.length > 0) {
      return {
        blad: "Żaden wpis ze spisu nie został pokazany. Pole plik to nazwa pliku .html albo jedna ścieżka katalog/plik.html (litery, cyfry, myślniki), a tytul nie może być pusty."
      };
    }

    return { wpisy: posortuj(wpisy) };
  }

  function element(tag, className, text) {
    var wezel = document.createElement(tag);
    if (className) {
      wezel.className = className;
    }
    if (text != null) {
      wezel.textContent = text;
    }
    return wezel;
  }

  function pokazKomunikat(kontener, tekst, klasa) {
    kontener.replaceChildren(element("p", klasa, tekst));
    kontener.setAttribute("aria-busy", "false");
  }

  function renderuj(kontener, wpisy) {
    kontener.replaceChildren();
    if (wpisy.length === 0) {
      var pusty = element("div", "pusty");
      pusty.append(
        element("p", "pusty-tytul", "Poradniki wkrótce"),
        element(
          "p",
          null,
          "Nie ma tu jeszcze żadnego tekstu. Gdy pojawią się pierwsze poradniki, zobaczysz je na tej liście."
        )
      );
      kontener.append(pusty);
      kontener.setAttribute("aria-busy", "false");
      return;
    }

    var lista = element("ul", "spis");
    wpisy.forEach(function (wpis) {
      var pozycja = element("li");
      var link = element("a", "karta");
      link.href = "poradniki/" + wpis.plik;
      if (wpis.dataTekst) {
        var czas = element("time", "karta-data", wpis.dataTekst);
        czas.dateTime = wpis.dataIso;
        link.append(czas);
      }
      link.append(element("span", "karta-tytul", wpis.tytul));
      if (wpis.opis) {
        link.append(element("span", "karta-opis", wpis.opis));
      }
      pozycja.append(link);
      lista.append(pozycja);
    });
    kontener.append(lista);
    kontener.setAttribute("aria-busy", "false");
  }

  function start() {
    var kontener = document.getElementById("lista-poradnikow");
    if (!kontener) {
      return;
    }

    fetch("poradniki.json", { cache: "no-cache" })
      .then(function (odpowiedz) {
        if (!odpowiedz.ok) {
          throw new Error("HTTP " + odpowiedz.status);
        }
        return odpowiedz.json();
      })
      .then(function (dane) {
        var wynik = przygotuj(dane);
        if (wynik.blad) {
          pokazKomunikat(kontener, wynik.blad, "stan stan-blad");
          return;
        }
        renderuj(kontener, wynik.wpisy);
      })
      .catch(function (blad) {
        console.error(blad);
        pokazKomunikat(kontener, "Nie udało się wczytać spisu poradników.", "stan stan-blad");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
