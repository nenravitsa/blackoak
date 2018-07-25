const readAll = (bot) => {
  bot.on('message', (msg) => {
    console.log(msg)
  })
}

module.exports = readAll;