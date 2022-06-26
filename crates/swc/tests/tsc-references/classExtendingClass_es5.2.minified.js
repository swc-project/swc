import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var d, d2, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.thing = function() {}, C.other = function() {}, C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
d.foo, d.bar, d.thing(), D.other();
var C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.thing = function(x) {}, C2.other = function(x) {}, C2;
}(), D2 = function(C2) {
    "use strict";
    _inherits(D2, C2);
    var _super = _create_super(D2);
    function D2() {
        return _class_call_check(this, D2), _super.apply(this, arguments);
    }
    return D2;
}(C2);
d2.foo, d2.bar, d2.thing(""), D2.other(1);
