
const Diff = require('deep-diff'),
  _ = require('lodash');


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
  permissions: [
    {
      org_id: '1454520867652',
      roles: ['admin']
    },
    // {
    //   org_id: '2342323234',
    //   roles: ['admin']
    // },
    // {
    //   org_id: '2342323234',
    //   roles: ['admin']
    // },
  ]
}

/*
var a = {
    a1: 1,
    a2: 2,
    a3: {
        a3a1: 1,
        a3a2: 2
    },
    a4: [1,2,3],
    a6: [
        { a61: 1, date: 0 },
        { a62: 2, date: 1 }
    ]
};

var b = {
    temp: '111',
    a1: 1,
    a2: 2,
    a3: {
        a3a2: 2,
        a3a3: 3
    },
    a4: [1,2,5],
    a5: 'Hello',
    a6: [
        { a61: 1 },
        { a62: 4 },
        { a64: 4 }
    ]
};
*/

var a = {
  info: [
    {
      source: ['emailbreaker.com'],
      rule: 'rule1',
      userId: '123'
    },
    {
      source: ['new-stuff.com'],
      rule: 'rulex',
      userId: 'xxxx'
    }
  ]
};

b = {
  a: 3,
  info: [
    {
      source: ['emailbreaker.com'],
      rule: 'rule1',
      userId: '123'
    },
    {
      source: ['new-stuff.com'],
      rule: 'rulex',
      userId: 'xxxx'
    },
    {
      source: ['crazy-stuff.com'],
      rule: 'ruley',
      userId: 'yyyyy'
    }
 ]
};


const diff = Diff.diff(user, update);
console.log('---- Diff ----');
// console.log(diff);

prependPath = [];

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

console.log(require('util').inspect(flatDiff, { depth: null }));
