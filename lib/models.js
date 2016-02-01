
'use strict';

/**
 * Module dependencies.
 * @private
 */
const _ = require('lodash'),
  util = require('util'),
  Joi = require('joi');


/**
 * @params {Db Instance} opts.db (Required)
 * @params {Object} opts.models (Required)
 * @params {Object} opts.logger (Required)
 * @params {Object} opts.joi (Optional)
 *
 * @private
 */
exports.initModels = opts => {

  _.forEach(opts.models, function(m) {

    opts.logger(`Loading Model: "${m.name}"`);

    const collection = opts.db.collection(m.name);

    if (m.schema) collection.schema = m.schema;

    // Compile Joi schema for each action
    if (m.actions) {
      collection.actions = _.mapValues(m.actions, a => {
        return Joi.compile(a)
            .options(opts.joi);
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
            opts.logger(`Index created @ ${m.name} ${util.inspect(i[0])}`);
          });
      });
    }

    opts.models[m.name] = collection;
  });

};
