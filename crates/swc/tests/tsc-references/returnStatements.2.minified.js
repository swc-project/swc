//// [returnStatements.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function fn1() {
    return 1;
}
function fn2() {
    return "";
}
function fn3() {}
function fn4() {}
function fn5() {
    return !0;
}
function fn6() {
    return new Date(12);
}
function fn7() {
    return null;
}
function fn8() {}
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.dispose = function() {}, C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
function fn10() {
    return {
        id: 12
    };
}
function fn11() {
    return new C();
}
function fn12() {
    return new D();
}
function fn13() {
    return null;
}
