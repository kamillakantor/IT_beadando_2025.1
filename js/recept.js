// Egy recept részletes megjelenítése

function getRecipeIdFromUrl() {
  // pl. ?id=csirkepaprikas
  let search = window.location.search; // a ? utáni rész
  if (!search || search.length < 4) {
    return null;
  }

  // levágjuk a ?
  search = search.substring(1); // "id=csirkepaprikas&mas=valami"
  let parts = search.split("&");

  for (let i = 0; i < parts.length; i++) {
    let pair = parts[i].split("=");
    let key = decodeURIComponent(pair[0]);
    let value = pair.length > 1 ? decodeURIComponent(pair[1]) : "";
    if (key === "id") {
      return value;
    }
  }

  return null;
}

function findRecipeById(id) {
  if (!window.RECIPES) {
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
  let host = document.getElementById("recipeDetail");
  if (!host || !window.RECIPES) {
    return;
  }

  let id = getRecipeIdFromUrl();
  let recipe = null;

  if (id) {
    recipe = findRecipeById(id);
  }

  // ha valamiért nincs találat, akkor az első receptet mutatjuk
  if (!recipe && RECIPES.length > 0) {
    recipe = RECIPES[0];
  }

  if (!recipe) {
    host.textContent = "Nincs ilyen recept.";
    return;
  }

  // kép
  let header = document.createElement("header");

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

  // hozzávalók
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

  let listInfo = document.createElement("p");
  listInfo.textContent = "A hozzávalókat a bevásárlólistához most kézzel tudod felvenni.";
  ingSection.appendChild(listInfo);

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

document.addEventListener("DOMContentLoaded", function () {
  renderRecipeDetail();
});
