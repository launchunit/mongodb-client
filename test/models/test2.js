
module.exports = {
  name: 'test2',
  indexes: [
    [ { email: 1 }, { unique: true, sparse: false } ],
    [ { fb_id: 1 }, { unique: true, sparse: true } ]
  ]
};
