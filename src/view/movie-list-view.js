import AbstractView from './abstract-view';

const createMovieListTemplate = () => (
  `<section class="films">
    <section class="films-list">
<!--      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>-->
<!--      <div class="films-list__container">-->
<!--      </div>-->
    </section>
  </section>
`
);

export default class MovieListView extends AbstractView {
  #movies = null;

  constructor(films) {
    super();
    this.#movies = films;
  }

  get template () {
    return createMovieListTemplate(this.#movies);
  }
}
