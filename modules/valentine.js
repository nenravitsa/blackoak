const Warrior = require('../models/warrior');
const createValentine = require('../helpers/valentine/createValentine');

const getPic = async message => await createValentine(message);

const sendValentine = (bot) => {
  bot.onText(/\/love @(.+) # (.+)/, (msg, match) => {
    const senderID = msg.from.id;
    const [_, name, message] = match;
    console.log(name);
    Warrior.findOne({ t_name: name }, { _id: 0, t_id: 1 }).then((res) =>
      {
        //console.log(res);
        const recipientID = res.t_id;
        if (recipientID === senderID) {
          bot.sendMessage(senderID, 'Я, конечно, понимаю, что ты у себя самый дорогой человечек. Но валентинку отправить так не выйдет, прости.', {reply_to_message_id: msg.message_id})
        }
        else {
          getPic(message).then(image => {
            bot.sendPhoto(recipientID, image, { caption: 'Ого, валентинка! Это тебе! ❤️'});
            bot.sendMessage(senderID, 'Валентинка отправлена 😏', {reply_to_message_id: msg.message_id})
          });
        }
      }
    ).catch(() => {
      bot.sendMessage(msg.chat.id, 'Увы! Твоя зазноба не зарегестрирована в Дубе. Попробуй намекнуть ей/ему 😉',  {reply_to_message_id: msg.message_id})
    })
  })
};

module.exports = sendValentine;
