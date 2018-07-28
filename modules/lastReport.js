const Warrior = require('../models/warrior');
const date = require('../helpers/date');
const check = require('../helpers/checkChat');
const getGeneral = require('../helpers/statistics');

const lastReport = (bot) => {
  bot.onText(/\/last/, (msg) => {
    const chatId = msg.chat.id;
    if(!check(chatId, msg.from.id, bot)){
      const b_time = date.nearestBattleTime(new Date());
      Warrior.find({squad: msg.chat.title, 'battles.date': b_time.toISOString()}, {
          battles: {$elemMatch: {date: b_time.toISOString()}},
          _id: 0
      }).then(res => {
        if (!res || res.length === 0) {
          bot.sendMessage(chatId, 'Пока никто не прислал репорт 😥')
        }
        else{
          const b = res.map(v => v.battles[0]);
          const message =
            `
            ⚔️*Результаты последней битвы* ⚔️
            👫 Участвовали *${b.length}* человек 
            🔥 Всего опыта: *${getGeneral(b, 'exp')}*
            💰 Всего золота: *${getGeneral(b, 'gold')}*
            📦 Всего ресурсов: *${getGeneral(b, 'stock')}*
          `;
          bot.sendMessage(chatId, message, {
            parse_mode: "Markdown"
          });
        }})
        .catch(err=>console.log('stat last ', err))
    }
  })
}

module.exports = lastReport;