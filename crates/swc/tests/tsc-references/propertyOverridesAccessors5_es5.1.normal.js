import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target: esnext
// @useDefineForClassFields: true
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    _create_class(A, [
        {
            key: "p",
            get: function get() {
                return "oh no";
            }
        }
    ]);
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B(p) {
        _class_call_check(this, B);
        var _this;
        _this = _super.call(this);
        _this.p = p;
        return _this;
    }
    return B;
}(A);
