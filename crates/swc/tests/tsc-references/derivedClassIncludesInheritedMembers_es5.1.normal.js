import * as swcHelpers from "@swc/helpers";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base(x) {
        swcHelpers.classCallCheck(this, Base);
    }
    var _proto = Base.prototype;
    _proto.b = function b() {};
    Base.s = function s() {};
    swcHelpers.createClass(Base, [
        {
            key: "c",
            get: function get() {
                return '';
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "t",
            get: function get() {
                return '';
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
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var d = new Derived(1);
var r1 = d.a;
var r2 = d.b();
var r3 = d.c;
d.c = '';
var r4 = Derived.r;
var r5 = Derived.s();
var r6 = Derived.t;
Derived.t = '';
var Base2 = function Base2() {
    "use strict";
    swcHelpers.classCallCheck(this, Base2);
};
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base2);
var d2;
var r7 = d2[''];
var r8 = d2[1];
