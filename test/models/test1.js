
module.exports = {
  name: 'test1',
  indexes: [
    [ { email: 1 }, { unique: true, sparse: false } ],
    [ { fb_id: 1 }, { unique: true, sparse: true } ]
  ]
};
