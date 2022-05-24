import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function(map) {
    "use strict";
    _class_call_check(this, A), this.map = map;
}, B = function(A1) {
    "use strict";
    _inherits(B, A1);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.call(this, function(value) {
            return String(value.toExponential());
        });
    }
    return B;
}(A);
