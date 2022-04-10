import * as swcHelpers from "@swc/helpers";
var x, y, Base = function() {
    function Base(a) {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.b = function(a) {}, Base.s = function(a) {}, swcHelpers.createClass(Base, [
        {
            key: "c",
            get: function() {
                return x;
            },
            set: function(v) {}
        }
    ], [
        {
            key: "t",
            get: function() {
                return x;
            },
            set: function(v) {}
        }
    ]), Base;
}(), Derived = function(Base) {
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(a) {
        return swcHelpers.classCallCheck(this, Derived), _super.call(this, x);
    }
    return Derived.prototype.b = function(a) {}, Derived.s = function(a) {}, swcHelpers.createClass(Derived, [
        {
            key: "c",
            get: function() {
                return y;
            },
            set: function(v) {}
        }
    ], [
        {
            key: "t",
            get: function() {
                return y;
            },
            set: function(a) {}
        }
    ]), Derived;
}(Base);
