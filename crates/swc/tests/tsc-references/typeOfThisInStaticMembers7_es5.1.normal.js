import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
