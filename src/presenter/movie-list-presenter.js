import {moviesConst, SortType} from '../const';
import {render, RenderPosition, remove} from '../utils/render';
import {sortByDate, sortByRating, updateItem} from '../utils/utils';
import MoviesBoardView from '../view/movies-board-view';
import MovieListView from '../view/movie-list-view';
import StatsView from '../view/stats-view';
import SortView from '../view/sort-view';
import LoadMoreButtonView from '../view/load-more-button-view';
import ListEmptyView from '../view/list-empty-view';
import MoviePresenter from './movie-presenter';
import FilterView from '../view/filter-view';

export default class MovieListPresenter {
  #mainContainer = null;

  #noFilmComponent = new ListEmptyView();
  #sortComponent = new SortView();
  #filmsComponent = new MoviesBoardView();
  #filmsListComponent = new MovieListView();
  #showMoreButtonComponent = new LoadMoreButtonView();
  #renderedFilmsCount = moviesConst.MOVIES_COUNT_PER_STEP;
  #moviesList = [];
  #filters = [];
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedMovies = [];

  constructor(main) {
    this.#mainContainer = main;
  }

  init = (moviesList, filters) => {
    this.#moviesList = [...moviesList];
    this.#filters = [...filters];
    this.#sourcedMovies = [...moviesList];

    render(this.#mainContainer, new FilterView(filters));
    render(this.#mainContainer, this.#filmsComponent);

    this.#renderFilmsBoard();
  };

  #renderNoFilm = () => {
    render(this.#filmsComponent, this.#noFilmComponent);
  };

  #handleFilmChange = (updatedFilm) => {
    this.#moviesList = updateItem(this.#moviesList, updatedFilm);
    this.#sourcedMovies = updateItem(this.#sourcedMovies, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  };

  #sortMovies = (sortType) => {
    switch(sortType) {
      case SortType.DATE:
        this.#moviesList.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#moviesList.sort(sortByRating);
        break;
      default:
        this.#moviesList = this.#sourcedMovies;
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearFilmsList();
    this.#renderFilmsList();
  };

  #renderSort = () => {
    render(this.#filmsComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmsCount = moviesConst.MOVIES_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #removePopup = () => {
    if (document.body.querySelector('.film-details')) {
      document.body.querySelector('.film-details').remove();
    }
  };

  #renderFilmsList = () => {
    this.#renderFilms(0, Math.min(this.#moviesList.length, moviesConst.MOVIES_COUNT_PER_STEP));

    if (this.#moviesList.length > moviesConst.MOVIES_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderFilm = (movie) => {
    const moviePresenter = new MoviePresenter(this.#filmsListComponent, this.#handleFilmChange, this.#removePopup);
    moviePresenter.init(movie);
    this.#filmPresenter.set(movie.id, moviePresenter);
  };

  #renderFilms = (from, to) => {
    this.#moviesList.slice(from, to).forEach((boardFilm) => this.#renderFilm(boardFilm));
  };

  #handleShowMoreButtonClick = () => {
    this.#moviesList.slice(this.#renderedFilmsCount, this.#renderedFilmsCount + moviesConst.MOVIES_COUNT_PER_STEP).forEach((movie) => this.#renderFilm(movie));
    this.#renderedFilmsCount += moviesConst.MOVIES_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#moviesList.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderShowMoreButton = () => {
    render(this.#filmsListComponent, this.#showMoreButtonComponent);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderFilmsBoard = () => {
    if (this.#moviesList.length === 0) {
      this.#renderNoFilm();
    } else {
      this.#renderSort();
      render(this.#filmsComponent, this.#filmsListComponent);
      this.#renderFilmsList();
      this.#renderStats();
    }
  };

  #renderStats = () => {
    const footer = document.querySelector('.footer');
    render(footer, new StatsView(this.#moviesList.length));
  }
}
