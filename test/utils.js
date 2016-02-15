
const test = require('ava');


test('deepDiff', t => {

  const user = {
    email: 'abc@abc.com',
    permissions: [
      {
        org_id: '1454520867652',
        roles: ['admin']
      },
      {
        org_id: '2342323234',
        roles: ['admin']
      },
    ]
  };

  const update = {
    first_name: 'Superman',
    permissions: [
      {
        org_id: '1454520867652',
        roles: ['admin']
      }
    ]
  };

  // Diff It
  console.log(DB.utils.deepDiff(user, update));

});
