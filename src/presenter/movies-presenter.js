import {
  ActionType,
  FilterType,
  MOVIES_COUNT_PER_STEP,
  NoTasksTextContent,
  SortType, TITLE_SECTION_COMMENTED,
  TITLE_SECTION_MAIN,
  TITLE_SECTION_TOP,
  UpdateType,
  State, TITLE_SECTION_LOADING
} from '../const';
import {render, RenderPosition, remove} from '../utils/render';
import {getSortedMovies} from '../utils/utils';
import {filter} from '../utils/filter';
import MoviesBoardView from '../view/movies-board-view';
import MovieListView from '../view/movie-list-view';
import SortView from '../view/sort-view';
import LoadMoreButtonView from '../view/load-more-button-view';
import MoviesListContainerView from '../view/movie-list-container-view';
import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view';

export default class MoviesPresenter {
  #boardContainer = null;
  #moviesModel = null;
  #commentsModel = null;
  #filterModel = null;
  #boardComponent = new MoviesBoardView();
  #showMoreButtonComponent = new LoadMoreButtonView();
  #filmsContainerComponent = new MoviesListContainerView();
  #filmsListComponent = new MovieListView(TITLE_SECTION_MAIN);
  #topMoviesComponent = new MovieListView(TITLE_SECTION_TOP);
  #commentedMoviesComponent = new MovieListView(TITLE_SECTION_COMMENTED);
  #loadingComponent = new MovieListView(TITLE_SECTION_LOADING);
  #moviePopupComponent = null;
  #noFilmsComponent = null;
  #sortComponent = null;
  #renderedCardsCount = MOVIES_COUNT_PER_STEP;
  #renderedCards = new Map;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(container, moviesModel, commentsModel, filterModel) {
    this.#boardContainer = container;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[this.#filterType](movies);

