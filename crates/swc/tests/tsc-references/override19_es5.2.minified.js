import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Context = function() {
    "use strict";
    _class_call_check(this, Context);
}, A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.doSomething = function() {}, A;
}(), B = function(_superClass) {
    "use strict";
    _inherits(B, _superClass);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B.prototype.foo = function() {}, B;
}(CreateMixin(Context, A)), C = function(_superClass) {
    "use strict";
    _inherits(C, _superClass);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C.prototype.doSomethang = function() {}, C;
}(CreateMixin(Context, A));
