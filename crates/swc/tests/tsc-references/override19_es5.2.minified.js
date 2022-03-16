import * as swcHelpers from "@swc/helpers";
var Context = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Context);
}, A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.doSomething = function() {}, A;
}(), B = function(_superClass) {
    "use strict";
    swcHelpers.inherits(B, _superClass);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B.prototype.foo = function() {}, B;
}(CreateMixin(Context, A)), C = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C, _superClass);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C.prototype.doSomethang = function() {}, C;
}(CreateMixin(Context, A));
