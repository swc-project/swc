//// [subtypingWithOptionalProperties.ts]
// subtyping is not transitive due to optional properties but the subtyping algorithm assumes it is for the 99% case
// returns { s?: number; }
var r = {
    s: {}
}; // ok
r.s && r.s.toFixed(); // would blow up at runtime
