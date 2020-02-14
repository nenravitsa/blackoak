const Squad = require('../models/squad');
const Warrior = require('../models/warrior');

const addSquad = bot => {
  bot.on('message', msg => {
    // if (msg.new_chat_member && msg.new_chat_member.id === 664951656) {
    //   console.log('new chat');
    //   const squad = new Squad({
    //     name: msg.chat.title,
    //     chat_id: msg.chat.id
    //   });
    //   squad.save()
    //     .then(() => {
    //       bot.sendMessage(83517095, `Добавлен новый отряд ${msg.chat.title}!! 👀`);
    //     }).catch(err => console.log("new squad error: ", err))
    // }
    if (msg.new_chat_title) {
      Squad.findOne({ chat_id: msg.chat.id }, { name: 1 }).then(res => {
        const old = res.name;
        Squad.findOneAndUpdate(
          { chat_id: msg.chat.id },
          { name: msg.chat.title }
        )
          .then(() => {
            Warrior.update(
              { squad: old },
              { $set: { squad: msg.chat.title } },
              { multi: true }
            );
          })
          .catch(err => console.log(err));
      });
    }
    if (msg.migrate_from_chat_id) {
      Squad.findOneAndUpdate(
        { name: msg.chat.title },
        { chat_id: msg.chat.id }
      ).catch(err => console.log(err));
    }
  });
};

const deleteSquad = bot => {
  bot.on('message', msg => {
    if (msg.left_chat_member && msg.left_chat_member.id === 664951656) {
      Squad.findOneAndRemove({ chat_id: msg.chat.id }).catch(err =>
        console.log('del squad: ', err)
      );
      Warrior.deleteMany({ squad: msg.chat.title });
    } else if (msg.left_chat_member) {
      Warrior.findOne({ t_id: msg.left_chat_member.id }, { squad: 1 }).then(
        res => {
          if (msg.chat.title === res.squad) {
            Warrior.update(
              { t_id: msg.left_chat_member.id },
              { $unset: { squad: null } }
            )
              .then(() => {
                bot.sendMessage(msg.chat.id, 'Боец исключен из отряда!');
              })
              .catch(err => console.log('del war: ', err));
          }
        }
      );
    }
  });
};

module.exports = { addSquad, deleteSquad };
