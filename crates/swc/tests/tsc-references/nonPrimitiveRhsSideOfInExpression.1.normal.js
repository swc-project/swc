//// [nonPrimitiveRhsSideOfInExpression.ts]
var o = {};
function f() {
    return {};
}
var b1 = "foo" in o;
var b2 = "bar" in f();
