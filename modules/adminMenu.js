const buttons = require('../buttons');
const Warrior = require('../models/warrior');

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
  const user_keyboard = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [['Мои ачивки']]
    }
  };

  bot.onText(/\/start|⬅️Назад/, (msg) => {
    // if(isLegit(msg.chat.type, msg.from.id)){
    //   bot.sendMessage(msg.chat.id, 'Посмотреть подробную статистику по отрядам', keyboard)
    // }
    if(msg.chat.type==='private'){
      bot.sendMessage(msg.chat.id, '🌟✨💫🌙', user_keyboard)
    }
  });
  let chat;
  bot.onText(/(.+)/, (msg, match) => {
      // if(isLegit(msg.chat.type, msg.from.id)){
      //   const index = chats.title.indexOf(match[0]);
      //   if(index!==-1){
      //     chat = chats.title[index];
      //     if(match[0]===chat) bot.sendMessage(msg.chat.id, `Информация об отряде ${chat}`, buttons.stat_keyboard)
      //   }
      //   if(match[0]==='🐰 Петы') bot.sendMessage(msg.chat.id, `Петы отряда ${chat}`, buttons.pets_keyboard);
      //   if(match[0]==='😿 У кого нет') bot.sendMessage(msg.chat.id, `Еще не завели животных в отряде ${chat}`);
      // }
      if(msg.chat.type==='private'){
        if(match[0]==='Мои ачивки'){
          let message = '';
          Warrior.findOne({t_id:msg.from.id}, {achievements:1, _id:0})
            .then(res => {
              if(res.achievements==null||res.achievements.length===0){
                bot.sendMessage(msg.chat.id, 'Ачивок пока нет 😔')
              }
              else {
                message = ' 🏅 *Достижения* 🏅 \n\n'+res.achievements.join('\n')
                bot.sendMessage(msg.chat.id, message,{
                  parse_mode: "Markdown"
                })
              }
            })
        }
      }
  });
};



module.exports = initialize;
