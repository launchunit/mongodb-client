# mongodb-client
Nodejs client for mongoDB

----

## Usage

```js
const mongoDB = require('mongodb-client');

/**
 * @params {String} opts.name (Required)
 * @params {Array} opts.indexes (Optional)
 * @params {Object} opts.schema (Optional)
 * @params {Object} opts.actions (Optional)
 *
 * @public
 */
mongoDB.createModel({
  name: 'user',
  indexes: [
    [ { email: 1 }, { unique: true, sparse: false } ],
    [ { fb_id: 1 }, { unique: true, sparse: false } ]
  ], // (Optional)
  // Joi schema
  schema: {
    created: Joi.date().min('now').default(new Date),
    email: Joi.string().lowercase().trim().email(),
  } // (Optional)
});


// You can also use loadModels helper to
// load all the models in a directory
/**
 * Load Models from a Path
 *
 * @params {String} modelsPath (Required)
 *
 * @public
 */
mongoDB.loadModels(__dirname + '/models');


/**
 * @params {String} opts.mongoUrl (Required)
 *
 * @params {Boolean|Object} opts.logger
 *           - Can be a Boolean (True = Default=console)
 *           - Logger Object = { error, info, debug }
 *
 * @params {Object} opts.connection (Optional)
 * @params {Object} opts.joi_errors (Optional)
 *
 * @return {Promise}
 * @public
 */
// Once models have been created, Connect!
mongoDB.connect({
  mongoUrl: 'mongodb://tester:tester@dbhost'
})
.then(function(res) {
  console.log(res);
  // { db, collections, utils }
})
.catch(function(e) {
  console.log(e);
});
```


#### Run Tests
```bash
$ npm test
```

#### To Do
- [ ] Test joi validations
- [ ] Test flat (nested) updates
- [ ] Utils.deepDiff - Account for Removal of Item in Array
