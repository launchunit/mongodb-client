
const ObjectID = require('mongodb').ObjectID;


exports.toObjectID = function(hex) {
  if (hex instanceof ObjectID)
    return hex;

  return ObjectID.createFromHexString(hex);
};


exports.isObjectID = idStr => ObjectID.isValid(idStr);


exports.flattenObject = require('flat');


// schemaData: function(modelName, d1, d2, d3, d4) {
//   return app.mongodb.models[modelName].schema.validate(
//     _.assign(d1, d2, d3, d4)
//   ).value;
// },
