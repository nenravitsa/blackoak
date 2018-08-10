const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a Schema and a Model

const BattleSchema = new Schema({
  date: Date,
  exp: Number,
  gold: Number,
  stock: Number
});

const OakWarriorSchema = new Schema({
  t_id: Number,
  t_name: String,
  cw_name: String,
  castle: String,
  squad: String,
  lvl: Number,
  attack: Number,
  protec: Number,
  battles: [BattleSchema],
  achievements: Array,
  reports:Number,
  arenas:Number,
  caravans:Number
});

const Warrior = mongoose.model('oak', OakWarriorSchema);

module.exports = Warrior;