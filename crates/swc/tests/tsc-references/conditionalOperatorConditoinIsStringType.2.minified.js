//// [conditionalOperatorConditoinIsStringType.ts]
//Cond ? Expr1 : Expr2,  Cond is of string type, Expr1 and Expr2 have the same type
var condString;
import { _ as _type_of } from "@swc/helpers/_/_type_of";
//Cond is a string type expression
function foo() {
    return "string";
}
void 0 === condString || _type_of(condString), condString.toUpperCase, foo(), foo(), void 0 === condString || _type_of(condString), condString.toUpperCase, foo(), void 0 === condString || _type_of(condString), condString.toUpperCase;
 // union
