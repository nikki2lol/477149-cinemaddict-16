import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

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
    minutes: m,
  };
};

export const humanizeReleaseDate = (date) => dayjs(date).format('D MMMM YYYY');

export const getSortedMovies = (movies, sortType) => (
  movies.sort((current, next) => {
    if (sortType === 'date') {
      return dayjs(next.movieData.release.date).diff(dayjs(current.movieData.release.date));
    }
    if (sortType === 'rating') {
      return next.movieData.rating - current.movieData.rating;
    }
    if (sortType === 'comments') {
      return next.comments.length - current.comments.length;
    }
  })
);

export const getTimeFromNow = (date) => dayjs(date).fromNow();
