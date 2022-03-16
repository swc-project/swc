import * as swcHelpers from "@swc/helpers";
// @target: ES5
var x;
var y;
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base(a) {
        swcHelpers.classCallCheck(this, Base);
    }
    var _proto = Base.prototype;
    _proto.b = function b(a) {};
    Base.s = function s(a) {};
    swcHelpers.createClass(Base, [
        {
            key: "c",
            get: function get() {
                return x;
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "t",
            get: function get() {
                return x;
            },
            set: function set(v) {}
        }
    ]);
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(a) {
        swcHelpers.classCallCheck(this, Derived);
        return _super.call(this, x);
    }
    var _proto = Derived.prototype;
    _proto.b = function b(a) {};
    Derived.s = function s(a) {};
    swcHelpers.createClass(Derived, [
        {
            key: "c",
            get: function get() {
                return y;
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "t",
            get: function get() {
                return y;
            },
            set: function set(a) {}
        }
    ]);
    return Derived;
}(Base);
