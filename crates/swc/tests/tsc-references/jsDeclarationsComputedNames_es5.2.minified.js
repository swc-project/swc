import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
var _obj, TopLevelSym = Symbol(), InnerSym = Symbol();
module.exports = (_define_property(_obj = {}, TopLevelSym, function() {
    var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 12;
    return x;
}), _define_property(_obj, "items", _define_property({}, InnerSym, function() {
    var arg = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 12
    };
    return arg.x;
})), _obj);
var TopLevelSym = Symbol(), InnerSym = Symbol(), _InnerSym = InnerSym;
export var MyClass = function() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], _class_call_check(this, MyClass), this[_InnerSym] = "ok";
};
MyClass[TopLevelSym] = 12;
