import * as swcHelpers from "@swc/helpers";
let _staticProp = (swcHelpers.classNameTDZError("C"), C).staticProp, _staticProp1 = (swcHelpers.classNameTDZError("C"), C).staticProp, _staticProp2 = (swcHelpers.classNameTDZError("C"), C).staticProp;
// @target: es6
class C {
    get [_staticProp]() {
        return "hello";
    }
    set [_staticProp1](x) {
        var y = x;
    }
    [_staticProp2]() {}
}
C.staticProp = 10;
