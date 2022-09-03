//// [typeGuardRedundancy.ts]
var x, r1 = "string" == typeof x && "string" == typeof x ? x.substr : x.toFixed, r2 = "string" == typeof x && "string" == typeof x ? x.substr : x.toFixed, r3 = "string" == typeof x || "string" == typeof x ? x.substr : x.toFixed, r4 = "string" == typeof x || "string" == typeof x ? x.substr : x.toFixed;
