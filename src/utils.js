import dayjs from 'dayjs';

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
  console.log(maxLength);
  while (maxLength--) {
    const x = Math.floor(Math.random() * len);
    result[maxLength] = array[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

export const generateRandomDate = (start, end = dayjs()) => dayjs(start.valueOf() + Math.random() * (end.valueOf() - start.valueOf()));

export const humanizeDuration = (duration) =>{
  if (duration < 60){
    return `${duration}m`;
  } else{
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  }
};
export const humanizeReleaseDate = (releaseDate) => dayjs(releaseDate).format('D MMMM YYYY');
export const humanizeCommentDate = (commentDate) => dayjs(commentDate).format('YYYY/MM/DD HH:mm');
