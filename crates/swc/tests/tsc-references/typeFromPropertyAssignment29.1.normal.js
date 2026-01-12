//// [typeFromPropertyAssignment29.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function ExpandoDecl(n) {
    return n.toString();
}
ExpandoDecl.prop = 2;
ExpandoDecl.m = function(n) {
    return n + 1;
};
var n = ExpandoDecl.prop + ExpandoDecl.m(12) + ExpandoDecl(101).length;
var ExpandoExpr = function ExpandoExpr(n) {
    return n.toString();
};
ExpandoExpr.prop = {
    x: 2
};
ExpandoExpr.prop = {
    y: ""
};
ExpandoExpr.m = function(n) {
    return n + 1;
};
var n = (ExpandoExpr.prop.x || 0) + ExpandoExpr.m(12) + ExpandoExpr(101).length;
var ExpandoArrow = function(n) {
    return n.toString();
};
ExpandoArrow.prop = 2;
ExpandoArrow.m = function(n) {
    return n + 1;
};
function ExpandoNested(n) {
    var nested = function nested(m) {
        return n + m;
    };
    nested.total = n + 1000000;
    return nested;
}
ExpandoNested.also = -1;
function ExpandoMerge(n) {
    return n * 100;
}
ExpandoMerge.p1 = 111;
(function(ExpandoMerge) {
    ExpandoMerge.p2 = 222;
})(ExpandoMerge || (ExpandoMerge = {}));
(function(ExpandoMerge) {
    ExpandoMerge.p3 = 333;
})(ExpandoMerge || (ExpandoMerge = {}));
var n = ExpandoMerge.p1 + ExpandoMerge.p2 + ExpandoMerge.p3 + ExpandoMerge(1);
(function(Ns) {
    function ExpandoNamespace() {}
    ExpandoNamespace.p6 = 42;
    function foo() {
        return ExpandoNamespace;
    }
    Ns.foo = foo;
})(Ns || (Ns = {}));
// Should not work in Typescript -- must be const
var ExpandoExpr2 = function ExpandoExpr2(n) {
    return n.toString();
};
ExpandoExpr2.prop = 2;
ExpandoExpr2.m = function(n) {
    return n + 1;
};
var n = ExpandoExpr2.prop + ExpandoExpr2.m(12) + ExpandoExpr2(101).length;
// Should not work in typescript -- classes already have statics
var ExpandoClass = function ExpandoClass() {
    "use strict";
    _class_call_check(this, ExpandoClass);
    this.n = 1001;
};
ExpandoClass.prop = 2;
ExpandoClass.m = function(n) {
    return n + 1;
};
var n = ExpandoClass.prop + ExpandoClass.m(12) + new ExpandoClass().n;
// Class expressions shouldn't work in typescript either
var ExpandoExpr3 = function ExpandoExpr3() {
    "use strict";
    _class_call_check(this, ExpandoExpr3);
    this.n = 10001;
};
ExpandoExpr3.prop = 3;
ExpandoExpr3.m = function(n) {
    return n + 1;
};
var n = ExpandoExpr3.prop + ExpandoExpr3.m(13) + new ExpandoExpr3().n;
var Ns;
