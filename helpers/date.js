const nearestBattleTime = (date) => {
  let d = new Date(date);
  let hour = d.getUTCHours();
  const closest = Math.max(...[6,14,22].filter(v => (hour>0) ? v <= hour : 22));
  d.setUTCHours(closest, 0, 0, 0);
  return d;
};

const getLastSunday = (date) => {
  let d = new Date(date);
  d.setDate(d.getUTCDate() - d.getUTCDay());
  return new Date(d.setUTCHours(22,0,0,0));
};

const getMonday = (date) => {
  let d = new Date(date)
  let day = d.getUTCDay(),
    diff = d.getUTCDate() - day + (day === 0 ? -6 : 1),
    monday = new Date(d.setUTCDate(diff));
  return new Date(monday.setUTCHours(1,0,0,0));
};

module.exports = {
  nearestBattleTime,
  getMonday,
  getLastSunday
};