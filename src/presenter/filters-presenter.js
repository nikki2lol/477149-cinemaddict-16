import {FilterType, UpdateType} from '../const';
import {filter} from '../utils/filter';
import {render, replace, remove} from '../utils/render';
import FiltersView from '../view/filter-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #moviesModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, moviesModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const filters = [];
    const movies = this.#moviesModel.movies;

    Object.values(FilterType).forEach(({type, name}) => {
      filters.push({type, name, count: filter[type](movies).length});
    });

    return filters;
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filters, this.#filterModel.filter);
    this.#filterComponent.setTypeChangeHandler(this.#handleTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = (updateType) => {
    if (updateType !== UpdateType.PATCH) {
      this.init();
    }
  }

  #handleTypeChange = (type) => {
    if (this.#filterModel.filter === type) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, type);
  }
}
