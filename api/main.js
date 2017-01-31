const cluster = require('cluster');
const log = require('winston');
const path = require('path');
const fs = require('fs');
const numCPUs = require('os').cpus().length;

const logFile = path.join(__dirname, 'logs', 'api.log');
if (!fs.existsSync(path.dirname(logFile))) fs.mkdirSync(path.dirname(logFile));
log.configure({
  transports: [
    new log.transports.File({
      level: 'info',
      filename: logFile,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      colorize: false,
    }),
    new log.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
});

if (cluster.isMaster) {
  log.info('Master cluster setting up ' + numCPUs + ' workers...');

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    log.info('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function(worker, code, signal) {
    const pid = worker.process.pid;
    log.warn(`Worker ${pid} died with code: ${code} and signal: ${signal}`);
    log.info('Starting a new worker');
    cluster.fork();
  });
} else {
  require('./server');
}
