import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
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
module.exports = (_obj = {}, _define_property(_obj, TopLevelSym, function() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 12;
    return x;
}), _define_property(_obj, "items", _define_property({}, InnerSym, function() {
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
    _class_call_check(this, MyClass);
    this[_InnerSym] = "ok";
};
MyClass[TopLevelSym] = 12;
