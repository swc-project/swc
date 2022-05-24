import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
var C2 = /*#__PURE__*/ function(C1) {
    "use strict";
    _inherits(C2, C1);
    var _super = _create_super(C2);
    function C2() {
        _class_call_check(this, C2);
        return _super.apply(this, arguments);
    }
    return C2;
}(C1);
var c1;
c1; // Should succeed (private x originates in the same declaration)
var C3 = function C3() {
    "use strict";
    _class_call_check(this, C3);
};
var C4 = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(C4, C3);
    var _super = _create_super(C4);
    function C4() {
        _class_call_check(this, C4);
        return _super.apply(this, arguments);
    }
    return C4;
}(C3);
var c3;
c3; // Should fail (private x originates in the same declaration, but different types)
