// bevásárlólista

let shoppingItems = [];             //text: "", done: true/false

//adatok betoltese localstoragebol
function loadShoppingList() {
  let saved = window.localStorage ? localStorage.getItem("shoppingList_simple") : null;     //ha van localstorage, akkor betolti a shoppinglistet
  if (saved) {
    try {
      shoppingItems = JSON.parse(saved);          //json stringet objektummá alakítja
    } catch (e) {
      shoppingItems = [];               //ha hiba van, ures tomb
    }
  }
}

//adatok mentese localstorageba
function saveShoppingList() {
  if (window.localStorage) {
    localStorage.setItem("shoppingList_simple", JSON.stringify(shoppingItems));     //objektumot json stringge alakitja es elmenti a localstoragebe
  }
}

//létrehoz egy új bevásárlólista tételt a recept alapján és elmenti a localstorage-be, majd átirányít a lista oldalra
function renderShoppingList() {
  let listElement = document.getElementById("shoppingList");        //ul elem
  let hideDoneCheckbox = document.getElementById("hideDone");       //checkbox az elrejtéshez

  if (!listElement) {                 //ha nincs mit kiirni
    return;
  }

  listElement.innerHTML = "";               //uresre állítja a listát hogy ne duplázódjon allandoan mint akinek kotelezo

  let hideDone = hideDoneCheckbox && hideDoneCheckbox.checked;

  // végigmegy a tételeken és létrehozza a HTML elemeket
  for (let i = 0; i < shoppingItems.length; i++) {
    let item = shoppingItems[i];

    //ha kesz akkor tovabb ne mutassa
    if (hideDone && item.done) {
      continue;
    }

    let li = document.createElement("li");          //li elem a listához az elemnek
    li.className = "shopping__item";
      if (item.done) {
        li.className += " done";    //ha kész van, akkor done osztály hozzáadása
      }
      li.setAttribute("data-index", i);         //későbbi azonosításhoz


      //csekkboksz a készre jelöléshez
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = !!item.done;     //booleanná alakítja
      checkbox.className = "chk";
      //ha megváltozik a csekkboksz állapota, frissíti a tétel állapotát és elmenti
      checkbox.addEventListener("change", function (event) {
        let index = parseInt(event.target.parentNode.getAttribute("data-index"), 10);       // kiokoskodja a szülő elemből h meylik elem
        shoppingItems[index].done = event.target.checked;   //frissíti a done állapotot
        saveShoppingList();
        renderShoppingList();         //újrarendereli a listát
      });
      li.appendChild(checkbox);       //hozzáadja a li elemhez

    let span = document.createElement("span");    //span elem a tétel szövegéhez
    span.className = "text";
    span.textContent = item.text;
    li.appendChild(span);

    let delBtn = document.createElement("button");    //törlés gomb
    delBtn.className = "btn btn--secondary";          //gomb osztályok
    delBtn.textContent = "Törlés";
    //rákattintásra törli a tételt a listából, elmenti és újrarendereli a listát
    delBtn.addEventListener("click", function (event) {
      let index = parseInt(event.target.parentNode.getAttribute("data-index"), 10);
      shoppingItems.splice(index, 1);
      saveShoppingList();
      renderShoppingList();
    });
    li.appendChild(delBtn);

    listElement.appendChild(li);
  }
}

//új tétel hozzáadása a listához
function addShoppingItem(text) {
  if (!text) {              //üres szöveg esetén semmi
    return;
  }
  let trimmed = text.trim();
  if (trimmed === "") {
    return;
  }
  shoppingItems.push({ text: trimmed, done: false });
  saveShoppingList();
  renderShoppingList();
}

//kész tételek törlése
function clearDoneItems() {
  let newItems = [];
  for (let i = 0; i < shoppingItems.length; i++) {
    if (!shoppingItems[i].done) {             //ha nincs kész, akkor hozzáadja az új tömbhöz
      newItems.push(shoppingItems[i]);
    }
  }
  shoppingItems = newItems;             //frissíti a fő tömböt
  saveShoppingList();
  renderShoppingList();
}

//összes tétel törlése
function clearAllItems() {
  shoppingItems = [];
  saveShoppingList();
  renderShoppingList();
}

//oldal betöltése után inicializálja a bevásárlólistát
document.addEventListener("DOMContentLoaded", function () {
  let input = document.getElementById("itemText");
  let addButton = document.getElementById("addBtn");
  let clearDoneButton = document.getElementById("clearDoneBtn");
  let clearAllButton = document.getElementById("clearAllBtn");
  let hideDoneCheckbox = document.getElementById("hideDone");

  if (!input || !addButton) {         //ha nincs input vagy gomb, akkor nem csinál semmit
    return;
  }

  //adatok betöltése és lista megjelenítése ha volt mentett adat
  loadShoppingList();
  renderShoppingList();

  //új tétel hozzáadása gombnyomásra
  addButton.addEventListener("click", function () {
    addShoppingItem(input.value);
    input.value = "";
  });

  //új tétel hozzáadása enter lenyomására h menci legyen a felhasználói élmény six seven
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addShoppingItem(input.value);
      input.value = "";
    }
  });

  //kész tételek törlése gomb
  if (clearDoneButton) {
    clearDoneButton.addEventListener("click", function () {
      clearDoneItems();
    });
  }

  //összes tétel törlése gomb
  if (clearAllButton) {
    clearAllButton.addEventListener("click", function () {
      // megerősítés kérés törlés előtt
      if (!shoppingItems || shoppingItems.length === 0) {
        return;
      }
      let ok = confirm("Biztosan törölni szeretnéd az összes tételt? Ez a művelet nem vonható vissza.");
      if (ok) {
        clearAllItems();
      }
    });
  }

  // ha a kész elemek elrejtése checkbox állapota változik, újrarendereli a listát
  if (hideDoneCheckbox) {
    hideDoneCheckbox.addEventListener("change", function () {
      renderShoppingList();
    });
  }
});
