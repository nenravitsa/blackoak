const Warrior = require('../models/warrior');
const statistics = require('../helpers/statistics');

const getSquad = (bot) => {
  bot.onText(/\/squad/, (msg) => {
    const chatId = msg.chat.id;
    Warrior.find({ }, { lvl: 1, attack: 1, protec:1, castle:1, cw_name:1, _id: 0 } ).sort({'lvl':-1})
      .then(
        (squad) => {
          console.log(squad)
          const team = squad.map(v=>v.lvl+"  "+v.attack+"   "+v.protec+"   "+v.castle+"   "+v.cw_name);
          const message = '🦉 *Black Oak Squad* 🦉\n\n'
            +'⭐️ ⚔️ 🛡  🏰   🐨\n'
            +team.join('\n')
            +'\n➖➖➖➖➖➖➖\n'
            +'*Средний уровень*: '+statistics.getGeneral(squad, 'lvl')+'\n'
            +'*Общая атака*: '+statistics.getGeneral(squad, 'attack')+'\n'
            +'*Общая защита*: '+statistics.getGeneral(squad, 'protec')
          ;
          bot.sendMessage(chatId, message,{
            parse_mode: "Markdown"
          });
        }
      )
      .catch((err)=>console.log(err))
  });
};

module.exports = {getSquad};