//// [propertyAccessOnTypeParameterWithConstraints.ts]
var x;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        return (void 0).getDate() + (void 0).getDate();
    }, C;
}())().f(), (void 0).foo.getDate(), (void 0).foo.getDate(), (void 0)().getDate(), (void 0)().getDate(), (x = new Date()).getDate(), x.getDate();
