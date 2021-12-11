import RankView from './view/rank-view';
import MovieListView from './view/movie-list-view';
import MovieCardView from './view/movie-card-view';
import LoadMoreButtonView from './view/load-more-button-view';
import FilterView from './view/filter-view';
import SortView from './view/sort-view';
import StatsView from './view/stats-view';
import PopupView from './view/popup-view';
import {render} from './render';
import {generateFilter} from './mock/filters';
import {generateMovieCard} from './mock/movie';

const MOVIES_TOTAL = 20;
const MOVIES_COUNT_PER_STEP = 5;

const movies = Array.from({length: MOVIES_TOTAL}, generateMovieCard);
const filters = generateFilter(movies);
const alreadyWatchedCounter = filters.find(({ name }) => name === 'history').count;

const bodyEl = document.querySelector('body');
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

const closePopup = (moviePopup) => {
  const onCloseFilmDetailsCard = (evt) => {
    evt.preventDefault();
    bodyEl.classList.remove('hide-overflow');
    bodyEl.removeChild(moviePopup.element);
  };
  moviePopup.element.querySelector('.film-details__close-btn').addEventListener('click', onCloseFilmDetailsCard);
};

const openPopup = (movieCard, moviePopup) => {
  const onShowDetailsCard = () => {
    bodyEl.classList.add('hide-overflow');
    bodyEl.appendChild(moviePopup.element);
  };
  movieCard.element.querySelector('.film-card__link').addEventListener('click', onShowDetailsCard);
};

const renderMovieCard = (container, movie) => {
  const movieCardComponent = new MovieCardView(movie);
  const moviePopupComponent = new PopupView(movie);
  const movieCardElement = movieCardComponent.element;

  render(container, movieCardElement);
  closePopup(moviePopupComponent);
  openPopup(movieCardComponent, moviePopupComponent);
};

const renderMovieList = (container, list) =>{
  const listHolderComponent = new MovieListView();
  render(main, listHolderComponent.element);
  const moviesElement = main.querySelector('.films-list');
  const moviesListElement = moviesElement.querySelector('.films-list__container');

  for (let i = 0; i < MOVIES_COUNT_PER_STEP; i++) {
    renderMovieCard(moviesListElement, list[i]);
  }

  if (movies.length > MOVIES_COUNT_PER_STEP) {
    let renderedPart = MOVIES_COUNT_PER_STEP;
    const LoadMoreButton = new LoadMoreButtonView();
    render(moviesElement, LoadMoreButton.element);

    LoadMoreButton.element.addEventListener('click', (evt) => {
      evt.preventDefault();

      movies
        .slice(renderedPart, renderedPart + MOVIES_COUNT_PER_STEP)
        .forEach((movie) => renderMovieCard(moviesListElement, movie));

      renderedPart += MOVIES_COUNT_PER_STEP;

      if (renderedPart >= movies.length) {
        LoadMoreButton.element.remove();
        LoadMoreButton.removeElement();
      }
    });
  }
};

render(header, new RankView(alreadyWatchedCounter).element);
render(footer, new StatsView(MOVIES_TOTAL).element);
render(main, new SortView().element);
render(main, new FilterView(filters).element);

renderMovieList(main, movies);
