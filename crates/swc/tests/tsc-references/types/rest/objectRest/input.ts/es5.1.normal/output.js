function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
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
var a = o.a, justB = _objectWithoutProperties(o, [
    "a"
]);
var a = o.a, renamed = o.b, empty = _objectWithoutProperties(o, [
    "a",
    "b"
]);
var renamed = o['b'], justA = _objectWithoutProperties(o, [
    'b'
]);
var renamed = o['b'], justA = _objectWithoutProperties(o, [
    'b'
]);
var _b = o.b, n = _b['0'], oooo = _b['1'], justA = _objectWithoutProperties(o, [
    "b"
]);
var o2 = {
    c: 'terrible idea?',
    d: 'yes'
};
var renamed = o2.d, d = _objectWithoutProperties(o2, [
    "d"
]);
var nestedrest;
var x = nestedrest.x, _n1 = nestedrest.n1, y = _n1.y, z = _n1.n2.z, nr = _extends({
}, nestedrest.n1.n2.n3), restrest = _objectWithoutProperties(nestedrest, [
    "x",
    "n1"
]);
var complex;
var ka = complex.x.ka, other = complex.y, nested = _objectWithoutProperties(complex.x, [
    "ka"
]), rest = _objectWithoutProperties(complex, [
    "x",
    "y"
]);
var _complex;
var ref;
_complex = complex, nested = _objectWithoutProperties(_complex.x, [
    "ka"
]), rest = _objectWithoutProperties(_complex, [
    "x",
    "y"
]), ref = _complex, ({ ka  } = ref.x), other = ref.y, ref, _complex;
var _ref = {
    x: 1,
    y: 2
}, x = _ref.x, fresh = _objectWithoutProperties(_ref, [
    "x"
]);
var _tmp;
_tmp = {
    x: 1,
    y: 2
}, fresh = _objectWithoutProperties(_tmp, [
    "x"
]), x = _tmp.x, _tmp;
var Removable = /*#__PURE__*/ function() {
    "use strict";
    function Removable() {
        _classCallCheck(this, Removable);
    }
    _createClass(Removable, [
        {
            key: "z",
            set: function set(value) {
            }
        },
        {
            key: "both",
            get: function get() {
                return 12;
            },
            set: function set(value) {
            }
        },
        {
            key: "m",
            value: function m() {
            }
        }
    ]);
    return Removable;
}();
var removable = new Removable();
var removed = removable.removed, removableRest = _objectWithoutProperties(removable, [
    "removed"
]);
var i1 = removable;
var removed = i1.removed, removableRest2 = _objectWithoutProperties(i1, [
    "removed"
]);
var computed = 'b';
var computed2 = 'a';
var stillNotGreat = o[computed], soSo = o[computed2], o = _objectWithoutProperties(o, [
    computed,
    computed2
].map(_toPropertyKey));
var _o;
var ref1;
_o = o, o = _objectWithoutProperties(_o, [
    computed,
    computed2
].map(_toPropertyKey)), ref1 = _o, stillNotGreat = ref1[computed], soSo = ref1[computed2], ref1, _o;
var noContextualType = function(_param) {
    var _aNumber = _param.aNumber, aNumber = _aNumber === void 0 ? 12 : _aNumber, notEmptyObject = _objectWithoutProperties(_param, [
        "aNumber"
    ]);
    return aNumber + notEmptyObject.anythingGoes;
};
