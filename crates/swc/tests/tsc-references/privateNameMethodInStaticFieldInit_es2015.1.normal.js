import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _ref, _method = /*#__PURE__*/ new WeakSet();
// @target: es2015
class C {
    constructor(){
        _class_private_method_init(this, _method);
    }
}
C.s = _class_private_method_get(_ref = new C(), _method, method).call(_ref);
function method() {
    return 42;
}
console.log(C.s);
