import "./Column.css";
import { Card } from "../Card/Card";

export class Column {
  constructor(title = "", cardsData = []) {
    this.id = `column-${Date.now()}`;
    this.title = title;
    this.cards = [];
    this.element = null;
    this.cardsContainer = null;
    this.addButton = null;

    cardsData.forEach((cardData) => {
      this.cards.push(new Card(cardData.text));
    });
  }

  render() {
    this.element = document.createElement("div");
    this.element.className = "column";
    this.element.dataset.columnId = this.id;

    const header = document.createElement("div");
    header.className = "column-header";

    const titleElement = document.createElement("h3");
    titleElement.className = "column-title";
    titleElement.textContent = this.title;

    const cardCount = document.createElement("span");
    cardCount.className = "card-count";
    cardCount.textContent = this.cards.length;

    header.append(titleElement, cardCount);

    this.cardsContainer = document.createElement("div");
    this.cardsContainer.className = "cards-container";

    this.addButton = document.createElement("button");
    this.addButton.className = "add-card-button";

    const plusIcon = document.createElement("span");
    plusIcon.className = "plus-icon";
    plusIcon.textContent = "+";

    this.addButton.append(plusIcon, "Add another card");
    this.element.append(header, this.cardsContainer, this.addButton);

    this.renderCards();
    this.bindEvents();

    return this.element;
  }

  renderCards() {
    if (!this.cardsContainer) return;

    this.cardsContainer.replaceChildren();

    this.cards.forEach((card) => {
      card.onDestroy = (cardId) => {
        this.removeCard(cardId);
      };
      this.cardsContainer.append(card.render());
    });

    this.updateCardCount();
  }

  updateCardCount() {
    const cardCount = this.element.querySelector(".card-count");
    if (cardCount) {
      cardCount.textContent = this.cards.length;
    }
  }

  addCard(text) {
    const newCard = new Card(text);

    newCard.onDestroy = (cardId) => {
      this.removeCard(cardId);
    };

    this.cards.push(newCard);

    if (this.cardsContainer) {
      this.cardsContainer.append(newCard.render());
    }

    this.updateCardCount();
    return newCard;
  }

  removeCard(cardId) {
    const index = this.cards.findIndex((card) => card.id === cardId);
    if (index >= 0) {
      this.cards.splice(index, 1);
      this.updateCardCount();
    }
  }

  bindEvents() {
    if (!this.addButton) return;

    this.addButton.addEventListener("click", () => {
      const text = prompt("Enter card text: ");

      if (text?.trim()) {
        this.addCard(text.trim());
      }
    });
  }
}
