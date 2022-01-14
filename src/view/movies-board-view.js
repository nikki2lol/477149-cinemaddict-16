import AbstractView from './abstract-view.js';


const createMoviesBoardTemplate = () => `<section class="films">
  </section>`;

export default class MoviesBoardView extends AbstractView {
  get template() {
    return createMoviesBoardTemplate();
  }
}
