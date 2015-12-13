
const Joi = require('joi'),
  test = require('ava');


// Init Things
var client, DB,
opts = {
  mongoUrl: process.env.MONGO_URL || ''
};


test.before(t => {

  client = require('../');

  // Create a model
  client.createModel({
    name: 'user',
    indexes: [
      [ { email: 1 }, { unique: true, sparse: false } ],
      [ { fb_id: 1 }, { unique: true, sparse: true } ]
    ],
    schema: {
      created: Joi.date().min('now').default(new Date),
      email: Joi.string().lowercase().trim().email(),
    }
  });
});


test('Connect to mongoDB (mongoUrl Not Passed)', t => {

  return client.connect()
  .then(function(res) {
    t.is(e, undefined);
  })
  .catch(function(e) {
    t.ok(e instanceof Error);
  });
});

test('Connect to mongoDB (mongoUrl is Incorrect)', t => {

  return client.connect({
    mongoUrl: 'mongodb://sssss'
  })
  .then(function(res) {
    t.is(e, undefined);
  })
  .catch(function(e) {
    t.ok(e instanceof Error);
  });
});

test.serial('Connect to mongoDB', t => {

  return client.connect(opts)
  .then(function(res) {
    t.ok(res.db);
    t.ok(res.collections);
    t.ok(res.utils);
    DB = res;
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});

test('Insert Data to User Collection, Index Requirement Not Met', t => {

  const userData = {
    name: 'Karan'
  };

  return DB.collections.user.insertOne(userData)
  .then(function(res) {
    t.is(e, undefined);
  })
  .catch(function(e) {
    // console.error(e);
    t.ok(e instanceof Error);
  });
});

test('Insert Data to User Collection, Index Requirement Not Met', t => {

  const userData = {
    name: 'Karan',
    email: 'Karan@Karan.com'
  };

  return DB.collections.user.insertOne(userData)
  .then(function(res) {
    t.is(e, undefined);
  })
  .catch(function(e) {
    // console.error(e);
    t.ok(e instanceof Error);
  });
});

test('Insert Data to User Collection', t => {

  const userData = {
    name: 'Karan',
    email: `Karan_${Date.now()}@Karan.com`
  };

  return DB.collections.user.insertOne(userData)
  .then(function(res) {
    t.ok(res.result);
    t.ok(res.result.ok);
    t.ok(res.result.n === 1);
    t.ok(res.insertedId);
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});
