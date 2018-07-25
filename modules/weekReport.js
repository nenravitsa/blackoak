const date = require('../helpers/date');
const Warrior = require('../models/warrior');

const weekReport = (bot) => {
  bot.onText(/\/week/, (msg) => {
    const chatId = msg.chat.id;
    const b_time = date.nearestBattleTime(new Date());
    Warrior.find({
      battles:{$elemMatch: { date: { $gte: date.getLastSunday(b_time).toISOString(), $lte:  b_time.toISOString()}}}
    })
      .then(res=>console.log())
    bot.sendMessage(chatId, 'Тест!');
  });
};

module.exports = weekReport;