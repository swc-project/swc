import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target: esnext, es2022, es6, es5
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.a = 1;
C.b = C.a + 1;
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
D.c = 2;
D.d = D.c + 1;
D.e = 1 + _get(_get_prototype_of(D), "a", D) + (D.c + 1) + 1;
