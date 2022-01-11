import dayjs from 'dayjs';
import {humanizeDuration} from '../utils/utils';
import SmartView from './smart-view';

const createMovieCardTemplate = (movie) => {
  const {
    movieData: {
      title,
      rating,
      posterPath,
      releaseDate,
      duration,
      genres,
      description,
      comments
    },
    userData: {
      isInWatchlist: isInWatchlist,
      isAlreadyWatched: isWatched,
      isFavorite: isFavorite,
    },
  } = movie;

  const formattedYear = dayjs(releaseDate).format('YYYY');
  const formattedDuration = humanizeDuration(duration);
  const formattedDescription = (description.length > 140) ? `${description.slice(0, 139)}...` : description;

  const watchlistClassName = isInWatchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const watchedClassName = isWatched
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';

  const favoriteClassName = isFavorite
    ? 'film-card__controls-item--favorite film-card__controls-item--active'
    : 'film-card__controls-item--favorite';


  return `<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${formattedYear}</span>
              <span class="film-card__duration">${formattedDuration}</span>
              <span class="film-card__genre">${genres[0]}</span>
            </p>
            <img src="./images/posters/${posterPath}" alt="${title}" class="film-card__poster">
            <p class="film-card__description">${formattedDescription}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item ${watchlistClassName}" type="button" name="watchlist" >Add to watchlist</button>
            <button class="film-card__controls-item ${watchedClassName}" type="button" name="watched" >Mark as watched</button>
            <button class="film-card__controls-item ${favoriteClassName}" type="button" name="favorite" >Mark as favorite</button>
          </div>
        </article>
  `;
};

export default class MovieCardView extends SmartView{
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
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openPopupHandler);
  }

  setControlClickHandler = (callback) => {
    this._callback.controlClick = callback;
    this.element.querySelectorAll('.film-card__controls-item').forEach((control) => {
      control.addEventListener('click', this.#controlClickHandler);
    });
  }

  #openPopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.openDetailsClick();
  }

  #controlClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.controlClick(this._data, evt.target.getAttribute('name'));
  }
}
