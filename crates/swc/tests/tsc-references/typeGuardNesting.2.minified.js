//// [typeGuardNesting.ts]
var strOrBool;
if ("boolean" == typeof strOrBool && !strOrBool || "string" == typeof strOrBool) var label = "string" == typeof strOrBool ? strOrBool : "string", bool = "boolean" == typeof strOrBool && strOrBool, label2 = "boolean" != typeof strOrBool ? strOrBool : "string", bool2 = "string" != typeof strOrBool && strOrBool;
if ("string" != typeof strOrBool && !strOrBool || "boolean" != typeof strOrBool) var label1 = "string" == typeof strOrBool ? strOrBool : "string", bool1 = "boolean" == typeof strOrBool && strOrBool, label21 = "boolean" != typeof strOrBool ? strOrBool : "string", bool21 = "string" != typeof strOrBool && strOrBool;
