import AbstractObservable from '../utils/abstract-observable';

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;
  #moviesModel = null;

  constructor(apiService, moviesModel) {
    super();
    this.#apiService = apiService;
    this.#moviesModel = moviesModel;
  }

  getComments = async (movieId) => {
    try {
      this.#comments = await this.#apiService.getComments(movieId);
      return this.#comments;
    } catch (err) {
      throw new Error('Can\'t get comments');
    }
  }

  add = async (updateType, {movieId, comment}) => {
    try {
      const response = await this.#apiService.addComment(movieId, comment);

      this.#comments = response.comments;
      this.#moviesModel.addComment(updateType, movieId, this.#comments);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  }

  delete = async (updateType, id) => {
    const index = this.#comments.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(id);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      this.#moviesModel.deleteComment(updateType, id);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  }
}
