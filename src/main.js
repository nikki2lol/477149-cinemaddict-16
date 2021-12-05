import {render, RenderPosition} from './render';
import {createRankTemplate} from './view/rank-view';
import {createMovieListTemplate} from './view/movie-list-view';
import {generateFilter} from './mock/filters';
import {createMovieCardTemplate} from './view/movie-card-view';
import {generateMovieCard} from './mock/movie';
import {createFilterTemplate} from './view/filters-view';
import {createSortTemplate} from './view/sort-view';
import {createLoadMoreButtonTemplate} from './view/load-more-button-view';
import {createStatsTemplate} from './view/stats-view';
import {createMoviePopupTemplate} from './view/popup-view';

const MOVIES_TOTAL = 20;
const MOVIES_COUNT_PER_STEP = 5;

const movies = Array.from({length: MOVIES_TOTAL}, generateMovieCard);
const filters = generateFilter(movies);
const alreadyWatchedCounter = filters.find(({ name }) => name === 'history').count;

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

render(header, createRankTemplate(alreadyWatchedCounter));
render(main, createFilterTemplate(filters));
render(main, createSortTemplate());
render(main, createMovieListTemplate());

const filmsElement = main.querySelector('.films-list');
const filmsListElement = filmsElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(movies.length, MOVIES_COUNT_PER_STEP); i++) {
  render(filmsListElement, createMovieCardTemplate(movies[i]));
}

if (movies.length > MOVIES_COUNT_PER_STEP) {
  let renderedPart = MOVIES_COUNT_PER_STEP;

  render(filmsElement, createLoadMoreButtonTemplate());

  const loadMoreButton = filmsElement.querySelector('.films-list__show-more');
  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    movies
      .slice(renderedPart, renderedPart + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => render(filmsListElement, createMovieCardTemplate(movie)));

    renderedPart += MOVIES_COUNT_PER_STEP;

    if (renderedPart >= movies.length) {
      loadMoreButton.remove();
    }
  });
}


render(footer, createStatsTemplate(MOVIES_TOTAL));
render(footer, createMoviePopupTemplate(movies[0]), RenderPosition.AFTEREND);

const moviePopupElement = document.body.querySelector('.film-details');
const moviePopupCloseButton = moviePopupElement.querySelector('.film-details__close-btn');

moviePopupCloseButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  moviePopupElement.remove();
});

