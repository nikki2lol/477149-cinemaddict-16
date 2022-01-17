import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL.type]: (movies) => movies,
  [FilterType.WATCHLIST.type]: (movies) => movies.filter((movie) => movie.userData.watchlist),
  [FilterType.HISTORY.type]: (movies) => movies.filter((movie) => movie.userData.alreadyWatched),
  [FilterType.FAVORITES.type]: (movies) => movies.filter((movie) => movie.userData.favorite),
};

