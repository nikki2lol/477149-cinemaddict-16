import {createElement} from '../utils/render.js';
import {ANIMATION_DURATION} from '../const';

export default class AbstractView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement() {
    this.#element = null;
  }

  doAnimate(element, callback) {
    element.style.animation = `shake ${ANIMATION_DURATION / 1000}s`;
    setTimeout(() => {
      element.style.animation = '';
      callback();
    }, ANIMATION_DURATION);
  }
}
