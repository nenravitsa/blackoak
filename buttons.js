const stat_keyboard = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [['🐰 Петы', '🗡 Оружие'],['⏳ Отчет за неделю','🔫 Последняя битва'], ['📈 Рейтинг отряда', '⬅️Назад']]
  }
};

const pets_keyboard = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [['😿 У кого нет', '⬅️Назад']]
  }
};

module.exports = {stat_keyboard, pets_keyboard};