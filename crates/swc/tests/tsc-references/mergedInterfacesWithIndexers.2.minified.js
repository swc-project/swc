//// [mergedInterfacesWithIndexers.ts]
// indexers should behave like other members when merging interface declarations
var a;
a[1], a["1"], a.hi;
