import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.foo = function() {
        return 1;
    }, A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    return _proto.bar = function() {
        swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "foo", this).call(this);
    }, _proto.baz = function() {
        return this.foo;
    }, B;
}(A), C = function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        return 2;
    }, _proto.qux = function() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "foo", this).call(this) || swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "foo", this);
    }, _proto.norf = function() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "bar", this).call(this);
    }, C;
}(B), AA = function() {
    "use strict";
    function AA() {
        swcHelpers.classCallCheck(this, AA);
    }
    var _proto = AA.prototype;
    return _proto.foo = function() {
        return 1;
    }, _proto.bar = function() {
        return this.foo();
    }, AA;
}(), BB = function(AA) {
    "use strict";
    swcHelpers.inherits(BB, AA);
    var _super = swcHelpers.createSuper(BB);
    function BB() {
        return swcHelpers.classCallCheck(this, BB), _super.apply(this, arguments);
    }
    return BB;
}(AA);
