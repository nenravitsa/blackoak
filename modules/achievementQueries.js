const getAch = require('../helpers/getAchievement');

const achievementQueries = (bot) => {
  bot.onText(/Ты задержал/, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902) {
      getAch(bot, msg.from.id, "🐫 Защитник корована")
    }
  })

  bot.onText(/Ты упустил/, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902) {
      getAch(bot, msg.from.id, "💩 Эх, упустил грабителя")
    }
  })
}

module.exports = achievementQueries;