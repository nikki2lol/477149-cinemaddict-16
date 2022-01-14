import {humanizeDuration, humanizeReleaseDate} from '../utils/utils';
import SmartView from './smart-view';
import {EMOJI} from '../mock-data';

const createMoviePopupTemplate = (movie) => {
  const {
    movieData: {
      title,
      altTitle,
      rating,
      posterPath,
      ageRating,
      director,
      writers,
      actors,
      releaseDate,
      country,
      duration,
      genres,
      description,
      comments,
      commentsListTemplate,
    },
    userData: {
      isInWatchlist,
      isAlreadyWatched,
      isFavorite,
    },
    isEmoji,
    isMessage,
    isEmojiChecked
  } = movie;

  const formattedDuration = humanizeDuration(duration);
  const formattedReleaseDate = humanizeReleaseDate(releaseDate);

  const watchlistClassName = isInWatchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const watchedClassName = isAlreadyWatched
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteClassName = isFavorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  const createEmojiTemplate = (emoji) => (
    `<input class="film-details__emoji-item visually-hidden"
  name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isEmojiChecked === `emoji-${emoji}` ? 'checked' : ''}>
<label class="film-details__emoji-label" for="emoji-${emoji}">
  <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
</label>`
  );

  const emojiListTemplate = EMOJI.map((item) => createEmojiTemplate(item)).join('');


  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${posterPath}" alt="">

          <p class="film-details__age">${ageRating}</p>
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
            </tr>
          </table>

          <p class="film-details__film-description">
              ${description}
          </p>
        </div>
      </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button ${watchedClassName}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
        </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsListTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${isEmoji ? `<img src="images/emoji/${isEmoji}.png" width="55" height="55" alt="emoji-${isEmoji}">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${isMessage}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojiListTemplate}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>
`;
};


export default class PopupView extends SmartView{
  #comments = null;

  constructor(movie) {
    super();
    this._data = PopupView.parseFilmToData(movie);
    this.#comments = movie.comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createMoviePopupTemplate(this._data, this.#comments);
  }

  reset = (movie) => {
    this.updateData(PopupView.parseFilmToData(movie));
  };

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
  };

  #setInnerHandlers = () => {
    const emojiList = this.element.querySelectorAll('.film-details__emoji-list input[name="comment-emoji"]');
    emojiList.forEach((emoji) => emoji.addEventListener('click', this.#emojiClickHandler));

    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#messageInputHandler);
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      isEmoji: evt.target.value,
      isEmojiChecked: evt.target.id,
    }, );
  };

  #messageInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData(
      {
        isMessage: evt.target.value,
      },
      true,
    );
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    PopupView.parseDataToFilm(this._data);
    this._callback.closeClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  static parseFilmToData = (movie) => ({
    ...movie,
    isEmoji: null,
    isMessage: '',
    isEmojiChecked: false
  });

  static parseDataToFilm = (data) => {
    const movie = { ...data };

    delete movie.isEmoji;
    delete movie.isMessage;
    delete movie.isEmojiChecked;

    return movie;
  };
}


