const getAch = require('../helpers/getAchievement');

const achievementQueries = (bot) => {
  bot.onText(/Ты задержал/, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902) {
      getAch(bot, msg.from.id, "🐫 Защитник корована")
      Warrior.findOne({t_id: id}, {_id:0, caravans:1} ).then(res=> {
        const caravansCount = res.caravans
        const newCount = caravansCount ? caravansCount+1 : 1
        Warrior.findOneAndUpdate({t_id:id},{caravans:newCount}).catch(err=>console.log(err))
        switch (newCount) {
          case 10: getAch(bot, msg.from.id, '🦁 Гроза воришек')
            break
          case 50: getAch(bot, msg.from.id, '⚡️️ Бдителен и стремителен')
            break
          case 100: getAch(bot, msg.from.id, '🥇️ Unstoppable')
            break
          default: break
        }
      })
    }
  })

  bot.onText(/Ты упустил/, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902) {
      getAch(bot, msg.from.id, "💩 Эх, упустил")
    }
  })

  bot.onText(/Поздравляем!/, (msg) => {
    if(msg.forward_from&&msg.forward_from.id===265204902) {
      getAch(bot, msg.from.id, "🏆 Вкус первой победы")
    }
  })
}

module.exports = achievementQueries;