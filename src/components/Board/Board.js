import "./Board.css";
import { Column } from "../Column/Column";

export class Board {
  constructor(container) {
    this.container = container;
    this.columns = [];
    this.element = null;

    this.draggedEl = null;
    this.ghostEl = null;
    this.insertionMarker = null;

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

  findInsertionElement(cardsContainer, clientY) {
    const cardElements = cardsContainer.querySelectorAll(".card");
    let closest = null;
    let closestOffset = -Infinity;

    cardElements.forEach((card) => {
      const box = card.getBoundingClientRect();
      const offset = clientY - box.top - box.height / 2;
      if (offset < 0 && offset > closestOffset) {
        closest = card;
        closestOffset = offset;
      }
    });

    return closest;
  }

  startDnD(e) {
    if (!e.target.closest(".card")) return;
    e.preventDefault();
    if (e.target.closest(".card-delete-btn")) return;
    this.draggedEl = e.target.closest(".card");

    if (!this.draggedEl) return;

    this.ghostEl = this.draggedEl.cloneNode(true);
    this.ghostEl.classList.add("dragged");

    const rect = this.draggedEl.getBoundingClientRect();

    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;

    this.ghostEl.style.width = `${rect.width}px`;
    this.ghostEl.style.height = `${rect.height}px`;
    document.body.append(this.ghostEl);

    this.ghostEl.style.left = `${e.clientX - this.offsetX}px`;
    this.ghostEl.style.top = `${e.clientY - this.offsetY}px`;

    this.insertionMarker = document.createElement("div");
    this.insertionMarker.className = "insertion-marker";
    this.insertionMarker.style.height = `${rect.height}px`;

    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", this.moveDnD);
    document.addEventListener("mouseup", this.endDnD);
  }

  moveDnD(e) {
    if (!this.draggedEl || !this.ghostEl) return;

    this.ghostEl.style.left = `${e.clientX - this.offsetX}px`;
    this.ghostEl.style.top = `${e.clientY - this.offsetY}px`;

    this.insertionMarker.remove();

    const targetColumn = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".column");
    if (!targetColumn) return;

    const cardsContainer = targetColumn.querySelector(".cards-container");
    const afterElement = this.findInsertionElement(cardsContainer, e.clientY);

    if (afterElement) {
      cardsContainer.insertBefore(this.insertionMarker, afterElement);
    } else {
      cardsContainer.append(this.insertionMarker);
    }
  }

  endDnD(e) {
    if (!this.draggedEl || !this.ghostEl) return;

    this.ghostEl.remove();
    this.ghostEl = null;

    if (this.insertionMarker) {
      this.insertionMarker.remove();
      this.insertionMarker = null;
    }

    const target = document.elementFromPoint(e.clientX, e.clientY);
    const targetColumn = target?.closest(".column");
    if (targetColumn) {
      const cardsContainer = targetColumn.querySelector(".cards-container");
      const afterElement = this.findInsertionElement(cardsContainer, e.clientY);

      if (afterElement) {
        cardsContainer.insertBefore(this.draggedEl, afterElement);
      } else {
        cardsContainer.append(this.draggedEl);
      }

      this.updateCardsData();
    }

    this.draggedEl.classList.remove("dragged");
    this.draggedEl = null;
    this.ghostEl = null;
    this.insertionMarker = null;

    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    document.removeEventListener("mousemove", this.moveDnD);
    document.removeEventListener("mouseup", this.endDnD);
  }
}
