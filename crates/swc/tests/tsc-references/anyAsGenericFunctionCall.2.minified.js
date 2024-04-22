//// [anyAsGenericFunctionCall.ts]
var x;
import "@swc/helpers/_/_class_call_check";
x(), x('hello'), x(x), x(x);
