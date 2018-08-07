const check = (chatID, userID, bot) => {
  if (chatID === userID) {
    const sticker = 'CAADAgADTBAAAkvcAwABpCaNtoShBhAC'
    bot.sendSticker(chatID, sticker)
    return true
  }
  else return false
}

module.exports = check;