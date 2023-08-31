//// [discriminatedUnionTypes3.ts]
// Repro from #44435
var example = {};
void 0 === example.err && example.property;
