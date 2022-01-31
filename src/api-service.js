const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class ApiService {
  #url = null;
  #authorization = null;

  constructor(url, authorization) {
    this.#url = url;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this.#load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptMovieToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  getComments = async (movie) => (
    this.#load({url: `comments/${movie}`}).then(ApiService.parseResponse)
  );

  addComment = async (movieId, comment) => {
    const response = await this.#load({
      url: `comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  deleteComment = async (commentId) => (
    await this.#load({
      url: `comments/${commentId}`,
      method: Method.DELETE
    })
  );

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(`${this.#url}/${url}`, {method, body, headers});

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptMovieToServer = ({id, movieData, userDetails, comments}) => {
    const adaptedMovie = {
      id,
      'film_info': {
        ...movieData,
        'alternative_title': movieData.altTitle,
        'total_rating': movieData.rating,
        'age_rating': movieData.ageRating,
        release: {
          date: movieData.releaseDate.toISOString(),
          'release_country': movieData.country
        }
      },
      'user_details': {
        ...userDetails,
        'already_watched': userDetails.alreadyWatched,
        'watching_date': userDetails.watchingDate instanceof Date ? userDetails.watchingDate.toISOString() : null
      },
      comments
    };

    delete adaptedMovie['film_info'].altTitle;
    delete adaptedMovie['film_info'].rating;
    delete adaptedMovie['film_info'].ageRating;
    delete adaptedMovie['film_info'].country;
    delete adaptedMovie['user_details'].alreadyWatched;
    delete adaptedMovie['user_details'].watchingDate;

    return adaptedMovie;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
