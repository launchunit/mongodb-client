
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

    const _Paths = [];
    var flatDiff = _.reduce(diff, (ret, i)=> {

      // Account for Edit or New
      if (i.kind === 'E' || i.kind === 'N') {
        ret['$set'] = ret['$set'] || {};
        ret['$set'][prependPath.concat(i.path).join('.')] = i.rhs;

        // Add Paths MetaData
        _Paths.push(i.path);
      }

      // Array
      else if (i.kind === 'A' && i.item &&
               (i.item.kind === 'N' || i.item.kind === 'E')) {

        var tempPath = prependPath.concat(i.path).join('.');

        // Account for $Each
        if (typeof ret['$push'] !== 'undefined' &&
            typeof ret['$push'][tempPath] !== 'undefined') {

          if (typeof ret['$push'][tempPath]['$each'] !== 'undefined') {
            ret['$push'][tempPath]['$each'].push(i.item.rhs);
          }

          // $Each doesnt exist, create $Each
          else {
            const tempRhs = ret['$push'][tempPath];
            ret['$push'][tempPath] = {};
            ret['$push'][tempPath]['$each'] = new Array(tempRhs, i.item.rhs);
          }

          // Add Paths MetaData
          _Paths.push(i.path);
        }

        else {

          // Determine If We should $Set or $Push
          var _isPush = true;
          _.forEach(_Paths, p => {

            if (_.intersection(p, i.path).length) {
              _isPush = false;
              return false
            }
          });

          // The Path has been used, use $Set operation
          if (_isPush === false &&
              typeof i.item.rhs === 'object') {
            ret['$set'] = ret['$set'] || {};
            ret['$set'][prependPath.concat(i.path,i.index).join('.')] = i.item.rhs;
          }
          else {
            ret['$push'] = ret['$push'] || {};
            ret['$push'][tempPath] = i.item.rhs;
          }

          // Add Paths MetaData
          _Paths.push(i.path);
        }
      }

      // ToDo - Account for Remove or Delete of Item
      // i.kind === 'D'
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
