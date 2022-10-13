//// [conditionalOperatorConditoinIsStringType.ts]
var condString;
import _type_of from "@swc/helpers/src/_type_of.mjs";
function foo() {
    return "string";
}
(void 0).toUpperCase, foo(), foo(), void 0 === condString || _type_of(condString), condString.toUpperCase, foo(), void 0 === condString || _type_of(condString), condString.toUpperCase;
