
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
 * @params {String} opts.mongoUrl || process.env.MONGO_URL (Required)
 * @params {Boolean} opts.debug (Optional, Default = true)
 * @params {Object} opts.connection (Optional)
 *
 * @return {Promise}
 * @public
 */
exports.connect = opts => {

  opts = Object.assign({
    debug: true
  }, opts);

  // Checking Env Var
  opts.mongoUrl = opts.mongoUrl || process.env.MONGO_URL;


  return new Promise((resolve, reject) => {

    if (typeof opts.mongoUrl !== 'string')
      return reject(new Error('mongoUrl is required.'));


    require('./lib/connect')(opts, (err, db) => {

      if (err) return reject(err);

      // Init Models
      exports.initModels({
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
