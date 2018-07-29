const buttons = require('../buttons');

const initialize = (bot, chats, admins) => {
  const isLegit = (type, id) => {
    return type==='private'&&admins.includes(id)
  };

  const keyboard = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [chats.title]
    }
  };

  bot.onText(/\/start|⬅️Назад/, (msg) => {
    if(isLegit(msg.chat.type, msg.from.id)){
      bot.sendMessage(msg.chat.id, 'Посмотреть подробную статистику по отрядам', keyboard)
    }
  });
  let chat;
  bot.onText(/(.+)/, (msg, match) => {
      if(isLegit(msg.chat.type, msg.from.id)){
        const index = chats.title.indexOf(match[0]);
        if(index!==-1){
          chat = chats.title[index];
          if(match[0]===chat) bot.sendMessage(msg.chat.id, `Информация об отряде ${chat}`, buttons.stat_keyboard)
        }
        if(match[0]==='🐰 Петы') bot.sendMessage(msg.chat.id, `Петы отряда ${chat}`, buttons.pets_keyboard);
        if(match[0]==='😿 У кого нет') bot.sendMessage(msg.chat.id, `Еще не завели животных в отряде ${chat}`);
      }
  });
};



module.exports = initialize;
