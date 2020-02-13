const nearestBattleTime = (date) => {
  let d = new Date(date);
  let hour = d.getUTCHours();
  const closest = Math.max(...[6,14,22].filter(v => (hour>=6) ? v <= hour : 22));
  if(hour<6) {
    let day = d.getUTCDate();
    d.setUTCDate(day-1)
  }
  d.setUTCHours(closest, 0, 0, 0);
  return d;
};

const getLastSunday = (date) => {
  let d = new Date(date);
  d.setDate(d.getUTCDate() - d.getUTCDay());
  return new Date(d.setUTCHours(22,0,0,0));
};

module.exports = {
  nearestBattleTime,
  getLastSunday
};