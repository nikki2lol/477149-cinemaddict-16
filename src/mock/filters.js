const moviesFilters = {
  all: (movies) => movies.length,
  watchList: (movies) => movies.filter(({ userData }) => userData.isInWatchlist).length,
  history: (movies) => movies.filter(({ userData }) => userData.isAlreadyWatched).length,
  favorites: (movies) => movies.filter(({ userData }) => userData.isFavorite).length,
};

export const generateFilter = (movies) => Object.entries(moviesFilters).map(
  ([filterName, countMovies]) => ({
    name: filterName,
    count: countMovies(movies),
  })
);
