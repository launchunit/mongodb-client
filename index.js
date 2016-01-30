
'use strict';

/**
 * Module dependencies.
 * @private
 */
const path = require('path'),
  RequireAll = require('require-all')


/**
 * Constants
 * @private
 */
const MODELS = {};


/**
 * @params {String} opts.name (Required)
 * @params {Array} opts.indexes (Optional)
 * @params {Object} opts.schema (Optional)
 * @params {Object} opts.actions (Optional)
 *
 * @public
 */
exports.createModel = opts => {

  if (! opts.name)
    throw new Error('Model name is required.');

  if (MODELS[opts.name])
    throw new Error(`Model name ${opts.name} already exits.`);

  if (opts.name === 's' ||
      opts.name === 'collection' ||
      opts.name === 'db')
    throw new Error(`Model name "${name}" is reserved, use something else.`);

  MODELS[opts.name] = opts;
};


/**
 * @params {String} opts.mongoUrl (Required)
 *
 * @params {Boolean|Function} opts.logger
 *           - Can be a Boolean (True = Default=console)
 *           - Logger Function(msg, context)
 *
 * @params {Object} opts.connection (Optional)
 * @params {Object} opts.joi_errors (Optional)
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
      require('./lib/models').initModels({
        logger: opts.logger,
        joi_errors: opts.joi_errors,
        models: MODELS,
        db: db
      });

      return resolve({
        db: db,
        collections: MODELS,
        utils: require('./lib/utils')
      });
    });

  });
};


/**
 * Load Models from a Path
 *
 * @params {String} modelsPath (Required)
 *
 * @public
 */
exports.loadModels = modelsPath => {

  return RequireAll({
    dirname: path.resolve(modelsPath),
    filter:  /(.+)\.js$/, // Only JS files
    recursive: false,
    resolve: function(m) {
      return exports.createModel(m);
    }
  });
};
