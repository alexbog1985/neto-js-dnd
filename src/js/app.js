import { Board } from "../components/Board/Board";

const container = document.querySelector(".container");

document.addEventListener("DOMContentLoaded", () => {
  new Board(container);
});
