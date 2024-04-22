//// [asOperator1.ts]
var as = 43;
var x = undefined;
var y = null.length;
var z = Date;
// Should parse as a union type, not a bitwise 'or' of (32 as number) and 'string'
var j = 32;
j = '';
