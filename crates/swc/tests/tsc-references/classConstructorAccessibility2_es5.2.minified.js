import * as swcHelpers from "@swc/helpers";
var BaseA = function() {
    "use strict";
    function BaseA(x) {
        swcHelpers.classCallCheck(this, BaseA), this.x = x;
    }
    return swcHelpers.createClass(BaseA, [
        {
            key: "createInstance",
            value: function() {
                new BaseA(1);
            }
        }
    ]), BaseA;
}(), BaseB = function() {
    "use strict";
    function BaseB(x) {
        swcHelpers.classCallCheck(this, BaseB), this.x = x;
    }
    return swcHelpers.createClass(BaseB, [
        {
            key: "createInstance",
            value: function() {
                new BaseB(2);
            }
        }
    ]), BaseB;
}(), BaseC = function() {
    "use strict";
    function BaseC(x) {
        swcHelpers.classCallCheck(this, BaseC), this.x = x;
    }
    return swcHelpers.createClass(BaseC, [
        {
            key: "createInstance",
            value: function() {
                new BaseC(3);
            }
        }
    ], [
        {
            key: "staticInstance",
            value: function() {
                new BaseC(4);
            }
        }
    ]), BaseC;
}(), DerivedA = function(BaseA1) {
    "use strict";
    swcHelpers.inherits(DerivedA, BaseA1);
    var _super = swcHelpers.createSuper(DerivedA);
    function DerivedA(x) {
        var _this;
        return swcHelpers.classCallCheck(this, DerivedA), (_this = _super.call(this, x)).x = x, _this;
    }
    return swcHelpers.createClass(DerivedA, [
        {
            key: "createInstance",
            value: function() {
                new DerivedA(5);
            }
        },
        {
            key: "createBaseInstance",
            value: function() {
                new BaseA(6);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function() {
                new BaseA(7);
            }
        }
    ]), DerivedA;
}(BaseA), DerivedB = function(BaseB1) {
    "use strict";
    swcHelpers.inherits(DerivedB, BaseB1);
    var _super = swcHelpers.createSuper(DerivedB);
    function DerivedB(x) {
        var _this;
        return swcHelpers.classCallCheck(this, DerivedB), (_this = _super.call(this, x)).x = x, _this;
    }
    return swcHelpers.createClass(DerivedB, [
        {
            key: "createInstance",
            value: function() {
                new DerivedB(7);
            }
        },
        {
            key: "createBaseInstance",
            value: function() {
                new BaseB(8);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function() {
                new BaseB(9);
            }
        }
    ]), DerivedB;
}(BaseB), DerivedC = function(BaseC1) {
    "use strict";
    swcHelpers.inherits(DerivedC, BaseC1);
    var _super = swcHelpers.createSuper(DerivedC);
    function DerivedC(x) {
        var _this;
        return swcHelpers.classCallCheck(this, DerivedC), (_this = _super.call(this, x)).x = x, _this;
    }
    return swcHelpers.createClass(DerivedC, [
        {
            key: "createInstance",
            value: function() {
                new DerivedC(9);
            }
        },
        {
            key: "createBaseInstance",
            value: function() {
                new BaseC(10);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function() {
                new BaseC(11);
            }
        }
    ]), DerivedC;
}(BaseC);
new BaseA(1), new BaseB(1), new BaseC(1), new DerivedA(1), new DerivedB(1), new DerivedC(1);
