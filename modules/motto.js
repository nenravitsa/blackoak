const Warrior = require('../models/warrior');

const mottoText = /Навечно вместе все, кто смел, кто тайну сохранить сумел! Навеки в радости и в грусти наш дуб злодеям не найти!/

const receiveMotto = (bot) => {
  bot.onText(mottoText, (msg) => {
    Warrior.findOneAndUpdate({t_id:msg.from.id},{$push: { achievements: "🌳 Один за всех и все за одного"}})
      .then(()=>{
        bot.sendMessage(msg.from.id, 'Получено новое достижение: 🌳 Один за всех и все за одного');
      })
      .catch(err=>console.log(err))
  })
}

module.exports = receiveMotto;