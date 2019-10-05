const Squad = require('../models/squad');

const getChats = async () => {
  try {
    const chatsRaw = await Squad.find({});
    return {id:chatsRaw.map(v => v.chat_id), title:chatsRaw.map(v => v.name)}
  }
  catch (e) {console.log(e)}
};

module.exports = getChats;