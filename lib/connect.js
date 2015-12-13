
'use strict';

/**
 * Module dependencies.
 * @private
 */

const MongoClient = require('mongodb').MongoClient,
  Logger = require('mongodb').Logger,
  extend = require('extend');


/**
 * Constants
 * @private
 */
const CONN_OPTS = {

  // http://mongodb.github.io/node-mongodb-native/2.0/api/Server.html
  server: {
    poolSize: 10,
    socketOptions: {
      autoReconnect: true
    },
    autoReconnect: true,
    reconnectInterval: 200
  },

  db: {
    w: 'majority',
    j: true,
    retryMiliSeconds: 200
  },

  // http://mongodb.github.io/node-mongodb-native/2.0/reference/connecting/connection-settings/
  mongos: {
    haInterval: 1000,
    poolSize: 10,
    autoReconnect: true
  }
};


/**
 * @params {String} opts.mongoUrl (Required)
 * @params {Object} opts.logger (Required)
 * @params {Boolean} opts.debug (Optional)
 * @params {Object} opts.connection (Optional)
 *
 * @private
 */
module.exports = (opts, cb) => {

  // Setting up mongoDB Logging
  if (opts.debug) {
    Logger.setCurrentLogger(opts.logger);
    Logger.setLevel('debug');
    Logger.filter('class', ['Mongos','Db','Collection','Cursor']);
  }


  // Connect (call only once)
  MongoClient.connect(opts.mongoUrl,
                      extend(true,CONN_OPTS,opts.connection),
                      (err, db) => {

    if (err) {
      opts.logger.error(`MongoDB connect failed: ${err.message}`);
      return cb(err);
    }

    // Get Basic Stats
    db.stats((err, stats) => {

      if (err) {
        opts.logger.error(`MongoDB connect failed: ${err.message}`);
        return cb(err);
      }

      opts.logger.info('MongoDB Conntected', db.writeConcern, stats);
      return cb(null, db);
    });

  });
};
