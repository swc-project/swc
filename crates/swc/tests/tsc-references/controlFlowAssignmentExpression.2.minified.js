//// [controlFlowAssignmentExpression.ts]
var x, o;
(void (x = "")).foo = x = x.length, (o = fn()).done && o.value;
