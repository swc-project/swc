//// [typeGuardsNestedAssignments.ts]
import "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_instanceof";
for(// Repro from #8851
var match, re = /./g; null != (match = re.exec("xxx"));)match[1].length, match[2].length;
