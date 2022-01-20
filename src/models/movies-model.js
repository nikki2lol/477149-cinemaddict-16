import AbstractObservable from '../utils/abstract-observable';
import {MOVIES_TOTAL_SUB} from '../const';
import {getSortedFilms} from '../utils/utils';

export default class MoviesModel extends AbstractObservable {
  #movies = [];

  get movies() {
    return [...this.#movies];
  }

  set movies(movies) {
    this.#movies = [...movies];
  }

  get topMovies() {
    return getSortedFilms([...this.movies], 'rating').slice(0, MOVIES_TOTAL_SUB);
  }

  get commentedMovies() {
    return getSortedFilms([...this.movies], 'comments').slice(0, MOVIES_TOTAL_SUB);
  }

  addComment = (type, {movie, comment}) => {
    const updatedFilm = {
      ...movie,
      comments: [...movie.comments, comment.id]
    };

    delete updatedFilm.activeEmoji;
    delete updatedFilm.commentText;

    this.update(type, updatedFilm);
  }

  deleteComment = (type, id) => {
    const movie = this.movies.find(({comments}) => comments.includes(id));
    const updatedFilm = {
      ...movie,
      comments: movie.comments.filter((item) => item !== id)
    };

    this.update(type, updatedFilm);
  }

  update = (type, updatedFilm) => {
    const index = this.#movies.findIndex((item) => item.id === updatedFilm.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      updatedFilm,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(type, updatedFilm);
  }
}
