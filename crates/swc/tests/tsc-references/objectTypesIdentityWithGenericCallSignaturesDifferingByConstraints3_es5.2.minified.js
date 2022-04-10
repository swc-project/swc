import * as swcHelpers from "@swc/helpers";
var One = function() {
    swcHelpers.classCallCheck(this, One);
}, Two = function() {
    swcHelpers.classCallCheck(this, Two);
}, A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.foo = function(x, y) {
        return null;
    }, A;
}(), B = function() {
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return B.prototype.foo = function(x, y) {
        return null;
    }, B;
}(), C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function(x, y) {
        return null;
    }, C;
}(), D = function() {
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    return D.prototype.foo = function(x, y) {
        return null;
    }, D;
}();
