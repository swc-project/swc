import * as swcHelpers from "@swc/helpers";
var C = function() {
    swcHelpers.classCallCheck(this, C);
};
C.f = 1;
var D = function(C1) {
    swcHelpers.inherits(D, C1);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
D.arrowFunctionBoundary = function() {
    return swcHelpers.get(swcHelpers.getPrototypeOf(D), "f", D) + 1;
}, D.functionExprBoundary = function() {
    return swcHelpers.get(swcHelpers.getPrototypeOf(D), "f", this) + 2;
}, D.classExprBoundary = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class), this.a = swcHelpers.get(swcHelpers.getPrototypeOf(_class.prototype), "f", this) + 3;
}, D.functionAndClassDeclBoundary = function() {
    var C2 = function() {
        function C2() {
            swcHelpers.classCallCheck(this, C2), this.a = swcHelpers.get(swcHelpers.getPrototypeOf(C2.prototype), "f", this) + 5;
        }
        return C2.prototype.method = function() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(C2.prototype), "f", this) + 6;
        }, C2;
    }();
}();
