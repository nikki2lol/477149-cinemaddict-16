import SmartView from './smart-view';
import {UpdateType} from '../const';
import {filter} from '../utils/filter';

const getUserRank = (count) => {
  let userRank;

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

const createRankTemplate = (count) => `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(count)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;

export default class RankView extends SmartView{
  #count = null;
  #moviesModel = null;

  constructor(moviesModel) {
    super();
    this.#moviesModel = moviesModel;
    this.#count = filter.history(this.#moviesModel.movies).length;
    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  get template() {
    return createRankTemplate(this.#count);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MINOR) {
      this.#count = filter.history(this.#moviesModel.movies).length;
      this.updateData({});
    }
  }

  restoreHandlers = () => {}
}
