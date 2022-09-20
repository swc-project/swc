//// [controlFlowAssignmentExpression.ts]
x = (x = "").length;
x = !0;
(x = "", obj).foo = x = x.length;
if ((o = fn()).done) {
    var x, obj, o;
    o.value;
}
