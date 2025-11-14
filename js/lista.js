// Egyszerű bevásárlólista

let shoppingItems = [];

function loadShoppingList() {
  let saved = window.localStorage ? localStorage.getItem("shoppingList_simple") : null;
  if (saved) {
    try {
      shoppingItems = JSON.parse(saved);
    } catch (e) {
      shoppingItems = [];
    }
  }
}

function saveShoppingList() {
  if (window.localStorage) {
    localStorage.setItem("shoppingList_simple", JSON.stringify(shoppingItems));
  }
}

function renderShoppingList() {
  let listElement = document.getElementById("shoppingList");
  let hideDoneCheckbox = document.getElementById("hideDone");

  if (!listElement) {
    return;
  }

  listElement.innerHTML = "";

  let hideDone = hideDoneCheckbox && hideDoneCheckbox.checked;

  for (let i = 0; i < shoppingItems.length; i++) {
    let item = shoppingItems[i];

    if (hideDone && item.done) {
      continue;
    }

  let li = document.createElement("li");
  li.className = "shopping__item";
    if (item.done) {
      li.className += " done";
    }
    li.setAttribute("data-index", i);

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!item.done;
    checkbox.className = "chk";
    checkbox.addEventListener("change", function (event) {
      let index = parseInt(event.target.parentNode.getAttribute("data-index"), 10);
      shoppingItems[index].done = event.target.checked;
      saveShoppingList();
      renderShoppingList();
    });
    li.appendChild(checkbox);

  let span = document.createElement("span");
    span.className = "text";
    span.textContent = item.text;
    li.appendChild(span);

    let delBtn = document.createElement("button");
    delBtn.className = "btn btn--secondary";
    delBtn.textContent = "Törlés";
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

function addShoppingItem(text) {
  if (!text) {
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

function clearDoneItems() {
  let newItems = [];
  for (let i = 0; i < shoppingItems.length; i++) {
    if (!shoppingItems[i].done) {
      newItems.push(shoppingItems[i]);
    }
  }
  shoppingItems = newItems;
  saveShoppingList();
  renderShoppingList();
}

function clearAllItems() {
  // Remove all items from the list and persist the empty list
  shoppingItems = [];
  saveShoppingList();
  renderShoppingList();
}

document.addEventListener("DOMContentLoaded", function () {
  let input = document.getElementById("itemText");
  let addButton = document.getElementById("addBtn");
  let clearDoneButton = document.getElementById("clearDoneBtn");
  let clearAllButton = document.getElementById("clearAllBtn");
  let hideDoneCheckbox = document.getElementById("hideDone");

  if (!input || !addButton) {
    return;
  }

  loadShoppingList();
  renderShoppingList();

  addButton.addEventListener("click", function () {
    addShoppingItem(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addShoppingItem(input.value);
      input.value = "";
    }
  });

  if (clearDoneButton) {
    clearDoneButton.addEventListener("click", function () {
      clearDoneItems();
    });
  }

  if (clearAllButton) {
    clearAllButton.addEventListener("click", function () {
      if (!shoppingItems || shoppingItems.length === 0) {
        return;
      }
      let ok = confirm("Biztosan törölni szeretnéd az összes tételt? Ez a művelet nem vonható vissza.");
      if (ok) {
        clearAllItems();
      }
    });
  }

  if (hideDoneCheckbox) {
    hideDoneCheckbox.addEventListener("change", function () {
      renderShoppingList();
    });
  }
});
