import {StatsFilterType} from '../const';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);

export const isMovieWatchedInPeriod = ({userDetails: {watchingDate}}, period) => {
  if (period === StatsFilterType.ALL.type) {
    return true;
  }
  if (period === StatsFilterType.TODAY.type) {
    return dayjs(watchingDate).isToday();
  }
  return dayjs(watchingDate).isSameOrAfter(dayjs().subtract(1, period));
};

export const getGenresStats = (movies) => {
  const stats = new Map();
  movies.forEach(({movieData: {genre}}) => {
    genre.forEach((item) => {
      const count = stats.has(item) ? stats.get(item) : 0;
      stats.set(item, count + 1);
    });
  });

  return new Map([...stats.entries()].sort((current, next) => next[1] - current[1]));
};
