import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var C = function() {
    "use strict";
    _class_call_check(this, C);
};
C.f = 1;
var D = function(C1) {
    "use strict";
    _inherits(D, C1);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
D.arrowFunctionBoundary = function() {
    return _get(_get_prototype_of(D), "f", D) + 1;
}, D.functionExprBoundary = function() {
    return _get(_get_prototype_of(D), "f", this) + 2;
}, D.classExprBoundary = function _class() {
    "use strict";
    _class_call_check(this, _class), this.a = _get(_get_prototype_of(_class.prototype), "f", this) + 3;
}, D.functionAndClassDeclBoundary = function() {
    var C2 = function() {
        "use strict";
        function C2() {
            _class_call_check(this, C2), this.a = _get(_get_prototype_of(C2.prototype), "f", this) + 5;
        }
        return C2.prototype.method = function() {
            return _get(_get_prototype_of(C2.prototype), "f", this) + 6;
        }, C2;
    }();
}();
