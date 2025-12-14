import { Card } from "../components/Card/Card";

const container = document.querySelector(".container");

const testCard = new Card("Тестовая карточка 1");

container.appendChild(testCard.render());

