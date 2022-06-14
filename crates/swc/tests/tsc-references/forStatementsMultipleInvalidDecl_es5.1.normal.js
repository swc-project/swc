import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var C2 = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(C2, C);
    var _super = _create_super(C2);
    function C2() {
        _class_call_check(this, C2);
        return _super.apply(this, arguments);
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
var M;
(function(M1) {
    var F2 = function F2(x) {
        return x.toString();
    };
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M1.A = A;
    M1.F2 = F2;
})(M || (M = {}));
// all of these are errors
for(var a;;){}
for(var a = 1;;){}
for(var a = "a string";;){}
for(var a = new C();;){}
for(var a = new D();;){}
for(var a = M;;){}
for(var b;;){}
for(var b = new C();;){}
for(var b = new C2();;){}
for(var f = F;;){}
for(var f = function(x) {
    return "";
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
