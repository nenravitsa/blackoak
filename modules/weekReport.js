const date = require('../helpers/date');
const Warrior = require('../models/warrior');
const check = require('../helpers/checkChat');

const weekReport = (bot) => {
  bot.onText(/\/week/, (msg) => {
    const chatId = msg.chat.id;
    if(!check(chatId, msg.from.id, bot)) {
      const b_time = date.nearestBattleTime(new Date());
      const sunday = date.getLastSunday(b_time);
      Warrior.aggregate([
        {$unwind: "$battles"},
        {$match: {squad: msg.chat.title, 'battles.date': {$gte: sunday}}},
        {
          $group: {
            _id: '$cw_name',
            amount: {$sum: 1},
            totalExp: {$sum: "$battles.exp"},
            totalGold: {$sum: "$battles.gold"},
            totalStock: {$sum: "$battles.stock"}
          }
        },
        {$sort: {amount: -1}}
      ]).then(res => {
        console.log(res);
        if (!res || res.length === 0) {
          bot.sendMessage(chatId, 'Пока никто не прислал репорт 😥')
        }
        else {
          const report = res.map((v, i) => `#${i + 1} ${v._id} [Битв: ${v.amount}] \n 🔥${v.totalExp} 💰 ${v.totalGold} 📦 ${v.totalStock}`);
          const message = 'Отчет за текущую неделю: \n' + report.join('\n');
          bot.sendMessage(chatId, message);
        }
      }).catch(console.log)
    }
  });
};

module.exports = weekReport;