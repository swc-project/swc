import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _ref, _method = new WeakSet();
class C {
    constructor(){
        _class_private_method_init(this, _method);
    }
}
function method() {
    return 42;
}
C.s = _class_private_method_get(_ref = new C(), _method, method).call(_ref), console.log(C.s);
