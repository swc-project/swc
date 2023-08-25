//// [anyAsGenericFunctionCall.ts]
// any is considered an untyped function call
// can be called except with type arguments which is an error
var x;
import "@swc/helpers/_/_class_call_check";
x(), x("hello"), x(x), x(x);
