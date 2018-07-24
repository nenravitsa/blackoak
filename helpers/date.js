const nearestBattleTime = (date) => {
  let hour = date.getHours();
  const closest = Math.max(...[1,9,17].filter(v => (hour>0) ? v <= hour : 17));
  date.setUTCHours(closest, 0, 0, 0);
  //UTC?
  return date;
};

const getMonday = (date) => {
  let day = date.getDay(),
    diff = date.getDate() - day + (day === 0 ? -6 : 1),
    monday = new Date(date.setUTCDate(diff));
  return new Date(monday.setUTCHours(1,0,0,0));
};

module.exports = {
  nearestBattleTime,
  getMonday
};