function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function _objectWithoutProperties(source, excluded) {
    if (null == source) return {
    };
    var key, i, target = _objectWithoutPropertiesLoose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++)key = sourceSymbolKeys[i], excluded.indexOf(key) >= 0 || Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) return {
    };
    var key, i, target = {
    }, sourceKeys = Object.keys(source);
    for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
    return target;
}
function _toPropertyKey(arg) {
    var key = function(input, hint) {
        if ("object" !== _typeof(input) || null === input) return input;
        var prim = input[Symbol.toPrimitive];
        if (void 0 !== prim) {
            var res = prim.call(input, hint || "default");
            if ("object" !== _typeof(res)) return res;
            throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === hint ? String : Number)(input);
    }(arg, "string");
    return "symbol" === _typeof(key) ? key : String(key);
}
var _complex, _tmp, _o, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, o = {
    a: 1,
    b: "no"
};
_extends({
}, o);
var { a  } = o;
_objectWithoutProperties(o, [
    "a"
]);
var { a , b: renamed  } = o;
_objectWithoutProperties(o, [
    "a",
    "b"
]);
var { ["b"]: renamed  } = o;
_objectWithoutProperties(o, [
    "b"
]);
var { b: renamed  } = o;
_objectWithoutProperties(o, [
    "b"
]);
var { b: { "0": n , "1": oooo  }  } = o;
_objectWithoutProperties(o, [
    "b"
]);
let o2 = {
    c: "terrible idea?",
    d: "yes"
};
var { d: renamed  } = o2;
_objectWithoutProperties(o2, [
    "d"
]);
let nestedrest;
var { x , n1: { y , n2: { z  }  }  } = nestedrest;
_extends({
}, nestedrest.n1.n2.n3), _objectWithoutProperties(nestedrest, [
    "x",
    "n1"
]);
let complex;
var { x: { ka  } , y: other  } = complex;
_objectWithoutProperties(complex.x, [
    "ka"
]), _objectWithoutProperties(complex, [
    "x",
    "y"
]), _objectWithoutProperties((_complex = complex).x, [
    "ka"
]), _objectWithoutProperties(_complex, [
    "x",
    "y"
]), { x: { ka  } , y: other  } = _complex;
var _ref = {
    x: 1,
    y: 2
}, { x  } = _ref;
_objectWithoutProperties(_ref, [
    "x"
]), _objectWithoutProperties(_tmp = {
    x: 1,
    y: 2
}, [
    "x"
]), { x  } = _tmp;
var removable = new class {
    set z(value) {
    }
    get both() {
        return 12;
    }
    set both(value1) {
    }
    m() {
    }
}(), { removed  } = removable;
_objectWithoutProperties(removable, [
    "removed"
]);
var i1 = removable, { removed  } = i1;
_objectWithoutProperties(i1, [
    "removed"
]);
let computed = "b", computed2 = "a";
var { [computed]: stillNotGreat , [computed2]: soSo  } = o, o = _objectWithoutProperties(o, [
    computed,
    computed2
].map(_toPropertyKey));
o = _objectWithoutProperties(_o = o, [
    computed,
    computed2
].map(_toPropertyKey)), ({ [computed]: stillNotGreat , [computed2]: soSo  } = _o), (_param)=>{
    var { aNumber =12  } = _param;
    return aNumber + _objectWithoutProperties(_param, [
        "aNumber"
    ]).anythingGoes;
};
