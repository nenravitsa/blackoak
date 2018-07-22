const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BattleSchema = require('./battle');

const OakWarriorSchema = new Schema({
  t_id: Number,
  t_name: String,
  cw_name: String,
  battles: [BattleSchema]
})

const OakWarrior = new mongoose.model('Blackoak', OakWarriorSchema);

module.exports = OakWarrior;