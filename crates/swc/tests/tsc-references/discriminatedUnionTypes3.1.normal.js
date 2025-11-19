//// [discriminatedUnionTypes3.ts]
// Repro from #44435
var example = {};
if (example.err === undefined) {
    example.property; // true
}
