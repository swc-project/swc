//// [classWithConstructors.ts]
var NonGeneric, Generics, C, C2, D, C1, C21, D1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
NonGeneric || (NonGeneric = {}), new (C = function C(x) {
    _class_call_check(this, C);
})(), new C(''), new (C2 = function C2(x) {
    _class_call_check(this, C2);
})(), new C2(''), new C2(1), new (D = function(C2) {
    _inherits(D, C2);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C2))(), new D(1), new D(''), Generics || (Generics = {}), new (C1 = function C(x) {
    _class_call_check(this, C);
})(), new C1(''), new (C21 = function C2(x) {
    _class_call_check(this, C2);
})(), new C21(''), new C21(1, 2), new (D1 = function(C2) {
    _inherits(D, C2);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C21))(), new D1(1), new D1('');
