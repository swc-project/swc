import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.f = 1;
C.arrowFunctionBoundary = function() {
    return C.f + 1;
};
C.functionExprBoundary = function() {
    return this.f + 2;
};
C.classExprBoundary = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
    this.a = this.f + 3;
};
C.functionAndClassDeclBoundary = (function() {
    var foo = function foo() {
        return this.f + 4;
    };
    var CC = /*#__PURE__*/ function() {
        "use strict";
        function CC() {
            swcHelpers.classCallCheck(this, CC);
            this.a = this.f + 5;
        }
        var _proto = CC.prototype;
        _proto.method = function method() {
            return this.f + 6;
        };
        return CC;
    }();
})();
