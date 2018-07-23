const nearestBattleTime = (date) => {
  let hour = date.getHours();

  const closest = Math.max(...[1,9,17].filter(v => (hour>0) ? v <= hour : 17));

  date.setHours(closest);
  date.setMinutes(0);
  date.setSeconds(0);

  return date;
};

module.exports = {
  nearestBattleTime:nearestBattleTime
};