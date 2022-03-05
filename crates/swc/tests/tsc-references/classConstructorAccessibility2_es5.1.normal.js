import * as swcHelpers from "@swc/helpers";
var BaseA = // @declaration: true
/*#__PURE__*/ function() {
    "use strict";
    function BaseA(x) {
        swcHelpers.classCallCheck(this, BaseA);
        this.x = x;
    }
    swcHelpers.createClass(BaseA, [
        {
            key: "createInstance",
            value: function createInstance() {
                new BaseA(1);
            }
        }
    ]);
    return BaseA;
}();
var BaseB = /*#__PURE__*/ function() {
    "use strict";
    function BaseB(x) {
        swcHelpers.classCallCheck(this, BaseB);
        this.x = x;
    }
    swcHelpers.createClass(BaseB, [
        {
            key: "createInstance",
            value: function createInstance() {
                new BaseB(2);
            }
        }
    ]);
    return BaseB;
}();
var BaseC = /*#__PURE__*/ function() {
    "use strict";
    function BaseC(x) {
        swcHelpers.classCallCheck(this, BaseC);
        this.x = x;
    }
    swcHelpers.createClass(BaseC, [
        {
            key: "createInstance",
            value: function createInstance() {
                new BaseC(3);
            }
        }
    ], [
        {
            key: "staticInstance",
            value: function staticInstance() {
                new BaseC(4);
            }
        }
    ]);
    return BaseC;
}();
var DerivedA = /*#__PURE__*/ function(BaseA1) {
    "use strict";
    swcHelpers.inherits(DerivedA, BaseA1);
    var _super = swcHelpers.createSuper(DerivedA);
    function DerivedA(x) {
        swcHelpers.classCallCheck(this, DerivedA);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        return _this;
    }
    swcHelpers.createClass(DerivedA, [
        {
            key: "createInstance",
            value: function createInstance() {
                new DerivedA(5);
            }
        },
        {
            key: "createBaseInstance",
            value: function createBaseInstance() {
                new BaseA(6);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function staticBaseInstance() {
                new BaseA(7);
            }
        }
    ]);
    return DerivedA;
}(BaseA);
var DerivedB = /*#__PURE__*/ function(BaseB1) {
    "use strict";
    swcHelpers.inherits(DerivedB, BaseB1);
    var _super = swcHelpers.createSuper(DerivedB);
    function DerivedB(x) {
        swcHelpers.classCallCheck(this, DerivedB);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        return _this;
    }
    swcHelpers.createClass(DerivedB, [
        {
            key: "createInstance",
            value: function createInstance() {
                new DerivedB(7);
            }
        },
        {
            key: "createBaseInstance",
            value: function createBaseInstance() {
                new BaseB(8);
            } // ok
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function staticBaseInstance() {
                new BaseB(9);
            } // ok
        }
    ]);
    return DerivedB;
}(BaseB);
var DerivedC = /*#__PURE__*/ function(BaseC1) {
    "use strict";
    swcHelpers.inherits(DerivedC, BaseC1);
    var _super = swcHelpers.createSuper(DerivedC);
    function DerivedC(x) {
        swcHelpers.classCallCheck(this, DerivedC);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        return _this;
    }
    swcHelpers.createClass(DerivedC, [
        {
            key: "createInstance",
            value: function createInstance() {
                new DerivedC(9);
            }
        },
        {
            key: "createBaseInstance",
            value: function createBaseInstance() {
                new BaseC(10);
            } // error
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function staticBaseInstance() {
                new BaseC(11);
            } // error
        }
    ]);
    return DerivedC;
}(BaseC);
var ba = new BaseA(1);
var bb = new BaseB(1); // error
var bc = new BaseC(1); // error
var da = new DerivedA(1);
var db = new DerivedB(1);
var dc = new DerivedC(1);
