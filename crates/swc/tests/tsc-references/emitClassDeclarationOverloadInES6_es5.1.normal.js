import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target: es6
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
};
var D = function D(x) {
    "use strict";
    var z = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "hello";
    _class_call_check(this, D);
};
