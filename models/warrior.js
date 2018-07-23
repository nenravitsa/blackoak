const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a Schema and a Model

const BattleSchema = new Schema({
  data: Date,
  exp: Number,
  gold: Number
});

const OakWarriorSchema = new Schema({
  t_id: Number,
  t_name: String,
  cw_name: String,
  battles: [BattleSchema]
});

const Warrior = mongoose.model('oak', OakWarriorSchema);

module.exports = Warrior;