//// [nullAssignedToUndefined.ts]
var x = undefined = null; // error
var y = null; // ok, widened
