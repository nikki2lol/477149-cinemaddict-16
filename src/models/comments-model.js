import AbstractObservable from '../utils/abstract-observable';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  get comments() {
    return [...this.#comments];
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  getMovieComment = (movie) => this.comments.filter((comment) => movie.comments.includes(comment.id));

  add = ({comment}) => {
    this.#comments = [
      ...this.#comments,
      comment
    ];

    this._notify();
  }

  delete = (id) => {
    const index = this.#comments.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify();
  }
}
