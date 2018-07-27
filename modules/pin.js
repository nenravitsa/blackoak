const pinForAll = (bot, chats, admins) => {
  bot.onText(/\/pin (.+)/, (msg, match) => {
      if(admins.includes(msg.from.id)){
        const resp = match[1];
        for(let i=0; i<chats.length; i++){
          bot.sendMessage(chats[i], resp).then(m => {
              bot.pinChatMessage(chats[i], m.message_id)}
          )
        }
      }
    })
};

const unpinForAll = (bot, chats, admins) => {
  bot.onText(/\/unpin/, (msg) => {
      if(admins.includes(msg.from.id)){
        for(let i=0; i<chats.length; i++) {
          bot.unpinChatMessage(chats[i])
        }
      }
    })
};

module.exports = {pinForAll, unpinForAll};
