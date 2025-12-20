import "./Board.css";
import { Column } from "../Column/Column";

export class Board {
  constructor(container) {
    this.container = container;
    this.columns = [];
    this.element = null;

    this.draggedEl = null;
    this.ghostEl = null;

    this.save = this.save.bind(this);
    this.startDnD = this.startDnD.bind(this);
    this.moveDnD = this.moveDnD.bind(this);
    this.endDnD = this.endDnD.bind(this);

    this.init();
    this.setupColumns();
    this.load();
    this.render();
    this.bindEvents();
  }

  init() {
    this.element = document.createElement("div");
    this.element.className = "board";
    this.container.append(this.element);
  }

  bindEvents() {
    this.element.addEventListener("columnchange", this.save);
    this.element.addEventListener("mousedown", this.startDnD);
  }

  setupColumns() {
    this.initialState = [
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
  }

  load() {
    const saved = localStorage.getItem("board");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.columns = data.map((d) => new Column(d.title, d.cards));
        return;
      } catch (e) {
        console.warn("invalid localStorage data", e);
      }
    }
    this.columns = this.initialState.map((d) => new Column(d.title, d.cards));
  }

  save() {
    const data = this.columns.map((column) => ({
      title: column.title,
      cards: column.cards.map((card) => ({ text: card.text })),
    }));
    localStorage.setItem("board", JSON.stringify(data));
  }

  updateCardsData() {
    this.columns.forEach((column) => {
      const columnEl = column.element;
      const cardElements = columnEl.querySelectorAll(".card");
      column.cards = Array.from(cardElements).map((el) => {
        const contentEl = el.querySelector(".card-content");
        return {
          text: contentEl ? contentEl.textContent.trim() : "",
        };
      });
    });
    this.save();
  }

  render() {
    this.element.replaceChildren();
    this.columns.forEach((column) => {
      this.element.append(column.render());
    });
  }

  startDnD(e) {
    e.preventDefault();
    if (e.target.closest(".card-delete-btn")) return;
    this.draggedEl = e.target.closest(".card");

    if (!this.draggedEl) return;

    this.ghostEl = this.draggedEl.cloneNode(true);
    this.ghostEl.classList.add("dragged");
    document.body.append(this.ghostEl);
    this.ghostEl.style.left = `${e.pageX - this.ghostEl.offsetWidth / 2}px`;
    this.ghostEl.style.top = `${e.pageY - this.ghostEl.offsetHeight / 2}px`;

    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", this.moveDnD);
    document.addEventListener("mouseup", this.endDnD);
  }

  moveDnD(e) {
    if (!this.draggedEl || !this.ghostEl) return;

    this.ghostEl.style.left = `${e.pageX - this.ghostEl.offsetWidth / 2}px`;
    this.ghostEl.style.top = `${e.pageY - this.ghostEl.offsetHeight / 2}px`;
  }

  endDnD(e) {
    if (!this.draggedEl || !this.ghostEl) return;

    this.ghostEl.remove();
    this.ghostEl = null;

    const targetColumn = e.target.closest(".column");
    console.log("target column", targetColumn);
    if (targetColumn) {
      const cardsContainer = targetColumn.querySelector(".cards-container");
      const cardElements = Array.from(cardsContainer.querySelectorAll(".card"));

      const afterElement = cardElements.reduce((closest, card) => {
        const box = card.getBoundingClientRect();
        const offset = e.clientY - box.top - box.height / 2;
        if (offset < 0 && offset > (closest ? closest.offset : -Infinity)) {
          return { offset, element: card };
        }
        return closest;
      }, null);

      if (afterElement) {
        cardsContainer.insertBefore(this.draggedEl, afterElement.element);
      } else {
        cardsContainer.append(this.draggedEl);
      }

      this.updateCardsData();

      this.draggedEl.classList.remove("dragged");
      this.draggedEl = null;

      document.body.style.userSelect = "";

      document.removeEventListener("mousemove", this.moveDnD);
      document.removeEventListener("mouseup", this.endDnD);
    }
  }
}
