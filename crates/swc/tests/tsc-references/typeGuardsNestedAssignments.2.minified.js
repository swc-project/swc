//// [typeGuardsNestedAssignments.ts]
for(var match, re = /./g; null != (match = re.exec("xxx"));)match[1].length, match[2].length;
