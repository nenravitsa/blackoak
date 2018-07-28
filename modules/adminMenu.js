const initialize = (bot, chats, admins) => {
  const isLegit = (type, id) => {
    return type==='private'&&admins.includes(id)
  }
  const keyboard = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [chats.title]
    }
  };
  bot.onText(/\/start|\/admin/, (msg) => {
    if(isLegit(msg.chat.type, msg.from.id)){
      bot.sendMessage(msg.chat.id, 'Посмотреть подробную статистику по отрядам', keyboard)
    }
  })
  const stat_keyboard = {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [['🐰 Петы', '🗡 Оружие'],['⏳ Отчет за неделю','🔫 Последняя битва'], ['📈 Рейтинг отряда']]
    }
  };
  bot.onText(/🦉 Черный дуб/, (msg) => {
    if(isLegit(msg.chat.type, msg.from.id)){
      bot.sendMessage(msg.chat.id, 'Информация об отряде', stat_keyboard)
    }
  })

};

module.exports = initialize;
