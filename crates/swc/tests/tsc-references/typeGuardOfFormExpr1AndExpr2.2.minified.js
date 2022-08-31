//// [typeGuardOfFormExpr1AndExpr2.ts]
var strOrNumOrBool, numOrBool, strOrNumOrBoolOrC;
"string" != typeof strOrNumOrBoolOrC && "number" != typeof strOrNumOrBoolOrC && "boolean" != typeof strOrNumOrBoolOrC || (strOrNumOrBool = strOrNumOrBoolOrC), "string" != typeof strOrNumOrBool && numOrBool !== strOrNumOrBool && (numOrBool = strOrNumOrBool);
