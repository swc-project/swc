//// [readonlyConstructorAssignment.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B(x) {
        var _this;
        return _class_call_check(this, B), (_this = _super.call(this, x)).x = 1, _this;
    }
    return B;
}(function A(x) {
    "use strict";
    _class_call_check(this, A), this.x = x, this.x = 0;
});
