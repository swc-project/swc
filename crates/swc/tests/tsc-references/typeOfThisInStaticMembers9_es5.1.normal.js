import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.f = 1;
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
D.arrowFunctionBoundary = function() {
    return swcHelpers.get(swcHelpers.getPrototypeOf(D), "f", D) + 1;
};
D.functionExprBoundary = function() {
    return swcHelpers.get(swcHelpers.getPrototypeOf(D), "f", this) + 2;
};
D.classExprBoundary = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
    this.a = swcHelpers.get(swcHelpers.getPrototypeOf(_class.prototype), "f", this) + 3;
};
D.functionAndClassDeclBoundary = (function() {
    var foo = function foo() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(D), "f", this) + 4;
    };
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            swcHelpers.classCallCheck(this, C);
            this.a = swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "f", this) + 5;
        }
        var _proto = C.prototype;
        _proto.method = function method() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "f", this) + 6;
        };
        return C;
    }();
})();
