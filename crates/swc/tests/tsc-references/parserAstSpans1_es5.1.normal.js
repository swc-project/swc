import * as swcHelpers from "@swc/helpers";
var c1 = /*#__PURE__*/ function() {
    "use strict";
    function c1() {
        swcHelpers.classCallCheck(this, c1);
    }
    swcHelpers.createClass(c1, [
        {
            key: "i1_f1",
            value: function i1_f1() {}
        },
        {
            key: "i1_nc_f1",
            value: function i1_nc_f1() {}
        },
        {
            key: "f1",
            value: /** c1_f1*/ function f1() {}
        },
        {
            key: "nc_f1",
            value: /** c1_nc_f1*/ function nc_f1() {}
        }
    ]);
    return c1;
}();
var i1_i;
i1_i.i1_f1();
i1_i.i1_nc_f1();
i1_i.f1();
i1_i.nc_f1();
i1_i.i1_l1();
i1_i.i1_nc_l1();
i1_i.l1();
i1_i.nc_l1();
var c1_i = new c1();
c1_i.i1_f1();
c1_i.i1_nc_f1();
c1_i.f1();
c1_i.nc_f1();
c1_i.i1_l1();
c1_i.i1_nc_l1();
c1_i.l1();
c1_i.nc_l1();
// assign to interface
i1_i = c1_i;
i1_i.i1_f1();
i1_i.i1_nc_f1();
i1_i.f1();
i1_i.nc_f1();
i1_i.i1_l1();
i1_i.i1_nc_l1();
i1_i.l1();
i1_i.nc_l1();
var c2 = /*#__PURE__*/ function() {
    "use strict";
    function c2(a) {
        swcHelpers.classCallCheck(this, c2);
        this.c2_p1 = a;
    }
    swcHelpers.createClass(c2, [
        {
            key: "c2_f1",
            value: /** c2 c2_f1*/ function c2_f1() {}
        },
        {
            key: "c2_prop",
            get: /** c2 c2_prop*/ function get() {
                return 10;
            }
        },
        {
            key: "c2_nc_f1",
            value: function c2_nc_f1() {}
        },
        {
            key: "c2_nc_prop",
            get: function get() {
                return 10;
            }
        },
        {
            key: "f1",
            value: /** c2 f1*/ function f1() {}
        },
        {
            key: "prop",
            get: /** c2 prop*/ function get() {
                return 10;
            }
        },
        {
            key: "nc_f1",
            value: function nc_f1() {}
        },
        {
            key: "nc_prop",
            get: function get() {
                return 10;
            }
        }
    ]);
    return c2;
}();
var c3 = /*#__PURE__*/ function(c2) {
    "use strict";
    swcHelpers.inherits(c3, c2);
    var _super = swcHelpers.createSuper(c3);
    function c3() {
        swcHelpers.classCallCheck(this, c3);
        var _this;
        _this = _super.call(this, 10);
        _this.p1 = swcHelpers.get((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(c3.prototype)), "c2_p1", _this);
        return _this;
    }
    swcHelpers.createClass(c3, [
        {
            key: "f1",
            value: /** c3 f1*/ function f1() {}
        },
        {
            key: "prop",
            get: /** c3 prop*/ function get() {
                return 10;
            }
        },
        {
            key: "nc_f1",
            value: function nc_f1() {}
        },
        {
            key: "nc_prop",
            get: function get() {
                return 10;
            }
        }
    ]);
    return c3;
}(c2);
var c2_i = new c2(10);
var c3_i = new c3();
c2_i.c2_f1();
c2_i.c2_nc_f1();
c2_i.f1();
c2_i.nc_f1();
c3_i.c2_f1();
c3_i.c2_nc_f1();
c3_i.f1();
c3_i.nc_f1();
// assign
c2_i = c3_i;
c2_i.c2_f1();
c2_i.c2_nc_f1();
c2_i.f1();
c2_i.nc_f1();
var c4 = /*#__PURE__*/ function(c2) {
    "use strict";
    swcHelpers.inherits(c4, c2);
    var _super = swcHelpers.createSuper(c4);
    function c4() {
        swcHelpers.classCallCheck(this, c4);
        return _super.apply(this, arguments);
    }
    return c4;
}(c2);
var c4_i = new c4(10);
var i2_i;
var i3_i;
i2_i.i2_f1();
i2_i.i2_nc_f1();
i2_i.f1();
i2_i.nc_f1();
i2_i.i2_l1();
i2_i.i2_nc_l1();
i2_i.l1();
i2_i.nc_l1();
i3_i.i2_f1();
i3_i.i2_nc_f1();
i3_i.f1();
i3_i.nc_f1();
i3_i.i2_l1();
i3_i.i2_nc_l1();
i3_i.l1();
i3_i.nc_l1();
// assign to interface
i2_i = i3_i;
i2_i.i2_f1();
i2_i.i2_nc_f1();
i2_i.f1();
i2_i.nc_f1();
i2_i.i2_l1();
i2_i.i2_nc_l1();
i2_i.l1();
i2_i.nc_l1();
var c5 = function c5() {
    "use strict";
    swcHelpers.classCallCheck(this, c5);
};
var c6 = /*#__PURE__*/ function(c5) {
    "use strict";
    swcHelpers.inherits(c6, c5);
    var _super = swcHelpers.createSuper(c6);
    function c6() {
        swcHelpers.classCallCheck(this, c6);
        var _this;
        _this = _super.call(this);
        _this.d = swcHelpers.get((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(c6.prototype)), "b", _this);
        return _this;
    }
    return c6;
}(c5);
