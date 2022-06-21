import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
