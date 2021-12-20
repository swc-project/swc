function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {
        }, ownKeys = Object.keys(source);
        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }))), ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
var _obj, o = {
    a: 1,
    b: "no"
}, PrivateOptionalX = function() {
    "use strict";
    _classCallCheck(this, PrivateOptionalX);
}, PublicX = function() {
    "use strict";
    _classCallCheck(this, PublicX);
}, o2 = _objectSpread({
}, publicX, privateOptionalX);
o2.x, _objectSpread({
}, optionalString, optionalNumber), _objectSpread({
}, {
    b: !0
}, {
    s: "foo"
}), _objectSpread({
    b: "bad"
}, o, {
    b: "bad"
}, o2, {
    b: "bad"
}), _objectSpread({
}, o, o), _objectSpread({
    b: "ignored"
}, o);
var o3 = {
    a: 1,
    b: "no"
}, o4 = {
    b: "yes",
    c: !0
};
_objectSpread({
    b: "ok"
}, o3, o4), _objectSpread({
}, o3, {
    b: "ok"
}, o4), _objectSpread({
}, _objectSpread({
    a: 4
}, {
    b: !1,
    c: "overriden"
}), {
    d: "actually new"
}, {
    a: 5,
    d: "maybe new"
}), _objectSpread({
    a: "wrong type?"
}, o3), _objectSpread({
}, o3, (_defineProperty(_obj = {
}, "in the middle", 13), _defineProperty(_obj, "b", "maybe?"), _obj), o4), _objectSpread({
}, 12), _objectSpread({
}, 2), _objectSpread({
}, 0).toFixed(), _objectSpread({
}, !0).valueOf();
var spreadStr = _objectSpread({
}, "foo");
spreadStr.length, spreadStr.charAt(1), _objectSpread({
}, function() {
})(), _objectSpread({
}, {
    set b (bad){
    }
}).b = 12;
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        _classCallCheck(this, C), this.p = 1;
    }
    return protoProps = [
        {
            key: "m",
            value: function() {
            }
        }
    ], _defineProperties((Constructor = C).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
_objectSpread({
}, new C()).m(), _objectSpread({
}, {
    a: 123
}).a;
