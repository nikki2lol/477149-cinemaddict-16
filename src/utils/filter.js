import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL.type]: (movies) => movies,
  [FilterType.WATCHLIST.type]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FilterType.HISTORY.type]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.FAVORITES.type]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};

