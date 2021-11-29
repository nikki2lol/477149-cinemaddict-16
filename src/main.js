import {renderTemplate, RenderPosition} from './render';

import {createRankTemplate} from './view/rank-view';
import {createMenuTemplate} from './view/menu-view';
import {createSortTemplate} from './view/sort-view';
import {createMainContentTemplate} from './view/cinema-content-view';
import {createStatsTemplate} from './view/stats-view';
import {createCardsTemplate} from './view/cards-view';
import {createDetailsTemplate} from './view/details-view';
import {createLoadMoreButtonTemplate} from './view/load-more-button-view';

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

renderTemplate(header, createRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(main, createMenuTemplate());
renderTemplate(main, createSortTemplate());
renderTemplate(main, createMainContentTemplate());

const cinemaContent = main.querySelector('.films');
const cinemaList = cinemaContent.querySelector('.films-list__container');

renderTemplate(cinemaList, createCardsTemplate());
renderTemplate(cinemaList, createLoadMoreButtonTemplate());
renderTemplate(cinemaContent, createDetailsTemplate());
renderTemplate(footer, createStatsTemplate());
