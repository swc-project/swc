//// [typeOfThisInStaticMembers8.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function() {
    C.f = 1;
})();
(function() {
    C.arrowFunctionBoundary = function() {
        return C.f + 1;
    };
})();
(function() {
    C.functionExprBoundary = function() {
        return this.f + 2;
    };
})();
(function() {
    C.classExprBoundary = function _class() {
        "use strict";
        _class_call_check(this, _class);
        this.a = this.f + 3;
    };
})();
(function() {
    C.functionAndClassDeclBoundary = function() {
        function foo() {
            return this.f + 4;
        }
        var CC = /*#__PURE__*/ function() {
            "use strict";
            function CC() {
                _class_call_check(this, CC);
                this.a = this.f + 5;
            }
            var _proto = CC.prototype;
            _proto.method = function method() {
                return this.f + 6;
            };
            return CC;
        }();
    }();
})();
