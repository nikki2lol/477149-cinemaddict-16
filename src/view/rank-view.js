import AbstractView from './abstract-view';

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

export default class RankView extends AbstractView{
  #counter = null;

  constructor(counter) {
    super();
    this.#counter = counter;
  }

  get template() {
    return createRankTemplate(this.#counter);
  }

}
