
const test = require('ava');


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
