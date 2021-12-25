import AbstractView from './abstract-view';

const createLoadingTemplate = () => (
  '<h2 class="films-list__title">There are no movies in our database</h2>'
);

export default class ListEmptyView extends AbstractView{
  #cards = null;

  constructor(cards) {
    super();
    this.#cards = cards;
  }

  get template() {
    return createLoadingTemplate(this.#cards);
  }
}
