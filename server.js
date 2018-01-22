/**
 * Server application
 */

module.exports = server;

/**
 * exports the application server
 *
 * @return {express.server} Express server
 */
function server() {
  const express = require('express');

  const config = require('./config');
  const healthCheckController = require('./controllers/health-check');
  const readinessCheckController = require('./controllers/readiness-check');
  const notFoundController = require('./controllers/not-found');
  const errorController = require('./controllers/error');
  const corsMiddleware = require('./middleware/cors');
  const morganMiddleware = require('./middleware/morgan');
  const bodyParserMiddleware = require('./middleware/body-parser');
  const helmetMiddleware = require('./middleware/helmet');
  const compressionMiddleware = require('./middleware/compression');
  const prometheusMiddleware = require('./middleware/prometheus');
  const basicAuthMiddleware = require('./middleware/basic-auth');

  const _server = express();

  // for logging all requests
  _server.use(morganMiddleware());
  // for server info stripping
  _server.use(helmetMiddleware());
  // for container orchestrators to check on service status
  _server.get(config.healthCheckEndpoint, healthCheckController);
  _server.get(config.readinessCheckEndpoint, readinessCheckController);
  // for handling cross origin resource sharing
  _server.use(corsMiddleware());
  // for handling response compression
  _server.use(compressionMiddleware());
  // for parsing JSON in post requests
  _server.use(bodyParserMiddleware.json());
  // for parsing URL query parameters
  _server.use(bodyParserMiddleware.urlencoded());
  // for prometheus metrics
  _server.use(
    config.metricsEndpoint,
    basicAuthMiddleware(),
    prometheusMiddleware()
  );

  _server.use(
    require('express-diroutes')({
      rootPath: require('path').resolve('./routes'),
    })
  );

  // application error handlers
  _server.use(notFoundController);
  _server.use(errorController);

  return _server;
};
