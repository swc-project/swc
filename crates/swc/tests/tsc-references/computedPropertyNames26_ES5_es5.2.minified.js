import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.bar = function() {
        return 0;
    }, Base;
}(), tmp = swcHelpers.defineProperty({}, super.bar(), 1)[0], C = function(Base) {
    "use strict";
    swcHelpers.inherits(C, Base);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C.prototype[tmp] = function() {}, C;
}(Base);
