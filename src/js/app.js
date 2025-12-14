import { Card } from "../components/Card/Card";

const container = document.querySelector(".container");

const testCard = new Card("Тестовая карточка 1");
const testCard2 = new Card("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae eos, exercitationem fugit id ipsum minus necessitatibus quidem! Distinctio dolore iste optio vel veritatis voluptas. Itaque nemo odio quae quia sunt!");
const testCard3 = new Card("Тестовая карточка 3");

container.appendChild(testCard.render());
container.appendChild(testCard2.render());
container.appendChild(testCard3.render());


