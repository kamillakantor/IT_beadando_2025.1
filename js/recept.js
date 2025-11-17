// Egy recept részletes megjelenítése

function getRecipeIdFromUrl() {                     // segédfüggvény az URL-ből kinyerni a recept azonosítóját
  // pl. ?id=csirkepaprikas
  let search = window.location.search;            // a ? utáni rész
  if (!search || search.length < 4) {                   // ha nincs keresési rész vagy túl rövid
    return null;
  }

  // levágjuk a ?
  search = search.substring(1);                // "id=csirkepaprikas&mas=valami"
  let parts = search.split("&");            // & mentén darabolás

  for (let i = 0; i < parts.length; i++) {
    let pair = parts[i].split("=");                   // kulcs-érték pár darabolás
    let key = decodeURIComponent(pair[0]);           // pair[0] = kulcs, pair[1] = érték
    let value = pair.length > 1 ? decodeURIComponent(pair[1]) : "";               //decode az URL kódolás miatt
    if (key === "id") {
      return value;                   // visszatér az id értékével pl. "csirkepaprikas"
    }
  }

  return null;
}

// megkeresi a receptet az azonosító alapján
function findRecipeById(id) {
  if (!window.RECIPES) {              //letezik-e a RECIPES tömb
    return null;
  }
  for (let i = 0; i < RECIPES.length; i++) {
    if (RECIPES[i].id === id) {
      return RECIPES[i];
    }
  }
  return null;
}

function renderRecipeDetail() {
  // a részletek megjelenítési helye hötömölöben
  let host = document.getElementById("recipeDetail");
  if (!host || !window.RECIPES) {
    return;
  }

  let id = getRecipeIdFromUrl();          // kinyeri az id-t az URL-ből
  let recipe = null;

  if (id) {
    recipe = findRecipeById(id);        // megkeresi a receptet az id alapján
  }

  // ha valamiért nincs találat, akkor az első receptet mutatja
  if (!recipe && RECIPES.length > 0) {
    recipe = RECIPES[0];
  }

  if (!recipe) {
    host.textContent = "Nincs ilyen recept.";
    return;
  }

  // recept megjelenítése
  let header = document.createElement("header");          // recept fejléc

  let img = document.createElement("img");
  img.id = "recipe-img";
  img.src = recipe.image;
  img.alt = recipe.title;
  header.appendChild(img);

  let h1 = document.createElement("h1");
  h1.textContent = recipe.title;
  header.appendChild(h1);

  let meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML =
    "Kategória: <strong>" + recipe.category +
    "</strong> • Idő: <strong>" + recipe.time + " perc" +
    "</strong> • Nehézség: <strong>" + recipe.difficulty +
    "</strong> • Adag: <strong>" + recipe.servings + "</strong>";
  header.appendChild(meta);

  let desc = document.createElement("p");
  desc.textContent = recipe.description;
  header.appendChild(desc);


  host.appendChild(header);

  // hozzávalók - ingredients
  let ingSection = document.createElement("section");
  ingSection.className = "ingredients";

  let h2Ing = document.createElement("h2");
  h2Ing.textContent = "Hozzávalók";
  ingSection.appendChild(h2Ing);

  let ul = document.createElement("ul");
  if (recipe.ingredients) {
    for (let i = 0; i < recipe.ingredients.length; i++) {
      let ing = recipe.ingredients[i];
      let li = document.createElement("li");
      let text = "";
      if (ing.qty) {
        text += ing.qty + " ";
      }
      text += ing.name;
      li.textContent = text;
      ul.appendChild(li);
    }
  }
  ingSection.appendChild(ul);

  // gomb a hozzávalók átviteléhez a bevásárlólistára
  let actionsDiv = document.createElement('div');
  actionsDiv.className = 'recipe__actions';

  let addToListBtn = document.createElement('a');
  addToListBtn.className = 'btn btn--secondary';
  addToListBtn.href = './lista.html';
  addToListBtn.textContent = 'Hozzávalók listához';
  actionsDiv.appendChild(addToListBtn);

  header.appendChild(actionsDiv);

  // kattintás kezelő: összetevők hozzáadása localStorage-hoz, majd navigáció
  addToListBtn.addEventListener('click', function (event) {
    event.preventDefault();

    let items = [];
    try {
      let saved = localStorage.getItem('shoppingList_simple');
      if (saved) {
        items = JSON.parse(saved);
      }
    } catch (e) {
      items = [];
    }

    if (recipe.ingredients) {
      for (let j = 0; j < recipe.ingredients.length; j++) {
        let ing = recipe.ingredients[j];
        let text = (ing.qty ? ing.qty + ' ' : '') + ing.name;
        items.push({ text: text, done: false });
      }
    }

    localStorage.setItem('shoppingList_simple', JSON.stringify(items));
    window.location.href = './lista.html';
  });

  host.appendChild(ingSection);

  // elkészítés
  let stepsSection = document.createElement("section");
  stepsSection.className = "steps";

  let h2Steps = document.createElement("h2");
  h2Steps.textContent = "Elkészítés";
  stepsSection.appendChild(h2Steps);

  let ol = document.createElement("ol");
  if (recipe.steps) {
    for (let j = 0; j < recipe.steps.length; j++) {
      let liStep = document.createElement("li");
      liStep.textContent = recipe.steps[j];
      ol.appendChild(liStep);
    }
  }
  stepsSection.appendChild(ol);

  host.appendChild(stepsSection);
}

document.addEventListener("DOMContentLoaded", function () {           // oldal betöltődése után
  renderRecipeDetail();
});
