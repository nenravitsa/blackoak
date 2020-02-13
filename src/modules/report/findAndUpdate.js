const Warrior = require('../../models/warrior');
const createUser = require('./createUser');
const updateUser = require('./updateUser');
const getAch = require('../../helpers/getAchievement');

const findAndUpdate = (bot, msg, username, b_date, message, ach, parse) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  Warrior.findOne({t_id:userId}).then((res)=>{
    if(res){
      const isName = res.cw_name===parse.cw_name;
      const isOld = ~res.battles.findIndex(v=>v.date.getTime()===b_date.getTime());
      if(!isName) {
        bot.sendMessage(chatId, 'Это не твой репорт. Не обманывай.', {reply_to_message_id: msg.message_id});
        getAch(bot, msg.from.id, '🐞 Нереальный жучара')
      }
      else if (isOld){
        bot.sendMessage(chatId, 'Репорт уже принят!', {reply_to_message_id: msg.message_id});
        getAch(bot, msg.from.id, '🔁 Повторение мать учения')
      }
      else if(isName&&!isOld) {
        updateUser(res, parse, userId, username, msg.chat.title, bot);
        const battle = {
          date: b_date,
          exp: parse.exp,
          gold: parse.gold,
          stock: parse.stock
        };
        res.battles.push(battle);
        res.save().then(() => {
          bot.sendMessage(chatId, message, {reply_to_message_id: msg.message_id});
          if(ach.length>0) {
            getAch(bot, msg.from.id, ach)
          }
        }).catch(err => console.error(err))
      }
    }
    else {
      createUser(parse, userId, username, msg.chat.title, b_date).then(()=>{
        const add = '\n\n Получено новое достижение: 👋 Привет, новичок! \n\n Чтобы получать сообщения о новых ачивках, нажми \/start в личной переписке с ботом';
        bot.sendMessage(chatId, message+add, {reply_to_message_id: msg.message_id});
      }).catch(err=> console.log('text', msg.text, 'err: ', err));
    }
  })
};

module.exports = findAndUpdate;
