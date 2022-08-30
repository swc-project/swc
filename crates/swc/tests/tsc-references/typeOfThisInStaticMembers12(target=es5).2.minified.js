//// [typeOfThisInStaticMembers12.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _c, _c1, _Inner, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.c = "foo", C.bar = (_c = C.c, _c1 = C.c, (_Inner = function Inner() {
    "use strict";
    _class_call_check(this, Inner), this[_c1] = 123;
})[_c] = 123, _Inner);
