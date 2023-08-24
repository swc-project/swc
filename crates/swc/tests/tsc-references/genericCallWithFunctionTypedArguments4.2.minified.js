//// [genericCallWithFunctionTypedArguments4.ts]
// No inference is made from function typed arguments which have multiple call signatures
import "@swc/helpers/_/_class_call_check";
 // T is {} (candidates boolean and {}), U is any (candidates any and {})
