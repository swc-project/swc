import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var One = function() {
    "use strict";
    _class_call_check(this, One);
}, Two = function() {
    "use strict";
    _class_call_check(this, Two);
}, A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function(x, y) {
        return null;
    }, A;
}(), B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.foo = function(x, y) {
        return null;
    }, B;
}(), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x, y) {
        return null;
    }, C;
}(), D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    return D.prototype.foo = function(x, y) {
        return null;
    }, D;
}();
