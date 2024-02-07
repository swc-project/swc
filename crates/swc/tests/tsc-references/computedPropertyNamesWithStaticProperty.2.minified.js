//// [computedPropertyNamesWithStaticProperty.ts]
import { _ as _class_name_tdz_error } from "@swc/helpers/_/_class_name_tdz_error";
let _staticProp = (_class_name_tdz_error("C1"), C1).staticProp, _staticProp1 = (_class_name_tdz_error("C1"), C1).staticProp, _staticProp2 = (_class_name_tdz_error("C1"), C1).staticProp;
class C1 {
    get [_staticProp]() {
        return "hello";
    }
    set [_staticProp1](x) {}
    [_staticProp2]() {}
}
C1.staticProp = 10, C2.staticProp, C2.staticProp, C2.staticProp;
