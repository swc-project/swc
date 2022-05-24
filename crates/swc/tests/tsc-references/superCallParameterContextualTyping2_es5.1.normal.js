import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function A(map) {
    "use strict";
    _class_call_check(this, A);
    this.map = map;
};
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.call(this, function(value) {
            return String(value());
        });
    }
    return C;
}(A);
