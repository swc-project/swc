import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.bar = function() {
        return 0;
    }, Base;
}(), C = function(Base) {
    "use strict";
    swcHelpers.inherits(C, Base);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C.prototype.foo = function() {
        return swcHelpers.defineProperty({}, swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "bar", this).call(this), function() {}), 0;
    }, C;
}(Base);
