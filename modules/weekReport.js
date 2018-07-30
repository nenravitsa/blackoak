const date = require('../helpers/date');
const Warrior = require('../models/warrior');

const weekReport = (bot) => {
  bot.onText(/\/week/, (msg) => {
    const chatId = msg.chat.id;
    const b_time = date.nearestBattleTime(new Date()).toISOString();
    const sunday = date.getLastSunday(b_time).toISOString();
    Warrior.aggregate([
      {$match:{squad: msg.chat.title}},
      {$unwind: "$battles"},
      {$match:{battles:{ $elemMatch: {date: { $gte: sunday}}}}},
      {$group:{_id:'$cw_name', week_battles:{$push:'$battles'}}}
    ]).then(res => console.log(res))
  });
};

module.exports = weekReport;