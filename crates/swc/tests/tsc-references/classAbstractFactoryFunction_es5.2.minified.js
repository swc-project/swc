import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function() {
    "use strict";
    _class_call_check(this, A);
}, B = function(A1) {
    "use strict";
    _inherits(B, A1);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B;
}(A);
function NewA(Factory) {
    return new A;
}
function NewB(Factory) {
    return new B;
}
NewA(A), NewA(B), NewB(A), NewB(B);
