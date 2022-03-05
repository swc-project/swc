function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
// @allowJs: true
// @checkJs: true
// @target: es5
// @lib: es6
// @outDir: ./out
// @declaration: true
// @filename: index.js
var TopLevelSym = Symbol();
var InnerSym = Symbol();
var _obj;
module.exports = (_obj = {}, _defineProperty(_obj, TopLevelSym, function() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 12;
    return x;
}), _defineProperty(_obj, "items", _defineProperty({}, InnerSym, function() {
    var arg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        x: 12
    };
    return arg.x;
})), _obj);
// @filename: index2.js
var TopLevelSym = Symbol();
var InnerSym = Symbol();
var _InnerSym = InnerSym;
export var MyClass = function MyClass() {
    "use strict";
    var _p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : InnerSym;
    _classCallCheck(this, MyClass);
    this[_InnerSym] = "ok";
};
MyClass[TopLevelSym] = 12;
