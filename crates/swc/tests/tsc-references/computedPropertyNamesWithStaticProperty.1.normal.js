//// [computedPropertyNamesWithStaticProperty.ts]
import { _ as _class_name_tdz_error } from "@swc/helpers/_/_class_name_tdz_error";
let _C2_staticProp, _C2_staticProp1, _C2_staticProp2;
var _C2;
let _staticProp = (_class_name_tdz_error("C1"), C1).staticProp, _staticProp1 = (_class_name_tdz_error("C1"), C1).staticProp, _staticProp2 = (_class_name_tdz_error("C1"), C1).staticProp;
class C1 {
    get [_staticProp]() {
        return "hello";
    }
    set [_staticProp1](x) {
        var y = x;
    }
    [_staticProp2]() {}
}
C1.staticProp = 10;
_C2_staticProp = C2.staticProp, _C2_staticProp1 = C2.staticProp, _C2_staticProp2 = C2.staticProp, _C2 = class C2 {
    get [_C2_staticProp]() {
        return "hello";
    }
    set [_C2_staticProp1](x) {
        var y = x;
    }
    [_C2_staticProp2]() {}
}, _C2.staticProp = 10, _C2;
