//// [typeOfThisInstanceMemberNarrowedWithLoopAntecedent.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function SomeClass() {
        _class_call_check(this, SomeClass);
    }
    return SomeClass.prototype.method = function() {
        this.state.data, "stringVariant" === this.state.type && this.state.data;
    }, SomeClass;
}();
