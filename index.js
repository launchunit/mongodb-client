
'use strict';

/**
 * @params {String} opts.name (Required)
 * @params {Array} opts.indexes (Optional)
 * @params {Object} opts.schema (Optional)
 * @params {Object} opts.methods (Optional)
 *
 * @public
 */
exports.createModel = require('./lib/models').createModel;


/**
 * Load Models from a Path
 *
 * @params {String} modelsPath (Required)
 *
 * @public
 */
exports.loadModels = require('./lib/models').loadModels;


/**
 * @params {Db Instance} opts.db (Required)
 * @params {Object} opts.logger (Required)
 *
 * @public
 */
exports.initModels = require('./lib/models').initModels;


/**
 * @params {String} opts.mongoUrl (Required)
 *
 * @params {Boolean|Function} opts.logger
 *           - Can be a Boolean (True = Default=console)
 *           - Logger Function(msg, context)
 * @params {Object} opts.connection (Optional)
 *
 * @return {Promise}
 * @public
 */
exports.connect = opts => {

  opts = opts || {};

  return new Promise((resolve, reject) => {

    if (typeof opts.mongoUrl !== 'string')
      return reject(new Error('mongoUrl is required.'));


    require('./lib/connect')(opts, (err, db) => {

      if (err) return reject(err);

      // Init Models
      exports.initModels({
        logger: opts.logger,
        db: db
      });

      return resolve({
        db: db,
        collections: require('./lib/models').MODELS,
        utils: require('./lib/utils')
      });
    });

  });
};
