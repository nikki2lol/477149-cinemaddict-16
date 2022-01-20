import AbstractView from './abstract-view';

const createFilterElemTemplate = ({type, name, count}, isActive) => (
  `<a href="#${type}" data-filter="${type}"
    class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}"
  >
    ${name} ${ type !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
  </a>`
);

export const createFilterTemplate = (filterItems, type) => {
  const filterItemsTemplate = filterItems
    .map((filter) => (
      createFilterElemTemplate(filter, filter.type === type)
    )).join('\n');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
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
