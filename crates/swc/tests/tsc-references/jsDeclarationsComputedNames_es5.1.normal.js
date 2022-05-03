import * as swcHelpers from "@swc/helpers";
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
module.exports = (_obj = {}, swcHelpers.defineProperty(_obj, TopLevelSym, function() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 12;
    return x;
}), swcHelpers.defineProperty(_obj, "items", swcHelpers.defineProperty({}, InnerSym, function() {
    var arg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        x: 12
    };
    return arg.x;
})), _obj);
// @filename: index2.js
var TopLevelSym = Symbol();
var InnerSym = Symbol();
export var MyClass = function MyClass() {
    "use strict";
    var _p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : InnerSym;
    swcHelpers.classCallCheck(this, MyClass);
    this[InnerSym] = "ok";
};
MyClass[TopLevelSym] = 12;
