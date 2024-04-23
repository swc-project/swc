//// [mergedInterfacesWithIndexers.ts]
// indexers should behave like other members when merging interface declarations
var a;
var r = a[1];
var r2 = a['1'];
var r3 = a['hi'];
