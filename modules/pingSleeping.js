const Warrior = require('../models/warrior');

const getPingList = async (sleep) => {
  try {
    const get = sleep.map(async s => {
      return await Warrior.findOne({cw_name: s}, {
        t_name: 1,
        _id: 0
      })
    });
    return Promise.all(get);
  }
  catch (e) {console.log(e)}
}

const pingSleeping = (bot) => {
  const regex = /\[🛌\]([a-zA-Z0-9А-Яа-яёЁ\s\[\] _]+)/;
  bot.onText(regex, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902&&(msg.date - msg.forward_date) < 1600) {
      const chatId = msg.chat.id;
      const s = msg.text.match(/\[🛌\]([a-zA-Z0-9А-Яа-яёЁ\s\[\] _]+)/g);
      const sleep = s.map(v => '[DUB]' + v.match(regex)[1].replace('\n', '').replace(' ', '') + ' ');
      getPingList(sleep).then(res => {
        const clearRes = res.filter(v => v != null);
        const names = clearRes.map(v => '@' + v.t_name);
        const message = `Скоро битва, не спать! ${names.join(', ')}`;
        bot.sendMessage(chatId, message);
      })
    }
  });
};

module.exports = pingSleeping;