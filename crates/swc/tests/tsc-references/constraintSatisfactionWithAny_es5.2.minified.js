function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function foo(x) {
    return null;
}
function foo2(x) {
    return null;
}
function foo4(x) {
    return null;
}
foo(a), foo2(a), foo4(a), foo(b), foo2(b), foo4(b);
var a, b, C = function(x) {
    "use strict";
    _classCallCheck(this, C), this.x = x;
};
new C(a), new C(b);
var C2 = function(x) {
    "use strict";
    _classCallCheck(this, C2), this.x = x;
};
new C2(a), new C2(b);
var C4 = function(x) {
    "use strict";
    _classCallCheck(this, C4), this.x = x;
};
new C4(a), new C4(b);
