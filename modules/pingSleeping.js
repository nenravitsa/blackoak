const Warrior = require('../models/warrior');

Object.defineProperty(Array.prototype, 'chunk', {
  value: function(chunkSize) {
    const that = this;
    return Array(Math.ceil(that.length/chunkSize)).fill().map(function(_,i){
      return that.slice(i*chunkSize,i*chunkSize+chunkSize);
    });
  }
});

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
        const chunks = names.chunk(5);
        chunks.map(v => bot.sendMessage(chatId, `Скоро битва, не спать! ${v.join(', ')}`));
      })
    }
  });
};

module.exports = pingSleeping;
