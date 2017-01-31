const path = require('path');
const numCPUs = require('os').cpus().length;

// Proxy configuration
const proxy = require('redbird')({
  cluster: numCPUs,
  port: process.env.HTTP_PORT || 80,
  ssl: {
    port: process.env.HTTPS_PORT || 443,
    key: path.join(__dirname, 'certs', 'dev', 'dev-key.pem'),
    cert: path.join(__dirname, 'certs', 'dev', 'dev-cert.pem'),
    http2: true,
  },
  letsencrypt: {
    path: path.join(__dirname, 'certs'),
  },
  bunyan: false,
});

// Load configured sites
const sites = require('./sites.' + process.env.NODE_ENV);

sites.forEach((site) => {
  let ssl;

  if (
    site.secure &&
    site.letsencrypt &&
    process.env.NODE_ENV === 'production'
  ) {
    ssl = {
      letsencrypt: {
        email: site.letsencrypt,
        production: process.env.NODE_ENV === 'production',
      },
    };
  } else if (site.secure) {
    ssl = true;
  }

  proxy.register(site.from, site.to, {
    ssl: ssl,
  });
});
