function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
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
}, function() {
}); // the constraints are self-referencing, no downstream error
function other() {
    var r5 = foo(c, d); // error
}
