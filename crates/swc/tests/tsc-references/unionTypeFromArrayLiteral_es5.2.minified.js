import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {}, C;
}(), D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    return D.prototype.foo2 = function() {}, D;
}(), E = function(C) {
    "use strict";
    _inherits(E, C);
    var _super = _create_super(E);
    function E() {
        return _class_call_check(this, E), _super.apply(this, arguments);
    }
    return E.prototype.foo3 = function() {}, E;
}(C), F = function(C) {
    "use strict";
    _inherits(F, C);
    var _super = _create_super(F);
    function F() {
        return _class_call_check(this, F), _super.apply(this, arguments);
    }
    return F.prototype.foo4 = function() {}, F;
}(C);
