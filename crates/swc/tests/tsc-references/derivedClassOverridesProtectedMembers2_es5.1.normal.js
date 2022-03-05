import * as swcHelpers from "@swc/helpers";
// @target: ES5
var x;
var y;
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base(a) {
        swcHelpers.classCallCheck(this, Base);
    }
    swcHelpers.createClass(Base, [
        {
            key: "b",
            value: function b(a) {}
        },
        {
            key: "c",
            get: function get() {
                return x;
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "s",
            value: function s(a) {}
        },
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
var Derived = // Increase visibility of all protected members to public
/*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(a) {
        swcHelpers.classCallCheck(this, Derived);
        return _super.call(this, a);
    }
    swcHelpers.createClass(Derived, [
        {
            key: "b",
            value: function b(a) {}
        },
        {
            key: "c",
            get: function get() {
                return y;
            },
            set: function set(v) {}
        }
    ], [
        {
            key: "s",
            value: function s(a) {}
        },
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
var d = new Derived(y);
var r1 = d.a;
var r2 = d.b(y);
var r3 = d.c;
var r3a = d.d;
d.c = y;
var r4 = Derived.r;
var r5 = Derived.s(y);
var r6 = Derived.t;
var r6a = Derived.u;
Derived.t = y;
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
