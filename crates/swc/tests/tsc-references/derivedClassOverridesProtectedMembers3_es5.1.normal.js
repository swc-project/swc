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
var Derived1 = // Errors
// decrease visibility of all public members to protected
/*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived1, Base);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1(a) {
        swcHelpers.classCallCheck(this, Derived1);
        return _super.call(this, a);
    }
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived2, Base);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2(a) {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.call(this, a);
    }
    swcHelpers.createClass(Derived2, [
        {
            key: "b",
            value: function b(a) {}
        }
    ]);
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived3, Base);
    var _super = swcHelpers.createSuper(Derived3);
    function Derived3(a) {
        swcHelpers.classCallCheck(this, Derived3);
        return _super.call(this, a);
    }
    swcHelpers.createClass(Derived3, [
        {
            key: "c",
            get: function get() {
                return x;
            }
        }
    ]);
    return Derived3;
}(Base);
var Derived4 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived4, Base);
    var _super = swcHelpers.createSuper(Derived4);
    function Derived4(a) {
        swcHelpers.classCallCheck(this, Derived4);
        return _super.call(this, a);
    }
    swcHelpers.createClass(Derived4, [
        {
            key: "c",
            set: function set(v) {}
        }
    ]);
    return Derived4;
}(Base);
var Derived5 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived5, Base);
    var _super = swcHelpers.createSuper(Derived5);
    function Derived5(a) {
        swcHelpers.classCallCheck(this, Derived5);
        return _super.call(this, a);
    }
    return Derived5;
}(Base);
var Derived6 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived6, Base);
    var _super = swcHelpers.createSuper(Derived6);
    function Derived6(a) {
        swcHelpers.classCallCheck(this, Derived6);
        return _super.call(this, a);
    }
    return Derived6;
}(Base);
var Derived7 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived7, Base);
    var _super = swcHelpers.createSuper(Derived7);
    function Derived7(a) {
        swcHelpers.classCallCheck(this, Derived7);
        return _super.call(this, a);
    }
    swcHelpers.createClass(Derived7, null, [
        {
            key: "s",
            value: function s(a) {}
        }
    ]);
    return Derived7;
}(Base);
var Derived8 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived8, Base);
    var _super = swcHelpers.createSuper(Derived8);
    function Derived8(a) {
        swcHelpers.classCallCheck(this, Derived8);
        return _super.call(this, a);
    }
    swcHelpers.createClass(Derived8, null, [
        {
            key: "t",
            get: function get() {
                return x;
            }
        }
    ]);
    return Derived8;
}(Base);
var Derived9 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived9, Base);
    var _super = swcHelpers.createSuper(Derived9);
    function Derived9(a) {
        swcHelpers.classCallCheck(this, Derived9);
        return _super.call(this, a);
    }
    swcHelpers.createClass(Derived9, null, [
        {
            key: "t",
            set: function set(v) {}
        }
    ]);
    return Derived9;
}(Base);
var Derived10 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived10, Base);
    var _super = swcHelpers.createSuper(Derived10);
    function Derived10(a) {
        swcHelpers.classCallCheck(this, Derived10);
        return _super.call(this, a);
    }
    return Derived10;
}(Base);
