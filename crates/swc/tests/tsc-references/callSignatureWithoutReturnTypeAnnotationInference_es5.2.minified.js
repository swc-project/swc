function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function foo3() {
    return foo3();
}
foo3(), (function(x) {
    try {} catch (e) {
        return [];
    } finally{}
})(1), (function(x) {
    var obj;
    void 0 === x || (obj = x) && "undefined" != typeof Symbol && obj.constructor === Symbol;
})(1);
var M, e1, C = function() {
    "use strict";
    _classCallCheck(this, C);
};
function m1() {
    return 1;
}
!function(M1) {
    M1.x = 1;
    var C1 = function() {
        "use strict";
        _classCallCheck(this, C1);
    };
    M1.C = C1;
}(M || (M = {})), (m1 || (m1 = {})).y = 2;
var c1 = function(x) {
    "use strict";
    _classCallCheck(this, c1);
};
(c1 || (c1 = {})).x = 1, (function(e1) {
    e1[e1.A = 0] = "A";
})(e1 || (e1 = {})), (e1 || (e1 = {})).y = 1;
