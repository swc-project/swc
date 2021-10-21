function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {
    };
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {
    };
    var target = {
    };
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
// @target: es2015
var o = {
    a: 1,
    b: 'no'
};
var clone = _extends({
}, o);
var { a  } = o, justB = _objectWithoutProperties(o, [
    "a"
]);
var { a , b: renamed  } = o, empty = _objectWithoutProperties(o, [
    "a",
    "b"
]);
var { ['b']: renamed  } = o, justA = _objectWithoutProperties(o, [
    'b'
]);
var { 'b': renamed  } = o, justA = _objectWithoutProperties(o, [
    'b'
]);
var { b: { '0': n , '1': oooo  }  } = o, justA = _objectWithoutProperties(o, [
    "b"
]);
let o2 = {
    c: 'terrible idea?',
    d: 'yes'
};
var { d: renamed  } = o2, d = _objectWithoutProperties(o2, [
    "d"
]);
let nestedrest;
var { x , n1: { y , n2: { z  }  }  } = nestedrest, nr = _extends({
}, nestedrest.n1.n2.n3), restrest = _objectWithoutProperties(nestedrest, [
    "x",
    "n1"
]);
let complex;
var { x: { ka  } , y: other  } = complex, nested = _objectWithoutProperties(complex.x, [
    "ka"
]), rest = _objectWithoutProperties(complex, [
    "x",
    "y"
]);
var _complex;
_complex = complex, nested = _objectWithoutProperties(_complex.x, [
    "ka"
]), rest = _objectWithoutProperties(_complex, [
    "x",
    "y"
]), ({ x: { ka  } , y: other  } = _complex), _complex;
var _ref = {
    x: 1,
    y: 2
}, { x  } = _ref, fresh = _objectWithoutProperties(_ref, [
    "x"
]);
var _tmp;
_tmp = {
    x: 1,
    y: 2
}, fresh = _objectWithoutProperties(_tmp, [
    "x"
]), ({ x  } = _tmp), _tmp;
class Removable {
    set z(value) {
    }
    get both() {
        return 12;
    }
    set both(value1) {
    }
    m() {
    }
}
var removable = new Removable();
var { removed  } = removable, removableRest = _objectWithoutProperties(removable, [
    "removed"
]);
var i1 = removable;
var { removed  } = i1, removableRest2 = _objectWithoutProperties(i1, [
    "removed"
]);
let computed = 'b';
let computed2 = 'a';
var { [computed]: stillNotGreat , [computed2]: soSo  } = o, o = _objectWithoutProperties(o, [
    computed,
    computed2
].map(_toPropertyKey));
var _o;
_o = o, o = _objectWithoutProperties(_o, [
    computed,
    computed2
].map(_toPropertyKey)), ({ [computed]: stillNotGreat , [computed2]: soSo  } = _o), _o;
var noContextualType = (_param)=>{
    var { aNumber =12  } = _param, notEmptyObject = _objectWithoutProperties(_param, [
        "aNumber"
    ]);
    return aNumber + notEmptyObject.anythingGoes;
};
