//// [thisTypeErrors.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f1(x) {
    return this;
}
var x1, x2, x3, N1, C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
}, C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.foo = function(x) {}, C2;
}();
C2.y = void 0, function(N1) {
    var x;
    N1.y = this, N1.x = x;
}(N1 || (N1 = {}));
var C3 = function() {
    "use strict";
    function C3() {
        _class_call_check(this, C3), this.x1 = {
            g: function(x) {}
        };
    }
    return C3.prototype.f = function() {}, C3;
}();
