
'use strict';

/**
 * Module dependencies.
 * @private
 */
const _ = require('lodash'),
  path = require('path'),
  RequireAll = require('require-all'),
  util = require('util'),
  joiHelpers = require('joi-helpers');


/**
 * Constants
 * @public
 */
const MODELS = {};
exports.MODELS = MODELS;


/**
 * @params {String} opts.name (Required)
 * @params {Array} opts.indexes (Optional)
 * @params {Object} opts.schema (Optional)
 * @params {Object} opts.methods (Optional)
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


/**
 * @params {Db Instance} opts.db (Required)
 *
 * @public
 */
exports.initModels = opts => {

  _.forEach(MODELS, function(m) {

    // If Already Init, then Do Nothing
    if (m.s) return;


    logger.mongodb(`Loading Model: "${m.name}"`);

    const collection = opts.db.collection(m.name);

    if (m.schema) collection.schema = m.schema;

    // Compile Joi schema for each action
    if (m.methods) {
      collection.methods = _.mapValues(m.methods, a => {
        return joiHelpers.compile(a);
      });
    }


    // Create Indexes
    // https://docs.mongodb.org/manual/reference/method/db.collection.createIndex/#db.collection.createIndex
    if (m.indexes) {
      _.forEach(m.indexes.splice(0), function(i) {

        collection.createIndex(i[0],
          // Make Background Indexing by Default
          Object.assign({ background: true },
            (i[1] || {})),
          function() {
            logger.mongodb(`Index created @ ${m.name} ${util.inspect(i[0])}`);
          });
      });
    }

    MODELS[m.name] = collection;
  });
};

