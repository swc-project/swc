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
var a;
function foo4(cb) {
    var u;
    return u;
}
var r = foo4(a); // T is {} (candidates boolean and string), U is {} (candidates C and D)
var b;
var r2 = foo4(b); // T is {} (candidates boolean and {}), U is any (candidates any and {})
