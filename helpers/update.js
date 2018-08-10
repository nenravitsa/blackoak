const Warrior = require('../models/warrior');

const updateWarrior = (id, type, param) => {
  Warrior.findOneAndUpdate({t_id:id},{[type]:param}).then().catch(err=>console.log(err))
};

module.exports = updateWarrior;
