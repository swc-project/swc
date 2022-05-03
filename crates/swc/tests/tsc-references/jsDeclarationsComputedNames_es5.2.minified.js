import * as swcHelpers from "@swc/helpers";
var _obj, TopLevelSym = Symbol(), InnerSym = Symbol();
module.exports = (_obj = {}, swcHelpers.defineProperty(_obj, TopLevelSym, function() {
    var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 12;
    return x;
}), swcHelpers.defineProperty(_obj, "items", swcHelpers.defineProperty({}, InnerSym, function() {
    var arg = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 12
    };
    return arg.x;
})), _obj);
var TopLevelSym = Symbol(), InnerSym = Symbol(), _InnerSym = InnerSym;
export var MyClass = function() {
    "use strict";
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], swcHelpers.classCallCheck(this, MyClass), this[_InnerSym] = "ok";
};
MyClass[TopLevelSym] = 12;
