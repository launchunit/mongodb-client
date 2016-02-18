
const test = require('ava');

test('toObjectID', t => {

  const hexId = '56be1d2a54d12187e6ee764e';
  const oId = DB.utils.toObjectID(hexId);

  t.ok(typeof oId === 'object');
});

test('toObjectID - When there is a trailing space', t => {

  const hexId = '56be1d2a54d12187e6ee764e   ';
  const oId = DB.utils.toObjectID(hexId);

  t.ok(typeof oId === 'object');
});

// test('deepDiff', t => {

//   const user = {
//     email: 'abc@abc.com',
//     permissions: [
//       {
//         org_id: '1454520867652',
//         roles: ['admin']
//       },
//       {
//         org_id: '2342323234',
//         roles: ['admin']
//       },
//     ]
//   };

//   const update = {
//     first_name: 'Superman',
//     permissions: [
//       {
//         org_id: '1454520867652',
//         roles: ['admin']
//       }
//     ]
//   };

//   // Diff It
//   console.log(DB.utils.deepDiff(user, update));

// });
