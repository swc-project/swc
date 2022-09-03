//// [objectTypeHidingMembersOfObjectAssignmentCompat2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
i = o = i;
var i, o, c, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.toString = function() {
        return 1;
    }, C;
}();
c = o = c;
var a = {
    toString: function() {}
};
a = o = a;
