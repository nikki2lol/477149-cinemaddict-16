import dayjs from 'dayjs';
import { COMMENTS, EMOJI, NAMES } from '../mock-data.js';
import {getRandomItem, generateRandomDate, humanizeCommentDate} from '../utils/utils.js';
let i = 1;

export const generateComment = () => {
  const commentData = {
    id: i.toString(),
    author: getRandomItem(NAMES),
    comment: getRandomItem(COMMENTS),
    date: humanizeCommentDate(generateRandomDate(dayjs('2021-02-07'))),
    emotion: getRandomItem(EMOJI)
  };

  i++;
  return commentData;
};
