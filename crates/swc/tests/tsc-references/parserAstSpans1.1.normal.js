//// [parserAstSpans1.ts]
/** i1 is interface with properties*/ import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var c1 = /*#__PURE__*/ function() {
    "use strict";
    function c1() {
        _class_call_check(this, c1);
    }
    var _proto = c1.prototype;
    _proto.i1_f1 = function i1_f1() {};
    _proto.i1_nc_f1 = function i1_nc_f1() {};
    /** c1_f1*/ _proto.f1 = function f1() {};
    /** c1_nc_f1*/ _proto.nc_f1 = function nc_f1() {};
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
        _class_call_check(this, c2);
        this.c2_p1 = a;
    }
    var _proto = c2.prototype;
    /** c2 c2_f1*/ _proto.c2_f1 = function c2_f1() {};
    _proto.c2_nc_f1 = function c2_nc_f1() {};
    /** c2 f1*/ _proto.f1 = function f1() {};
    _proto.nc_f1 = function nc_f1() {};
    _create_class(c2, [
        {
            key: "c2_prop",
            get: /** c2 c2_prop*/ function get() {
                return 10;
            }
        },
        {
            key: "c2_nc_prop",
            get: function get() {
                return 10;
            }
        },
        {
            key: "prop",
            get: /** c2 prop*/ function get() {
                return 10;
            }
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
    _inherits(c3, c2);
    function c3() {
        _class_call_check(this, c3);
        var _this;
        _this = _call_super(this, c3, [
            10
        ]);
        _this.p1 = _get((_assert_this_initialized(_this), _get_prototype_of(c3.prototype)), "c2_p1", _this);
        return _this;
    }
    var _proto = c3.prototype;
    /** c3 f1*/ _proto.f1 = function f1() {};
    _proto.nc_f1 = function nc_f1() {};
    _create_class(c3, [
        {
            key: "prop",
            get: /** c3 prop*/ function get() {
                return 10;
            }
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
    _inherits(c4, c2);
    function c4() {
        _class_call_check(this, c4);
        return _call_super(this, c4, arguments);
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
/**c5 class*/ var c5 = function c5() {
    "use strict";
    _class_call_check(this, c5);
};
var c6 = /*#__PURE__*/ function(c5) {
    "use strict";
    _inherits(c6, c5);
    function c6() {
        _class_call_check(this, c6);
        var _this;
        _this = _call_super(this, c6);
        _this.d = _get((_assert_this_initialized(_this), _get_prototype_of(c6.prototype)), "b", _this);
        return _this;
    }
    return c6;
}(c5);
