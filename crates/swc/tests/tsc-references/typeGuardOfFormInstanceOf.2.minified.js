//// [typeGuardOfFormInstanceOf.ts]
// A type guard of the form x instanceof C, where C is of a subtype of the global type 'Function' 
// and C has a property named 'prototype'
//  - when true, narrows the type of x to the type of the 'prototype' property in C provided 
//    it is a subtype of the type of x, or
//  - when false, has no effect on the type of x.
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var ctor1, ctor2, ctor3, ctor4, ctor5, ctor6, C1 = function C1() {
    _class_call_check(this, C1);
}, C2 = function C2() {
    _class_call_check(this, C2);
}, D1 = function(C1) {
    _inherits(D1, C1);
    var _super = _create_super(D1);
    function D1() {
        return _class_call_check(this, D1), _super.apply(this, arguments);
    }
    return D1;
}(C1);
_instanceof(ctor1, C1) && ctor1.p1, _instanceof(ctor1, C2) && ctor1.p2, _instanceof(ctor1, D1) && ctor1.p1, _instanceof(ctor1, D1) && ctor1.p3, _instanceof(ctor2, C2) && ctor2.p2, _instanceof(ctor2, D1) && ctor2.p3, _instanceof(ctor2, D1) && ctor2.p1, _instanceof(ctor2, C1), _instanceof(ctor3, C1) ? ctor3.p1 : ctor3.p2, _instanceof(ctor4, C1) ? ctor4.p1 : _instanceof(ctor4, C2) ? ctor4.p2 : ctor4.p4, _instanceof(ctor5, C1) ? ctor5.p1 : ctor5.p2, _instanceof(ctor6, C1) || _instanceof(ctor6, C2) || ctor6.p4;
