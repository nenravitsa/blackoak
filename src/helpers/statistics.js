const getGeneral = (squad, type) => {
  const stats = squad.map(v=>v[type]);
  if(type==='lvl'){
    return Math.round(stats.reduce((a,b)=>a+b)/stats.length)
  }
  return stats.reduce((a,b)=>a+b)
};

module.exports = getGeneral;

