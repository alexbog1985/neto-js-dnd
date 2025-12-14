import "./Card.css";

export class Card {
  constructor(text = "") {
    this.id = `card-${Date.now()}`;
    this.text = text;
    this.element = null
  }

  render() {
    this.element = document.createElement("div");
    this.element.className = "card";
    this.element.textContent = this.text;

    return this.element;
  }
}
