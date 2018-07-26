const Squad = require('../models/squad');

const pinForAll = (bot) => {
  let chats;
  Squad.find({}).then(res=>{
    chats = res.map(v=>v.chat_id)
  }).catch(err=>console.log(err));

  bot.onText(/\/pin (.+)/, (msg, match) => {
    if([83517095,86007368].includes (msg.from.id)){
      const resp = match[1];
      for(let i=0; i<chats.length; i++){
        bot.sendMessage(chats[i], resp).then(m => {
            bot.pinChatMessage(chats[i], m.message_id)
          }
        )
      }
    }
  });

  setInterval(()=>{
      let curDate = new Date().getUTCHours() + ':' + new Date().getUTCMinutes();
      if (['6:00','14:00','22:00'].includes(curDate)) {
        for(let i=0; i<chats.length; i++) {
          bot.unpinChatMessage(chats[i])
        }
      }
  },1000);
};

module.exports = pinForAll;
