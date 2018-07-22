const TOKEN = process.env.TOKEN||require('parameters').token;
const TelegramBot = require('node-telegram-bot-api');
const mongoURI = process.env.MONGO_URL||require('parameters').path;
const mongoose = require('mongoose');
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

mongoose.connect(mongoURI, { useNewUrlParser: true, useMongoClient: true })

mongoose.connection.once('open', ()=>{console.log('connection has been made')})
  .on('error', error=>console.log(error))

const messages = ['Ого, это все тебе?', 'Спасибо, котик!', 'Ты настоящий воен!', 'Ты самый(ая) лучший(ая)!', '❤❤❤❤', 'Ты лучший воен!', 'Гильдия запомнит твой подвиг!']

bot.onText(/[🍁🌹🍆🦇🐢🖤☘️](.*?⚔:)(.+)/, (msg) => {
  if(msg.forward_from&&msg.forward_from.id===265204902) {
    const chatId = msg.chat.id;
    if((msg.date-msg.forward_date)>400){
      bot.sendMessage(chatId, 'Пришли мне, пожалуйста, свежий репорт.', {reply_to_message_id:msg.message_id});
    }
    else {
      //cw_name:msg.text.match(/[🍁🌹🍆🦇🐢🖤☘️]([a-zA-Z0-9А-Яа-яёЁ\s\[\]]+)/)[1],
      const battle = {
        date:Date.now(),
        exp:parseInt(msg.text.match(/Exp: (\d+)/)[1])||0,
        gold:parseInt(msg.text.match(/Gold: (-?\d+)/)[1])
      }
      //console.log(player)
      if(player.exp===0){
        bot.sendMessage(chatId, "В следующий раз не проспи!", {reply_to_message_id:msg.message_id});
      }
      else if(player.gold&&player.gold<0) {
        bot.sendMessage(chatId, "Не забывай сливать голду, пирожочек!", {reply_to_message_id:msg.message_id});
      }
      else bot.sendMessage(chatId, messages[[Math.floor(Math.random()*messages.length)]], {reply_to_message_id:msg.message_id});
    }
  }
});