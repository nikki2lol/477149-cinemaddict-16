import {
  ActionType,
  FilterType,
  MOVIES_COUNT_PER_STEP,
  NoTasksTextContent,
  SortType, TITLE_SECTION_COMMENTED,
  TITLE_SECTION_MAIN,
  TITLE_SECTION_TOP, UpdateType
} from '../const';
import {render, RenderPosition, remove} from '../utils/render';
import {getSortedFilms} from '../utils/utils';
import {filter} from '../utils/filter';
import MoviesBoardView from '../view/movies-board-view';
import MovieListView from '../view/movie-list-view';
import SortView from '../view/sort-view';
import LoadMoreButtonView from '../view/load-more-button-view';
import MoviesListContainerView from '../view/movie-list-container-view';
import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view';

export default class MovieListPresenter {
  #boardContainer = null;
  #moviesModel = null;
  #commentsModel = null;
  #filterModel = null;
  #boardComponent = new MoviesBoardView();
  #showMoreButtonComponent = new LoadMoreButtonView();
  #filmsListComponent = new MovieListView(TITLE_SECTION_MAIN);
  #topMoviesComponent = new MovieListView(TITLE_SECTION_TOP);
  #commentedMoviesComponent = new MovieListView(TITLE_SECTION_COMMENTED);
  #filmsContainerComponent = new MoviesListContainerView();
  #moviePopupComponent = null;
  #noFilmsComponent = null;
  #sortComponent = null;
  #renderedCardsCount = MOVIES_COUNT_PER_STEP;
  #renderedCards = new Map;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(container, moviesModel, commentsModel, filterModel) {
    this.#boardContainer = container;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[this.#filterType](movies);

    return this.#currentSortType === SortType.DEFAULT ? filteredMovies : getSortedFilms(filteredMovies, this.#currentSortType);
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    render(this.#boardContainer, this.#boardComponent);
    this.#renderBoard();
    this.#renderExtraFilms();
  }

  #handleSortTypeChange = (newSort) => {
    if (this.#currentSortType === newSort) {
      return;
    }

    this.#currentSortType = newSort;
    this.#clearBoard();
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#boardComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderCard = (container, movie) => {
    const cardComponent = new MovieCardView(movie);
    render(container, cardComponent);
    // console.log(cardComponent, 'cardComponent');

    cardComponent.setOpenPopupHandler(() => {
      this.#replaceCardToPopup(cardComponent.movieData);
      document.addEventListener('keydown', this.#handleKeydown);
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
    const films = this.movies.slice(this.#renderedCardsCount, newRenderedCount);

    this.#renderCards(films);
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

  #renderFullList = () => {
    const filmsCount = this.movies.length;
    const films = this.movies.slice(0, Math.min(filmsCount, this.#renderedCardsCount));

    this.#filmsListComponent.element.querySelector('.films-list__title').classList.add('visually-hidden');
    render(this.#boardComponent, this.#filmsListComponent, RenderPosition.AFTERBEGIN);
    render(this.#filmsListComponent, this.#filmsContainerComponent);

    this.#renderCards(films);

    if (filmsCount > this.#renderedCardsCount) {
      this.#renderMoreButton();
    }
  }

  #renderExtraList = (component, films) => {
    component.element.classList.add('films-list--extra');
    render(this.#boardComponent, component);

    const containerComponent = new MoviesListContainerView();
    render(component, containerComponent);

    films.forEach((movie) => this.#renderCard(containerComponent, movie));
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

  #clearBoard = ({resetRenderedCount = false, resetSortType = false} = {}) => {
    this.#renderedCards.forEach((card) => remove(card));
    this.#renderedCards.clear();

    if (resetRenderedCount) {
      this.#renderedCardsCount = MOVIES_COUNT_PER_STEP;
    }

    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#filmsListComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard = () => {
    if (this.movies.length === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderSort();
    this.#renderFullList();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case ActionType.UPDATE_CARD:
        this.#moviesModel.update(updateType, update);
        break;
      case ActionType.ADD_COMMENT:
        this.#commentsModel.add(update);
        this.#moviesModel.addComment(updateType, update);
        break;
      case ActionType.DELETE_COMMENT:
        this.#commentsModel.delete(update);
        this.#moviesModel.deleteComment(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#updateCard(data);
        break;
      case UpdateType.MINOR:
        this.#updateCard(data);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  }


  // то что надо бы хорошему вынести в отдельный презeнтер
  #replaceCardToPopup = (movie) => {
    if (this.#moviePopupComponent !== null) {
      this.#replacePopupToCard();
    }
    this.#moviePopupComponent = new PopupView(movie, this.#commentsModel.getMovieComment(movie));

    document.body.classList.add('hide-overflow');
    render(document.body, this.#moviePopupComponent);

    this.#moviePopupComponent.setCloseDetailsHandler(this.#replacePopupToCard);
    this.#moviePopupComponent.setControlClickHandler(this.#handleControlClick);
    this.#moviePopupComponent.setDeleteCommentHandler(this.#deleteComment);
  }

  #replacePopupToCard = () => {
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#handleKeydown);
    remove(this.#moviePopupComponent);
  }

  #handleKeydown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#replacePopupToCard();
    }
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      this.#addComment();
    }
  }

  #updateCard = (updatedFilm) => {
    const movieCard = this.#renderedCards.get(updatedFilm.id);

    if (movieCard) {
      movieCard.updateData(updatedFilm);
    }

    if (this.#moviePopupComponent !== null && this.#moviePopupComponent.movieData.id === updatedFilm.id) {
      this.#moviePopupComponent.updateData({
        movie: updatedFilm,
        comments: this.#commentsModel.getMovieComment(updatedFilm)
      });
    }

    this.#clearExtraFilms();
    this.#renderExtraFilms();
  }

  #handleControlClick = (movie, controlType) => {
    let updatedFilm = null;

    if (controlType === 'watchlist') {
      updatedFilm = {
        ...movie,
        userData: {
          ...movie.userData,
          watchlist: !movie.userData.watchlist
        }
      };
    }

    if (controlType === 'watched') {
      updatedFilm = {
        ...movie,
        userData: {
          ...movie.userData,
          alreadyWatched: !movie.userData.alreadyWatched,
          watchingDate: !movie.userData.alreadyWatched ? new Date() : null
        }
      };
    }

    if (controlType === 'favorite') {
      updatedFilm = {
        ...movie,
        userData: {
          ...movie.userData,
          favorite: !movie.userData.favorite
        }
      };
    }

    this.#handleViewAction(ActionType.UPDATE_CARD, UpdateType.MINOR, updatedFilm);
  }

  #addComment = () => {
    const movie = this.#moviePopupComponent.movieData;

    const comment = {
      id: this.comments[this.comments.length - 1].id + 1,
      comment: movie.commentText,
      emotion: movie.activeEmoji
    };

    if (comment.comment && comment.emotion) {
      this.#handleViewAction(ActionType.ADD_COMMENT, UpdateType.PATCH, {movie, comment});
    }
  }

  #deleteComment = (id) => {
    this.#handleViewAction(ActionType.DELETE_COMMENT, UpdateType.PATCH, id);
  }
}
