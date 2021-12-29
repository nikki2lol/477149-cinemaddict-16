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
  #filmsComponents = new Map();
  #movies = [];
  #sourcedMovies = [];

  constructor (listHolder) {
    this.#listHolder = listHolder;
  }

  init = (movies) => {
    this.#movies = [...movies];
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
    this.#renderFilmsList();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#listHolder, this.#sortComponent, RenderPosition.AFTEREND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #clearMoviesList = () => {
    this.#filmsComponents.forEach((component) => remove(component));
    this.#filmsComponents.clear();
    this.#renderedFilmCount = moviesConst.MOVIES_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #renderFilms = () => {
    if (this.#movies.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsListContainer();
    this.#renderFilmsList();
  }

  #renderFilmsListContainer = () => {
    const filmList = document.querySelector('.films-list');
    this.#filmsListContainerComponent = new MovieListContainerView();
    render(filmList, this.#filmsListContainerComponent);
  }

  #renderFilmsList = () => {
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

  #renderPopup = (movie) => {
    const body = document.querySelector('body');
    const footerElement = document.querySelector('.footer');

    this.#popupComponent = new PopupView(movie);

    const closeButton = this.#popupComponent.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', () => {
      this.#closePopup();
    });

    const handlePopupAddToWatchList = () => {
      this.#updateMovie({...movie,  userData: {...movie.userData, isInWatchlist: !movie.userData.isInWatchlist}});
    };

    const handlePopupAlreadyWatchedClick = () => {
      this.#updateMovie({...movie,  userData: {...movie.userData, isAlreadyWatched: !movie.userData.isAlreadyWatched}});
    };

    const handlePopupFavoriteClick = () => {
      this.#updateMovie({...movie,  userData: {...movie.userData, isFavorite: !movie.userData.isFavorite}});
    };

    this.#popupComponent.setAddToWatchClickHandler(handlePopupAddToWatchList);
    this.#popupComponent.setAlreadyWatchedClickHandler(handlePopupAlreadyWatchedClick);
    this.#popupComponent.setAddToFavoriteClickHandler(handlePopupFavoriteClick);

    render(footerElement, this.#popupComponent, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #renderMovie = (movie) => {
    const prevFilmComponent = this.#filmsComponents.get(movie.id);
    const filmCardComponent = new MovieCardView(movie);

    this.#filmsComponents.set(movie.id, filmCardComponent);

    const handleMovieCardClick = () => {
      this.#closePopup();
      this.#renderPopup(movie);
    };

    const handleAddToWatchListClick = () => {
      this.#updateMovie({...movie,  userData: {...movie.userData, isInWatchlist: !movie.userData.isInWatchlist}});
    };

    const handleAlreadyWatchedClick = () => {
      this.#updateMovie({...movie,  userData: {...movie.userData, isAlreadyWatched: !movie.userData.isAlreadyWatched}});
    };

    const handleAddToFavoriteClick = () => {
      this.#updateMovie({...movie,  userData: {...movie.userData, isFavorite: !movie.userData.isFavorite}});
    };

    filmCardComponent.setFilmCardClickHandler(handleMovieCardClick);
    filmCardComponent.setAddToWatchClickHandler(handleAddToWatchListClick);
    filmCardComponent.setAlreadyWatchedClickHandler(handleAlreadyWatchedClick);
    filmCardComponent.setAddToFavoriteClickHandler(handleAddToFavoriteClick);

    if (!prevFilmComponent) {
      render(this.#filmsListContainerComponent, filmCardComponent, RenderPosition.BEFOREEND);
    } else {
      replace(filmCardComponent, prevFilmComponent);
      remove(prevFilmComponent);

      if (!(this.#popupComponent === null)) {
        this.#closePopup();
        this.#renderPopup(movie);
      }
    }
  }


  #renderNoFilms = () => {
    const filmList = this.#filmsComponent.element.querySelector('.films-list');
    render(filmList, this.#noFilmsComponent, RenderPosition.AFTERBEGIN);
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
