import * as swcHelpers from "@swc/helpers";
var Base = // @target: ES5
/*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    swcHelpers.createClass(Base, [
        {
            key: "fn",
            value: function fn() {
                return '';
            }
        },
        {
            key: "a",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return Base;
}();
var Derived = // error, not a subtype
/*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Derived, [
        {
            key: "fn",
            value: function fn() {
                return '';
            }
        },
        {
            key: "a",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return Derived;
}(Base);
