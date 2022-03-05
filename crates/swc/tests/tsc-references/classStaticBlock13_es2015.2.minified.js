import * as swcHelpers from "@swc/helpers";
class C {
    foo() {
        return swcHelpers.classStaticPrivateFieldSpecGet(C, C, _x);
    }
}
var _x = {
    writable: !0,
    value: 123
};
console.log(swcHelpers.classStaticPrivateFieldSpecGet(C, C, _x));
