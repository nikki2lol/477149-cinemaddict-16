import dayjs from 'dayjs';
import { COMMENTS, EMOJI, NAMES } from '../mock-data.js';
import {getRandomItem, generateRandomDate, humanizeCommentDate} from '../utils/utils.js';

export const generateComment = (id) => {
  const emote = getRandomItem(EMOJI);
  const comment = getRandomItem(COMMENTS);
  const author = getRandomItem(NAMES);
  const date = humanizeCommentDate(generateRandomDate(dayjs('1994-05-12')));

  return {
    id,
    emote,
    comment,
    author,
    date
  };
};
