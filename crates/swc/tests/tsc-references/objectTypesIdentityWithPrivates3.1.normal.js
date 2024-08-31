//// [objectTypesIdentityWithPrivates3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
var C2 = /*#__PURE__*/ function(C1) {
    "use strict";
    _inherits(C2, C1);
    function C2() {
        _class_call_check(this, C2);
        return _call_super(this, C2, arguments);
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
    function C4() {
        _class_call_check(this, C4);
        return _call_super(this, C4, arguments);
    }
    return C4;
}(C3);
var c3;
c3; // Should fail (private x originates in the same declaration, but different types)
