import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.f = function() {
        return "hello";
    }, A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B.prototype.g = function() {
        var a, b, c;
        this.x, this.f(), this.y, this.z, swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "x", this), swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "f", this).call(this), swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "y", this), swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "z", this), a.x, a.f(), a.y, a.z, b.x, b.f(), b.y, b.z, c.x, c.f(), c.y, c.z;
    }, B;
}(A), C = function(A) {
    "use strict";
    swcHelpers.inherits(C, A);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C;
}(A);
