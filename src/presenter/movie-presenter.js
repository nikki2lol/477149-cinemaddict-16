import { render, replace, remove } from '../utils/render.js';
import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view';
import SmartView from '../view/smart-view';

export default class MoviePresenter {
  #filmsListComponent = null;
  #changeData = null;
  #removePrevPopup = null;
  #movieCardComponent = null;
  #moviePopupComponent = null;
  #movie = null;

  constructor(filmListComponent, changeData, removePrevPopup) {
    this.#filmsListComponent = filmListComponent;
    this.#changeData = changeData;
    this.#removePrevPopup = removePrevPopup;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevMovieCardComponent = this.#movieCardComponent;
    const prevMoviePopupComponent = this.#moviePopupComponent;

    this.#movieCardComponent = new MovieCardView(movie);
    this.#moviePopupComponent = new PopupView(movie);

    this.#movieCardComponent.setEditClickHandler(this.#replaceCardToPopup);
    this.#moviePopupComponent.setCloseClickHandler(() => {
      this.#moviePopupComponent.reset(this.#movie);
      this.#replacePopupToCard();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    this.#movieCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#movieCardComponent.setWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#movieCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#moviePopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#moviePopupComponent.setWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#moviePopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    if (prevMovieCardComponent === null || prevMoviePopupComponent === null) {
      render(this.#filmsListComponent.container, this.#movieCardComponent);
      return;
    }

    if (this.#filmsListComponent.element.contains(prevMovieCardComponent.element)) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }

    if (document.body.contains(prevMoviePopupComponent.element)) {
      const scrollPosition = prevMoviePopupComponent.element.scrollTop;
      replace(this.#moviePopupComponent, prevMoviePopupComponent);
      this.#moviePopupComponent.element.scrollTop = scrollPosition;
    }

    remove(prevMovieCardComponent);
    remove(prevMoviePopupComponent);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#moviePopupComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape'  || evt.key === 'Esc') {
      evt.preventDefault();
      this.#moviePopupComponent.reset(this.#movie);
      this.#replacePopupToCard();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #replacePopupToCard = () => {
    const popup = this.#moviePopupComponent instanceof SmartView ? this.#moviePopupComponent.element : this.#moviePopupComponent;
    document.body.removeChild(popup);
    document.body.classList.remove('hide-overflow');
  };

  #replaceCardToPopup = () => {
    this.#removePrevPopup();
    const popup = this.#moviePopupComponent instanceof SmartView ? this.#moviePopupComponent.element : this.#moviePopupComponent;
    document.body.appendChild(popup);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #handleFavoriteClick = () => {
    this.#changeData({
      ...this.#movie,
      userData: {
        isInWatchlist: this.#movie.userData.isInWatchlist,
        isAlreadyWatched: this.#movie.userData.isAlreadyWatched,
        isFavorite: !this.#movie.userData.isFavorite,
      },
    });
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData({
      ...this.#movie,
      userData: {
        isInWatchlist: this.#movie.userData.isInWatchlist,
        isAlreadyWatched: !this.#movie.userData.isAlreadyWatched,
        isFavorite: this.#movie.userData.isFavorite,
      },
    });
  };

  #handleWatchlistClick = () => {
    this.#changeData({
      ...this.#movie,
      userData: {
        isInWatchlist: !this.#movie.userData.isInWatchlist,
        isAlreadyWatched: this.#movie.userData.isAlreadyWatched,
        isFavorite: this.#movie.userData.isFavorite,
      },
    });
  };
}
