//// [typeOfThisInStaticMembers13.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
var _c, _c1, _Inner, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
_define_property(C, "c", "foo"), _define_property(C, "bar", (_c = C.c, _c1 = C.c, _Inner = function Inner() {
    "use strict";
    _class_call_check(this, Inner), _define_property(this, _c1, 123);
}, _define_property(_Inner, _c, 123), _Inner));
