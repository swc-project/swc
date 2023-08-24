//// [functionCalls.ts]
// Invoke function call on value of type 'any' with no type arguments
var anyVar, subFunc, func;
anyVar(0), anyVar(""), // Invoke function call on value of type 'any' with type arguments
// These should be errors
anyVar("hello"), anyVar(), anyVar(void 0), subFunc(0), subFunc(""), subFunc(), // Invoke function call on value of a subtype of Function with no call signatures with type arguments
// These should be errors
subFunc(0), subFunc(""), subFunc(), func(0), func(""), func();
