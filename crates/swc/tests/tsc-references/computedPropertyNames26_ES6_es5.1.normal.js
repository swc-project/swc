import * as swcHelpers from "@swc/helpers";
// @target: es6
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    var _proto = Base.prototype;
    _proto.bar = function bar() {
        return 0;
    };
    return Base;
}();
var tmp = swcHelpers.defineProperty({}, super.bar(), 1)[0];
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(C, Base);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    // Gets emitted as super, not _super, which is consistent with
    // use of super in static properties initializers.
    _proto[tmp] = function() {};
    return C;
}(Base);
