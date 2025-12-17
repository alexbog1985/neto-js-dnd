import "./Board.css";
import { Column } from "../Column/Column";

export class Board {
  constructor(container) {
    this.container = container;
    this.columns = [];
    this.element = null;

    this.save = this.save.bind(this);

    this.init();
    this.setupColumns();
    this.load();
    this.render();
    this.eventListeners();
  }

  init() {
    this.element = document.createElement("div");
    this.element.className = "board";
    this.container.append(this.element);
  }

  eventListeners() {
    this.element.addEventListener("columnchange", this.save);
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
    this.columns = this.initialState.map(d => new Column(d.title, d.cards));
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
