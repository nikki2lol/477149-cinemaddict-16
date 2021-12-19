import dayjs from 'dayjs';
import {humanizeDuration} from '../utils';
import {createElement} from '../render';

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
    },
    userData: {
      isInWatchlist,
      isWatched,
      isFavorite,
    },
    comments
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


export default class MovieCardView {
  #element = null;
  #movie = null;

  constructor(movie) {
    this.#movie = movie;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  removeElement() {
    this.#element = null;
  }
}
