
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


// @prependPath {Array}
exports.deepDiff = function(oldObj, newObj, prependPath) {

  prependPath = prependPath || [];
  Array.isArray(prependPath) ? prependPath : [prependPath];

  // Remove the ObjectID and Deep-Diff the Object
  const oldObjId = oldObj._id;
  delete oldObj._id;
  delete newObj._id;

  const diff = Diff.diff(oldObj, newObj);

  // Create Flat Diff for Update
  if (diff) {

    const flatDiff = _.reduce(diff, (ret, i)=> {

      // Only Account for Edit or New
      if (i.kind === 'E' || i.kind === 'N') {
        ret['$set'] = ret['$set'] || {};
        ret['$set'][prependPath.concat(i.path).join('.')] = i.rhs;
      }

      // Account for Removal
      // if (i.kind === 'D') {
      //   ret['$unset'] = ret['$unset'] || {};
      //   ret['$unset'][path] = '';
      // }

      // ToDo - Account for Removal of Item in Array
      /***
      Exmaple
      DiffArray {
        kind: 'A',
        path: [ 'contactInfos' ],
        index: 4,
        item:
          DiffDeleted {
           kind: 'D',
           lhs:
           { consumerVisible: true,
             userId: '552c36078604fd3daf1b317e',
             profileImageURL: '//d2787ndpv5cwhz.cloudfront.net/118e9a8db8333858506b04fcabada21070722edd/300x300.jpg',
             websiteURL: '/agents/nyc/sr-team/',
             phone: '6468323543',
             contactName: 'The Spiegelman-Rothman Team',
             email: 'srteam@compass.com' } } } ],
        ***/

      return ret;
    }, {});
  }

  return {
    objectId: oldObjId,
    diff: diff,
    patch: (flatDiff && Object.keys(flatDiff).length)
                ? flatDiff : undefined

  };
};


// schemaData: function(modelName, d1, d2, d3, d4) {
//   return app.mongodb.models[modelName].schema.validate(
//     _.assign(d1, d2, d3, d4)
//   ).value;
// },
