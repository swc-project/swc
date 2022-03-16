import * as swcHelpers from "@swc/helpers";
class B {
    test(x) {
        swcHelpers.classStaticPrivateFieldSpecGet(x, B, _foo);
    }
}
var _foo = {
    writable: !0,
    value: !0
};
