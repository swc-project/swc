function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _key, _key1, _obj, TopLevelSym = Symbol(), InnerSym = Symbol();
module.exports = (_defineProperty(_obj = {}, TopLevelSym, function() {
    var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 12;
    return x;
}), _defineProperty(_obj, "items", _defineProperty({}, InnerSym, function() {
    var arg = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 12
    };
    return arg.x;
})), _obj);
var TopLevelSym = Symbol(), InnerSym = Symbol();
export var MyClass = function() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], (function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    })(this, MyClass), this[_key1] = "ok";
};
_key = TopLevelSym, _key1 = InnerSym, MyClass[_key] = 12;
