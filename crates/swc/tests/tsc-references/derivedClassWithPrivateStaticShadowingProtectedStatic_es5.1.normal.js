import * as swcHelpers from "@swc/helpers";
// @target: ES5
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    Base.fn = function fn() {
        return '';
    };
    swcHelpers.createClass(Base, null, [
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
// should be error
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    Derived.fn = function fn() {
        return '';
    };
    swcHelpers.createClass(Derived, null, [
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
