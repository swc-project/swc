//// [anyAsFunctionCall.ts]
// any is considered an untyped function call
// can be called except with type arguments which is an error
var x;
x(), x("hello"), x(x);
