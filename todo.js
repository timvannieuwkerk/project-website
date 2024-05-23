// Queryselectors
const newCategoryMenuOpen = document.querySelector(".fa-square-plus");
const newCategoryConfirm = document.querySelector(".fa-square-check");
const newCategoryMenu = document.querySelector(".nieuw");
const newCategoryName = document.querySelector("#newCategoryName");
const todoForm = document.querySelector("#todo-form");
const chooseCategoryButton = document.querySelector(".categories-choose");
const errorCategoryCannotBeEmpty = document.querySelector(".error");
const inputTitleField = document.querySelector("#title");
const inputDateField = document.querySelector("#date");
const chooseCategoryList = document.querySelector(".categories-options");
const chooseDateButton = document.querySelector("#date");
const toDoOverview = document.querySelector(".to-do-overview");

// Loading the page
window.addEventListener("load", () => {
  // EventListeners
  // 1. EventListener newCategoryMenuOpen
  OpenNewCategoryMenu();

  // 2. EventListener newCategoryConfirm
  UpdateNewCategory();

  // 3. EventListener chooseCategoryButton
  OpenCategoryMenu();

  // 4. EventListener chooseDateButton
  OpenDateMenu();

  // 5. EventListener Submit
  SubmitNewToDo();

  // 6. EventListener clickOnWindow
  CloseOpenFields();

  // Initieel categoriën en items weergeven
  DisplayCategories();
});

// FUNCTIONS
// A: EventListeners

function OpenNewCategoryMenu() {
  newCategoryMenuOpen.addEventListener("click", () => {
    newCategoryMenu.classList.toggle("hidden");
  });
}

function UpdateNewCategory() {
  newCategoryConfirm.addEventListener("click", () => {
    if (newCategoryName.value === "") {
      newCategoryMenu.classList.toggle("hidden");
    } else {
      const categoryNew = { category: newCategoryName.value };

      newCategoryName.value = "";
      newCategoryMenu.classList.toggle("hidden");

      categorieOverzicht.push(categoryNew);
      localStorage.setItem("categories", JSON.stringify(categorieOverzicht));

      DisplayCategories();
    }
  });
}

function OpenCategoryMenu() {
  chooseCategoryButton.addEventListener("click", () => {
    chooseCategoryList.classList.toggle("hidden");
    chooseCategoryButton.classList.toggle("border");
  });
}

function OpenDateMenu() {
  chooseDateButton.addEventListener("click", () => {
    chooseDateButton.classList.remove("grijs");
  });
}

function SubmitNewToDo() {
  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    if (chooseCategoryButton.value === "Kies een categorie") {
      errorCategoryCannotBeEmpty.classList.remove("hidden");
      return;
    }

    const todo = {
      title: event.target.elements.title.value,
      category: chooseCategoryButton.value,
      date: event.target.elements.date.value,
    };

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));

    inputTitleField.value = "";
    chooseCategoryButton.value = "Kies een categorie";
    chooseCategoryButton.classList.add("grijs");
    inputDateField.value = "";
    inputDateField.classList.add("grijs");

    DisplayTodos();
    CheckIfCategoryIsEmpty();
  });
}

function CloseOpenFields() {
  window.onclick = function (event) {
    if (
      !event.target.matches(".categories-choose") &&
      !chooseCategoryList.classList.contains("hidden")
    ) {
      chooseCategoryList.classList.add("hidden");
      chooseCategoryButton.classList.remove("border");
    }
  };
}

// B: Displayfunctions

