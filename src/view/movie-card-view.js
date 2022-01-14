import dayjs from 'dayjs';
import {humanizeDuration} from '../utils/utils';
import AbstractView from './abstract-view';

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
            <button class="film-card__controls-item ${watchlistClassName}" type="button" id="watchlist" name="watchlist">Add to watchlist</button>
            <button class="film-card__controls-item ${watchedClassName}" type="button" id="watched" name="watched">Mark as watched</button>
            <button class="film-card__controls-item ${favoriteClassName}" type="button" id="favorite" name="favorite">Mark as favorite</button>
          </div>
        </article>
  `;
};

export default class MovieCardView extends AbstractView {
  #movie = null;
  #movieLinkEl = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  get movieCardLink() {
    this.#movieLinkEl = this.element.querySelector('.film-card__link');
    return this.#movieLinkEl;
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.movieCardLink.addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  setWatchedClickHandler = (callback) => {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatched();
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlist = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlist();
  };
}
