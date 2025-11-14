// Egyszerű, közös JavaScript függvények

// Rövidítés a gyakran használt lekérdezésekhez
function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

// Mobil menü gomb működése
document.addEventListener("DOMContentLoaded", function () {
  let menuBtn = document.querySelector(".menu-toggle");
  let nav = document.getElementById("site-nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      let isOpen = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
});
