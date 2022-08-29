//// [controlFlowBinaryAndExpression.ts]
var x;
var cond;
(x = "") && (x = 0);
x; // string | number
x = "";
cond && (x = 0);
x; // string | number
