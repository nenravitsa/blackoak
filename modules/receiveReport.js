const Warrior = require('../models/warrior');
const date = require('../helpers/date');
const stats = require('../helpers/getStats');
const messages = ['Ого, это все тебе?', 'Спасибо, котик!', 'Ты настоящий воен!', 'Ты самый(ая) лучший(ая)!', '❤❤❤❤', 'Ты лучший воен!', 'Гильдия запомнит твой подвиг!', '/ogo', 'А ты мне нравишься!'];

const receiveReport = (bot) => {
  bot.onText(/[🍁🌹🍆🦇🐢🖤☘️](.*?⚔:)(.+)/, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902) {
      const chatId = msg.chat.id;
      if ((msg.date - msg.forward_date) > 600) {
        bot.sendMessage(chatId, 'Пришли мне, пожалуйста, свежий репорт.', {reply_to_message_id: msg.message_id});
      }
      else {
        const exp = msg.text.match(/Exp: (\d+)/) ? parseInt(msg.text.match(/Exp: (\d+)/)[1]) : 0;
        const gold = msg.text.match(/Gold: (-?\d+)/) ? parseInt(msg.text.match(/Gold: (-?\d+)/)[1]) : 0;
        const stock = msg.text.match(/Stock: (-?\d+)/) ? parseInt(msg.text.match(/Stock: (-?\d+)/)[1]) : 0;
        const b_date = date.nearestBattleTime(new Date());
        let text;
        if(exp === 0) {text = "В следующий раз не проспи!"}
        else if(gold && gold < 0){text = "Не забывай сливать голду, пирожочек!"}
        else {text = messages[[Math.floor(Math.random() * messages.length)]]}
        const battle = {
          date: b_date,
          exp: exp,
          gold: gold,
          stock: stock
        };
        //check if player with provided telegram id already in db
        //todo: check if report belong to player
        Warrior.findOne({t_id:msg.from.id}).then((res)=>{
          console.log(res)
          if(res==null){
            const warrior = new Warrior({
              t_id:msg.from.id,
              t_name:msg.from.username,
              cw_name:msg.text.match(/[🍁🌹🍆🦇🐢🖤☘️]([a-zA-Z0-9А-Яа-яёЁ\s\[\]]+)/)[1],
              castle:msg.text.match(/(🍁|🌹|🍆|🦇|🐢|🖤|☘️)/)[1],
              lvl:msg.text.match(/Lvl: (\d+)/)[1],
              attack:stats.getStats(msg.text.match(/⚔:(-?\d+\(?[+-]?\d+)/)[1]),
              protec:stats.getStats(msg.text.match(/🛡:(-?\d+\(?[+-]?\d+)/)[1]),
              battles:[battle]
            });
            warrior.save().then(()=>{
              bot.sendMessage(chatId, text, {reply_to_message_id: msg.message_id});
            }).catch(err=>console.error(err));
          }
          else {
            if (~res.battles.findIndex(v=>v.date.getTime()===b_date.getTime())){
              bot.sendMessage(chatId, 'Репорт уже принят!', {reply_to_message_id: msg.message_id});
            }
            else {
              res.battles.push(battle);
              res.save().then(() => {
                bot.sendMessage(chatId, text, {reply_to_message_id: msg.message_id});
              }).catch(err => console.error(err))
            }
          }
        });

      }
    }
  });
};

module.exports = {receiveReport};