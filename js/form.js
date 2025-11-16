// Egyszerű űrlap-ellenőrzés a recept beküldés oldalhoz

document.addEventListener("DOMContentLoaded", function () {
  let form = document.getElementById("submitForm");
  if (!form) {
    return;
  }

  let servings = document.getElementById("servings");
  let servingsOut = document.getElementById("servingsOut");

  if (servings && servingsOut) {
    servings.addEventListener("input", function () {
      servingsOut.textContent = servings.value;
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

  let nameInput = document.getElementById("name");
  let emailInput = document.getElementById("email");
  let recipeNameInput = document.getElementById("recipeName");
  let categorySelect = document.getElementById("category");
  let timeInput = document.getElementById("time");
  let descInput = document.getElementById("desc");
  let termsCheckbox = document.getElementById("terms");

  let ok = true;

    // Név
    let name = nameInput.value.trim();
    if (name.length < 3) {
      ok = false;
      document.getElementById("err-name").textContent = "A név legalább 3 karakter.";
    } else {
      document.getElementById("err-name").textContent = "";
    }

    // E-mail – nagyon egyszerű ellenőrzés
    let email = emailInput.value.trim();
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      ok = false;
      document.getElementById("err-email").textContent = "Adj meg egy érvényes e-mail címet.";
    } else {
      document.getElementById("err-email").textContent = "";
    }

    // Recept neve
    let recipeName = recipeNameInput.value.trim();
    if (recipeName.length < 3) {
      ok = false;
      document.getElementById("err-recipeName").textContent = "Adj meg legalább 3 karaktert.";
    } else {
      document.getElementById("err-recipeName").textContent = "";
    }

    // Kategória
    if (!categorySelect.value) {
      ok = false;
      document.getElementById("err-category").textContent = "Válassz kategóriát.";
    } else {
      document.getElementById("err-category").textContent = "";
    }

    // Idő
    let timeValue = parseInt(timeInput.value, 10);
    if (isNaN(timeValue) || timeValue < 1 || timeValue > 240) {
      ok = false;
      document.getElementById("err-time").textContent = "1 és 240 perc között add meg az időt.";
    } else {
      document.getElementById("err-time").textContent = "";
    }

    // Leírás
    let desc = descInput.value.trim();
    if (desc.length < 50) {
      ok = false;
      document.getElementById("err-desc").textContent = "Minimum 50 karakteres leírás szükséges.";
    } else {
      document.getElementById("err-desc").textContent = "";
    }

    // Feltételek elfogadása
    if (!termsCheckbox.checked) {
      ok = false;
      document.getElementById("err-terms").textContent = "El kell fogadni a feltételeket.";
    } else {
      document.getElementById("err-terms").textContent = "";
    }

    if (ok) {
      alert("Köszönjük! A beküldés sikeres.");
      form.reset();
      if (servingsOut) {
        servingsOut.textContent = "4";
      }
    }
  });
});
