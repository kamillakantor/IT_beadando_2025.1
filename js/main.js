// Egyszerű, közös JavaScript függvények

// Rövidítés a gyakran használt lekérdezésekhez
function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

// Mobil menü gomb működése hambi gomb
// DOMContentLoaded azért, h a script akkor fusson le, amikor már a html teljesen betöltődött
document.addEventListener("DOMContentLoaded", function () {
  let menuBtn = $(".menu-toggle");            // a menü gomb aminek ez az osztalya
  let nav = document.getElementById("site-nav");            // a nav elem aminek ez az id-je

  if (menuBtn && nav) {             // ha van ilyen elem az oldalon
    menuBtn.addEventListener("click", function () {
      let isOpen = nav.classList.toggle("open");            //megnyitja v bezarja ertelemszeruen phhh
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
});
