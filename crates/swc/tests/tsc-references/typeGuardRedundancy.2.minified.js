//// [typeGuardRedundancy.ts]
var x;
"string" == typeof x && "string" == typeof x ? x.substr : x.toFixed, "string" == typeof x && "string" == typeof x ? x.substr : x.toFixed, "string" == typeof x || "string" == typeof x ? x.substr : x.toFixed, "string" == typeof x || "string" == typeof x ? x.substr : x.toFixed;
