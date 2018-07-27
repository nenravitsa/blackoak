const Squad = require('../models/squad');

const pinForAll = (bot) => {
  let chats;
  Squad.find({}).then(res=>{
    chats = res.map(v=>v.chat_id)
  }).catch(err=>console.log(err));
  bot.onText(/\/pin (.+)/, (msg, match) => {
    bot.getChatAdministrators(msg.chat.id).then(res=>{
      const admins = res.map(v=>v.user.id);
      if(admins.includes(msg.from.id)){
        const resp = match[1];
        for(let i=0; i<chats.length; i++){
          bot.sendMessage(chats[i], resp).then(m => {
              bot.pinChatMessage(chats[i], m.message_id)}
          )
        }
      }
    })
  });
};

const unpinForAll = (bot) => {
  let chats;
  Squad.find({}).then(res=>{
    chats = res.map(v=>v.chat_id)
  }).catch(err=>console.log(err));
  bot.onText(/\/unpin/, (msg) => {
    bot.getChatAdministrators(msg.chat.id).then(res=>{
      const admins = res.map(v=>v.user.id);
      if(admins.includes(msg.from.id)){
        for(let i=0; i<chats.length; i++) {
          bot.unpinChatMessage(chats[i])
        }
      }
    })
  });
};

module.exports = {pinForAll, unpinForAll};
