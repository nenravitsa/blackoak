const receiveHero = (bot) => {
  bot.onText(/[🍁🌹🍆🦇🐢🖤☘️](\w+\n🏅)(.+)/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Круто!', {reply_to_message_id: msg.message_id});
  });
};

module.exports = receiveHero;