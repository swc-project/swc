//// [privateNameMethodInStaticFieldInit.ts]
import { _ as _class_private_method_get } from "@swc/helpers/_/_class_private_method_get";
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
var _ref, _method = /*#__PURE__*/ new WeakSet();
class C {
    constructor(){
        _class_private_method_init(this, _method);
    }
}
C.s = _class_private_method_get(_ref = new C(), _method, function() {
    return 42;
}).call(_ref), console.log(C.s);
