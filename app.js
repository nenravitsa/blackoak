const TOKEN = process.env.TOKEN||require('./parameters').token;
const TelegramBot = require('node-telegram-bot-api');
const mongoURI = process.env.MONGO_URL||require('./parameters').path;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Warrior = require('./models/warrior');
const date = require('./helpers/date');

const options = {
  webHook: {
    port: 443
  }
};
if(process.env.NODE_ENV === 'production') {
  const url = 'blackoak.now.sh';
  const bot = new TelegramBot(TOKEN, options);
  bot.setWebHook(`${url}/bot${TOKEN}`);
}
else bot = new TelegramBot(TOKEN, {polling: true});

mongoose.connect(mongoURI, { useNewUrlParser: true });

mongoose.connection.once('open', ()=>{console.log('connection has been made')})
  .on('error', error=>console.log(error));

const messages = ['Ого, это все тебе?', 'Спасибо, котик!', 'Ты настоящий воен!', 'Ты самый(ая) лучший(ая)!', '❤❤❤❤', 'Ты лучший воен!', 'Гильдия запомнит твой подвиг!'];

bot.onText(/[🍁🌹🍆🦇🐢🖤☘️](.*?⚔:)(.+)/, (msg) => {
  if(msg.forward_from&&msg.forward_from.id===265204902) {
    const chatId = msg.chat.id;
    if((msg.date-msg.forward_date)>400){
      bot.sendMessage(chatId, 'Пришли мне, пожалуйста, свежий репорт.', {reply_to_message_id:msg.message_id});
    }
    else {
      const exp = parseInt(msg.text.match(/Exp: (\d+)/)[1])||0;
      const gold = parseInt(msg.text.match(/Gold: (-?\d+)/)[1]);
      const b_date = date.nearestBattleTime(Date.now());
      const battle = {
        date:b_date,
        exp:exp,
        gold:gold
      };
      //check if player with provided telegram id already in db
      //todo: check if report belong to player

      Warrior.findOne({t_id:msg.from.id}).then((res)=>{
          if(res==null){
            const warrior = new Warrior({
              t_id:msg.from.id,
              t_name:msg.from.username,
              cw_name:msg.text.match(/[🍁🌹🍆🦇🐢🖤☘️]([a-zA-Z0-9А-Яа-яёЁ\s\[\]]+)/)[1],
              battles:[battle]
            });
            warrior.save().catch(err=>console.error(err));
          }
          else {
            if (~res.battles.findIndex(v=>v.date===b_date)){
              bot.sendMessage(chatId, "Репорт уже принят!", {reply_to_message_id:msg.message_id});
            }
            else {
              res.battles.push(battle);
              res.save().then(() => {
              }).catch(err => console.error(err))
            }
          }
      });


      if(exp===0){
        bot.sendMessage(chatId, "В следующий раз не проспи!", {reply_to_message_id:msg.message_id});
      }
      else if(gold&&gold<0) {
        bot.sendMessage(chatId, "Не забывай сливать голду, пирожочек!", {reply_to_message_id:msg.message_id});
      }
      else bot.sendMessage(chatId, messages[[Math.floor(Math.random()*messages.length)]], {reply_to_message_id:msg.message_id});
    }
  }
});