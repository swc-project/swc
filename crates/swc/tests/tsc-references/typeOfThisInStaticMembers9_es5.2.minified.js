import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.f = 1;
var D = function(C) {
    "use strict";
    _inherits(D, C);
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
}, D.functionAndClassDeclBoundary = void 0;
