//// [typeGuardOfFormNotExpr.ts]
var strOrNumOrBool, numOrBool;
"string" != typeof strOrNumOrBool && numOrBool !== strOrNumOrBool && (numOrBool = strOrNumOrBool);