function DisplayTodos() {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  const allCategories = document.querySelectorAll(".to-do-category");

  for (let i = 0; i < allCategories.length; i++) {
    allCategories[i].children[1].innerHTML = "";
  }

  todos.forEach((todo) => {
    const newTodoItem = document.createElement("div");
    const newTitle = document.createElement("input");
    const newDate = document.createElement("input");
    const editButton = document.createElement("i");
    const deleteButton = document.createElement("i");

    newTodoItem.classList.add("todo-item", "read-only");
    newTitle.classList.add("text");
    newDate.classList.add("date-todo");
    editButton.classList.add("fa-solid", "fa-pen-to-square");
    deleteButton.classList.add("fa-regular", "fa-trash-can");

    newTitle.value = todo.title;
    newDate.value = todo.date;

    newTitle.readOnly = true;
    newDate.type = "date";
    newDate.readOnly = true;

    newTodoItem.append(newTitle, newDate, editButton, deleteButton);

    for (let i = 0; i < allCategories.length; i++) {
      if (allCategories[i].firstElementChild.innerText === todo.category) {
        allCategories[i].children[1].appendChild(newTodoItem);
      }
    }

    // EventListeners voor Buttons
    const titleToFind = newTitle.value;
    const categoryToFind = todo.category;
    const dateToFind = newDate.value;

    editButton.addEventListener("click", () => {
      let todos = JSON.parse(localStorage.getItem("todos")) || [];

      if (newTodoItem.classList.contains("read-only")) {
        newTodoItem.classList.toggle("read-only");
        newTitle.readOnly = !newTitle.readOnly;
        newDate.readOnly = !newDate.readOnly;
        editButton.classList.remove("fa-pen-to-square");
        editButton.classList.add("fa-floppy-disk");
      } else {
        const updatedTodo = {
          title: newTitle.value,
          category: categoryToFind,
          date: newDate.value,
        };

        const indexInTodos = todos.findIndex(
          (todo) =>
            todo.title === titleToFind &&
            todo.category === categoryToFind &&
            todo.date === dateToFind
        );

        todos[indexInTodos] = updatedTodo;
        localStorage.setItem("todos", JSON.stringify(todos));

        newTodoItem.classList.toggle("read-only");
        newTitle.readOnly = !newTitle.readOnly;
        newDate.readOnly = !newDate.readOnly;
        editButton.classList.remove("fa-floppy-disk");
        editButton.classList.add("fa-pen-to-square");
      }
    });

    deleteButton.addEventListener("click", () => {
      todos = JSON.parse(localStorage.getItem("todos")) || [];

      const indexInTodos = todos.findIndex(
        (todo) =>
          todo.title === titleToFind &&
          todo.category === categoryToFind &&
          todo.date === dateToFind
      );

      if (indexInTodos !== -1) {
        todos.splice(indexInTodos, 1);
      }

      localStorage.setItem("todos", JSON.stringify(todos));

      DisplayTodos();
      CheckIfCategoryIsEmpty();
    });
  });
  DateTodaySetting();
}

function DisplayCategories() {
  categorieOverzicht = JSON.parse(localStorage.getItem("categories")) || [];

  toDoOverview.innerHTML = "";
  chooseCategoryList.innerHTML = "";

  const toDoTitle = document.createElement("h2");
  toDoTitle.innerText = "To Do Overzicht";

  toDoOverview.appendChild(toDoTitle);

  categorieOverzicht.forEach((cat) => {
    const categoryButton = document.createElement("button");

    categoryButton.classList.add("option");
    categoryButton.type = "button";
    categoryButton.innerText = cat.category;

    chooseCategoryList.appendChild(categoryButton);

    const categoryDivMain = document.createElement("div");
    const categoryTitle = document.createElement("h4");
    const categoryDivSecundary = document.createElement("div");

    categoryDivMain.classList.add("to-do-category");
    categoryTitle.innerText = cat.category;

    categoryDivMain.appendChild(categoryTitle);
    categoryDivMain.appendChild(categoryDivSecundary);

    toDoOverview.appendChild(categoryDivMain);
  });

  const categoryOptionsIndividueel = document.querySelectorAll(".option");

  categoryOptionsIndividueel.forEach((option) => {
    option.addEventListener("click", (event) => {
      errorCategoryCannotBeEmpty.classList.add("hidden");

      let newOption = event.target.innerHTML;

      chooseCategoryButton.value = newOption;

      chooseCategoryList.classList.toggle("hidden");
      chooseCategoryButton.classList.toggle("border");
      chooseCategoryButton.classList.remove("grijs");
    });
  });

  DisplayTodos();
  CheckIfCategoryIsEmpty();
}

// C: Other functions
function DateTodaySetting() {
  const datumVandaag = new Date().toISOString().split("T")[0].toString();
  document.querySelectorAll(["#date", ".date-todo"]).forEach((x) => {
    x.setAttribute("min", datumVandaag);
  });
}

function CheckIfCategoryIsEmpty() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  const categorieOverzicht =
    JSON.parse(localStorage.getItem("categories")) || [];
  const categoryOptionsTitles = document.querySelectorAll(".to-do-category h4");

  for (let i = 0; i < categoryOptionsTitles.length; i++) {
    const category = categoryOptionsTitles[i].innerHTML;

    if (!todos.some((todo) => todo.category === category)) {
      categoryOptionsTitles[i].classList.add("red-delete");

      categoryOptionsTitles[i].addEventListener("click", (event) => {
        console.log("click");

        const indexIncategorieOverzicht = categorieOverzicht.findIndex(
          (category) => category.category === categoryOptionsTitles[i].innerHTML
        );

        if (indexIncategorieOverzicht !== -1) {
          categorieOverzicht.splice(indexIncategorieOverzicht, 1);
        }

        localStorage.setItem("categories", JSON.stringify(categorieOverzicht));

        console.log(categorieOverzicht);

        DisplayCategories();
        CheckIfCategoryIsEmpty();
      });
    } else {
      categoryOptionsTitles[i].classList.remove("red-delete");
    }
  }
}
