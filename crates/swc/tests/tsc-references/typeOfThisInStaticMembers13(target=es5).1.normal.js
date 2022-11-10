//// [typeOfThisInStaticMembers13.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
var _this_c, _this_c1;
var _Inner;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
_define_property(C, "c", "foo");
_define_property(C, "bar", (_this_c = C.c, _this_c1 = C.c, _Inner = function Inner() {
    "use strict";
    _class_call_check(this, Inner);
    _define_property(this, _this_c1, 123);
}, _define_property(_Inner, _this_c, 123), _Inner));
