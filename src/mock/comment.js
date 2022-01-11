import dayjs from 'dayjs';
import { COMMENTS, EMOJI, NAMES } from '../mock-data.js';
import {getRandomItem, generateRandomDate, humanizeCommentDate} from '../utils/utils.js';
import {nanoid} from 'nanoid';

export const generateComment = () => ({
  id: nanoid(),
  emotion: getRandomItem(EMOJI),
  comment: getRandomItem(COMMENTS),
  author: getRandomItem(NAMES),
  date: humanizeCommentDate(generateRandomDate(dayjs('1994-05-12'))),
});
