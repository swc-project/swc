import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
var M1, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {
        _get(_get_prototype_of(C.prototype), "foo", this).call(this);
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
            _get(_get_prototype_of(C.prototype), "foo", this).call(this);
        }, C;
    }();
}(M1 || (M1 = {}));
