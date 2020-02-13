const getStats = (str) => {
    const clear = str.replace('+','');
    const stats = clear.split('(');
    if(str.includes('-')||str.includes('+')){
      return Number.parseInt(stats[0])-Number.parseInt(stats[1])
    }
    return stats[0]
};


module.exports = getStats;
