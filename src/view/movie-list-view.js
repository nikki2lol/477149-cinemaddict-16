import AbstractView from './abstract-view';

const createMovieListTemplate = () => `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container"></div>
    </section>
`;

export default class MovieListView extends AbstractView {
  #container = null;

  get template() {
    return createMovieListTemplate();
  }

  get container() {
    this.#container = this.element.querySelector('.films-list__container');

    return this.#container;
  }
}
