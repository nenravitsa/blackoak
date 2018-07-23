const getStats = (str) => {
    const clear = str.replace('+','');
    const stats = clear.split('(');
    if(str.includes('+')){
      return stats[0]-stats[1]
    }
    if(str.includes('-')){
      return stats[0]+stats[1]
    }
    return stats[0]
};


module.exports = {
  getStats:getStats
};
