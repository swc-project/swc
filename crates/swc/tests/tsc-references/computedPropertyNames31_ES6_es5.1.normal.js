import * as swcHelpers from "@swc/helpers";
var Base = // @target: es6
/*#__PURE__*/ function() {
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
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(C, Base);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        var _this = this;
        (function() {
            var obj = swcHelpers.defineProperty({}, swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "bar", _this).call(_this), function() {} // needs capture
            );
        });
        return 0;
    };
    return C;
}(Base);
