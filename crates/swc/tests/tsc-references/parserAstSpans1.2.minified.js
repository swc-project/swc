//// [parserAstSpans1.ts]
/** i1 is interface with properties*/ import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var /*#__PURE__*/ i1_i, i2_i, i3_i, c1 = function() {
    function c1() {
        _class_call_check(this, c1);
    }
    var _proto = c1.prototype;
    return _proto.i1_f1 = function() {}, _proto.i1_nc_f1 = function() {}, /** c1_f1*/ _proto.f1 = function() {}, /** c1_nc_f1*/ _proto.nc_f1 = function() {}, c1;
}();
i1_i.i1_f1(), i1_i.i1_nc_f1(), i1_i.f1(), i1_i.nc_f1(), i1_i.i1_l1(), i1_i.i1_nc_l1(), i1_i.l1(), i1_i.nc_l1();
var c1_i = new c1();
c1_i.i1_f1(), c1_i.i1_nc_f1(), c1_i.f1(), c1_i.nc_f1(), c1_i.i1_l1(), c1_i.i1_nc_l1(), c1_i.l1(), c1_i.nc_l1(), // assign to interface
(i1_i = c1_i).i1_f1(), i1_i.i1_nc_f1(), i1_i.f1(), i1_i.nc_f1(), i1_i.i1_l1(), i1_i.i1_nc_l1(), i1_i.l1(), i1_i.nc_l1();
var c2 = function() {
    function c2(a) {
        _class_call_check(this, c2), this.c2_p1 = a;
    }
    var _proto = c2.prototype;
    return(/** c2 c2_f1*/ _proto.c2_f1 = function() {}, _proto.c2_nc_f1 = function() {}, /** c2 f1*/ _proto.f1 = function() {}, _proto.nc_f1 = function() {}, _create_class(c2, [
        {
            key: "c2_prop",
            get: /** c2 c2_prop*/ function() {
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
            get: /** c2 prop*/ function() {
                return 10;
            }
        },
        {
            key: "nc_prop",
            get: function() {
                return 10;
            }
        }
    ]), c2);
}(), c3 = function(c2) {
    _inherits(c3, c2);
    var _super = _create_super(c3);
    function c3() {
        var _this;
        return _class_call_check(this, c3), (_this = _super.call(this, 10)).p1 = _get((_assert_this_initialized(_this), _get_prototype_of(c3.prototype)), "c2_p1", _this), _this;
    }
    var _proto = c3.prototype;
    return(/** c3 f1*/ _proto.f1 = function() {}, _proto.nc_f1 = function() {}, _create_class(c3, [
        {
            key: "prop",
            get: /** c3 prop*/ function() {
                return 10;
            }
        },
        {
            key: "nc_prop",
            get: function() {
                return 10;
            }
        }
    ]), c3);
}(c2), /*#__PURE__*/ c2_i = new c2(10), c3_i = new c3();
c2_i.c2_f1(), c2_i.c2_nc_f1(), c2_i.f1(), c2_i.nc_f1(), c3_i.c2_f1(), c3_i.c2_nc_f1(), c3_i.f1(), c3_i.nc_f1(), // assign
(c2_i = c3_i).c2_f1(), c2_i.c2_nc_f1(), c2_i.f1(), c2_i.nc_f1(), new (function(c2) {
    _inherits(c4, c2);
    var _super = _create_super(c4);
    function c4() {
        return _class_call_check(this, c4), _super.apply(this, arguments);
    }
    return c4;
}(c2))(10), i2_i.i2_f1(), i2_i.i2_nc_f1(), i2_i.f1(), i2_i.nc_f1(), i2_i.i2_l1(), i2_i.i2_nc_l1(), i2_i.l1(), i2_i.nc_l1(), i3_i.i2_f1(), i3_i.i2_nc_f1(), i3_i.f1(), i3_i.nc_f1(), i3_i.i2_l1(), i3_i.i2_nc_l1(), i3_i.l1(), i3_i.nc_l1(), // assign to interface
(i2_i = i3_i).i2_f1(), i2_i.i2_nc_f1(), i2_i.f1(), i2_i.nc_f1(), i2_i.i2_l1(), i2_i.i2_nc_l1(), i2_i.l1(), i2_i.nc_l1();
