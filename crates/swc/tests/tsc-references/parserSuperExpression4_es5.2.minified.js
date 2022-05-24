import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _set from "@swc/helpers/lib/_set.js";
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
