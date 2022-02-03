import AbstractObservable from '../utils/abstract-observable';
import {MOVIES_TOTAL_SUB, UpdateType} from '../const';
import {getSortedMovies} from '../utils/utils';
import {filter} from '../utils/filter';

export default class MoviesModel extends AbstractObservable {
  #movies = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get movies() {
    return [...this.#movies];
  }

  init = async () => {
    try {
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch (err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
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
    return [...this.movies].filter((movie) => movie.userDetails.alreadyWatched);
  }

  addComment = (type, movie, comments) => {
    const updatedMovie = {
      ...this.movies.find(({id}) => id === movie),
      comments: comments.map((item) => item.id)
    };

    this.#updateList(type, updatedMovie);
  }

  deleteComment = (type, id) => {
    const movie = this.movies.find(({comments}) => comments.includes(id));
    const updatedMovie = {
      ...movie,
      comments: movie.comments.filter((item) => item !== id)
    };

    this.#updateList(type, updatedMovie);
  }


  updateMovie = async (type, update) => {
    try {
      const response = await this.#apiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);

      this.#updateList(type, updatedMovie);
    } catch (err) {
      throw new Error('Can\'t update movie');
    }
  }

  #updateList = (type, updatedFilm) => {
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

  #adaptToClient = (movie) => {
    const movieData = movie['film_info'];
    const userDetails = movie['user_details'];

    const adaptedFilm = {
      id: movie.id,
      movieData: {
        ...movieData,
        altTitle: movieData['alternative_title'],
        rating: movieData['total_rating'],
        ageRating: movieData['age_rating'],
        releaseDate: new Date(movieData['release']['date']),
        country: movieData['release']['release_country']
      },
      userDetails: {
        ...userDetails,
        alreadyWatched: userDetails['already_watched'],
        watchingDate: userDetails['watching_date'] !== null ? new Date(userDetails['watching_date']) : null,
      },
      comments: movie.comments
    };

    delete adaptedFilm.movieData['alternative_title'];
    delete adaptedFilm.movieData['total_rating'];
    delete adaptedFilm.movieData['age_rating'];
    delete adaptedFilm.movieData.release['release_country'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_date'];

    return adaptedFilm;
  }
}
