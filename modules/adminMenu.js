const Warrior = require('../models/warrior');
const getChats = require('../helpers/getChats');

const initialize = (bot, admins) => {
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

  bot.onText(/\/stat/, (msg) => {
    if(msg.chat.type==='private' && admins.includes(msg.from.id)){
      Warrior.aggregate([
        {
          $group: {
            _id: null,
            totalAttack: {
              $sum: "$attack"
            },
            totalProtec: {
              $sum: "$protec"
            }
          }
        }
      ]).then(
        res => {
          const report = `Общая защита: ${res[0].totalProtec} \n Общая атака: ${res[0].totalAttack}`;
          bot.sendMessage(msg.chat.id, report);
        }
      )
    }
  });
  bot.onText(/\/delete (.+)/, (msg, match) => {
    if(admins.includes(msg.from.id)){
      Warrior.findOneAndDelete({t_name: match[1]}).then(res => {
        if(!res)  bot.sendMessage(msg.chat.id, "Такого пользователя нет в базе либо произошла другая ошибка. Извини :с")
        else bot.sendMessage(msg.chat.id, "Боец удален из отряда!")
      })
    }
  });

  bot.onText(/\/chats/, (msg) => {
    if(msg.chat.type==='private' && admins.includes(msg.from.id)) {
      getChats().then(chats => {
        bot.sendMessage(msg.chat.id, chats.title.join('\n'))
      });
    }
  });

  bot.onText(/\/onetimecode/, (msg) => {
    if(msg.chat.type==='private' && admins.includes(msg.from.id)) {
     const oneTimeCode = (+new Date).toString(36).slice(-8);
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
