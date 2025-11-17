// űrlap-ellenőrzés a recept beküldés oldalhoz
//html toltodjon be fisrt
document.addEventListener("DOMContentLoaded", function () {
  let form = document.getElementById("submitForm");     //id alapjan keresi az űrlapot
  if (!form) {            // ha nincs ilyen elem az oldalon
    return;
  }

  let servings = document.getElementById("servings");           //bemeneti mező
  let servingsOut = document.getElementById("servingsOut");         //kimeneti mező

  if (servings && servingsOut) {
    servings.addEventListener("input", function () {
      servingsOut.textContent = servings.value;             //frissíti a kimeneti mezőt a bemeneti mező értékére
    });
  }
  
  
  // ha megprobáljuk elküldeni az űrlapot
  form.addEventListener("submit", function (event) {
    event.preventDefault();           //nem engedi ujratoltreni az oladlt
  
  
  // lekéri az űrlap mezőit
  let nameInput = document.getElementById("name");
  let emailInput = document.getElementById("email");
  let recipeNameInput = document.getElementById("recipeName");
  let categorySelect = document.getElementById("category");
  let timeInput = document.getElementById("time");
  let descInput = document.getElementById("desc");
  let termsCheckbox = document.getElementById("terms");

  let ok = true;             //minden okes e

  // Név ellenorzese
  let name = nameInput.value.trim();        //trim: spacek eltavolitasa
  if (name.length < 3) {
    ok = false;
    document.getElementById("err-name").textContent = "A név legalább 3 karakter.";
  } else {
    document.getElementById("err-name").textContent = "";         //ha okes, ures hibaüzenet
  }

  // Emil kicsit se gany ellenorzese ahah
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
  if (!categorySelect.value) {        //ha ures az nem jo nem jo rósz
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
    form.reset();         //űrlap alaphelyzetbe állítása
    form.addEventListener('reset', function () {
    // setTimeout 0, hogy a böngésző előbb végrehajtsa a reset-et a DOM-on
    
      if (servings && servingsOut) {
        servingsOut.textContent = servings.value;
      }
  });
    if (servingsOut) {
      // állítsuk vissza a kimenetet a bemeneti mező alapértelmezett értékére
      servingsOut.textContent = (servings && servings.defaultValue) ? servings.defaultValue : '4';
    }
    
  }
});

});
