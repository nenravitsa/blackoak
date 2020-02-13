const getAch = require('../helpers/getAchievement');
const Warrior = require('../models/warrior');
const mottoText = /Навечно вместе все, кто смел, кто тайну сохранить сумел! Навеки в радости и в грусти наш дуб злодеям не найти!/;

const achievementQueries = bot => {
  bot.onText(/Ты задержал/, msg => {
    if (msg.forward_from && msg.forward_from.id === 265204902) {
      if (msg.date - msg.forward_date > 3000) {
        bot.sendMessage(
          msg.chat.id,
          'Нужно свежее сообщение. Ты не успел, увы!',
          { reply_to_message_id: msg.message_id }
        );
      } else {
        Warrior.findOne({ t_id: id }, { _id: 0, caravans: 1, t_id: 1 }).then(
          res => {
            if (res && res.t_id === msg.from.id) {
              const caravansCount = res.caravans;
              const newCount = caravansCount ? caravansCount + 1 : 1;
              Warrior.findOneAndUpdate({ t_id: id }, { caravans: newCount })
                .then(res => console.log('caravan: ', res.t_name))
                .catch(err => console.log(err));
              switch (newCount) {
                case 10:
                  getAch(bot, msg.from.id, '🦁 Гроза воришек');
                  break;
                case 50:
                  getAch(bot, msg.from.id, '⚡️️ Бдителен и стремителен');
                  break;
                case 100:
                  getAch(bot, msg.from.id, '🥇️ Unstoppable');
                  break;
                default:
                  bot.sendMessage(msg.from.id, 'Принято!');
                  getAch(bot, msg.from.id, '🐫 Защитник корована');
                  break;
              }
            }
          }
        );
      }
    }
  });

  bot.onText(/Ты упустил/, msg => {
    if (msg.forward_from && msg.forward_from.id === 265204902) {
      getAch(bot, msg.from.id, '💩 Эх, упустил');
    }
  });

  bot.onText(/Поздравляем!/, msg => {
    if (msg.forward_from && msg.forward_from.id === 265204902) {
      Warrior.findOne({ t_id: id }, { _id: 0, t_id: 1 }).then(res => {
        if (res && res.t_id === msg.from.id) {
          getAch(bot, msg.from.id, '🏆 Вкус первой победы');
        }
      });
    }
  });

  bot.onText(mottoText, msg => {
    getAch(bot, msg.from.id, '🌳 Один за всех и все за одного');
  });
};

module.exports = achievementQueries;
