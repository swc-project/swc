import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function(map) {
    "use strict";
    _class_call_check(this, A), this.map = map;
}, C = function(A1) {
    "use strict";
    _inherits(C, A1);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.call(this, function(value) {
            return String(value());
        });
    }
    return C;
}(A);
