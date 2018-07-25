const Squad = require('../models/squad');
const Warrior = require('../models/warrior');

const addSquad = (bot) => {
  bot.on('message', (msg) => {
    if(msg.new_chat_member&&msg.new_chat_member.id===664951656){
      const squad = new Squad({
        name:msg.chat.title,
        chat_id:msg.chat.id
      });
      squad.save().then().catch(err=>console.log("new squad error: ",err))
    }
  });
};

const deleteSquad = (bot) => {
  bot.on('message', (msg)=>{
    if(msg.left_chat_member&&msg.left_chat_member.id===664951656){
        Squad.findOneAndRemove({chat_id:msg.chat.id}).then().catch(err=>console.log("del squad: ", err))
        Warrior.deleteMany({squad:msg.chat.title})
    }
  })
}
module.exports = {addSquad, deleteSquad};