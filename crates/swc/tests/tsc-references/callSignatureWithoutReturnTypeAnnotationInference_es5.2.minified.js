import * as swcHelpers from "@swc/helpers";
function foo3() {
    return foo3();
}
x1 = 1, function(x) {
    var x1;
    x1 = 1;
}(1), foo3(), function(x) {
    try {} catch (e) {
        return [];
    } finally{}
}(1), function(x) {
    void 0 === x || swcHelpers.typeOf(x);
}(1);
var x1, M, e1, C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
function m1() {
    return 1;
}
!function(M1) {
    M1.x = 1;
    var C1 = function() {
        "use strict";
        swcHelpers.classCallCheck(this, C1);
    };
    M1.C = C1;
}(M || (M = {})), (m1 || (m1 = {})).y = 2;
var c1 = function(x) {
    "use strict";
    swcHelpers.classCallCheck(this, c1);
};
(c1 || (c1 = {})).x = 1, function(e1) {
    e1[e1.A = 0] = "A";
}(e1 || (e1 = {})), (e1 || (e1 = {})).y = 1;
