//// [anyAsGenericFunctionCall.ts]
var x;
import "@swc/helpers/src/_class_call_check.mjs";
x(), x("hello"), x(x), x(x);
