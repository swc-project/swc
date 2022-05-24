import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _ref, _method = new WeakSet(), C = function() {
    "use strict";
    _class_call_check(this, C), _class_private_method_init(this, _method);
};
function method() {
    return 42;
}
C.s = _class_private_method_get(_ref = new C(), _method, method).call(_ref), console.log(C.s);
