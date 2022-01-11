import MovieListContainerView from '../view/movie-list-container-view';
import MovieListView from '../view/movie-list-view';
import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view';
import StatsView from '../view/stats-view';
import SortView from '../view/sort-view';
import LoadMoreButtonView from '../view/load-more-button-view';
import ListEmptyView from '../view/list-empty-view';
import {moviesConst, SortType} from '../const';
import {render, RenderPosition, remove, replace} from '../utils/render';
import {sortByDate, sortByRating, updateItem} from '../utils/utils';

export default class MovieListPresenter {
  #listHolder = null;
  #filmsComponent = null;
  #filmsListContainerComponent = null;
  #sortComponent = null;
  #popupComponent = null;
  #noFilmsComponent = new ListEmptyView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #renderedFilmCount = moviesConst.MOVIES_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #moviesComponents = new Map();
  #movies = [];
  #comments = [];
  #sourcedMovies = [];

  constructor (listHolder) {
    this.#listHolder = listHolder;
  }

  init = (movies, comments) => {
    this.#movies = [...movies];
    this.#comments = [...comments];
    this.#sourcedMovies = [...movies];

    this.#filmsComponent = new MovieListView(this.#movies);
    render(this.#listHolder, this.#filmsComponent, RenderPosition.AFTEREND);
    this.#renderFilms(this.#filmsListContainerComponent);
    this.#renderStats(this.#movies.length);
  }

  #sortMovies = (sortType) => {
    switch(sortType) {
      case SortType.DATE:
        this.#movies.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#movies.sort(sortByRating);
        break;
      default:
        this.#movies = this.#sourcedMovies;
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearMoviesList();
    remove(this.#sortComponent);
    this.#renderSort(this.#currentSortType);
    this.#renderMoviesList();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#listHolder, this.#sortComponent, RenderPosition.AFTEREND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #clearMoviesList = () => {
    this.#moviesComponents.forEach((component) => remove(component));
    this.#moviesComponents.clear();
    this.#renderedFilmCount = moviesConst.MOVIES_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #renderPopup = (movie) => {
    const body = document.querySelector('body');
    const footerElement = document.querySelector('.footer');

    const comments = this.#comments.filter((comment) => movie.comments.includes(comment.id));
    this.#popupComponent = new PopupView(movie, comments);

    const closeButton = this.#popupComponent.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', () => {
      this.#closePopup();
    });

    render(footerElement, this.#popupComponent, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#popupComponent.setCloseDetailsHandler(this.#closePopup);
    this.#popupComponent.setControlClickHandler(this.#handleControlClick);
  }

  #closePopup = () => {
    if (this.#popupComponent === null) {
      return;
    }
    const body = document.querySelector('body');
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    remove(this.#popupComponent);
    this.#popupComponent = null;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleFilmChange = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    const filmCard = this.#moviesComponents.get(updatedMovie.id);

    if (filmCard) {
      filmCard.updateData(updatedMovie);
    }

    if (this.#popupComponent !== null && this.#popupComponent.movieData.id === updatedMovie.id) {
      this.#popupComponent.updateData(updatedMovie);
    }
  }

  #handleControlClick = (movie, buttonType) => {
    let updatedMovie = null;

    if (buttonType === 'watchlist') {
      updatedMovie = {...movie, userData: {...movie.userData, isInWatchlist: !movie.userData.isInWatchlist}};
    }

    if (buttonType === 'watched') {
      updatedMovie = {...movie, userData: {...movie.userData, isAlreadyWatched: !movie.userData.isAlreadyWatched}};
    }

    if (buttonType === 'favorite') {
      updatedMovie = {...movie, userData: {...movie.userData, isFavorite: !movie.userData.isFavorite}};
    }

    this.#handleFilmChange(updatedMovie);
  }

  #renderMovie = (movie) => {
    const prevFilmComponent = this.#moviesComponents.get(movie.id);
    const movieCardComponent = new MovieCardView(movie);

    this.#moviesComponents.set(movie.id, movieCardComponent);

    if (!prevFilmComponent) {
      render(this.#filmsListContainerComponent, movieCardComponent, RenderPosition.BEFOREEND);
    } else {
      replace(movieCardComponent, prevFilmComponent);
      remove(prevFilmComponent);

      if (!(this.#popupComponent === null)) {
        this.#closePopup();
        this.#renderPopup(movie);
      }
    }
  }


  #renderFilms = () => {
    if (this.#movies.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderMoviesListContainer();
    this.#renderMoviesList();
  }

  #renderMoviesListContainer = () => {
    const movieList = document.querySelector('.films-list');
    this.#filmsListContainerComponent = new MovieListContainerView();
    render(movieList, this.#filmsListContainerComponent);
  }

  #renderMoviesList = () => {
    this.#renderEnoughMovies(0, Math.min(this.#movies.length, moviesConst.MOVIES_COUNT_PER_STEP));

    if (this.#movies.length > moviesConst.MOVIES_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderEnoughMovies = (from, to) => {
    this.#movies
      .slice(from, to)
      .forEach((movie) => this.#renderMovie(movie));
  }

  #updateMovie = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#sourcedMovies = updateItem(this.#sourcedMovies, updatedMovie);
    this.#renderMovie(updatedMovie);
  }

  #renderNoFilms = () => {
    const movieList = this.#filmsComponent.element.querySelector('.films-list');
    render(movieList, this.#noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  #renderStats = () => {
    const footer = document.querySelector('.footer');
    render(footer, new StatsView(this.#movies.length));
  }

  #handleShowMoreButtonClick = () => {
    this.#renderEnoughMovies(this.#renderedFilmCount, this.#renderedFilmCount + moviesConst.MOVIES_COUNT_PER_STEP);
    this.#renderedFilmCount += moviesConst.MOVIES_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.#movies.length) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmsListContainerComponent, this.#loadMoreButtonComponent, RenderPosition.AFTEREND);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }
}
