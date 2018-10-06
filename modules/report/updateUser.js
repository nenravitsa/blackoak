const updateWarrior = require('../../helpers/update');
const getAch = require('../../helpers/getAchievement');

const updateUser = (user, parse, id, username, squad, bot) => {
  //add new warrior to squad
  if(!user.squad){updateWarrior(id, 'squad', squad)}
  //update warrior info if it's necessary
  //if(username)
  if(user.lvl!==parse.lvl){updateWarrior(id, 'lvl', parse.lvl)}
  if(user.attack!==parse.attack){updateWarrior(id, 'attack', parse.attack)}
  if(user.protec!==parse.protec){updateWarrior(id, 'protec', parse.protec)}
  if(user.castle!==parse.castle){updateWarrior(id, 'castle', parse.castle)}

  const newReportsCount = user.reports ? (user.reports+1) : 1;
  updateWarrior(id, 'reports', newReportsCount);
  switch (newReportsCount) {
    case 10: getAch(bot, id, '👏 Верный гильдеец');
      break;
    case 50: getAch(bot, id, '✊️ Надежда гильдии');
      break;
    case 100: getAch(bot, id, '🎖️ Ветеран сражений');
      break;
    case 150: getAch(bot, id, '🌚 Легенда');
      break;
    default: break
  }
}

module.exports = updateUser;
