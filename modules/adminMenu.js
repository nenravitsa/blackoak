bot.sendMessage(chatId, "inline kbd", {
  reply_markup: {
    inline_keyboard: [[{
      text: "A button",
      url: "example.com",
    }]],
  },
}).then(function() {
  console.log('message sent');
}).catch(console.error);