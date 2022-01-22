import {COMMENTS_TOTAL, MOVIES_TOTAL, ScreenView} from './const';
import {render} from './utils/render';
import {generateMovieCard} from './mock/movie';
import {generateComment} from './mock/comment';
import MoviesPresenter from './presenter/movies-presenter';
import NavigationPresenter from './presenter/menu-presenter';
import StatsPresenter from './presenter/stats-presenter';
import FilterModel from './models/filters-model';
import RankView from './view/rank-view';
import FooterStatsView from './view/footer-stats-view';
import MoviesModel from './models/movies-model';
import CommentsModel from './models/comments-model';

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

const movies = Array.from({length: MOVIES_TOTAL}, generateMovieCard);
const comments = Array.from({length: COMMENTS_TOTAL}, generateComment);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

moviesModel.movies = movies;
commentsModel.comments = comments;

const moviesPresenter = new MoviesPresenter(main, moviesModel, commentsModel, filterModel);
const statsPresenter = new StatsPresenter(main, moviesModel);

const handleMenuClick = (screenView) => {
  if (screenView === ScreenView.STATS) {
    moviesPresenter.destroy();
    statsPresenter.init();
  } else {
    statsPresenter.destroy();
    moviesPresenter.init();
  }
};

const navigationPresenter = new NavigationPresenter(main, moviesModel, filterModel, handleMenuClick);

render(header, new RankView(moviesModel));
navigationPresenter.init();
moviesPresenter.init();
render(footer, new FooterStatsView(movies.length));
