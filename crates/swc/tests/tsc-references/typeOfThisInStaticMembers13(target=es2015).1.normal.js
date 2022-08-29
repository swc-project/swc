//// [typeOfThisInStaticMembers13.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
let _c, _c1;
var _Inner;
class C {
}
_define_property(C, "c", "foo");
_define_property(C, "bar", (_c = C.c, _c1 = C.c, _Inner = class Inner {
    constructor(){
        _define_property(this, _c1, 123);
    }
}, _define_property(_Inner, _c, 123), _Inner));
