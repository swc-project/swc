import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
