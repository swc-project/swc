import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @target: esnext,es2015
// @noImplicitOverride: true
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        var _this;
        _this = _super.apply(this, arguments);
        _this.foo = "string";
        return _this;
    }
    return B;
}(A);
