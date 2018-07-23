const TOKEN = process.env.TOKEN||require('./parameters').token;
const TelegramBot = require('node-telegram-bot-api');
const mongoURI = process.env.MONGO_URL||require('./parameters').path;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Warrior = require('./models/warrior');
const date = require('./helpers/date');
const stats = require('./helpers/getStats');

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

const messages = ['Ого, это все тебе?', 'Спасибо, котик!', 'Ты настоящий воен!', 'Ты самый(ая) лучший(ая)!', '❤❤❤❤', 'Ты лучший воен!', 'Гильдия запомнит твой подвиг!', '/ogo', 'А ты мне нравишься!'];

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
              bot.sendMessage(chatId, messages[[Math.floor(Math.random() * messages.length)]], {reply_to_message_id: msg.message_id});
            }).catch(err=>console.error(err));
          }
          else {
            if (~res.battles.findIndex(v=>v.date.getTime()===b_date.getTime())){
              bot.sendMessage(chatId, "Репорт уже принят!", {reply_to_message_id:msg.message_id});
            }
            else {
              res.battles.push(battle);
              res.save().then(() => {
                bot.sendMessage(chatId, messages[[Math.floor(Math.random() * messages.length)]], {reply_to_message_id: msg.message_id});
              }).catch(err => console.error(err))
            }
          }
      });
      if (exp === 0) {
        bot.sendMessage(chatId, "В следующий раз не проспи!", {reply_to_message_id: msg.message_id});
      }
      else if (gold && gold < 0) {
        bot.sendMessage(chatId, "Не забывай сливать голду, пирожочек!", {reply_to_message_id: msg.message_id});
      }
    }
  }
});
//$gte:
bot.onText(/\/week/, (msg) => {
  const chatId = msg.chat.id;
  const b_time = date.nearestBattleTime(new Date())
  Warrior.find({'battles.date':{$lte: b_time.toISOString()}})
    .then(res=>console.log(res))
});

bot.onText(/\/squad/, (msg) => {
  const chatId = msg.chat.id;
   Warrior.find({ }, { lvl: 1, attack: 1, protec:1, castle:1, cw_name:1, _id: 0 } )
     .then(
     (squad) => {
       console.log(squad)
       const team = squad.map(v=>v.lvl+"  "+v.attack+"   "+v.protec+"   "+v.castle+"   "+v.cw_name);
       const message = '🦉 *Black Oak Squad* 🦉\n\n'+'⭐️ ⚔️ 🛡  🏰   🐨\n'+team.join('\n');
       bot.sendMessage(chatId, message,{
         parse_mode: "Markdown"
       });
     }
    )
     .catch((err)=>console.log(err))
});

bot.onText(/\/lost/, (msg) => {
  const chatId = msg.chat.id;
  const b_time = date.nearestBattleTime(new Date())
  // Warrior.find({ battles:{date:date.nearestBattleTime(new Date()).toISOString(), gold: { $lte: 0 }, exp: 0, stock:{$lte: 0}}})
  //   .then((res)=>{
  //     console.log(res)
  //   })
  Warrior.find({'battles.date':{$ne: b_time.toISOString()}}).then(res=>console.log(res))
});
