const Warrior = require('../models/warrior');

const changeName = (bot) => {
  bot.onText(/\/name (.+)/, (msg, match) => {
    const id = msg.from.id;
    const name = match[1];
    Warrior.findOneAndUpdate({t_id:id},{'cw_name': name+' '}).then(() =>
    {bot.sendMessage(msg.chat.id, 'Имя успешно изменено, боец!', {reply_to_message_id: msg.message_id})}
    ).catch((err) => {
      console.log(err)
      bot.sendMessage(msg.chat.id, 'Что-то пошло не так :(',  {reply_to_message_id: msg.message_id})
    })
  })
}

module.exports = changeName;
