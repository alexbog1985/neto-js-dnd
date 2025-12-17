import "./Card.css";

export class Card {
  constructor(text = "") {
    this.id = `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.text = text;
    this.element = null;
    this.contentElement = null;
    this.deleteButton = null;

    this.destroy = this.destroy.bind(this);
  }

  render() {
    this.element = document.createElement("div");
    this.element.className = "card";

    this.contentElement = document.createElement("div");
    this.contentElement.className = "card-content";
    this.contentElement.textContent = this.text;

    this.deleteButton = document.createElement("button");
    this.deleteButton.className = "card-delete-btn";
    this.deleteButton.setAttribute("aria-label", "Delete card");

    const deleteIcon = document.createElement("span");
    deleteIcon.className = "delete-icon";
    deleteIcon.textContent = "\u2715";
    this.deleteButton.append(deleteIcon);

    this.element.append(this.contentElement);
    this.element.append(this.deleteButton);

    this.bindEvents();

    return this.element;
  }

  bindEvents() {
    this.deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.destroy();
    });
  }

  destroy() {
    this.element?.remove();
    if (typeof this.onDestroy === "function") {
      this.onDestroy(this.id);
    }
  }
}
