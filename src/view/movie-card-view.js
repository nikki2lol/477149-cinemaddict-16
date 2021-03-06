import {MAX_DESCRIPTION_LENGTH} from '../const';
import dayjs from 'dayjs';
import {humanizeDuration} from '../utils/utils';
import SmartView from './smart-view';

const createMovieCardTemplate = ({movieData, userDetails, comments}) => {
  const {title, rating, releaseDate, runtime, genre, poster, description} = movieData;

  const watchlistClassName = userDetails.watchlist ? 'film-card__controls-item--active' : '';
  const watchedClassName = userDetails.alreadyWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = userDetails.favorite ? 'film-card__controls-item--active' : '';

  const formattedYear = dayjs(releaseDate).format('YYYY');
  const formattedDuration = humanizeDuration(runtime);
  const formattedDescription = (description.length > MAX_DESCRIPTION_LENGTH) ? `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1)}...` : description;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formattedYear}</span>
        <span class="film-card__duration">${formattedDuration}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${formattedDescription}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button name="watchlist" class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
      <button name="watched" class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
      <button name="favorite" class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class MovieCardView extends SmartView {
  constructor(movie) {
    super();
    this._data = movie;
  }

  get template() {
    return createMovieCardTemplate(this._data);
  }

  get movieData() {
    return this._data;
  }

  restoreHandlers = () => {
    this.setOpenPopupHandler(this._callback.openDetailsClick);
    this.setControlClickHandler(this._callback.controlClick);
  }

  setOpenPopupHandler = (callback) => {
    this._callback.openDetailsClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openDetailsHandler);
  }

  setControlClickHandler = (callback) => {
    this._callback.controlClick = callback;
    this.element.querySelectorAll('.film-card__controls-item').forEach((control) => {
      control.addEventListener('click', this.#controlClickHandler);
    });
  }

  #openDetailsHandler = (evt) => {
    evt.preventDefault();
    this._callback.openDetailsClick();
  }

  #controlClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.controlClick(this._data, evt.target.getAttribute('name'));
  }
}
