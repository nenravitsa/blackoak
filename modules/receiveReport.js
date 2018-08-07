const Warrior = require('../models/warrior');
const date = require('../helpers/date');
const stats = require('../helpers/getStats');
const update = require('../helpers/update');
const messages = require('../messages');
const getAch = require('../helpers/getAchievement')

const receiveReport = (bot) => {
  bot.onText(/[🍁🌹🍆🦇🐢🖤☘️](.*?⚔:)(.+)/, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902) {
      const chatId = msg.chat.id;
      if ((msg.date - msg.forward_date) > 600) {
        bot.sendMessage(chatId, 'Пришли мне, пожалуйста, свежий репорт.', {reply_to_message_id: msg.message_id});
        getAch(bot, msg.from.id, "⌛ Старо как мир")
      }
      else {
        const exp = msg.text.match(/Exp: (\d+)/) ? parseInt(msg.text.match(/Exp: (\d+)/)[1]) : 0;
        const gold = msg.text.match(/Gold: (-?\d+)/) ? parseInt(msg.text.match(/Gold: (-?\d+)/)[1]) : 0;
        const stock = msg.text.match(/Stock: (-?\d+)/) ? parseInt(msg.text.match(/Stock: (-?\d+)/)[1]) : 0;
        const b_date = date.nearestBattleTime(new Date());
        let text, ach;
        if(exp === 0) {text = "В следующий раз не проспи!"; ach = "💤 Все проспал"}
        else if(gold && gold < 0){text = "Не забывай сливать голду, пирожочек!"; ach = '🙊 Расточитель богатств'}
        else {text = messages[[Math.floor(Math.random() * messages.length)]]; ach=''}
        const battle = {
          date: b_date,
          exp: exp,
          gold: gold,
          stock: stock
        };
        if(msg.chat.type==='private' || chatId === -1001175776732){
          getAch(bot, msg.from.id, "⛔ Не туда")
        }
        else {
          Warrior.findOne({squad: msg.chat.title, 'battles.date': b_date.toISOString()}).then((res) => {
            if (res == null) {
              getAch(bot, msg.from.id, "💃 Самый быстрый воен дуба")
            }
          });
        }
        //check if player with provided telegram id already in db and create new if not
        Warrior.findOne({t_id:msg.from.id}).then((res)=>{
          const lvl = msg.text.match(/Lvl: (\d+)/)[1];
          const attack = stats.getStats(msg.text.match(/⚔:(\d+\(?[+-]?\d*)/)[1]);
          const protec = stats.getStats(msg.text.match(/🛡:(\d+\(?[+-]?\d*)/)[1]);
          const castle = msg.text.match(/(🍁|🌹|🍆|🦇|🐢|🖤|☘️)/)[1];
          const cw_name = msg.text.match(/[🍁🌹🍆🦇🐢🖤☘️]([a-zA-Z0-9А-Яа-яёЁ\s\[\] _]+)/)[1];
          if(res==null){
            const warrior = new Warrior({
              t_id:msg.from.id,
              t_name:msg.from.username,
              cw_name:cw_name,
              castle: castle,
              squad:msg.chat.title,
              lvl:lvl,
              attack:attack,
              protec: protec,
              battles:[battle],
              achievements:['👋 Привет, новичок!']
            });
            warrior.save().then(()=>{
              bot.sendMessage(chatId, text, {reply_to_message_id: msg.message_id});
              bot.sendMessage(msg.from.id, 'Получено новое достижение: 👋 Привет, новичок!');
            }).catch(err=> console.log('text',msg.text, 'err: ', err));
          }
          else {
            if(!res.squad){update.updateWarrior(msg.from.id, 'squad', msg.chat.title)}
            if(res.t_id!==msg.from.id) {bot.sendMessage(chatId, 'Это не твой репорт. Не обманывай.', {reply_to_message_id: msg.message_id});}
            if(res.lvl!==lvl){update.updateWarrior(msg.from.id, 'lvl', lvl)}
            if(res.attack!==attack){update.updateWarrior(msg.from.id, 'attack', attack)}
            if(res.protec!==protec){update.updateWarrior(msg.from.id, 'protec', protec)}
            if(res.castle!==castle){update.updateWarrior(msg.from.id, 'castle', castle)}
            if(res.cw_name!==cw_name){update.updateWarrior(msg.from.id, 'cw_name', cw_name)}
            if (~res.battles.findIndex(v=>v.date.getTime()===b_date.getTime())){
              bot.sendMessage(chatId, 'Репорт уже принят!', {reply_to_message_id: msg.message_id})
            }
            else {
              res.battles.push(battle);
              res.save().then(() => {
                bot.sendMessage(chatId, text, {reply_to_message_id: msg.message_id});
                if(ach.length>0) {
                  getAch(bot, msg.from.id, ach)
                }
              }).catch(err => console.error(err))
            }
          }
        });
      }
     }
  });
};

module.exports = receiveReport;