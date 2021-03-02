// Loaded from https://cdn.skypack.dev/-/mongobj@v1.0.9-VYPOdIIfPZvZAWJWUZ9S/dist=es2020,mode=imports/optimized/mongobj.js


function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = void 0;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
var ArrayFilter = /^\$\[(.*)\]$/;
var ArrayIndex = /^[0-9]*$/;
function getProp(_ref) {
  var obj = _ref.obj, path = _ref.path, _ref$arrayFilters = _ref.arrayFilters, arrayFilters = _ref$arrayFilters === void 0 ? [] : _ref$arrayFilters, _ref$level = _ref.level, level = _ref$level === void 0 ? 0 : _ref$level, _ref$createOnNone = _ref.createOnNone, createOnNone = _ref$createOnNone === void 0 ? false : _ref$createOnNone;
  var tokens = path.split(".");
  var parent = obj;
  var _loop = function _loop2() {
    var propName = tokens.splice(0, 1)[0];
    var m = propName.match(ArrayFilter);
    if (m) {
      var filter = arrayFilters.find(function(f) {
        return Object.keys(f)[0].startsWith(m[1] + ".");
      });
      if (!filter) {
        return {
          v: null
        };
      }
      var key = Object.keys(filter)[0];
      var filterKey = key.substring(m[1].length + 1, key.length);
      var filterValue = Object.values(filter)[0];
      parent = parent.find(function(i) {
        return getProp({
          obj: i,
          path: filterKey
        }) === filterValue;
      });
    } else if (propName.match(ArrayIndex)) {
      parent = parent[parseInt(propName)];
    } else {
      if (!(propName in parent)) {
        if (createOnNone !== false) {
          parent[propName] = {};
          parent = parent[propName];
        }
      } else {
        parent = parent[propName];
      }
    }
  };
  while (tokens.length > level) {
    var _ret = _loop();
    if (_typeof(_ret) === "object")
      return _ret.v;
  }
  return parent;
}
function objectMatch(obj, filter) {
  if (_typeof(filter) !== "object") {
    return false;
  }
  return Object.entries(filter).every(function(_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2), key = _ref3[0], value = _ref3[1];
    if (_typeof(value) !== "object") {
      return obj[key] === value;
    } else if (key === "$in") {
      return value.includes(obj);
    } else {
      return objectMatch(obj[key], value);
    }
  });
}
function update(obj, changes) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var _loop2 = function _loop22(op2) {
    var patches = changes[op2];
    var _loop3 = function _loop32(key2) {
      var tokens = key2.split(".");
      var attr = null;
      var parent = null;
      switch (op2) {
        case "$unset":
          parent = getProp({
            obj,
            path: key2,
            arrayFilters: options.arrayFilters,
            level: 1
          });
          attr = tokens[tokens.length - 1];
          delete parent[attr];
          break;
        case "$pull":
          parent = getProp({
            obj,
            path: key2,
            arrayFilters: options.arrayFilters
          });
          var idx = 0;
          if (_typeof(patches[key2]) === "object") {
            while (idx >= 0) {
              idx = parent.findIndex(function(i) {
                return objectMatch(i, patches[key2]);
              });
              if (idx >= 0) {
                parent.splice(idx, 1);
              }
            }
          } else {
            while (idx >= 0) {
              idx = parent.indexOf(patches[key2]);
              if (idx >= 0) {
                parent.splice(idx, 1);
              }
            }
          }
          break;
        case "$push":
          parent = getProp({
            obj,
            path: key2,
            arrayFilters: options.arrayFilters,
            level: 1,
            createOnNone: true
          });
          attr = tokens[tokens.length - 1];
          if (parent[attr] === void 0) {
            parent[attr] = [];
          }
          parent = parent[attr];
          if (patches[key2]["$each"]) {
            patches[key2]["$each"].forEach(function(i) {
              if ("$position" in patches[key2]) {
                parent.splice(patches[key2]["$position"], 0, i);
              } else {
                parent.push(i);
              }
            });
          } else {
            parent.push(patches[key2]);
          }
          break;
        default:
          parent = getProp({
            obj,
            path: key2,
            arrayFilters: options.arrayFilters,
            level: 1,
            createOnNone: true
          });
          attr = tokens[tokens.length - 1];
          parent[attr] = patches[key2];
      }
    };
    for (var key in patches) {
      _loop3(key);
    }
  };
  for (var op in changes) {
    _loop2(op);
  }
  return obj;
}
var mongobj = {
  update
};
export default mongobj;
var update$1 = mongobj.update;
export {mongobj as __moduleExports, update$1 as update};
