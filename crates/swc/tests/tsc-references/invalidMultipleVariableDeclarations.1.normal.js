//// [invalidMultipleVariableDeclarations.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var C2 = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(C2, C);
    function C2() {
        _class_call_check(this, C2);
        return _call_super(this, C2, arguments);
    }
    return C2;
}(C);
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function F(x) {
    return 42;
}
(function(M) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A;
    function F2(x) {
        return x.toString();
    }
    M.F2 = F2;
})(M || (M = {}));
// all of these are errors
var a;
var a = 1;
var a = 'a string';
var a = new C();
var a = new D();
var a = M;
var b;
var b = new C();
var b = new C2();
var f = F;
var f = function(x) {
    return '';
};
var arr;
var arr = [
    1,
    2,
    3,
    4
];
var arr = [
    new C(),
    new C2(),
    new D()
];
var arr2 = [
    new D()
];
var arr2 = new Array();
var m;
var m = M.A;
var M;
