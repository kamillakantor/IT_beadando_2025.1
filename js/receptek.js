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
  listLink.textContent = "Listához adás";
  actions.appendChild(listLink);

  //kattintásra hozzzáadás a listához
  listLink.addEventListener("click", function (event) {
    event.preventDefault();                   //ne kövesse a linket

    let items = [];
    try {
      let saved = localStorage.getItem("shoppingList_simple");          //beolvasás
      if (saved) {
        items = JSON.parse(saved);                //parse-olás
      }
    } catch (e) {
      items = [];               //hiba esetén üres tömb
    }

    if (recipe.ingredients) {
      for (let j = 0; j < recipe.ingredients.length; j++) {
        let ing = recipe.ingredients[j];
        let text = (ing.qty ? ing.qty + " " : "") + ing.name;
        items.push({ text: text, done: false });
      }
    }

    //rárárárámenegetés a html5 localstorage-be
    localStorage.setItem("shoppingList_simple", JSON.stringify(items));         //mentés
    window.location.href = "lista.html";            //átirányítás a listára
  });

  return card;
}

function showFeaturedRecipes() {
  let featuredContainer = document.querySelector("[data-bind='featured']");       //ide ekrulnek ,majd
  if (!featuredContainer || !window.RECIPES) {
    return;
  }

  // első 3 recept
  featuredContainer.innerHTML = "";               //üresre állítás
  let max = Math.min(3, RECIPES.length);            //ha kevesebb mint 3 recept van
  for (let i = 0; i < max; i++) {                 //kártya létrehozás
    let card = createRecipeCard(RECIPES[i]);
    featuredContainer.appendChild(card);
  }
}

function initRecipeListPage() {
  let grid = document.getElementById("recipeGrid");         //kártyák ide kerülnek
  let form = document.getElementById("filterForm");       //szűrők helye

  if (!grid || !form || !window.RECIPES) {
    return;
  }
  //szűrő elemek
  let categorySelect = form.elements["category"];
  let difficultySelect = form.elements["difficulty"];
  let timeInput = form.elements["time"];
  let searchInput = form.elements["q"];

  function refreshList() {
    grid.innerHTML = "";                //üresre állítás

    //szűrő értékek kiolvasása
    let category = categorySelect.value;
    let difficulty = difficultySelect.value;
    let maxTime = parseInt(timeInput.value, 10);
    if (isNaN(maxTime)) {
      maxTime = 0;
    }
    let search = searchInput.value.toLowerCase();

    let found = 0;

    //RECIPES tömb végigjárása és szűrés
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

      // keresés a címben, leírásban és az összetevőkben
      if (search) {
        let textToSearch = (r.title + " " + r.description).toLowerCase();
        let hasSearch = textToSearch.indexOf(search) !== -1;

        // ha nincs benne akkor a hozzavalok kozott is megnézi
        if (!hasSearch && r.ingredients) {
          for (let j = 0; j < r.ingredients.length; j++) {
            let ingName = r.ingredients[j].name.toLowerCase();
            if (ingName.indexOf(search) !== -1) {
              hasSearch = true;
              break;
            }
          }
        }
        // ha igy is semmi akkor megy tovabb
        if (!hasSearch) {
          continue;
        }
      }
      // kártya létrehozása és hozzáadása a gridhez
      let card = createRecipeCard(r);
      grid.appendChild(card);
      found++;
    }
    // ha nincs találat egy se
    if (found === 0) {
      let p = document.createElement("p");
      p.textContent = "Nincs találat a szűrők alapján.";
      grid.appendChild(p);
    }
  }

  // események, ha bármio változik refresheli a stisztémát
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
