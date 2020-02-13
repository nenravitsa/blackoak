const Warrior = require('../../models/warrior');

const createUser = (user, id, username, squad, date) => {
  const battle = {
    date,
    exp: user.exp,
    gold: user.gold,
    stock: user.stock
  };
  const warrior = new Warrior({
    t_id: id,
    t_name: username,
    cw_name: user.cw_name,
    castle: user.castle,
    squad,
    lvl: user.lvl,
    attack:user.attack,
    protec: user.protec,
    battles:[battle],
    achievements:['👋 Привет, новичок!']
  });
  return warrior.save()
};

module.exports = createUser;

