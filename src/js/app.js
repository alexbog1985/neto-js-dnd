import { Column } from "../components/Column/Column";

const container = document.querySelector(".container");

const columnsData = [
  {
    title: "To Do",
    cards: [{ text: "Task 1" }, { text: "Task 2" }],
  },
  {
    title: "In Progress",
    cards: [{ text: "task 3" }],
  },
  {
    title: "Done",
    cards: [{ text: "task 4" }, { text: "task 5" }],
  },
];

columnsData.forEach((columnData) => {
  const column = new Column(columnData.title, columnData.cards);
  container.append(column.render());
});
