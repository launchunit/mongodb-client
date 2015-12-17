
const _ = require('lodash'),
  ObjectID = require('mongodb').ObjectID,
  Diff = require('deep-diff');


exports.toObjectID = function(hex) {
  if (hex instanceof ObjectID)
    return hex;

  return ObjectID.createFromHexString(hex);
};


exports.isObjectID = idStr => ObjectID.isValid(idStr);


exports.flattenObject = require('flat');


exports.deepDiff = function(source, newObj) {

  // Remove the ObjectID and Deep-Diff the Object
  const OId = source._id;
  delete source._id;
  delete newObj._id;

  const diff = Diff.diff(source, newObj);

  // Create Flat Diff for Update
  if (diff) {

    const flatDiff = _.reduce(diff, (ret, i)=> {
      // Nested Paths
      ret[Array.isArray(i.path) ? i.path.join('.') : i.path] = i.rhs;
      return ret;
    }, {});
  }

  return {
    ObjectId: OId,
    detail: diff,
    diffObj: flatDiff
  };
};


// schemaData: function(modelName, d1, d2, d3, d4) {
//   return app.mongodb.models[modelName].schema.validate(
//     _.assign(d1, d2, d3, d4)
//   ).value;
// },
