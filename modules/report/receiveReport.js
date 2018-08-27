const getAch = require('../../helpers/getAchievement');
const parseMessage = require('./parseMessage');
const date = require('../../helpers/date');
const messages = require('../../messages');
const findAndUpdate = require('./findAndUpdate');

const receiveReport = (bot) => {
  bot.onText(/[🍁🌹🍆🦇🐢🖤☘️](.*?⚔:)(.+)/, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902) {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      if ((msg.date - msg.forward_date) > 600) {
        bot.sendMessage(chatId, 'Пришли мне, пожалуйста, свежий репорт.', {reply_to_message_id: msg.message_id});
        getAch(bot, userId, "⌛ Старо как мир")
      }
      if(msg.chat.type==='private') {
        getAch(bot, userId, "⛔ Не туда")
      }
      else {
        const username = msg.from.username;
        const b_date = date.nearestBattleTime(new Date());
        const parse = parseMessage(msg.text);
        let message, ach;
        if(parse.exp === 0) {message = "В следующий раз не проспи!"; ach = "💤 Все проспал"}
        else if(parse.gold && parse.gold < 0){message = "Не забывай сливать голду, пирожочек!"; ach = '🙊 Расточитель богатств'}
        else {message = messages[[Math.floor(Math.random() * messages.length)]]; ach=''}
        findAndUpdate(bot, msg, username, b_date, message, ach, parse)
      }
    }
  })
};

module.exports = receiveReport;
