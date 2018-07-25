const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SquadSchema = new Schema({
  name:String,
  chat_id:Number
});

const Squad = mongoose.model('squads', SquadSchema);

module.exports = Squad;