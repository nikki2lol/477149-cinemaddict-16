import {render} from './utils/render';
import {generateFilter} from './mock/filters';
import {generateMovieCard} from './mock/movie';
import MovieListPresenter from './presenter/movie-list-presenter';
import RankView from './view/rank-view';
import {moviesConst} from './const';

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const movies = Array.from({length: moviesConst.MOVIES_TOTAL}, generateMovieCard);
const filters = generateFilter(movies);
const alreadyWatchedCounter = filters.find(({ name }) => name === 'history').count;
const movieListPresenter = new MovieListPresenter(main);

render(header, new RankView(alreadyWatchedCounter));
render(main);

movieListPresenter.init(movies, filters);

