import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target: esnext, es2022, es6, es5
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.f = 1;
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
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
