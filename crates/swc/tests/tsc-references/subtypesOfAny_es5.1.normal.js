function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
var A2 = function A2() {
    "use strict";
    _classCallCheck(this, A2);
};
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
function f() {}
(function(f1) {
    var bar = f1.bar = 1;
})(f || (f = {}));
var c = function c() {
    "use strict";
    _classCallCheck(this, c);
};
(function(c) {
    var bar = c.bar = 1;
})(c || (c = {}));
