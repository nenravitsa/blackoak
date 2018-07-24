const TOKEN = process.env.TOKEN||require('./parameters').token;
const TelegramBot = require('node-telegram-bot-api');
const mongoURI = process.env.MONGO_URL||require('./parameters').path;
const mongoose = require('mongoose');
const week = require('./modules/weekReport');
const squad = require('./modules/getSquad');
const main = require('./modules/receiveReport');
const lost = require('./modules/getLost');
mongoose.Promise = global.Promise;

const options = {
  webHook: {
    port: 443
  }
};

//bot initialization
if(process.env.NODE_ENV == 'production') {
  const url = 'blackoak.now.sh';
  const bot = new TelegramBot(TOKEN, options);
  bot.setWebHook(`${url}/bot${TOKEN}`);
}
else bot = new TelegramBot(TOKEN, {polling: true});

//connect to DB
mongoose.connect(mongoURI, { useNewUrlParser: true });
mongoose.connection.once('open', ()=>{console.log('connection has been made')})
  .on('error', error=>console.log(error));

//all operations
main.receiveReport(bot);
week.weekReport(bot);
squad.getSquad(bot);
lost.getLost(bot);
