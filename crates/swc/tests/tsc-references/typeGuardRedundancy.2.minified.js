//// [typeGuardRedundancy.ts]
var x;
(void 0).toFixed, "string" == typeof x && "string" == typeof x ? x.substr : x.toFixed, "string" == typeof x || "string" == typeof x ? x.substr : x.toFixed, "string" == typeof x || "string" == typeof x ? x.substr : x.toFixed;
