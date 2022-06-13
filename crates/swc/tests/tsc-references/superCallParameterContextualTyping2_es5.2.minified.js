import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
