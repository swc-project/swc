import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
function foo(t, t2) {
    return function(x) {
        return t2;
    };
}
var c;
var d;
var r2 = foo(d, c); // the constraints are self-referencing, no downstream error
var r9 = foo(function() {
    return 1;
}, function() {}); // the constraints are self-referencing, no downstream error
function other() {
    var r5 = foo(c, d); // error
}
