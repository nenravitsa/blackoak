const Warrior = require('../models/warrior');

const initialize = (bot) => {

  const user_keyboard = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [['Мои ачивки']]
    }
  };

  bot.onText(/\/start|⬅️Назад/, (msg) => {
    if(msg.chat.type==='private'){
      bot.sendMessage(msg.chat.id, '🌟✨💫🌙', user_keyboard)
    }
  });

  bot.onText(/(.+)/, (msg, match) => {
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
