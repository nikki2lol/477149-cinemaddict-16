import AbstractView from './abstract-view';

const createMoviesContainerTemplate = () => (
  '<div class="films-list__container"></div>'
);

export default class MoviesListContainerView extends AbstractView {
  get template() {
    return createMoviesContainerTemplate();
  }
}
