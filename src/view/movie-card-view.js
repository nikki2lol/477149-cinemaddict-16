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
            <button class="film-card__controls-item ${watchlistClassName}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item ${watchedClassName}" type="button">Mark as watched</button>
            <button class="film-card__controls-item ${favoriteClassName}" type="button">Mark as favorite</button>
          </div>
        </article>
  `;
};

export default class MovieCardView extends AbstractView{
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  setFilmCardClickHandler = (callback) => {
    this._callback.openPopup = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#filmCardClickHandler);
  }

  #filmCardClickHandler = () => {
    this._callback.openPopup();
  }

  setAddToWatchClickHandler = (callback) => {
    this._callback.addToWatch = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addtoWatchListClickHandler);
  }

  #addtoWatchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToWatch();
  }

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  }

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatched();
  }

  setAddToFavoriteClickHandler = (callback) => {
    this._callback.addToFavorite = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#addToFavoriteClickHandler);
  }

  #addToFavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToFavorite();
  }
}
