//// [invalidMultipleVariableDeclarations.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var M, a, b, arr, m, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, C2 = function(C) {
    "use strict";
    _inherits(C2, C);
    var _super = _create_super(C2);
    function C2() {
        return _class_call_check(this, C2), _super.apply(this, arguments);
    }
    return C2;
}(C), D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function F(x) {
    return 42;
}
!function(M) {
    var F2 = function(x) {
        return x.toString();
    }, A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A, M.F2 = F2;
}(M || (M = {}));
var a = 1, a = "a string", a = new C(), a = new D(), a = M, b = new C(), b = new C2(), f = F, f = function(x) {
    return "";
}, arr = [
    1,
    2,
    3,
    4
], arr = [
    new C(),
    new C2(),
    new D()
], arr2 = [
    new D()
], arr2 = [], m = M.A;
