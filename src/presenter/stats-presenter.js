import {StatsFilterType, UpdateType} from '../const';
import {getDurationStats} from '../utils/utils';
import {remove, render} from '../utils/render';
import {getGenresStats, isMovieWatchedInPeriod} from '../utils/stats';
import StatsView from '../view/stats-view';

export default class StatsPresenter {
  #statsContainer = null;
  #statsComponent = null;

  #moviesModel = null;
  #activeFilter = null;

  constructor(statsContainer, moviesModel) {
    this.#statsContainer = statsContainer;
    this.#moviesModel = moviesModel;
  }

  init = () => {
    this.#activeFilter = StatsFilterType.ALL.type;
    this.#renderStats(this.stats);
    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    return this.#moviesModel.watchedMovies;
  }

  get stats() {
    const movies = this.movies.filter((movie) => isMovieWatchedInPeriod(movie, this.#activeFilter));
    const genresMapList = getGenresStats(movies);
    const totalDuration = getDurationStats(movies.reduce((prev, movie) => prev + movie.movieData.duration, 0));

    return {
      rank: this.#moviesModel.userRank,
      activeFilter: this.#activeFilter,
      totalCount: movies.length,
      totalDuration,
      topGenre: genresMapList ? [...genresMapList.keys()][0] : null,
      genresMapList
    };
  }

  destroy = () => {
    remove(this.#statsComponent);
    this.#moviesModel.removeObserver(this.#handleModelEvent);
  }

  #renderStats = (data) => {
    this.#statsComponent = new StatsView(data);
    render(this.#statsContainer, this.#statsComponent);
    this.#statsComponent.setFilterChangeHandler(this.#handleFilterChange);
  }

  #handleFilterChange = (activeFilter) => {
    this.#activeFilter = activeFilter;
    remove(this.#statsComponent);
    this.#renderStats(this.stats);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MINOR) {
      remove(this.#statsComponent);
      this.#renderStats(this.stats);
    }
  }
}
