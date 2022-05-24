import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var e, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x, y) {}, C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D.prototype.foo = function(x) {}, D;
}(C), E = function(D) {
    "use strict";
    _inherits(E, D);
    var _super = _create_super(E);
    function E() {
        return _class_call_check(this, E), _super.apply(this, arguments);
    }
    return E.prototype.foo = function(x, y) {}, E;
}(D);
e.foo("", ""), e.foo("", 1);
