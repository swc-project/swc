import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function() {
    "use strict";
    _class_call_check(this, A);
}, B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B.prototype.foo = function() {
        return 1;
    }, B;
}(A), C = function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(A), a = new B;
a.foo(), (a = new C).foo();
