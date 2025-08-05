'use strict';

const YAML = require('yaml');
const fs = require('fs');

let oasDoc = fs.readFileSync('./src/api/oas.yaml', 'utf8');
oasDoc = YAML.parse(oasDoc);

const governify = require('governify-commons');
const logger = governify.getLogger().tag('index');

const oasTelemetry = require('@oas-tools/oas-telemetry');
const oasTelemetryMiddleware = oasTelemetry({ spec: JSON.stringify(oasDoc) });

const server = require('./server');

governify.init().then((commonsMiddleware) => {
  server.deploy([commonsMiddleware, oasTelemetryMiddleware]).catch(logger.error);
});

// ##################### Docker signals #####################

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint() {
  logger.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm() {
  logger.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
  shutdown();
});

const shutdown = () => {
  server.undeploy();
};
