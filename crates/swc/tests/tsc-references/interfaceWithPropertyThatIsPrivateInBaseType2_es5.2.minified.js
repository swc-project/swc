import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.x = function() {}, Base;
}(), Base2 = function() {
    "use strict";
    function Base2() {
        _class_call_check(this, Base2);
    }
    return Base2.prototype.x = function() {}, Base2;
}();
