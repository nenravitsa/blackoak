const TOKEN = process.env.TOKEN;
const mongoURI = process.env.MONGO_URL;
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const week = require('./modules/weekReport');
const squad = require('./modules/getSquad');
const receiveReport = require('./modules/report/receiveReport');
const lost = require('./modules/getLost');
const squadInfo = require('./modules/updateSquadInfo');
const pin = require('./modules/pin');
const lastReport = require('./modules/lastReport');
mongoose.Promise = global.Promise;
const schedule = require('node-schedule');
const initialize = require('./modules/adminMenu');
const sleep = require('./modules/pingSleeping');
const achievementQueries = require('./modules/achievementQueries');
const changeName = require('./modules/changeName');
const Warrior = require('./models/warrior');
const getChats = require('./helpers/getChats');
const sendValentine = require('./modules/valentine');

const options = {
  webHook: {
    port: 9229
  }
};
let bot;
//bot initialization
if (process.env.NODE_ENV === 'production') {
  const url = 'blackoak.now.sh';
  bot = new TelegramBot(TOKEN, options);
  bot.setWebHook(`${url}/bot${TOKEN}`);
} else bot = new TelegramBot(TOKEN, { polling: true });

//connect to DB
mongoose.connect(mongoURI, { useNewUrlParser: true });
mongoose.connection
  .once('open', () => {
    console.log('connection has been made');
  })
  .on('error', error => console.log(error));

const getAdmins = () =>
  Warrior.find({ isAdmin: true }, { _id: 0, t_id: 1 }).then(res =>
    res.map(v => v.t_id)
  );

//all operations
receiveReport(bot);
week(bot);
squad(bot);
lastReport(bot);
sleep(bot);
achievementQueries(bot);
changeName(bot);

//monitors the addition and removal of the bot from the chats
squadInfo.addSquad(bot);
squadInfo.deleteSquad(bot);
sendValentine(bot);

//set scheduler
//functions for pin and unpin message in all chats
getChats().then(chats => {
  schedule.scheduleJob('0 6,14,22 * * *', function() {
    for (let i = 0; i < chats.id.length; i++) {
      bot.unpinChatMessage(chats.id[i]);
    }
  });
  schedule.scheduleJob('0 10 * * *', function() {
    for (let i = 0; i < chats.id.length; i++) {
      bot.sendMessage(chats.id[i], 'Аренки! 🌝').then(m => {
        bot.pinChatMessage(chats.id[i], m.message_id);
      });
    }
  });
  getAdmins().then(admins => {
    pin.pinForAll(bot, admins);
    pin.unpinForAll(bot, admins);
    initialize(bot, admins);
    lost(bot, admins);
  });
});

//clean up db every sunday
schedule.scheduleJob('59 21 * * 0', () => {
  Warrior.update({}, { $set: { battles: null } }, { multi: true });
});

//dev option only, for get some info about chat, user or message
//readAll(bot);
