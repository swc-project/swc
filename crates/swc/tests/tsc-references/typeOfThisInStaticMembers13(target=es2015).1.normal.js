//// [typeOfThisInStaticMembers13.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
let _this_c, _this_c1;
var _Inner;
class C {
}
_define_property(C, "c", "foo");
_define_property(C, "bar", (_this_c = C.c, _this_c1 = C.c, _Inner = class Inner {
    constructor(){
        _define_property(this, _this_c1, 123);
    }
}, _define_property(_Inner, _this_c, 123), _Inner));
