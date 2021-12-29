import AbstractView from './abstract-view.js';

const createFilmsListContainerTemplate = () => (
  `<div class="films-list__container"></div>
`
);

export default class MovieListContainerView extends AbstractView {
  get template() {
    return createFilmsListContainerTemplate();
  }
}
