//// [functionImplementations.ts]
// FunctionExpression with no return type annotation and no return statement returns void
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
function rec2() {
    return rec2();
}
function rec4() {
    return rec4();
}
rec2(), rec2(), rec4(), rec4();
// Otherwise, the inferred return type is the first of the types of the return statement expressions
// in the function body that is a supertype of each of the others, 
// ignoring return statements with no expressions.
// A compile - time error occurs if no return statement expression has a type that is a supertype of each of the others.
// FunctionExpression with no return type annotation with multiple return statements with subtype relation between returns
var Base = function Base() {
    _class_call_check(this, Base);
};
new Base(), new Base();
