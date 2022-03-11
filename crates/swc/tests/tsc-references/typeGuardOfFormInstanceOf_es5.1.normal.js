import * as swcHelpers from "@swc/helpers";
// A type guard of the form x instanceof C, where C is of a subtype of the global type 'Function' 
// and C has a property named 'prototype'
//  - when true, narrows the type of x to the type of the 'prototype' property in C provided 
//    it is a subtype of the type of x, or
//  - when false, has no effect on the type of x.
var C1 = function C1() {
    "use strict";
    swcHelpers.classCallCheck(this, C1);
};
var C2 = function C2() {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
};
var D1 = /*#__PURE__*/ function(C1) {
    "use strict";
    swcHelpers.inherits(D1, C1);
    var _super = swcHelpers.createSuper(D1);
    function D1() {
        swcHelpers.classCallCheck(this, D1);
        return _super.apply(this, arguments);
    }
    return D1;
}(C1);
var C3 = function C3() {
    "use strict";
    swcHelpers.classCallCheck(this, C3);
};
var str;
var num;
var strOrNum;
var ctor1;
str = swcHelpers._instanceof(ctor1, C1) && ctor1.p1; // C1
num = swcHelpers._instanceof(ctor1, C2) && ctor1.p2; // C2
str = swcHelpers._instanceof(ctor1, D1) && ctor1.p1; // D1
num = swcHelpers._instanceof(ctor1, D1) && ctor1.p3; // D1
var ctor2;
num = swcHelpers._instanceof(ctor2, C2) && ctor2.p2; // C2
num = swcHelpers._instanceof(ctor2, D1) && ctor2.p3; // D1
str = swcHelpers._instanceof(ctor2, D1) && ctor2.p1; // D1
var r2 = swcHelpers._instanceof(ctor2, C1) && ctor2; // C2 | D1
var ctor3;
if (swcHelpers._instanceof(ctor3, C1)) {
    ctor3.p1; // C1
} else {
    ctor3.p2; // C2
}
var ctor4;
if (swcHelpers._instanceof(ctor4, C1)) {
    ctor4.p1; // C1
} else if (swcHelpers._instanceof(ctor4, C2)) {
    ctor4.p2; // C2
} else {
    ctor4.p4; // C3
}
var ctor5;
if (swcHelpers._instanceof(ctor5, C1)) {
    ctor5.p1; // C1
} else {
    ctor5.p2; // C2
}
var ctor6;
if (swcHelpers._instanceof(ctor6, C1) || swcHelpers._instanceof(ctor6, C2)) {} else {
    ctor6.p4; // C3
}
