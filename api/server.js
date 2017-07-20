// Requirements
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const glob = require('glob');
const log = require('winston');
const bodyParser = require('body-parser');
const cors = require('cors');

// Config info
const config = require('./app/config');

// Database setup
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
    useMongoClient: true,
}, (err) => {
  if (err) {
    log.error('Can\'t connect to mongodb', err);
    process.exit();
  }
});

// Load models
const models = glob.sync(path.join(__dirname, 'app', 'models', '*.js'));
models.forEach((file) => {
  require(file);
});

// Start the app
const app = express();

// Express configuration
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// Register controllers
require('./app/controllers')(app);

// Error handler
app.use((err, req, res, next) => {
  log.error(err);

  const jsonResponse = {
    success: false,
    message: err.message,
  };
  if (err.errors && err.name === 'ValidationError') {
    jsonResponse.errors = {};
    for (key in err.errors) {
      if (err.errors.hasOwnProperty(key)) {
        jsonResponse.errors[key] = err.errors[key].message;
      }
    }
  };

  res.status(err.status || 500);
  res.json(jsonResponse);
});

app.listen(process.env.PORT || 3000);
