//// [undefinedIsSubtypeOfEverything.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var E, Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
function f() {}
!function(Base) {
    "use strict";
    _inherits(D0, Base);
    var _super = _create_super(D0);
    function D0() {
        return _class_call_check(this, D0), _super.apply(this, arguments);
    }
    return D0;
}(Base), function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), (f || (f = {})).bar = 1;
var c = function c() {
    "use strict";
    _class_call_check(this, c);
};
(c || (c = {})).bar = 1;
