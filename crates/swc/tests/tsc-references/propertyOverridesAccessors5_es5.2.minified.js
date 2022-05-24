import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return _create_class(A, [
        {
            key: "p",
            get: function() {
                return "oh no";
            }
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B(p) {
        var _this;
        return _class_call_check(this, B), (_this = _super.call(this)).p = p, _this;
    }
    return B;
}(A);
