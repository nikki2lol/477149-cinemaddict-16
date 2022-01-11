import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import {
  generateRandomDate,
  getRandomInteger,
  getRandomItem,
  getRandomList,
  getRandomNumber
} from '../utils/utils.js';
import { POSTERS, AGE_RATING, GENRES, DESCRIPTION, NAMES, COUNTRIES } from '../mock-data.js';
import {generateComment} from './comment';

const getTitle = (posterFileName) => {
  const title = posterFileName.split('.')[0].split('-').join(' ');
  return title.slice(0, 1).toUpperCase() + title.slice(1);
};

const generateTotalRating = () => `${getRandomInteger(1, 9)}.${getRandomInteger(0, 9)}`;


// const createCommentTemplate = (comments) => comments.map((item) => {
//   const { emote, comment, author, date } = item;
//
//   return `<li class="film-details__comment">
//     <span class="film-details__comment-emoji">
//       <img src="./images/emoji/${emote}.png" width="55" height="55" alt="emoji-${emote}">
//     </span>
//     <div>
//       <p class="film-details__comment-text">${comment}</p>
//       <p class="film-details__comment-info">
//         <span class="film-details__comment-author">${author}</span>
//         <span class="film-details__comment-day">${date}</span>
//         <button class="film-details__comment-delete">Delete</button>
//       </p>
//     </div>
//   </li>`;
// }).join('');

const generateMovieInfo = () => {
  const posterPath = getRandomItem(POSTERS);
  const title = getTitle(posterPath);
  const altTitle = getTitle(getRandomItem(POSTERS));
  const rating = generateTotalRating();
  const ageRating = getRandomItem(AGE_RATING);
  const releaseDate = generateRandomDate(dayjs('1994-05-12'));
  const country = getRandomItem(COUNTRIES);
  const duration = getRandomInteger(30, 240);
  const genres = getRandomList(GENRES, getRandomNumber(1,4));
  const description = getRandomList(DESCRIPTION, getRandomNumber(1,5));
  const director = getRandomItem(NAMES);
  const writers = getRandomList(NAMES, getRandomNumber(1,4));
  const actors = getRandomList(NAMES, getRandomNumber(3,10));
  const comments = Array.from({ length: getRandomInteger(0, 5) });
  // const commentsArray = comments.map(generateComment);
  // const commentsListTemplate = createCommentTemplate(commentsArray);

  return {
    posterPath,
    title,
    altTitle,
    rating,
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
    // commentsListTemplate
  };
};

const generateUserData = () => ({
  isInWatchlist: Boolean(getRandomInteger(0, 1)),
  isAlreadyWatched: Boolean(getRandomInteger(0, 1)),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  watchDate: generateRandomDate(dayjs('1994-05-12'), dayjs()),
});

export const generateMovieCard = () => {
  const id = nanoid();
  const movieData = generateMovieInfo();
  const userData = generateUserData();

  return {
    id,
    movieData,
    userData,
  };
};
