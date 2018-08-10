const Warrior = require('../models/warrior');

const getAch = (bot, id, ach) => {
  Warrior.findOneAndUpdate({t_id: id, achievements:{ "$ne" : ach }}, {$push: {achievements: ach}})
    .then((res) => {
      if(res!=null) bot.sendMessage(id, 'Получено новое достижение: '+ ach);
    })
    .catch(err => console.log(err))
}

module.exports = getAch;
