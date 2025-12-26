//// [typeOfThisInStaticMembers9.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.f = 1;
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    return D;
}(C);
D.arrowFunctionBoundary = function() {
    return _get(_get_prototype_of(D), "f", D) + 1;
};
D.functionExprBoundary = function() {
    return _get(_get_prototype_of(D), "f", this) + 2;
};
D.classExprBoundary = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.a = _get(_get_prototype_of(_class.prototype), "f", this) + 3;
};
D.functionAndClassDeclBoundary = function() {
    var foo = function foo() {
        return _get(_get_prototype_of(D), "f", this) + 4;
    };
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
            this.a = _get(_get_prototype_of(C.prototype), "f", this) + 5;
        }
        var _proto = C.prototype;
        _proto.method = function method() {
            return _get(_get_prototype_of(C.prototype), "f", this) + 6;
        };
        return C;
    }();
}();
