import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @declaration: true
function ExpandoDecl(n1) {
    return n1.toString();
}
ExpandoDecl.prop = 2;
ExpandoDecl.m = function(n2) {
    return n2 + 1;
};
var n = ExpandoDecl.prop + ExpandoDecl.m(12) + ExpandoDecl(101).length;
var ExpandoExpr = function ExpandoExpr(n3) {
    return n3.toString();
};
ExpandoExpr.prop = {
    x: 2
};
ExpandoExpr.prop = {
    y: ""
};
ExpandoExpr.m = function(n4) {
    return n4 + 1;
};
var n = (ExpandoExpr.prop.x || 0) + ExpandoExpr.m(12) + ExpandoExpr(101).length;
var ExpandoArrow = function(n5) {
    return n5.toString();
};
ExpandoArrow.prop = 2;
ExpandoArrow.m = function(n6) {
    return n6 + 1;
};
function ExpandoNested(n7) {
    var nested = function nested(m) {
        return n7 + m;
    };
    nested.total = n7 + 1000000;
    return nested;
}
ExpandoNested.also = -1;
function ExpandoMerge(n8) {
    return n8 * 100;
}
ExpandoMerge.p1 = 111;
(function(ExpandoMerge1) {
    var p2 = ExpandoMerge1.p2 = 222;
})(ExpandoMerge || (ExpandoMerge = {}));
(function(ExpandoMerge2) {
    var p3 = ExpandoMerge2.p3 = 333;
})(ExpandoMerge || (ExpandoMerge = {}));
var n = ExpandoMerge.p1 + ExpandoMerge.p2 + ExpandoMerge.p3 + ExpandoMerge(1);
var Ns;
(function(Ns1) {
    var ExpandoNamespace = function ExpandoNamespace() {};
    var foo = function foo() {
        return ExpandoNamespace;
    };
    ExpandoNamespace.p6 = 42;
    Ns1.foo = foo;
})(Ns || (Ns = {}));
// Should not work in Typescript -- must be const
var ExpandoExpr2 = function ExpandoExpr2(n9) {
    return n9.toString();
};
ExpandoExpr2.prop = 2;
ExpandoExpr2.m = function(n10) {
    return n10 + 1;
};
var n = ExpandoExpr2.prop + ExpandoExpr2.m(12) + ExpandoExpr2(101).length;
// Should not work in typescript -- classes already have statics
var ExpandoClass = function ExpandoClass() {
    "use strict";
    _class_call_check(this, ExpandoClass);
    this.n = 1001;
};
ExpandoClass.prop = 2;
ExpandoClass.m = function(n11) {
    return n11 + 1;
};
var n = ExpandoClass.prop + ExpandoClass.m(12) + new ExpandoClass().n;
// Class expressions shouldn't work in typescript either
var ExpandoExpr3 = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.n = 10001;
};
ExpandoExpr3.prop = 3;
ExpandoExpr3.m = function(n12) {
    return n12 + 1;
};
var n = ExpandoExpr3.prop + ExpandoExpr3.m(13) + new ExpandoExpr3().n;
