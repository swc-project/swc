//// [anyAsFunctionCall.ts]
// any is considered an untyped function call
// can be called except with type arguments which is an error
var x;
var a = x();
var b = x('hello');
var c = x(x);
