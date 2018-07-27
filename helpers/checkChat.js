const check = (chatID, userID, bot) => {
  if ((chatID === userID) || (chatID === -1001175776732)) {
    const sticker = 'CAADAgADTBAAAkvcAwABpCaNtoShBhAC'
    bot.sendSticker(chatID, sticker)
    return true
  }
  else return false
}

module.exports = check;