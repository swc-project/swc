//// [typeGuardOfFormTypeOfPrimitiveSubtype.ts]
if ("number" == typeof a) var a, b, c = a;
if ("string" == typeof a) var c1 = a;
if ("boolean" == typeof a) var c2 = a;
if ("number" == typeof b) var c3 = b;
if ("string" == typeof b) var c4 = b;
if ("boolean" == typeof b) var c5 = b;
