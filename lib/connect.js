
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


/***
* DB Object Only Once
*/
var DB;


/**
 * @params {String} opts.mongoUrl (Required)
 * @params {Object} opts.debug (Required)
 * @params {Object} opts.connection (Optional)
 *
 * @private
 */
module.exports = (opts, cb) => {

  // Check If DB is already Instantiated:
  if (DB) return cb(null, DB);


  // Setting up mongoDB Logging
  if (opts.debug === true) {
    Logger.setCurrentLogger(logger.mongodb);
    Logger.setLevel('debug');
    Logger.filter('class', ['Mongos','Db','Collection','Cursor']);
  }


  // Connect (call only once)
  MongoClient.connect(
    opts.mongoUrl, extend(true,{},CONN_OPTS,opts.connection))

  .then(db => {
    // Get Basic Stats
    DB = db;
    return db.stats();
  })
  .then(stats => {
    logger.mongodb('MongoDB Conntected', DB.writeConcern, stats);
    return cb(null, DB);
  })
  .catch(err => {
    logger.mongodb(`MongoDB connect failed: ${err.message}`);
    return cb(err);
  });

};
