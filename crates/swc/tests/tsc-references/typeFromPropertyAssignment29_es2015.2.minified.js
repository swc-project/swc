function ExpandoDecl(n) {
    return n.toString();
}
ExpandoDecl.prop = 2, ExpandoDecl.m = function(n) {
    return n + 1;
}, ExpandoDecl.prop, ExpandoDecl.m(12), ExpandoDecl(101).length;
const ExpandoExpr = function(n) {
    return n.toString();
};
ExpandoExpr.prop = {
    x: 2
}, ExpandoExpr.prop = {
    y: ""
}, ExpandoExpr.m = function(n) {
    return n + 1;
}, ExpandoExpr.prop.x, ExpandoExpr.m(12), ExpandoExpr(101).length;
const ExpandoArrow = (n)=>n.toString()
;
function ExpandoMerge(n) {
    return 100 * n;
}
ExpandoArrow.prop = 2, ExpandoArrow.m = function(n) {
    return n + 1;
}, (function(n) {
    let nested = function(m) {
        return n + m;
    };
    return nested.total = n + 1_000_000, nested;
}).also = -1, ExpandoMerge.p1 = 111, (ExpandoMerge || (ExpandoMerge = {})).p2 = 222, (ExpandoMerge || (ExpandoMerge = {})).p3 = 333, ExpandoMerge.p1, ExpandoMerge.p2, ExpandoMerge.p3, ExpandoMerge(1), function(Ns1) {
    function ExpandoNamespace() {}
    function foo() {
        return ExpandoNamespace;
    }
    ExpandoNamespace.p6 = 42, Ns1.foo = foo;
}(Ns || (Ns = {}));
var Ns, ExpandoExpr2 = function(n) {
    return n.toString();
};
ExpandoExpr2.prop = 2, ExpandoExpr2.m = function(n) {
    return n + 1;
}, ExpandoExpr2.prop, ExpandoExpr2.m(12), ExpandoExpr2(101).length;
class ExpandoClass {
    constructor(){
        this.n = 1001;
    }
}
ExpandoClass.prop = 2, ExpandoClass.m = function(n) {
    return n + 1;
}, ExpandoClass.prop, ExpandoClass.m(12), new ExpandoClass().n;
var ExpandoExpr3 = class {
    constructor(){
        this.n = 10001;
    }
};
ExpandoExpr3.prop = 3, ExpandoExpr3.m = function(n) {
    return n + 1;
}, ExpandoExpr3.prop, ExpandoExpr3.m(13), new ExpandoExpr3().n;
