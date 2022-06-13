import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function() {
    "use strict";
    var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 12, y = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : x;
    _class_call_check(this, Foo), this.x = x, this.y = y;
};
