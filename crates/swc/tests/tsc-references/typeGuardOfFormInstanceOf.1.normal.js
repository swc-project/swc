//// [typeGuardOfFormInstanceOf.ts]
// A type guard of the form x instanceof C, where C is of a subtype of the global type 'Function' 
// and C has a property named 'prototype'
//  - when true, narrows the type of x to the type of the 'prototype' property in C provided 
//    it is a subtype of the type of x, or
//  - when false, has no effect on the type of x.
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
var D1 = /*#__PURE__*/ function(C1) {
    "use strict";
    _inherits(D1, C1);
    function D1() {
        _class_call_check(this, D1);
        return _call_super(this, D1, arguments);
    }
    return D1;
}(C1);
var C3 = function C3() {
    "use strict";
    _class_call_check(this, C3);
};
var str;
var num;
var strOrNum;
var ctor1;
str = _instanceof(ctor1, C1) && ctor1.p1; // C1
num = _instanceof(ctor1, C2) && ctor1.p2; // C2
str = _instanceof(ctor1, D1) && ctor1.p1; // D1
num = _instanceof(ctor1, D1) && ctor1.p3; // D1
var ctor2;
num = _instanceof(ctor2, C2) && ctor2.p2; // C2
num = _instanceof(ctor2, D1) && ctor2.p3; // D1
str = _instanceof(ctor2, D1) && ctor2.p1; // D1
var r2 = _instanceof(ctor2, C1) && ctor2; // C2 | D1
var ctor3;
if (_instanceof(ctor3, C1)) {
    ctor3.p1; // C1
} else {
    ctor3.p2; // C2
}
var ctor4;
if (_instanceof(ctor4, C1)) {
    ctor4.p1; // C1
} else if (_instanceof(ctor4, C2)) {
    ctor4.p2; // C2
} else {
    ctor4.p4; // C3
}
var ctor5;
if (_instanceof(ctor5, C1)) {
    ctor5.p1; // C1
} else {
    ctor5.p2; // C2
}
var ctor6;
if (_instanceof(ctor6, C1) || _instanceof(ctor6, C2)) {} else {
    ctor6.p4; // C3
}
