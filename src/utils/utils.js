import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
export const getRandomNumber = (min, max) =>  Math.floor(Math.random() * (max - min) + min);

export const getRandomItem = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);
  return arr[randomIndex];
};

export const getRandomList = (array, maxLength) => {
  const result = new Array(maxLength);
  let len = array.length;
  const taken = new Array(len);
  while (maxLength--) {
    const x = Math.floor(Math.random() * len);
    result[maxLength] = array[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

export const generateRandomDate = (start, end = dayjs()) => dayjs(start.valueOf() + Math.random() * (end.valueOf() - start.valueOf()));

export const humanizeDuration = (runtime) =>{
  if (runtime < 60){
    return `${runtime}m`;
  } else{
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  }
};
export const getDurationStats = (minutes) => {
  let h = Math.floor(minutes / 60);
  let m = minutes % 60;
  h = h < 10 ? 0 : h;
  m = m < 10 ? 0 : m;
  return {
    hours: h,
    minutes: m
  };
};

export const humanizeReleaseDate = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');

export const humanizeCommentDate = (commentDate) => dayjs(commentDate).format('YYYY/MM/DD HH:mm');

export const getSortedMovies = (movies, sortType) => (
  movies.sort((current, next) => {
    if (sortType === 'date') {
      return dayjs(next.movieData.releaseDate).diff(dayjs(current.movieData.releaseDate));
    }
    if (sortType === 'rating') {
      return next.movieData.rating - current.movieData.rating;
    }
    if (sortType === 'comments') {
      return next.comments.length - current.comments.length;
    }
  })
);
