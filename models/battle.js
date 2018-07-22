const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BattleSchema = new Schema({
  data: Date,
  exp: Number,
  gold: Number
})

module.exports = BattleSchema;