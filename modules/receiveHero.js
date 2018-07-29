const stats = require('../helpers/getStats');
const Warrior = require('../models/warrior');

const receiveHero = (bot) => {
  bot.onText(/[🍁🌹🍆🦇🐢🖤☘️](\w+\n🏅)(.+)/, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902) {
      const chatId = msg.chat.id;
      if ((msg.date - msg.forward_date) > 4600) {
        bot.sendMessage(chatId, 'Пришли мне, пожалуйста, свежий профиль.', {reply_to_message_id: msg.message_id});
      }
      else {
        const castle = msg.text.match(/(🍁|🌹|🍆|🦇|🐢|🖤|☘️)/)[1];
        const cw_name = msg.text.match(/[🍁🌹🍆🦇🐢🖤☘️]([a-zA-Z0-9А-Яа-яёЁ\s\[\]]+)/)[1];
        const lvl = msg.text.match(/🏅Уровень: (\d+)/)[1];
        const attack = stats.getStats(msg.text.match(/⚔Атака: (\d+\(?[+-]?\d*)/)[1]);
        const protec = stats.getStats(msg.text.match(/🛡Защита: (\d+\(?[+-]?\d*)/)[1]);
        const pet = msg.text.match(/[🐎🐷]([a-zA-Z0-9А-Яа-яёЁ\s]+\(\d+ lvl\))/) ? msg.text.match(/[🐎🐷]([a-zA-Z0-9А-Яа-яёЁ\s]+\(\d+ lvl\))/)[1] : null;
        const weapons = msg.text.match(/\n([\w ']+\+\d+⚔[^ ])/g);
        const armor = msg.text.match(/\n([\w ']+\+\d+🛡)/g);
        const arWithAttac = msg.text.match(/\n([\w ']+\+\d+⚔️ \+\d+🛡)/g);
      }
      Warrior.findOne({t_id:msg.from.id}).then((res)=>{})
      //bot.sendMessage(chatId, message, {reply_to_message_id: msg.message_id});

    }
  });
};

module.exports = receiveHero;