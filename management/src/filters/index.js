const filters = {
  nl2br: require('./nl2br'),
  nl2comma: require('./nl2comma'),
};

module.exports = {
  register(Vue) {
    for (key in filters) {
      if (filters.hasOwnProperty(key)) {
        Vue.filter(key, filters[key]);
      }
    }
  },
};
