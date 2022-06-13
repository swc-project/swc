import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
// more args
testError(function(t1, t2, t3) {});
testError(function(t1, t2, t3) {});
testError(function(t1, t2, t3) {});
