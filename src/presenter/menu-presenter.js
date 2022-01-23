import {FilterType, ScreenView, UpdateType} from '../const';
import {filter} from '../utils/filter';
import {render, replace, remove} from '../utils/render';
import MenuView from '../view/menu-view';

export default class MenuPresenter {
  #menuContainer = null;
  #filterModel = null;
  #moviesModel = null;
  #menuComponent = null;

  #activeItem = FilterType.ALL.type;
  #screenView = ScreenView.MOVIES;

  #handleMenuClick = () => {};

  constructor(menuContainer, moviesModel, filterModel, handleMenuClick) {
    this.#menuContainer = menuContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;
    this.#handleMenuClick = handleMenuClick;

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
    const prevMenuComponent = this.#menuComponent;

    this.#menuComponent = new MenuView(filters, this.#activeItem);
    this.#menuComponent.setItemClickHandler(this.#handleMenuChange);

    if (prevMenuComponent === null) {
      render(this.#menuContainer, this.#menuComponent);
      return;
    }

    replace(this.#menuComponent, prevMenuComponent);
    remove(prevMenuComponent);
  }

  #handleModelEvent = (updateType) => {
    if (updateType !== UpdateType.PATCH) {
      this.init();
    }
  }

  #handleMenuChange = (activeItem) => {
    if (this.#activeItem === activeItem) {
      return;
    }

    this.#activeItem = activeItem;
    const prevScreenView = this.#screenView;

    if (this.filters.some((item) => item.type === activeItem)) {
      this.#filterModel.setFilter(UpdateType.MAJOR, activeItem);
      this.#screenView = ScreenView.MOVIES;
    } else {
      this.#screenView = activeItem;
    }

    if (prevScreenView !== this.#screenView) {
      this.#handleMenuClick(this.#screenView);
    }

    this.init();
  }
}
