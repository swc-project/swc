//// [typeGuardsInGlobal.ts]
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// variables in global
var var1;
"string" == typeof var1 && var1.length;
