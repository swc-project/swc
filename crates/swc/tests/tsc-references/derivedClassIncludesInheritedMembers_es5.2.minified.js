import * as swcHelpers from "@swc/helpers";
var d2, Base = function() {
    function Base(x) {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.b = function() {}, Base.s = function() {}, swcHelpers.createClass(Base, [
        {
            key: "c",
            get: function() {
                return "";
            },
            set: function(v) {}
        }
    ], [
        {
            key: "t",
            get: function() {
                return "";
            },
            set: function(v) {}
        }
    ]), Base;
}(), Derived = function(Base) {
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), d = new Derived(1);
d.a, d.b(), d.c, d.c = "", Derived.r, Derived.s(), Derived.t, Derived.t = "";
var Base2 = function() {
    swcHelpers.classCallCheck(this, Base2);
}, Derived2 = function(Base21) {
    swcHelpers.inherits(Derived2, Base21);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base2);
d2[""], d2[1];
