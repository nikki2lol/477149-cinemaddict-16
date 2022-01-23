import AbstractObservable from '../utils/abstract-observable';
import {MOVIES_TOTAL_SUB} from '../const';
import {getSortedMovies} from '../utils/utils';
import {filter} from '../utils/filter';

export default class MoviesModel extends AbstractObservable {
  #movies = [];

  get movies() {
    return [...this.#movies];
  }

  set movies(movies) {
    this.#movies = [...movies];
  }

  get topMovies() {
    return getSortedMovies([...this.movies], 'rating').slice(0, MOVIES_TOTAL_SUB);
  }

  get commentedMovies() {
    return getSortedMovies([...this.movies], 'comments').slice(0, MOVIES_TOTAL_SUB);
  }

  get userRank() {
    const count = filter.history(this.movies).length;
    if (count === 0) {
      return null;
    }
    if (count <= 10) {
      return 'Novice';
    }
    if (count <= 20) {
      return 'Fan';
    }
    return 'Movie buff';
  }

  get watchedMovies() {
    return [...this.movies].filter((movie) => movie.userData.alreadyWatched);
  }

  addComment = (type, {movie, comment}) => {
    const updatedMovie = {
      ...movie,
      comments: [...movie.comments, comment.id]
    };

    delete updatedMovie.activeEmoji;
    delete updatedMovie.commentText;

    this.update(type, updatedMovie);
  }

  deleteComment = (type, id) => {
    const movie = this.movies.find(({comments}) => comments.includes(id));
    const updatedMovie = {
      ...movie,
      comments: movie.comments.filter((item) => item !== id)
    };

    this.update(type, updatedMovie);
  }

  update = (type, updatedMovie) => {
    const index = this.#movies.findIndex((item) => item.id === updatedMovie.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      updatedMovie,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(type, updatedMovie);
  }
}
