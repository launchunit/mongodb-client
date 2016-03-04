
const Joi = require('joi'),
  test = require('ava');

// Global Logger
require('logger')({ level: 'info' });

// Init Things
var client;


test.before(t => {

  client = require('../');
  t.ok(client);
  t.ok(client.createModel);
  t.ok(client.loadModels);
  t.ok(client.initModels);

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
    },
    methods: {
      abd: {
        created: Joi.date().min('now').default(new Date)
      },
      xyz: {
        email: Joi.string().lowercase().trim().email()
      }
    }
  });
});

test.serial('Load Models from a Path', t => {
  client.loadModels(__dirname + '/models');
  t.pass();
});

test.serial('Connect to mongoDB (mongoUrl Not Passed)', t => {

  return client.connect()
  .then(function(res) {
    t.is(e, undefined);
  })
  .catch(function(e) {
    t.ok(e instanceof Error);
  });
});

test.serial('Connect to mongoDB (mongoUrl is Incorrect)', t => {

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

  return client.connect({
    mongoUrl: process.env.MONGO_URL,
    debug: false
  })
  .then(function(res) {
    t.ok(res.db);
    t.ok(res.collections);
    t.ok(res.utils);
    global.DB = res;
  })
  .catch(function(e) {
    t.is(e, undefined);
  });
});

// Load Other Tests
require('./insert');
require('./utils');

