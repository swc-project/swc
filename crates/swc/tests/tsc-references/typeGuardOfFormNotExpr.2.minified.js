//// [typeGuardOfFormNotExpr.ts]
if ("string" != typeof strOrNumOrBool && numOrBool !== strOrNumOrBool) numOrBool = strOrNumOrBool;
else var strOrNumOrBool, numOrBool;
