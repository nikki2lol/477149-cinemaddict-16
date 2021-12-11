import {createElement} from '../render';

const createStatsTemplate = (count) =>
  `<section class="footer__statistics">
    <p>${count} movies inside</p>
  </section>
`;

export default class StatsView {
  #element = null;
  #count = null;

  constructor(count) {
    this.#count = count;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createStatsTemplate(this.#count);
  }

  removeElement() {
    this.#element = null;
  }
}

