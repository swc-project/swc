//// [typeOfThisInStaticMembers13.ts]
var _Inner;
import _define_property from "@swc/helpers/src/_define_property.mjs";
let _c;
class C {
}
_define_property(C, "c", "foo"), _define_property(C, "bar", (_c = C.c, _Inner = class {
    constructor(){
        _define_property(this, C.c, 123);
    }
}, _define_property(_Inner, _c, 123), _Inner));
