import AbstractView from './abstract-view';

const createFilterElemTemplate = (filter) => {
  const { name, count } = filter;
  const filterName = name[0].toUpperCase() + name.slice(1).toLowerCase();

  return `<a href="#${filterName}" class="main-navigation__item">${filterName} <span class="main-navigation__item-count">${count}</span></a>`;
};

export const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => (index !== 0) ? createFilterElemTemplate(filter) : '')
    .join('');

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItemsTemplate}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class FilterView extends AbstractView{
  #filters = null;
  #type = null;

  constructor(filters, type) {
    super();
    this.#filters = filters;
    this.#type = type;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#type);
  }

  setTypeChangeHandler = (callback) => {
    this._callback.typeChange = callback;
    this.element.querySelectorAll('.main-navigation__item').forEach((filterButton) => {
      filterButton.addEventListener('click', this.#typeChangeHandler);
    });
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.typeChange(evt.target.dataset.filter);
  }
}
