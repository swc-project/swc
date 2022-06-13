import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
    _class_call_check(this, C);
    this.x = x;
    var y = x;
};
var D = function D() {
    "use strict";
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
    _class_call_check(this, D);
    this.y = y;
    var z = x;
};
var E = function E() {
    "use strict";
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Date();
    _class_call_check(this, E);
    var y = x;
};
