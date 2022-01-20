import {render} from './utils/render';
import {generateMovieCard} from './mock/movie';
import {generateComment} from './mock/comment';
import MovieListPresenter from './presenter/movie-list-presenter';
import RankView from './view/rank-view';
import {COMMENTS_TOTAL, MOVIES_TOTAL} from './const';
import StatsView from './view/stats-view';
import FilterPresenter from './presenter/filters-presenter';
import MoviesModel from './models/movies-model';
import CommentsModel from './models/comments-model';
import FilterModel from './models/filters-model';

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

const movies = Array.from({length: MOVIES_TOTAL}, generateMovieCard);
const comments = Array.from({length: COMMENTS_TOTAL}, generateComment);

const moviesModel = new MoviesModel();
moviesModel.movies = movies;

const commentsModel = new CommentsModel();
commentsModel.comments = comments;

const filterModel = new FilterModel();

const moviesPresenter = new MovieListPresenter(main, moviesModel, commentsModel, filterModel);
const filtersPresenter = new FilterPresenter(main, filterModel, moviesModel);

render(header, new RankView(moviesModel));
filtersPresenter.init();
moviesPresenter.init();
render(footer, new StatsView(movies.length));
