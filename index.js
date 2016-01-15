
'use strict';

/**
 * Constants
 * @private
 */

const MODELS = {};


/**
 * @params {String} opts.name (Required)
 * @params {Array} opts.indexes (Optional)
 * @params {Object} opts.schema (Optional)
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
 * @params {Boolean|Object} opts.logger (Default=console)
 *           - Can be a boolean or logger function
 *           - Logger Object = { error, info, debug }
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

      require('./lib/models')({
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
