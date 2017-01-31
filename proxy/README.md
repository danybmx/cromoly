# Proxy

## Configure sites
Configure the sitest that you want to proxy on the ./sites.json file.
Each site can have the following properties:

  - from: Domain name.
  - to: Destination host:port.
  - secure: Use true for enable https.
  - letsencrypt: The letsencrypt admin email address that will be used in production to generate the certificates.

## Use HTTPS while developing
In order to use HTTPS while developing you can't use letsencrypt so you need to generate a self signed certificates manually.

For do it, go to ./certs/dev and just run the following commands:
```
openssl genrsa -out dev-key.pem 1024
openssl req -new -key dev-key.pem -out dev-csr.pem
openssl x509 -req -in dev-csr.pem -signkey dev-key.pem -out dev-cert.pem
```

IMPORTANT: Don't forget to fill the FQDN field with localhost.
