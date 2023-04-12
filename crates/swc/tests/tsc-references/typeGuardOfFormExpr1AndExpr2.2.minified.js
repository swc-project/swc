//// [typeGuardOfFormExpr1AndExpr2.ts]
var strOrNumOrBool, numOrBool, strOrNumOrBoolOrC;
import "@swc/helpers/_/_class_call_check";
"string" != typeof strOrNumOrBoolOrC && "number" != typeof strOrNumOrBoolOrC && "boolean" != typeof strOrNumOrBoolOrC || (strOrNumOrBool = strOrNumOrBoolOrC), "string" != typeof strOrNumOrBool && numOrBool !== strOrNumOrBool && (numOrBool = strOrNumOrBool);
