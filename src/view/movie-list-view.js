import AbstractView from './abstract-view';

const createMovieListTemplate = (title) => `<section class="films-list">
    <h2 class="films-list__title">${title}</h2>
    </section>
`;

export default class MovieListView extends AbstractView {
  #title = '';

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createMovieListTemplate(this.#title);
  }
}
