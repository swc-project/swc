import * as swcHelpers from "@swc/helpers";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    var _proto = Base.prototype;
    _proto.foo = function foo(x) {
        return null;
    };
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    var _proto = Derived.prototype;
    _proto.foo = function foo(x) {
        return null;
    };
    _proto.bar = function bar() {
        var r = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "foo", this).call(this, {
            a: 1
        }); // { a: number }
        var r2 = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "foo", this).call(this, {
            a: 1,
            b: 2
        }); // { a: number }
        var r3 = this.foo({
            a: 1,
            b: 2
        }); // { a: number; b: number; }
    };
    return Derived;
}(Base);
