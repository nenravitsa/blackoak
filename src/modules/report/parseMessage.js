const getStats = require('../../helpers/getStats');

const parseMessage = (text) => {
  const parse = {};
  parse.exp = text.match(/Exp: (\d+)/) ? parseInt(text.match(/Exp: (\d+)/)[1]) : 0;
  parse.gold = text.match(/Gold: (-?\d+)/) ? parseInt(text.match(/Gold: (-?\d+)/)[1]) : 0;
  parse.stock = text.match(/Stock: (-?\d+)/) ? parseInt(text.match(/Stock: (-?\d+)/)[1]) : 0;
  parse.lvl = text.match(/Lvl: (\d+)/)[1];
  parse.attack = getStats(text.match(/⚔:(\d+\(?[+-]?\d*)/)[1]);
  parse.protec = getStats(text.match(/🛡:(\d+\(?[+-]?\d*)/)[1]);
  parse.castle = text.match(/(🍁|🌹|🍆|🦇|🐢|🖤|☘️)/)[1];
  parse.cw_name = text.match(/[🍁🌹🍆🦇🐢🖤☘️]([a-zA-Z0-9А-Яа-яёЁ\s\[\] _-]+)/)[1];
  return parse;
};

module.exports = parseMessage;
