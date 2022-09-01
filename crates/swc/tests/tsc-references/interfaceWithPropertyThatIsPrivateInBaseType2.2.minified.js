//// [interfaceWithPropertyThatIsPrivateInBaseType2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.x = function() {}, Base;
}();
