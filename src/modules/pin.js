const getChats = require('../helpers/getChats');

const pinForAll = (bot, admins) => {
  bot.onText(/\/pin (.+)/, (msg, match) => {
    getChats().then(chats => {
      if (admins.includes(msg.from.id)) {
        const resp = match[1];
        for (let i = 0; i < chats.id.length; i++) {
          bot.sendMessage(chats.id[i], resp).then(m => {
            bot.pinChatMessage(chats.id[i], m.message_id);
          });
        }
      }
    });
  });
  bot.onText(/\/spin (.+)/, (msg, match) => {
    console.log('Pin from: ', msg.from.id);
    getChats().then(chats => {
      if (admins.includes(msg.from.id)) {
        const resp = match[1];
        for (let i = 0; i < chats.id.length; i++) {
          bot.sendMessage(chats.id[i], resp).then(m =>
            bot.pinChatMessage(chats.id[i], m.message_id, {
              disable_notification: true
            })
          );
        }
      }
    });
  });
};

const unpinForAll = (bot, admins) => {
  bot.onText(/\/unpin/, msg => {
    getChats().then(chats => {
      if (admins.includes(msg.from.id)) {
        for (let i = 0; i < chats.id.length; i++) {
          bot.unpinChatMessage(chats.id[i]);
        }
      }
    });
  });
};

module.exports = { pinForAll, unpinForAll };
