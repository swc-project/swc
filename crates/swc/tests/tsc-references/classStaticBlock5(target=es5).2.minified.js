//// [classStaticBlock5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var B = function B() {
    _class_call_check(this, B);
};
B.a = 1, B.b = 2;
var C = function(B) {
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C.b = 3, C.c = _get(_get_prototype_of(C), "a", C), C.b, _get(_get_prototype_of(C), "b", C), _get(_get_prototype_of(C), "a", C);
