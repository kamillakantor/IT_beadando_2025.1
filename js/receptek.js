// Receptek listázása és kártyák létrehozása

function createRecipeCard(recipe) {
  let card = document.createElement("article");
  card.className = "card";

  // kép
  let img = document.createElement("img");
  img.src = recipe.image;
  img.alt = recipe.title;
  card.appendChild(img);

  // tartalom doboz
  let body = document.createElement("div");
  body.className = "card__body";
  card.appendChild(body);

  // cím
  let title = document.createElement("h3");
  title.className = "card__title";
  title.textContent = recipe.title;
  body.appendChild(title);

  // meta információ
  let meta = document.createElement("div");
  meta.className = "card__meta";
  meta.textContent = recipe.category + " • " + recipe.time + " perc • " + recipe.difficulty;
  body.appendChild(meta);

  // leírás
  let p = document.createElement("p");
  p.textContent = recipe.description;
  body.appendChild(p);

  // gombok
  let actions = document.createElement("div");
  actions.className = "card__actions";
  body.appendChild(actions);

  let detailsLink = document.createElement("a");
  detailsLink.className = "btn";
  detailsLink.href = "recept.html?id=" + encodeURIComponent(recipe.id);
  detailsLink.textContent = "Részletek";
  actions.appendChild(detailsLink);

  let listLink = document.createElement("a");
  listLink.className = "btn btn--secondary";
  listLink.href = "lista.html";
  listLink.textContent = "Hozzávalók listához";
  actions.appendChild(listLink);

  //kattintásra hozzzáadás a listához
  listLink.addEventListener("click", function (event) {
    event.preventDefault();

    let items = [];
    try {
      let saved = localStorage.getItem("shoppingList_simple");
      if (saved) {
        items = JSON.parse(saved);
      }
    } catch (e) {
      items = [];
    }

    if (recipe.ingredients) {
      for (let j = 0; j < recipe.ingredients.length; j++) {
        let ing = recipe.ingredients[j];
        let text = (ing.qty ? ing.qty + " " : "") + ing.name;
        items.push({ text: text, done: false });
      }
    }

    //rárárárámenegetés a html5 localstorage-be
    localStorage.setItem("shoppingList_simple", JSON.stringify(items));
      // Dinamikus útvonal, amely GitHub Pages-en is működik
      let basePath = window.location.pathname.split('/').slice(0, -1).join('/');
      window.location.href = basePath + "/lista.html";
  });

  return card;
}

function showFeaturedRecipes() {
  let featuredContainer = document.querySelector("[data-bind='featured']");
  if (!featuredContainer || !window.RECIPES) {
    return;
  }

  // első 3 recept
  featuredContainer.innerHTML = "";
  let max = Math.min(3, RECIPES.length);
  for (let i = 0; i < max; i++) {
    let card = createRecipeCard(RECIPES[i]);
    featuredContainer.appendChild(card);
  }
}

function initRecipeListPage() {
  let grid = document.getElementById("recipeGrid");
  let form = document.getElementById("filterForm");

  if (!grid || !form || !window.RECIPES) {
    return;
  }

  let categorySelect = form.elements["category"];
  let difficultySelect = form.elements["difficulty"];
  let timeInput = form.elements["time"];
  let searchInput = form.elements["q"];

  function refreshList() {
    grid.innerHTML = "";

    let category = categorySelect.value;
    let difficulty = difficultySelect.value;
    let maxTime = parseInt(timeInput.value, 10);
    if (isNaN(maxTime)) {
      maxTime = 0;
    }
    let search = searchInput.value.toLowerCase();

    let found = 0;

    for (let i = 0; i < RECIPES.length; i++) {
      let r = RECIPES[i];

      // szűrés kategória szerint
      if (category && r.category !== category) {
        continue;
      }

      // szűrés nehézség szerint
      if (difficulty && r.difficulty !== difficulty) {
        continue;
      }

      // max idő
      if (maxTime > 0 && r.time > maxTime) {
        continue;
      }

      // egyszerű keresés a címben, leírásban és az összetevőkben
      if (search) {
        let textToSearch = (r.title + " " + r.description).toLowerCase();
        let hasSearch = textToSearch.indexOf(search) !== -1;

        if (!hasSearch && r.ingredients) {
          for (let j = 0; j < r.ingredients.length; j++) {
            let ingName = r.ingredients[j].name.toLowerCase();
            if (ingName.indexOf(search) !== -1) {
              hasSearch = true;
              break;
            }
          }
        }

        if (!hasSearch) {
          continue;
        }
      }

      let card = createRecipeCard(r);
      grid.appendChild(card);
      found++;
    }

    if (found === 0) {
      let p = document.createElement("p");
      p.textContent = "Nincs találat a szűrők alapján.";
      grid.appendChild(p);
    }
  }

  // események
  categorySelect.addEventListener("change", refreshList);
  difficultySelect.addEventListener("change", refreshList);
  timeInput.addEventListener("input", refreshList);
  searchInput.addEventListener("input", refreshList);

  // első betöltés
  refreshList();
}

// Ha az oldal betöltődött, nézzük meg, milyen elemek vannak és ahhoz igazodunk
document.addEventListener("DOMContentLoaded", function () {
  showFeaturedRecipes();
  initRecipeListPage();
});
