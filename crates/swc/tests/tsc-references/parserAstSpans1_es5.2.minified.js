import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var i1_i, i2_i, i3_i, c1 = function() {
    "use strict";
    function c1() {
        _class_call_check(this, c1);
    }
    var _proto = c1.prototype;
    return _proto.i1_f1 = function() {}, _proto.i1_nc_f1 = function() {}, _proto.f1 = function() {}, _proto.nc_f1 = function() {}, c1;
}();
i1_i.i1_f1(), i1_i.i1_nc_f1(), i1_i.f1(), i1_i.nc_f1(), i1_i.i1_l1(), i1_i.i1_nc_l1(), i1_i.l1(), i1_i.nc_l1();
var c1_i = new c1();
c1_i.i1_f1(), c1_i.i1_nc_f1(), c1_i.f1(), c1_i.nc_f1(), c1_i.i1_l1(), c1_i.i1_nc_l1(), c1_i.l1(), c1_i.nc_l1(), (i1_i = c1_i).i1_f1(), i1_i.i1_nc_f1(), i1_i.f1(), i1_i.nc_f1(), i1_i.i1_l1(), i1_i.i1_nc_l1(), i1_i.l1(), i1_i.nc_l1();
var c2 = function() {
    "use strict";
    function c2(a) {
        _class_call_check(this, c2), this.c2_p1 = a;
    }
    var _proto = c2.prototype;
    return _proto.c2_f1 = function() {}, _proto.c2_nc_f1 = function() {}, _proto.f1 = function() {}, _proto.nc_f1 = function() {}, _create_class(c2, [
        {
            key: "c2_prop",
            get: function() {
                return 10;
            }
        },
        {
            key: "c2_nc_prop",
            get: function() {
                return 10;
            }
        },
        {
            key: "prop",
            get: function() {
                return 10;
            }
        },
        {
            key: "nc_prop",
            get: function() {
                return 10;
            }
        }
    ]), c2;
}(), c3 = function(c2) {
    "use strict";
    _inherits(c3, c2);
    var _super = _create_super(c3);
    function c3() {
        var _this;
        return _class_call_check(this, c3), (_this = _super.call(this, 10)).p1 = _get((_assert_this_initialized(_this), _get_prototype_of(c3.prototype)), "c2_p1", _this), _this;
    }
    var _proto = c3.prototype;
    return _proto.f1 = function() {}, _proto.nc_f1 = function() {}, _create_class(c3, [
        {
            key: "prop",
            get: function() {
                return 10;
            }
        },
        {
            key: "nc_prop",
            get: function() {
                return 10;
            }
        }
    ]), c3;
}(c2), c2_i = new c2(10), c3_i = new c3();
c2_i.c2_f1(), c2_i.c2_nc_f1(), c2_i.f1(), c2_i.nc_f1(), c3_i.c2_f1(), c3_i.c2_nc_f1(), c3_i.f1(), c3_i.nc_f1(), (c2_i = c3_i).c2_f1(), c2_i.c2_nc_f1(), c2_i.f1(), c2_i.nc_f1();
var c4 = function(c2) {
    "use strict";
    _inherits(c4, c2);
    var _super = _create_super(c4);
    function c4() {
        return _class_call_check(this, c4), _super.apply(this, arguments);
    }
    return c4;
}(c2);
new c4(10), i2_i.i2_f1(), i2_i.i2_nc_f1(), i2_i.f1(), i2_i.nc_f1(), i2_i.i2_l1(), i2_i.i2_nc_l1(), i2_i.l1(), i2_i.nc_l1(), i3_i.i2_f1(), i3_i.i2_nc_f1(), i3_i.f1(), i3_i.nc_f1(), i3_i.i2_l1(), i3_i.i2_nc_l1(), i3_i.l1(), i3_i.nc_l1(), (i2_i = i3_i).i2_f1(), i2_i.i2_nc_f1(), i2_i.f1(), i2_i.nc_f1(), i2_i.i2_l1(), i2_i.i2_nc_l1(), i2_i.l1(), i2_i.nc_l1();
var c5 = function() {
    "use strict";
    _class_call_check(this, c5);
}, c6 = function(c51) {
    "use strict";
    _inherits(c6, c51);
    var _super = _create_super(c6);
    function c6() {
        var _this;
        return _class_call_check(this, c6), (_this = _super.call(this)).d = _get((_assert_this_initialized(_this), _get_prototype_of(c6.prototype)), "b", _this), _this;
    }
    return c6;
}(c5);
