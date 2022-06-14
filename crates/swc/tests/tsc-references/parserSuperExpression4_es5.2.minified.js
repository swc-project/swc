import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _set from "@swc/helpers/src/_set.mjs";
var M1, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {
        _set(_get_prototype_of(C.prototype), "foo", 1, this, !0);
    }, C;
}();
!function(M11) {
    var C;
    M11.M2 || (M11.M2 = {}), C = function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        return C.prototype.foo = function() {
            _set(_get_prototype_of(C.prototype), "foo", 1, this, !0);
        }, C;
    }();
}(M1 || (M1 = {}));
