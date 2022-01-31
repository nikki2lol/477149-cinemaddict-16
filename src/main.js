import {ScreenView, API_AUTHORIZATION, API_URL} from './const';
import {render} from './utils/render';
import ApiService from './api-service';
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

const apiService = new ApiService(API_URL, API_AUTHORIZATION);
const moviesModel = new MoviesModel(apiService);
const commentsModel = new CommentsModel(apiService, moviesModel);
const filterModel = new FilterModel();
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

navigationPresenter.init();
moviesPresenter.init();

moviesModel.init().finally(() => {
  render(header, new RankView(moviesModel));
  render(footer, new FooterStatsView(moviesModel.movies.length));
});
