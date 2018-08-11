const getAch = require('../../helpers/getAchievement');
const parseMessage = require('./parseMessage');
const createUser = require('./createUser');
const updateUser = require('./updateUser');
const date = require('../../helpers/date');
const messages = require('../../messages');
const Warrior = require('../../models/warrior');

const receiveReport = (bot) => {
  bot.onText(/[🍁🌹🍆🦇🐢🖤☘️](.*?⚔:)(.+)/, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902) {
      const chatId = msg.chat.id;
      if ((msg.date - msg.forward_date) > 600) {
        bot.sendMessage(chatId, 'Пришли мне, пожалуйста, свежий репорт.', {reply_to_message_id: msg.message_id});
        getAch(bot, userId, "⌛ Старо как мир")
      }
      if(chatId === -1001175776732) {
        getAch(bot, msg.from.id, "⛔ Не туда")
      }
      else {
        const userId = msg.from.id;
        const username = msg.from.username;
        const b_date = date.nearestBattleTime(new Date());
        const parse = parseMessage(msg.text);
        let message, ach;
        if(parse.exp === 0) {message = "В следующий раз не проспи!"; ach = "💤 Все проспал"}
        else if(parse.gold && parse.gold < 0){message = "Не забывай сливать голду, пирожочек!"; ach = '🙊 Расточитель богатств'}
        else {message = messages[[Math.floor(Math.random() * messages.length)]]; ach=''}
        Warrior.findOne({t_id:userId}).then((res)=>{
          if(res){
            const isName = res.cw_name===parse.cw_name;
            const isOld = ~res.battles.findIndex(v=>v.date.getTime()===b_date.getTime());
            if(!isName) {
              bot.sendMessage(chatId, 'Это не твой репорт. Не обманывай.', {reply_to_message_id: msg.message_id});
              getAch(bot, msg.from.id, '🐞 Нереальный жучара')
            }
            if (isOld){
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
      }
    }
  })
};

module.exports = receiveReport;
