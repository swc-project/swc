//// [mergedInterfacesWithMultipleBases.ts]
// merged interfaces behave as if all extends clauses from each declaration are merged together
// no errors expected
var a, M;
import "@swc/helpers/_/_class_call_check";
a.a, M || (M = {});
