import * as swcHelpers from "@swc/helpers";
var x, y, d2, Base = function() {
    "use strict";
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
    "use strict";
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
}(Base), d = new Derived(y);
d.a, d.b(y), d.c, d.d, d.c = y, Derived.r, Derived.s(y), Derived.t, Derived.u, Derived.t = y;
var Base2 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base2);
}, Derived2 = function(Base21) {
    "use strict";
    swcHelpers.inherits(Derived2, Base21);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base2);
d2[''], d2[1];
