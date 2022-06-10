import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var _superprop_get_b = ()=>super.b, _superprop_get_a = ()=>super.a;
// @target: esnext, es2022, es2015, es5
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
B.a = 1;
B.b = 2;
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C.b = 3;
C.c = _get(_get_prototype_of(C), "a", C);
var __ = {
    writable: true,
    value: function() {
        C.b;
        _superprop_get_b();
        _superprop_get_a();
    }()
};
