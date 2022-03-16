import * as swcHelpers from "@swc/helpers";
var B = function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return B.prototype.baz = function(a) {
        arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    }, B;
}(), C = function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {}, _proto.baz = function(a, y) {
        swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "baz", this).call(this, a, y);
    }, C;
}(B), D = function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.call(this);
    }
    var _proto = D.prototype;
    return _proto.foo = function() {
        swcHelpers.get(swcHelpers.getPrototypeOf(D.prototype), "foo", this).call(this);
    }, _proto.baz = function() {
        swcHelpers.get(swcHelpers.getPrototypeOf(D.prototype), "baz", this).call(this, "hello", 10);
    }, D;
}(C);
