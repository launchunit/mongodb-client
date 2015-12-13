# mongodb-client
Nodejs client for mongoDB

----

## Usage

```js
// Create a mongoDB client instance
const mongoDB = require('mongodb-client');

// Create Models
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


// Once models have been created, Connect!
/**
 * @params {String} opts.mongoUrl (Required)
 *
 * @params {Boolean|Object} opts.logger (Default=console)
 *           - Can be a boolean or logger function
 *           - Logger Object = { error, info, debug }
 *
 * @params {Object} opts.connection (Optional)
 */
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
