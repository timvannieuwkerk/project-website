window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoForm = document.querySelector("#todo-form");

  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const categorie = document.querySelector(".categories-choose");
    const error = document.querySelector(".error");

    if (categorie.value === "Kies een categorie") {
      error.classList.remove("hidden");
      return;
    }

    const todo = {
      title: event.target.elements.title.value,
      category: event.target.elements.category.value,
      date: event.target.elements.date.value,
    };

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));

    DisplayTodos();

    const name = document.querySelector("#title");
    const categories = document.querySelector(".categories-choose");
    const date = document.querySelector("#date");

    name.value = "";
    categories.value = "Kies een categorie";
    categories.classList.add("grijs");
    date.value = "";
    date.classList.add("grijs");
  });

  DisplayTodos();

  const categoryChoose = document.querySelector(".categories-choose");

  categoryChoose.addEventListener("click", () => {
    const categoriesOptions = document.querySelector(".categories-options");
    const categoriesChoose = document.querySelector(".categories-choose");

    categoriesOptions.classList.toggle("hidden");
    categoriesChoose.classList.toggle("border");
  });

  window.onclick = function (event) {
    const categoriesOptions = document.querySelector(".categories-options");
    const categoriesChoose = document.querySelector(".categories-choose");

    if (
      !event.target.matches(".categories-choose") &&
      !categoriesOptions.classList.contains("hidden")
    ) {
      categoriesOptions.classList.add("hidden");
      categoriesChoose.classList.remove("border");
    }

    const todoItem = document.querySelectorAll(".todo-item");

    if (
      !event.target.matches([
        ".todo-item",
        ".fa-pen-to-square",
        ".date-todo",
        ".text",
        ".fa-trash-can",
      ])
    ) {
      for (let i = 0; i < todoItem.length; i++) {
        todoItem[i].classList.add("read-only");
        for (let j = 0; j < 2; j++) {
          todoItem[i].children[j].readOnly = true;
        }
      }
    }
  };

  const categoryOptionsIndividueel = document.querySelectorAll(".option");

  categoryOptionsIndividueel.forEach((option) => {
    option.addEventListener("click", (event) => {
      const error = document.querySelector(".error");
      error.classList.add("hidden");

      let newOption = event.target.innerHTML;

      const categoriesChoose = document.querySelector(".categories-choose");
      categoriesChoose.value = newOption;

      const categoriesOptions = document.querySelector(".categories-options");
      categoriesOptions.classList.toggle("hidden");
      categoriesChoose.classList.toggle("border");

      let categoryMenu = document.querySelector(".categories-menu input");

      categoryMenu.classList.remove("grijs");
    });
  });

  const dateSelector = document.querySelector("#date");

  dateSelector.addEventListener("click", (event) => {
    dateSelector.classList.remove("grijs");
  });

  const datumVandaag = new Date().toISOString().split("T")[0].toString();

  document.querySelector("#date").setAttribute("min", datumVandaag);
});

function DisplayTodos() {
  const projectList1 = document.querySelector(".project-1");
  const projectList2 = document.querySelector(".project-2");

  projectList1.innerHTML = "";
  projectList2.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    const title = document.createElement("input");
    const date = document.createElement("input");
    const edit = document.createElement("i");
    const deleteItem = document.createElement("i");

    todoItem.classList.add("todo-item");
    todoItem.classList.add("read-only");
    title.classList.add("text");
    date.classList.add("date-todo");
    edit.classList.add("fa-solid", "fa-pen-to-square");
    deleteItem.classList.add("fa-regular", "fa-trash-can");

    title.value = todo.title;
    date.value = todo.date;

    date.type = "date";

    title.readOnly = "readonly";
    date.readOnly = "readonly";

    todoItem.appendChild(title);
    todoItem.appendChild(date);
    todoItem.appendChild(edit);
    todoItem.appendChild(deleteItem);

    if (todo.category === "Thuis") {
      projectList1.appendChild(todoItem);
    } else if (todo.category === "Werk") {
      projectList2.appendChild(todoItem);
    }
  });

  const editButton = document.querySelectorAll(".fa-pen-to-square");
  const todoItem = document.querySelectorAll(".todo-item");

  editButton.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      todoItem[index].classList.toggle("read-only");
      if (
        (event.target.parentElement.children[0].readOnly = event.target
          .parentElement.children[0].readOnly
          ? false
          : true)
      );
      if (
        (event.target.parentElement.children[1].readOnly = event.target
          .parentElement.children[1].readOnly
          ? false
          : true)
      );
    });
  });

  const deleteButton = document.querySelectorAll(".fa-trash-can");

  deleteButton.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      todos = JSON.parse(localStorage.getItem("todos")) || [];

      const titleToFind = event.target.parentElement.children[0].value;
      const dateToFind = event.target.parentElement.children[1].value;

      const gevondenIndex = todos.findIndex(
        (todo) => todo.title === titleToFind && todo.date === dateToFind
      );

      todos.splice(gevondenIndex, 1);

      localStorage.setItem("todos", JSON.stringify(todos));

      DisplayTodos();
    });
  });
}
