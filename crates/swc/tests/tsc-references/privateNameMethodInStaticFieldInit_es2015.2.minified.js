import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
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
