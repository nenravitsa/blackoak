const TOKEN = process.env.TOKEN||require('./parameters').token;
const TelegramBot = require('node-telegram-bot-api');
const mongoURI = process.env.MONGO_URL||require('./parameters').path;
const mongoose = require('mongoose');
const week = require('./modules/weekReport');
const squad = require('./modules/getSquad');
const receiveReport = require('./modules/receiveReport');
const lost = require('./modules/getLost');
const receiveHero = require('./modules/receiveHero');
const squadInfo = require('./modules/updateSquadInfo');
const readAll = require('./modules/test');
const pinForAll = require('./modules/pin');
mongoose.Promise = global.Promise;

const options = {
  webHook: {
    port: 443
  }
};
let bot;
//bot initialization
if(process.env.NODE_ENV == 'production') {
  const url = 'blackoak.now.sh';
  bot = new TelegramBot(TOKEN, options);
  bot.setWebHook(`${url}/bot${TOKEN}`);
}
else bot = new TelegramBot(TOKEN, {polling: true});

//connect to DB
mongoose.connect(mongoURI, { useNewUrlParser: true });
mongoose.connection.once('open', ()=>{console.log('connection has been made')})
  .on('error', error=>console.log(error));

//all operations
receiveReport(bot);
week(bot);
squad(bot);
lost(bot);
receiveHero(bot);

//monitors the addition and removal of the bot from the chats
squadInfo.addSquad(bot);
squadInfo.deleteSquad(bot);

//pin message in all chats, unpin when time is come
pinForAll(bot);

//dev option only, for get some info about chat, user or message
//readAll(bot);

