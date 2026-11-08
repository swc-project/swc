//// [propertyAccessOnTypeParameterWithoutConstraints.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        return (void 0).toString() + (void 0).toString();
    }, C;
}())().f(), (void 0).foo.toString(), (void 0).foo.toString(), (void 0)().toString(), (void 0)().toString();
