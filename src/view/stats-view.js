import AbstractView from './abstract-view';

const createStatsTemplate = (count) =>
  `<section class="footer__statistics">
    <p>${count} movies inside</p>
  </section>
`;

export default class StatsView extends AbstractView{
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createStatsTemplate(this.#count);
  }

}

