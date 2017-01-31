const controllers = {
  products: require('./products'),
  categories: require('./categories'),
  brands: require('./brands'),
  orders: require('./orders'),
  storages: require('./storages'),
  users: require('./users'),
  auth: require('./auth'),
  taxes: require('./taxes'),
  install: require('./install'),
};

module.exports = (app) => {
  for (key in controllers) {
    if (controllers.hasOwnProperty(key)) {
      app.use('/' + key, controllers[key]);
    }
  }
};
