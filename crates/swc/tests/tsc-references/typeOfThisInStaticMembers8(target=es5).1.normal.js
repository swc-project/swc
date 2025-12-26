//// [typeOfThisInStaticMembers8.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap(), __5 = new WeakMap();
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
__.set(C, {
    writable: true,
    value: C.f = 1
});
__2.set(C, {
    writable: true,
    value: C.arrowFunctionBoundary = function() {
        return C.f + 1;
    }
});
__3.set(C, {
    writable: true,
    value: C.functionExprBoundary = function() {
        return this.f + 2;
    }
});
__4.set(C, {
    writable: true,
    value: C.classExprBoundary = function _class() {
        "use strict";
        _class_call_check(this, _class);
        this.a = this.f + 3;
    }
});
__5.set(C, {
    writable: true,
    value: C.functionAndClassDeclBoundary = function() {
        var foo = function foo() {
            return this.f + 4;
        };
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
    }()
});
