//// [forStatementsMultipleInvalidDecl.ts]
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
for(var a;;){}
for(var a = 1;;){}
for(var a = 'a string';;){}
for(var a = new C();;){}
for(var a = new D();;){}
for(var a = M;;){}
for(var b;;){}
for(var b = new C();;){}
for(var b = new C2();;){}
for(var f = F;;){}
for(var f = function(x) {
    return '';
};;){}
for(var arr;;){}
for(var arr = [
    1,
    2,
    3,
    4
];;){}
for(var arr = [
    new C(),
    new C2(),
    new D()
];;){}
for(var arr2 = [
    new D()
];;){}
for(var arr2 = new Array();;){}
for(var m;;){}
for(var m = M.A;;){}
var M;
