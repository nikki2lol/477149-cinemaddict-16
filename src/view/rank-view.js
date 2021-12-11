import {createElement} from '../render.js';

const getUserRank = (count) => {
  let userRank = null;

  if (count >= 21) {
    userRank = 'Movie Buff';
  } else if (count >= 11 && count < 21) {
    userRank = 'Fan';
  } else if (count >= 1 && count < 11) {
    userRank = 'Novice';
  } else {
    userRank = '';
  }
  return userRank;
};

const createRankTemplate = (counter) => {
  const userRank = getUserRank(counter);
  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class RankView {
  #element = null;
  #counter = null;

  constructor(counter) {
    this.#counter = counter;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createRankTemplate(this.#counter);
  }

  removeElement() {
    this.#element = null;
  }
}
