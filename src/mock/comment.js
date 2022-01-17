import dayjs from 'dayjs';
import { COMMENTS, EMOJI, NAMES } from '../mock-data.js';
import {getRandomItem, generateRandomDate, humanizeCommentDate} from '../utils/utils.js';
import {nanoid} from 'nanoid';

export const generateComment = () => {
  const commentData = {
    id: nanoid(),
    author: getRandomItem(NAMES),
    comment: getRandomItem(COMMENTS),
    date: humanizeCommentDate(generateRandomDate(dayjs('1994-05-12'))),
    emotion: getRandomItem(EMOJI)
  };

  return {
    commentData
  };
};
