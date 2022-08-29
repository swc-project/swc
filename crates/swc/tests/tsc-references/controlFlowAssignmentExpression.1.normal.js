//// [controlFlowAssignmentExpression.ts]
var x;
var obj;
x = "";
x = x.length;
x; // number
x = true;
(x = "", obj).foo = x = x.length;
x; // number
var o;
if ((o = fn()).done) {
    var y = o.value;
}
