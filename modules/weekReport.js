const date = require('../helpers/date');
const Warrior = require('../models/warrior');

const weekReport = (bot) => {
  bot.onText(/\/week/, (msg) => {
    const chatId = msg.chat.id;
    const b_time = date.nearestBattleTime(new Date());
    console.log(date.getMonday(b_time).toISOString(), b_time)
    Warrior.find({
      battles:{$elemMatch: { date: { $gte: date.getMonday(b_time).toISOString(), $lte:  b_time.toISOString()}}}
    })
      .then(res=>console.log(res))
    bot.sendMessage(chatId, 'Тест!');
  });
};

module.exports = {weekReport};