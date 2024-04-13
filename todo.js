window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
  const todoForm = document.querySelector("#todo-form");

  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const todo = {
      title: event.target.elements.title.value,
      category: event.target.elements.category.value,
      date: event.target.elements.date.value,
    };

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));

    DisplayTodos();
  });

  DisplayTodos();
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

    todoItem.classList.add("todo-item");
    todoItem.classList.add("read-only");
    title.classList.add("text");
    date.classList.add("date-todo");

    title.value = todo.title;
    date.value = todo.date;

    date.type = "date";

    title.readOnly = "readonly";
    date.readOnly = "readonly";

    todoItem.appendChild(title);
    todoItem.appendChild(date);

    if (todo.category === "Project 1") {
      projectList1.appendChild(todoItem);
    } else if (todo.category === "Project 2") {
      projectList2.appendChild(todoItem);
    }
  });
}
