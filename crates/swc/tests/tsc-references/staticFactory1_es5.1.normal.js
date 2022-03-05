import * as swcHelpers from "@swc/helpers";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    swcHelpers.createClass(Base, [
        {
            key: "foo",
            value: function foo() {
                return 1;
            }
        }
    ], [
        {
            key: "create",
            value: function create() {
                return new this();
            }
        }
    ]);
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
    swcHelpers.createClass(Derived, [
        {
            key: "foo",
            value: function foo() {
                return 2;
            }
        }
    ]);
    return Derived;
}(Base);
var d = Derived.create();
d.foo();
