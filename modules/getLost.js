const Warrior = require('../models/warrior');
const date = require('../helpers/date');
const check = require('../helpers/checkChat');

const getLost = (bot) => {
  bot.onText(/\/lost/, (msg) => {
    const chatId = msg.chat.id;
    if(!check(chatId, msg.from.id, bot)) {
      const b_time = date.nearestBattleTime(new Date());
      Warrior.find({squad: msg.chat.title, 'battles.date': {$ne: b_time}}, {
        t_name: 1,
        cw_name: 1,
        _id: 0
      }).then(res => {
        if (!res || (res && res.length === 0)) {
          bot.sendMessage(chatId, '💯 /ogo! Сегодня на битве были все! 💯');
        }
        else {
          const losts = res.map(v => '@' + v.t_name + "|" + v.cw_name);
          const message = '😔 Кто не участвовал в битве:\n\n' +
            losts.join('\n');
          bot.sendMessage(chatId, message);
        }
      })
    }
  });
};

module.exports = getLost;