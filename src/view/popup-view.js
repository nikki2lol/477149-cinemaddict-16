import {humanizeDuration, humanizeReleaseDate } from '../utils/utils';
import SmartView from './smart-view';
import {EMOJI} from '../mock-data';
import he from 'he';

const createEmojiItemTemplate = (emoji, activeEmoji) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}"
    value="${emoji}" ${activeEmoji === emoji ? 'checked' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img data-emoji="${emoji}" src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`
);

const createMoviesCommentTemplate = ({id, author, comment, date, emotion}) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete" data-comment="${id}">Delete</button>
      </p>
    </div>
  </li>`
);

const createMovieDetailsTemplate = ({movieData, userData, comments, activeEmoji, commentText}, commentsData) => {
  const {
    posterPath,
    ageRating,
    title,
    altTitle,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    country,
    runtime,
    description,
    genres
  } = movieData;

  const watchlistClassName = userData.watchlist ? 'film-details__control-button--active' : '';
  const watchedClassName = userData.alreadyWatched ? 'film-details__control-button--active' : '';
  const favoriteClassName = userData.favorite ? 'film-details__control-button--active' : '';

  const formattedDuration = humanizeDuration(runtime);
  const formattedReleaseDate = humanizeReleaseDate(releaseDate);

  const commentsList = commentsData.map((comment) => createMoviesCommentTemplate(comment)).join('');
  const emojiList = EMOJI.map((emoji) => createEmojiItemTemplate(emoji, activeEmoji)).join('');

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${posterPath}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${altTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formattedReleaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formattedDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${genres.join(', ')}</span></td>
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button name="watchlist" type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist">Add to watchlist</button>
          <button name="watched" type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched">Already watched</button>
          <button name="favorite" type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsList}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
                ${activeEmoji ? `<img src="images/emoji/${activeEmoji}.png" width="55" height="55" alt="emoji-${activeEmoji}">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"
              >${commentText ? he.encode(commentText) : ''}</textarea>
            </label>

            <div class="film-details__emoji-list">
              ${emojiList}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class PopupView extends SmartView{
  constructor(movie, comments) {
    super();
    this._data = {
      movie: PopupView.parseFilmToData(movie),
      comments: comments
    };

    this.#setInnerHandlers();
  }

  get template() {
    return createMovieDetailsTemplate(this._data.movie, this._data.comments);
  }

  get movieData() {
    return this._data.movie;
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseDetailsHandler(this._callback.closeDetailsClick);
    this.setControlClickHandler(this._callback.controlClick);
    this.setDeleteCommentHandler(this._callback.deleteCommentClick);
  }

  setCloseDetailsHandler = (callback) => {
    this._callback.closeDetailsClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupHandler);
  }

  setControlClickHandler = (callback) => {
    this._callback.controlClick = callback;
    this.element.querySelectorAll('.film-details__control-button').forEach((control) => {
      control.addEventListener('click', this.#controlClickHandler);
    });
  }

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => {
      button.addEventListener('click', this.#deleteCommentHandler);
    });
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-label img').forEach((item) => {
      item.addEventListener('click', this.#emojiClickHandler);
    });

    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  #closePopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeDetailsClick();
  }

  #controlClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.controlClick(
      PopupView.parseDataToFilm(this._data.movie),
      evt.target.getAttribute('name')
    );
  }

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteCommentClick(evt.target.dataset.comment);
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      movie: {
        ...this._data.movie,
        activeEmoji: evt.target.dataset.emoji
      }
    });
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      movie: {
        ...this._data.movie,
        commentText: evt.target.value
      }
    }, true);
  }

  static parseFilmToData = (movie) => ({
    ...movie,
    activeEmoji: null,
    commentText: null
  });

  static parseDataToFilm = (data) => {
    const movie = {...data};

    delete movie.activeEmoji;
    delete movie.commentText;

    return movie;
  }
}


