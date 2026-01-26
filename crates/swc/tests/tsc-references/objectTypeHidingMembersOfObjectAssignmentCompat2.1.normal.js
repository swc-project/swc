//// [objectTypeHidingMembersOfObjectAssignmentCompat2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var i;
var o;
o = i; // error
i = o; // error
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.toString = function toString() {
        return 1;
    };
    return C;
}();
var c;
o = c; // error
c = o; // error
var a = {
    toString: function toString() {}
};
o = a; // error
a = o; // ok
