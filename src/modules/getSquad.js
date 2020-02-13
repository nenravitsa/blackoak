const Warrior = require('../models/warrior');
const getGeneral = require('../helpers/statistics');
const check = require('../helpers/checkChat');

const format = s => (s.length <= 2 ? s + ' ' : s);

const getSquad = bot => {
  bot.onText(/\/squad/, msg => {
    const chatId = msg.chat.id;
    if (!check(chatId, msg.from.id, bot)) {
      Warrior.find(
        { squad: msg.chat.title },
        {
          lvl: 1,
          attack: 1,
          protec: 1,
          castle: 1,
          cw_name: 1,
          _id: 0
        }
      )
        .sort({ lvl: -1 })
        .then(squad => {
          const team = squad.map(
            v =>
              `${v.castle} ${v.cw_name}\n ${format(v.lvl.toString())}  ${format(
                v.attack.toString()
              )}  ${format(v.protec.toString())}`
          );

          const message =
            `*${msg.chat.title}*\n\n` +
            '⭐️ ⚔️  🛡\n' +
            team.join('\n') +
            '\n➖➖➖➖➖➖➖\n' +
            'Средний уровень: ' +
            getGeneral(squad, 'lvl') +
            '\n' +
            'Количество участников: ' +
            squad.length +
            '\n' +
            'Общая атака: ' +
            getGeneral(squad, 'attack') +
            '\n' +
            'Общая защита: ' +
            getGeneral(squad, 'protec');
          bot.sendMessage(chatId, message);
        })
        .catch(err => console.log(err));
    }
  });
};

module.exports = getSquad;
