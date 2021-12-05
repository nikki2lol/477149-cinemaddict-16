// 0 — блок со званием не отображается;
// от 1 до 10 — novice;
// от 11 до 20 — fan;
// от 21 и выше — movie buff.
const getUserRank = (count) => {
  let userRank = null;

  if (count >= 21) {
    userRank = 'Movie Buff';
  } else if (count >= 11 && count < 21) {
    userRank = 'Fan';
  } else if (count >= 1 && count < 11) {
    userRank = 'Novice';
  } else {
    userRank = '';
  }
  return userRank;
};

export const createRankTemplate = (counter) => {
  const userRank = getUserRank(counter);
  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
