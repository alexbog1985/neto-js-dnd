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
    this.cardsContainer = this.container.querySelector(".cards-container");

    this.element.addEventListener("columnchange", this.save);
    this.element.addEventListener("mousedown", this.startDnD);
    this.element.addEventListener("mousemove", this.moveDnD);
    this.element.addEventListener("mouseleave", this.leaveDnD);
  }

  startDnD(e) {
    if (e.target.closest(".card-delete-btn")) return;
    this.draggedEl = e.target.closest(".card");

    if (!this.draggedEl) return;

    this.ghostEl = this.draggedEl.cloneNode(true);
    this.ghostEl.classList.add("dragged");
    document.body.append(this.ghostEl);
    this.ghostEl.style.left = `${e.pageX - this.ghostEl.offsetWidth / 2}px`;
    this.ghostEl.style.top = `${e.pageY - this.ghostEl.offsetWeight / 2}px`;
  }

  moveDnD(e) {
    e.preventDefault();
    if (!this.draggedEl) return;

    this.ghostEl.style.left = `${e.pageX - this.ghostEl.offsetWidth / 2}px`
    this.ghostEl.style.top = `${e.pageY - this.ghostEl.offsetHeight / 2}px`
  }

  leaveDnD(e) {
    if (!this.draggedEl) return;
    this.ghostEl = null;
    this.draggedEl = null;
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

  render() {
    this.element.replaceChildren();
    this.columns.forEach((column) => {
      this.element.append(column.render());
    });
  }
}
