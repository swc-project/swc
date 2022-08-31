//// [typeGuardOfFromPropNameInUnionType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function InMemberOfClass() {
        _class_call_check(this, InMemberOfClass);
    }
    return InMemberOfClass.prototype.inThis = function() {
        "a" in this.prop ? this.prop.a : this.prop.b;
    }, InMemberOfClass;
}();
