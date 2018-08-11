const TOKEN = process.env.TOKEN||require('./parameters').token;
const TelegramBot = require('node-telegram-bot-api');
const mongoURI = process.env.MONGO_URL||require('./parameters').path;
const mongoose = require('mongoose');
const week = require('./modules/weekReport');
const squad = require('./modules/getSquad');
const receiveReport = require('./modules/report/receiveReport');
const lost = require('./modules/getLost');
const squadInfo = require('./modules/updateSquadInfo');
const readAll = require('./modules/test');
const pin = require('./modules/pin');
const lastReport = require('./modules/lastReport');
mongoose.Promise = global.Promise;
const Squad = require('./models/squad');
const schedule = require('node-schedule');
const initialize = require('./modules/adminMenu');
const sleep = require('./modules/pingSleeping');
const achievementQueries = require('./modules/achievementQueries')
const Warrior = require('./models/warrior');

const options = {
  webHook: {
    port: 443
  }
};
let bot;
//bot initialization
if(process.env.NODE_ENV === 'production') {
  const url = 'blackoak.now.sh';
  bot = new TelegramBot(TOKEN, options);
  bot.setWebHook(`${url}/bot${TOKEN}`);
}
else bot = new TelegramBot(TOKEN, {polling: true});

//connect to DB
mongoose.connect(mongoURI, { useNewUrlParser: true });
mongoose.connection.once('open', ()=>{
  console.log('connection has been made')
}).on('error', error=>console.log(error));

const getChats = async () => {
  try {
    const chatsRaw = await Squad.find({});
    return {id:chatsRaw.map(v => v.chat_id),title:chatsRaw.map(v => v.name)}
  }
  catch (e) {console.log(e)}
}

const getAdmins = async (chats) => {
  try {
    const adminsRaw = chats.id.map(async ch => {
      return await bot.getChatAdministrators(ch)
    });
    return Promise.all(adminsRaw).then(res => {
      const admins = res.reduce((a, b) => a.concat(b)).map(v => v.user.id);
      return [...new Set(admins)];
    });
  }
  catch (e) {console.log(e)}
}

//all operations
receiveReport(bot);
week(bot);
squad(bot);
lost(bot);
lastReport(bot);
sleep(bot);
achievementQueries(bot);
initialize(bot);

//monitors the addition and removal of the bot from the chats
squadInfo.addSquad(bot);
squadInfo.deleteSquad(bot);

//set scheduler
//functions for pin and unpin message in all chats
getChats().then(chats=>{
  schedule.scheduleJob('0 6,14,22 * * *', function(){
    for(let i=0; i<chats.id.length; i++) {
      bot.unpinChatMessage(chats.id[i])
    }
  });
  getAdmins(chats).then(admins=>{
    pin.pinForAll(bot, chats.id, admins);
    pin.unpinForAll(bot, chats.id, admins);
  })
});

//clean up db every sunday
schedule.scheduleJob('59 21 * * 0', () => {
  Warrior.update({},{battles:[]}, { multi: true })
});

//dev option only, for get some info about chat, user or message
//readAll(bot);

