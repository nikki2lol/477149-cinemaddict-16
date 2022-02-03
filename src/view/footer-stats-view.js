import AbstractView from './abstract-view';

const createStatsTemplate = (count) => (
  `<p>${count} movies inside</p>`
);

export default class FooterStatsView extends AbstractView{
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createStatsTemplate(this.#count);
  }

}

