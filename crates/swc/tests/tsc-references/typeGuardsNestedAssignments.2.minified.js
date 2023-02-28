//// [typeGuardsNestedAssignments.ts]
import "@swc/helpers/src/_class_call_check.mjs";
import "@swc/helpers/src/_instanceof.mjs";
for(var match, re = /./g; null != (match = re.exec("xxx"));)match[1].length, match[2].length;
