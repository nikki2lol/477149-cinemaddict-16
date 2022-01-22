export const MOVIES_TOTAL = 45;
export const MOVIES_TOTAL_SUB = 2;
export const COMMENTS_TOTAL = 100;
export const MOVIES_COUNT_PER_STEP = 5;

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const ActionType = {
  UPDATE_CARD: 'UPDATE_CARD',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const FilterType = {
  ALL: {type: 'all', name: 'All movies'},
  WATCHLIST: {type: 'watchlist', name: 'Watchlist'},
  HISTORY: {type: 'history', name: 'History'},
  FAVORITES: {type: 'favorites', name: 'Favorites'}
};

export const NoTasksTextContent = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now'
};

export const TITLE_SECTION_MAIN = 'All movies. Upcoming';
export const TITLE_SECTION_TOP = 'Top rated';
export const TITLE_SECTION_COMMENTED = 'Most commented';

export const ScreenView = {
  MOVIES: 'films',
  STATS: 'stats'
};

export const StatsFilterType = {
  ALL: {type: 'all-time', name: 'All time'},
  TODAY: {type: 'today', name: 'Today'},
  WEEK: {type: 'week', name: 'Week'},
  MONTH: {type: 'month', name: 'Month'},
  YEAR: {type: 'year', name: 'Year'}
};
