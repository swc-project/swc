function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @declaration: true
function ExpandoDecl(n) {
    return n.toString();
}
ExpandoDecl.prop = 2;
ExpandoDecl.m = function(n) {
    return n + 1;
};
var n1 = ExpandoDecl.prop + ExpandoDecl.m(12) + ExpandoDecl(101).length;
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
var n1 = (ExpandoExpr.prop.x || 0) + ExpandoExpr.m(12) + ExpandoExpr(101).length;
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
function ExpandoMerge1(n) {
    return n * 100;
}
ExpandoMerge1.p1 = 111;
(function(ExpandoMerge) {
    ExpandoMerge.p2 = 222;
})(ExpandoMerge1 || (ExpandoMerge1 = {
}));
(function(ExpandoMerge) {
    ExpandoMerge.p3 = 333;
})(ExpandoMerge1 || (ExpandoMerge1 = {
}));
var n1 = ExpandoMerge1.p1 + ExpandoMerge1.p2 + ExpandoMerge1.p3 + ExpandoMerge1(1);
var Ns1;
(function(Ns) {
    var ExpandoNamespace = function ExpandoNamespace() {
    };
    var foo = function foo() {
        return ExpandoNamespace;
    };
    ExpandoNamespace.p6 = 42;
    Ns.foo = foo;
})(Ns1 || (Ns1 = {
}));
// Should not work in Typescript -- must be const
var ExpandoExpr2 = function ExpandoExpr2(n) {
    return n.toString();
};
ExpandoExpr2.prop = 2;
ExpandoExpr2.m = function(n) {
    return n + 1;
};
var n1 = ExpandoExpr2.prop + ExpandoExpr2.m(12) + ExpandoExpr2(101).length;
var ExpandoClass = function ExpandoClass() {
    "use strict";
    _classCallCheck(this, ExpandoClass);
    // Should not work in typescript -- classes already have statics
    this.n = 1001;
};
ExpandoClass.prop = 2;
ExpandoClass.m = function(n) {
    return n + 1;
};
var n1 = ExpandoClass.prop + ExpandoClass.m(12) + new ExpandoClass().n;
// Class expressions shouldn't work in typescript either
var ExpandoExpr3 = function _class() {
    "use strict";
    _classCallCheck(this, _class);
    this.n = 10001;
};
ExpandoExpr3.prop = 3;
ExpandoExpr3.m = function(n) {
    return n + 1;
};
var n1 = ExpandoExpr3.prop + ExpandoExpr3.m(13) + new ExpandoExpr3().n;
