import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Context = function Context() {
    "use strict";
    _class_call_check(this, Context);
};
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.doSomething = function doSomething() {};
    return A;
}();
var B = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(B, _superClass);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    _proto.foo // Remove override
     = function foo() {};
    return B;
}(CreateMixin(Context, A));
var C = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C, _superClass);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.doSomethang // Suggestion 'doSomething'
     = function doSomethang() {};
    return C;
}(CreateMixin(Context, A));
