//// [computedPropertyNamesWithStaticProperty.ts]
import { _ as _class_name_tdz_error } from "@swc/helpers/_/_class_name_tdz_error";
let _staticProp = (_class_name_tdz_error("C"), C).staticProp, _staticProp1 = (_class_name_tdz_error("C"), C).staticProp, _staticProp2 = (_class_name_tdz_error("C"), C).staticProp;
class C {
    get [_staticProp]() {
        return "hello";
    }
    set [_staticProp1](x) {
        var y = x;
    }
    [_staticProp2]() {}
}
(()=>{
    C.staticProp = 10;
})();
