//// [typeFromPropertyAssignment29.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function ExpandoDecl(n) {
    return n.toString();
}
ExpandoDecl.prop = 2, ExpandoDecl.m = function(n) {
    return n + 1;
};
var Ns, n = ExpandoDecl.prop + ExpandoDecl.m(12) + ExpandoDecl(101).length, ExpandoExpr = function(n) {
    return n.toString();
};
ExpandoExpr.prop = {
    x: 2
}, ExpandoExpr.prop = {
    y: ""
}, ExpandoExpr.m = function(n) {
    return n + 1;
};
var n = (ExpandoExpr.prop.x || 0) + ExpandoExpr.m(12) + ExpandoExpr(101).length, ExpandoArrow = function(n) {
    return n.toString();
};
function ExpandoNested(n) {
    var nested = function(m) {
        return n + m;
    };
    return nested.total = n + 1000000, nested;
}
function ExpandoMerge(n) {
    return 100 * n;
}
ExpandoArrow.prop = 2, ExpandoArrow.m = function(n) {
    return n + 1;
}, ExpandoNested.also = -1, ExpandoMerge.p1 = 111, (ExpandoMerge || (ExpandoMerge = {})).p2 = 222, (ExpandoMerge || (ExpandoMerge = {})).p3 = 333;
var n = ExpandoMerge.p1 + ExpandoMerge.p2 + ExpandoMerge.p3 + ExpandoMerge(1);
!function(Ns) {
    var ExpandoNamespace = function() {}, foo = function() {
        return ExpandoNamespace;
    };
    ExpandoNamespace.p6 = 42, Ns.foo = foo;
}(Ns || (Ns = {}));
var ExpandoExpr2 = function(n) {
    return n.toString();
};
ExpandoExpr2.prop = 2, ExpandoExpr2.m = function(n) {
    return n + 1;
};
var n = ExpandoExpr2.prop + ExpandoExpr2.m(12) + ExpandoExpr2(101).length, ExpandoClass = function ExpandoClass() {
    "use strict";
    _class_call_check(this, ExpandoClass), this.n = 1001;
};
ExpandoClass.prop = 2, ExpandoClass.m = function(n) {
    return n + 1;
};
var n = ExpandoClass.prop + ExpandoClass.m(12) + new ExpandoClass().n, ExpandoExpr3 = function ExpandoExpr3() {
    "use strict";
    _class_call_check(this, ExpandoExpr3), this.n = 10001;
};
ExpandoExpr3.prop = 3, ExpandoExpr3.m = function(n) {
    return n + 1;
};
var n = ExpandoExpr3.prop + ExpandoExpr3.m(13) + new ExpandoExpr3().n;
