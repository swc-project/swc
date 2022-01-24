function _defineProperties(target, props) {
    for(var i1 = 0; i1 < props.length; i1++){
        var descriptor = props[i1];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i1 = 1; i1 < arguments.length; i1++){
            var source = arguments[i1];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function _objectWithoutProperties(source, excluded) {
    if (null == source) return {};
    var key, i1, target = _objectWithoutPropertiesLoose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i1 = 0; i1 < sourceSymbolKeys.length; i1++)key = sourceSymbolKeys[i1], excluded.indexOf(key) >= 0 || Object.prototype.propertyIsEnumerable.call(source, key) && (target[key] = source[key]);
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) return {};
    var key, i1, target = {}, sourceKeys = Object.keys(source);
    for(i1 = 0; i1 < sourceKeys.length; i1++)key = sourceKeys[i1], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
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
var nestedrest, complex, _complex, ref, _o, ref1, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, o = {
    a: 1,
    b: "no"
};
_extends({}, o), o.a, _objectWithoutProperties(o, [
    "a"
]), o.a, o.b, _objectWithoutProperties(o, [
    "a",
    "b"
]), o.b, _objectWithoutProperties(o, [
    "b"
]), o.b, _objectWithoutProperties(o, [
    "b"
]);
var _b = o.b;
_b["0"], _b["1"], _objectWithoutProperties(o, [
    "b"
]);
var o2 = {
    c: "terrible idea?",
    d: "yes"
};
o2.d, _objectWithoutProperties(o2, [
    "d"
]), nestedrest.x;
var _n1 = nestedrest.n1;
_n1.y, _n1.n2.z, _extends({}, nestedrest.n1.n2.n3), _objectWithoutProperties(nestedrest, [
    "x",
    "n1"
]), complex.x.ka, complex.y, _objectWithoutProperties(complex.x, [
    "ka"
]), _objectWithoutProperties(complex, [
    "x",
    "y"
]), _objectWithoutProperties((_complex = complex).x, [
    "ka"
]), _objectWithoutProperties(_complex, [
    "x",
    "y"
]), (ref = _complex).x.ka, ref.y;
var _ref = {
    x: 1,
    y: 2
}, x = _ref.x, fresh = _objectWithoutProperties(_ref, [
    "x"
]), _tmp = {
    x: 1,
    y: 2
};
_objectWithoutProperties(_tmp, [
    "x"
]), _tmp.x;
var Removable = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Removable() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Removable);
    }
    return Constructor = Removable, protoProps = [
        {
            key: "z",
            set: function(value) {}
        },
        {
            key: "both",
            get: function() {
                return 12;
            },
            set: function(value) {}
        },
        {
            key: "m",
            value: function() {}
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Removable;
}(), removable = new Removable();
removable.removed, _objectWithoutProperties(removable, [
    "removed"
]);
var i = removable;
i.removed, _objectWithoutProperties(i, [
    "removed"
]);
var computed = "b", computed2 = "a", stillNotGreat = o[computed], soSo = o[computed2], o = _objectWithoutProperties(o, [
    computed,
    computed2
].map(_toPropertyKey));
o = _objectWithoutProperties(_o = o, [
    computed,
    computed2
].map(_toPropertyKey)), (ref1 = _o)[computed], ref1[computed2];
