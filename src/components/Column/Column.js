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
    this.cardForm = null;
    this.isFormVisible = false;

    cardsData.forEach((cardData) => {
      this.cards.push(new Card(cardData.text));
    });
  }

  render() {
    if (this.element) {
      this.element.remove();
    }
    this.element = document.createElement("div");
    this.element.className = "column";
    this.element.dataset.columnId = this.id;

    const header = document.createElement("div");
    header.className = "column-header";

    const titleElement = document.createElement("h3");
    titleElement.className = "column-title";
    titleElement.textContent = this.title;

    header.append(titleElement);

    this.cardsContainer = document.createElement("div");
    this.cardsContainer.className = "cards-container";

    this.cardForm = document.createElement("form");
    this.cardForm.className = "add-card-form";
    this.cardForm.style.display = "none";

    const input = document.createElement("textarea");
    input.className = "add-card-input";
    input.placeholder = "Enter some text";
    input.rows = 3;

    const footer = document.createElement("div");
    footer.className = "add-card-footer";

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "add-card-submit";
    submitButton.textContent = "Add card";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "add-card-cancel";
    cancelButton.textContent = "\u2715";

    footer.append(submitButton, cancelButton);
    this.cardForm.append(input, footer);

    this.addButton = document.createElement("button");
    this.addButton.className = "add-card-button";

    const plusIcon = document.createElement("span");
    plusIcon.className = "plus-icon";
    plusIcon.textContent = "+";

    this.addButton.append(plusIcon, "Add another card");
    this.element.append(
      header,
      this.cardsContainer,
      this.addButton,
      this.cardForm,
    );

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

    this.dispatchChange();

    return newCard;
  }

  dispatchChange() {
    console.log("Column changed, dispatching event...");
    this.element.dispatchEvent(
      new CustomEvent("columnchange", { bubbles: true }),
    );
  }

  removeCard(cardId) {
    const index = this.cards.findIndex((card) => card.id === cardId);
    if (index !== -1) {
      this.cards.splice(index, 1);
      this.renderCards();
      this.dispatchChange();
    }
  }

  showForm() {
    this.addButton.style.display = "none";
    this.cardForm.style.display = "block";
    this.cardForm.querySelector(".add-card-input").focus();
    this.isFormVisible = true;
  }

  hideForm() {
    this.cardForm.style.display = "none";
    this.cardForm.querySelector("textarea").value = "";
    this.addButton.style.display = "block";
    this.isFormVisible = false;
  }

  bindEvents() {
    this.addButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.showForm();
    });

    this.cardForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = this.cardForm.querySelector(".add-card-input");
      const text = input.value.trim();
      if (text) {
        this.addCard(text);
        this.hideForm();
      }
    });

    this.cardForm
      .querySelector(".add-card-cancel")
      .addEventListener("click", () => {
        this.hideForm();
      });
  }
}
