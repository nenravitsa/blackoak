const date = require('../helpers/date');
const Warrior = require('../models/warrior');
const mongoose = require('mongoose');


const weekReport = (bot) => {
  bot.onText(/\/week/, (msg) => {
    const chatId = msg.chat.id;
    const b_time = date.nearestBattleTime(new Date()).toISOString();
    const sunday = date.getLastSunday(b_time);
    // Warrior.find({squad: msg.chat.title}, {
    //   battles: {$all: {date: {$gte: sunday}}},
    //   _id: 0
    // }).then(res => console.log(res))
    Warrior.aggregate([
      {$unwind: "$battles"},
      {$match:{squad: msg.chat.title, 'battles.date':{$gte: sunday}}},
      {$group:{_id:'$cw_name',
          amount:{$sum:1},
          totalExp:{$sum: "$battles.exp"},
          totalGold:{$sum:"$battles.gold"},
          totalStock:{$sum:"$battles.stock"}
        }
      }
      ]).then(res => console.log(res)).catch(console.log)
    //bot.sendMessage(chatId, 'test', {reply_to_message_id: msg.message_id});
  });
};

module.exports = weekReport;