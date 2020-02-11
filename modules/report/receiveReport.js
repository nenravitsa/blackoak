const getAch = require('../../helpers/getAchievement');
const parseMessage = require('./parseMessage');
const date = require('../../helpers/date');
const messages = require('../../../messages');
const findAndUpdate = require('./findAndUpdate');
const Warrior = require('../../src/models/warrior');

const receiveReport = bot => {
  bot.onText(/[🍁🌹🍆🦇🐢🖤☘️](.*?⚔:)(.+)/, msg => {
    if (msg.forward_from && msg.forward_from.id === 265204902) {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      if (msg.date - msg.forward_date > 600) {
        bot.sendMessage(chatId, 'Пришли мне, пожалуйста, свежий репорт.', {
          reply_to_message_id: msg.message_id
        });
        getAch(bot, userId, '⌛ Старо как мир');
      }
      if (msg.chat.type === 'private') {
        getAch(bot, userId, '⛔ Не туда');
      } else if (msg.date - msg.forward_date < 600) {
        const username = msg.from.username;
        const b_date = date.nearestBattleTime(new Date());
        const parse = parseMessage(msg.text);
        let message, ach;
        Warrior.findOne({
          squad: msg.chat.title,
          'battles.date': b_date.toISOString()
        }).then(res => {
          if (res == null) {
            getAch(bot, msg.from.id, '💃 Самый быстрый воен дуба');
          }
        });
        if (parse.exp === 0) {
          message =
            messages.lose[[Math.floor(Math.random() * messages.lose.length)]];
          ach = '💤 Все проспал';
        } else if (parse.exp === 1) {
          message =
            `|￣￣￣￣￣￣￣￣￣￣￣| \n` +
            `|     1 EXP         |\n` +
            `|    WARRIORS       |\n` +
            `|＿＿＿＿＿＿＿＿＿＿＿|\n` +
            `           (\\__/) ||\n` +
            `           (•ㅅ•)  ||\n` +
            `          /      づ`;
        } else if (parse.gold && parse.gold < 0) {
          message = 'Не забывай сливать голду, пирожочек!';
          ach = '🙊 Расточитель богатств';
        } else {
          message =
            messages.win[[Math.floor(Math.random() * messages.win.length)]];
          ach = '';
        }
        findAndUpdate(bot, msg, username, b_date, message, ach, parse);
      }
    }
  });
};

module.exports = receiveReport;
