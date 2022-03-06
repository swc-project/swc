import * as swcHelpers from "@swc/helpers";
var Base = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    swcHelpers.createClass(Base, [
        {
            key: "bar",
            value: function bar() {
                return 0;
            }
        }
    ]);
    return Base;
}();
var tmp = super.bar();
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(C, Base);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C, [
        {
            // Gets emitted as super, not _super, which is consistent with
            // use of super in static properties initializers.
            key: tmp,
            value: function value() {}
        }
    ]);
    return C;
}(Base);
