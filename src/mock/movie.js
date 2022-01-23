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
import {COMMENTS_TOTAL} from '../const';

const getTitle = (posterFileName) => {
  const title = posterFileName.split('.')[0].split('-').join(' ');
  return title.slice(0, 1).toUpperCase() + title.slice(1);
};

const generateTotalRating = () => `${getRandomInteger(1, 9)}.${getRandomInteger(0, 9)}`;


const generateCommentsList = () => {
  const commentsId = [];
  const randomCount = getRandomInteger(0, 5);

  for (let i = 0; i < randomCount; i++) {
    commentsId.push(getRandomInteger(1, COMMENTS_TOTAL).toString());
  }

  return commentsId;
};

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
  };
};

const generateUserData = () => ({
  watchlist: Boolean(getRandomInteger(0, 1)),
  alreadyWatched: Boolean(getRandomInteger(0, 1)),
  favorite: Boolean(getRandomInteger(0, 1)),
  watchingDate: generateRandomDate(dayjs().subtract(1, 'year'), dayjs()),
});

export const generateMovieCard = () => ({
  id: nanoid(),
  movieData: generateMovieInfo(),
  userData: generateUserData(),
  comments: generateCommentsList()
});