    return this.#currentSortType === SortType.DEFAULT ? filteredMovies : getSortedMovies(filteredMovies, this.#currentSortType);
  }

  init = () => {
    render(this.#boardContainer, this.#boardComponent);

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetRenderedCount: true, resetSortType: true});

    remove(this.#loadingComponent);
    remove(this.#boardComponent);

    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #handleSortTypeChange = (newSort) => {
    if (this.#currentSortType === newSort) {
      return;
    }

    this.#currentSortType = newSort;
    this.#clearFullList();
    this.#renderFullList();

  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#boardComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderCard = (container, movie) => {
    const cardComponent = new MovieCardView(movie);
    render(container, cardComponent);

    cardComponent.setOpenPopupHandler(() => {
      this.#replaceCardToPopup(cardComponent.movieData);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      document.addEventListener('keydown', this.#enterKeyDownHandler);
    });

    cardComponent.setControlClickHandler(this.#handleControlClick);

    return cardComponent;
  }

  #renderCards = (movies) => {
    movies.forEach((movie) => {
      const movieCard = this.#renderCard(this.#filmsContainerComponent, movie);
      this.#renderedCards.set(movie.id, movieCard);
    });
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new MovieListView(NoTasksTextContent[this.#filterType]);
    render(this.#boardComponent, this.#noFilmsComponent);
  }

  #handleMoreButtonClick = () => {
    const filmsCount = this.movies.length;
    const newRenderedCount = Math.min(filmsCount, this.#renderedCardsCount + MOVIES_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedCardsCount, newRenderedCount);

    this.#renderCards(movies);
    this.#renderedCardsCount = newRenderedCount;

    if (this.#renderedCardsCount >= filmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#filmsListComponent, this.#showMoreButtonComponent);
    this.#showMoreButtonComponent.setClickHandler(() => {
      this.#handleMoreButtonClick();
    });
  }

  #renderLoading = () => {
    render(this.#boardComponent, this.#loadingComponent);
  }

  #renderFullList = () => {
    const filmsCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(filmsCount, this.#renderedCardsCount));

    this.#filmsListComponent.element.querySelector('.films-list__title').classList.add('visually-hidden');
    render(this.#boardComponent, this.#filmsListComponent, RenderPosition.AFTERBEGIN);
    render(this.#filmsListComponent, this.#filmsContainerComponent);

    this.#renderSort();
    this.#renderCards(movies);

    if (filmsCount > this.#renderedCardsCount) {
      this.#renderMoreButton();
    }
  }

  #renderExtraList = (component, movies) => {
    component.element.classList.add('films-list--extra');
    render(this.#boardComponent, component);

    const containerComponent = new MoviesListContainerView();
    render(component, containerComponent);

    movies.forEach((movie) => this.#renderCard(containerComponent, movie));
  }

  #renderExtraFilms = () => {
    if (this.movies.some(({movieData}) => movieData.rating > 0)) {
      this.#renderExtraList(this.#topMoviesComponent, this.#moviesModel.topMovies);
    }

    if (this.movies.some(({comments}) => comments.length > 0)) {
      this.#renderExtraList(this.#commentedMoviesComponent, this.#moviesModel.commentedMovies);
    }
  }

  #clearExtraFilms = () => {
    remove(this.#topMoviesComponent);
    remove(this.#commentedMoviesComponent);
  }

  #clearFullList = ({resetRenderedCount = false} = {}) => {
    this.#renderedCards.forEach((card) => remove(card));
    this.#renderedCards.clear();

    if (resetRenderedCount) {
      this.#renderedCardsCount = MOVIES_COUNT_PER_STEP;
    }

    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#filmsListComponent);
  }

  #clearBoard = ({resetRenderedCount = false, resetSortType = false} = {}) => {
    this.#clearFullList({resetRenderedCount: resetRenderedCount});
    this.#clearExtraFilms();

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.movies.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFullList();
    this.#renderExtraFilms();
  };

  #resetFormState = () => {
    this.#moviePopupComponent.updateData({
      isDisabled: false,
      deletingId: null,
    });
  };

  #setViewState = (state, update) => {
    switch (state) {
      case State.SAVING:
        this.#moviePopupComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this.#moviePopupComponent.updateData({
          deletingId: update
        });
        break;
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case ActionType.UPDATE_CARD:
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case ActionType.ADD_COMMENT:
        this.#setViewState(State.SAVING);
        try {
          await this.#commentsModel.add(updateType, update);
        } catch (err) {
          const shakeElement = this.#moviePopupComponent.element.querySelector('.film-details__new-comment');
          this.#moviePopupComponent.doAnimate(shakeElement, this.#resetFormState);
        }
        break;
      case ActionType.DELETE_COMMENT:
        this.#setViewState(State.DELETING, update);
        try {
          await this.#commentsModel.delete(updateType, update);
        } catch (err) {
          const shakeElement = document.getElementById(`${update}`);
          this.#moviePopupComponent.doAnimate(shakeElement, this.#resetFormState);
        }
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#updateCard(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        if (this.#moviePopupComponent !== null) {
          this.#updatePopup(data);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }

  #replaceCardToPopup = async (movie) => {
    if (this.#moviePopupComponent !== null) {
      this.#replacePopupToCard();
    }

    const comments = await this.#commentsModel.getComments(movie.id);
    this.#moviePopupComponent = new PopupView(movie, comments);

    document.body.classList.add('hide-overflow');
    render(document.body, this.#moviePopupComponent);

    this.#moviePopupComponent.setCloseDetailsHandler(this.#replacePopupToCard);
    this.#moviePopupComponent.setControlClickHandler(this.#handleControlClick);
    this.#moviePopupComponent.setDeleteCommentHandler(this.#deleteComment);
  }

  #replacePopupToCard = () => {
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.removeEventListener('keydown', this.#enterKeyDownHandler);
    remove(this.#moviePopupComponent);
  }

  #updatePopup = async (updatedMovie) => {
    if (this.#moviePopupComponent.movieData.id === updatedMovie.id) {
      this.#moviePopupComponent.updateData({
        movie: updatedMovie,
        comments: await this.#commentsModel.getComments(updatedMovie.id),
        isDisabled: false,
        deletingId: null
      });
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replacePopupToCard();
    }
  }

  #enterKeyDownHandler = (evt) => {
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      this.#addComment();
    }
  }

  #updateCard = (updatedMovie) => {
    const movieCard = this.#renderedCards.get(updatedMovie.id);

    if (movieCard) {
      movieCard.updateData(updatedMovie);
    }

    if (this.#moviePopupComponent !== null) {
      this.#updatePopup(updatedMovie);
    }

    this.#clearExtraFilms();
    this.#renderExtraFilms();
  }

  #handleControlClick = (movie, controlType) => {
    let updatedMovie = null;

    if (controlType === 'watchlist') {
      updatedMovie = {
        ...movie,
        userDetails: {
          ...movie.userDetails,
          watchlist: !movie.userDetails.watchlist
        }
      };
    }

    if (controlType === 'watched') {
      updatedMovie = {
        ...movie,
        userDetails: {
          ...movie.userDetails,
          alreadyWatched: !movie.userDetails.alreadyWatched,
          watchingDate: !movie.userDetails.alreadyWatched ? new Date() : null
        }
      };
    }

    if (controlType === 'favorite') {
      updatedMovie = {
        ...movie,
        userDetails: {
          ...movie.userDetails,
          favorite: !movie.userDetails.favorite
        }
      };
    }

    this.#handleViewAction(ActionType.UPDATE_CARD, UpdateType.MINOR, updatedMovie);
  }

  #addComment = () => {
    const movie = this.#moviePopupComponent.movieData;
    const movieId = movie.id;

    const comment = {
      comment: movie.commentText,
      emotion: movie.activeEmoji
    };

    if (comment.comment && comment.emotion) {
      this.#handleViewAction(ActionType.ADD_COMMENT, UpdateType.PATCH, {movieId, comment});
    }
  }

  #deleteComment = (id) => {
    this.#handleViewAction(ActionType.DELETE_COMMENT, UpdateType.PATCH, id);
  }
}
