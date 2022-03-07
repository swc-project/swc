import * as swcHelpers from "@swc/helpers";
var x, Base = function() {
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
}(), Derived1 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived1, Base);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1(a) {
        return swcHelpers.classCallCheck(this, Derived1), _super.call(this, a);
    }
    return Derived1;
}(Base), Derived2 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived2, Base);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2(a) {
        return swcHelpers.classCallCheck(this, Derived2), _super.call(this, a);
    }
    return Derived2.prototype.b = function(a) {}, Derived2;
}(Base), Derived3 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived3, Base);
    var _super = swcHelpers.createSuper(Derived3);
    function Derived3(a) {
        return swcHelpers.classCallCheck(this, Derived3), _super.call(this, a);
    }
    return swcHelpers.createClass(Derived3, [
        {
            key: "c",
            get: function() {
                return x;
            }
        }
    ]), Derived3;
}(Base), Derived4 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived4, Base);
    var _super = swcHelpers.createSuper(Derived4);
    function Derived4(a) {
        return swcHelpers.classCallCheck(this, Derived4), _super.call(this, a);
    }
    return swcHelpers.createClass(Derived4, [
        {
            key: "c",
            set: function(v) {}
        }
    ]), Derived4;
}(Base), Derived5 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived5, Base);
    var _super = swcHelpers.createSuper(Derived5);
    function Derived5(a) {
        return swcHelpers.classCallCheck(this, Derived5), _super.call(this, a);
    }
    return Derived5;
}(Base), Derived6 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived6, Base);
    var _super = swcHelpers.createSuper(Derived6);
    function Derived6(a) {
        return swcHelpers.classCallCheck(this, Derived6), _super.call(this, a);
    }
    return Derived6;
}(Base), Derived7 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived7, Base);
    var _super = swcHelpers.createSuper(Derived7);
    function Derived7(a) {
        return swcHelpers.classCallCheck(this, Derived7), _super.call(this, a);
    }
    return Derived7.s = function(a) {}, Derived7;
}(Base), Derived8 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived8, Base);
    var _super = swcHelpers.createSuper(Derived8);
    function Derived8(a) {
        return swcHelpers.classCallCheck(this, Derived8), _super.call(this, a);
    }
    return swcHelpers.createClass(Derived8, null, [
        {
            key: "t",
            get: function() {
                return x;
            }
        }
    ]), Derived8;
}(Base), Derived9 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived9, Base);
    var _super = swcHelpers.createSuper(Derived9);
    function Derived9(a) {
        return swcHelpers.classCallCheck(this, Derived9), _super.call(this, a);
    }
    return swcHelpers.createClass(Derived9, null, [
        {
            key: "t",
            set: function(v) {}
        }
    ]), Derived9;
}(Base), Derived10 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived10, Base);
    var _super = swcHelpers.createSuper(Derived10);
    function Derived10(a) {
        return swcHelpers.classCallCheck(this, Derived10), _super.call(this, a);
    }
    return Derived10;
}(Base);
