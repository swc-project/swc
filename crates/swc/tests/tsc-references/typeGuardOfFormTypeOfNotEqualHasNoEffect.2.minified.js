//// [typeGuardOfFormTypeOfNotEqualHasNoEffect.ts]
var strOrC;
import "@swc/helpers/src/_class_call_check.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
void 0 === strOrC || _type_of(strOrC);
